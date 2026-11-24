-- ═══════════════════════════════════════════════════════════════
-- MAC Development Co. — resident portal database
-- Paste this whole file into Supabase → SQL Editor → Run (once).
-- ═══════════════════════════════════════════════════════════════

-- ── Tables ──────────────────────────────────────────────────────

-- One row per house.
create table public.units (
  id          uuid primary key default gen_random_uuid(),
  number      text not null,
  street      text not null,
  town        text,
  rent_cents  integer not null default 0 check (rent_cents >= 0),
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- One row per login. Created automatically when someone signs up.
create table public.profiles (
  id                  uuid primary key references auth.users on delete cascade,
  email               text,
  full_name           text,
  phone               text,
  unit_id             uuid references public.units on delete set null,
  role                text not null default 'resident' check (role in ('resident', 'admin')),
  stripe_customer_id  text,
  created_at          timestamptz not null default now()
);

-- Sign-up links. One per house is enough: every resident of that
-- house can use it until it expires, runs out of uses, or is turned off.
create table public.invites (
  code        text primary key,
  unit_id     uuid not null references public.units on delete cascade,
  max_uses    integer default 8 check (max_uses is null or max_uses > 0),
  uses        integer not null default 0,
  active      boolean not null default true,
  expires_at  timestamptz default now() + interval '60 days',
  created_at  timestamptz not null default now()
);

-- Anything owed: rent, utilities, fees. Negative amounts are credits.
create table public.charges (
  id            uuid primary key default gen_random_uuid(),
  unit_id       uuid not null references public.units on delete cascade,
  kind          text not null default 'other' check (kind in ('rent', 'utility', 'fee', 'credit', 'other')),
  description   text not null,
  amount_cents  integer not null check (amount_cents <> 0),
  period        date,                       -- for rent: first day of the month
  due_date      date not null default current_date,
  created_at    timestamptz not null default now()
);
create unique index charges_one_rent_per_month on public.charges (unit_id, period) where kind = 'rent';

-- Money received. ACH rows are written by the Stripe webhook;
-- Zelle / Venmo / check rows are recorded by the admin.
create table public.payments (
  id                 uuid primary key default gen_random_uuid(),
  unit_id            uuid not null references public.units on delete cascade,
  user_id            uuid references auth.users on delete set null,
  amount_cents       integer not null check (amount_cents > 0),
  method             text not null check (method in ('ach', 'zelle', 'venmo', 'check', 'cash', 'other')),
  status             text not null default 'succeeded' check (status in ('processing', 'succeeded', 'failed')),
  stripe_session_id  text unique,
  stripe_payment_intent text,
  note               text,
  paid_on            date not null default current_date,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- Maintenance requests and questions from residents.
create table public.requests (
  id          uuid primary key default gen_random_uuid(),
  unit_id     uuid not null references public.units on delete cascade,
  user_id     uuid references auth.users on delete set null,
  category    text not null default 'Maintenance',
  details     text not null check (length(details) between 1 and 4000),
  status      text not null default 'open' check (status in ('open', 'in_progress', 'done')),
  created_at  timestamptz not null default now()
);

create index on public.charges (unit_id);
create index on public.payments (unit_id);
create index on public.requests (unit_id);
create index on public.profiles (unit_id);

-- ── Helpers ─────────────────────────────────────────────────────

create function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create function public.my_unit() returns uuid
language sql stable security definer set search_path = public as $$
  select unit_id from public.profiles where id = auth.uid();
$$;

-- Balance per house. Processing ACH payments count as paid (so nobody
-- pays twice); if one fails it drops off and the balance comes back.
create view public.unit_balances with (security_invoker = true) as
select
  u.id as unit_id,
  coalesce((select sum(c.amount_cents) from public.charges c where c.unit_id = u.id), 0)
    - coalesce((select sum(p.amount_cents) from public.payments p where p.unit_id = u.id and p.status in ('processing', 'succeeded')), 0)
    as balance_cents,
  coalesce((select sum(p.amount_cents) from public.payments p where p.unit_id = u.id and p.status = 'processing'), 0)
    as processing_cents
from public.units u;

-- ── New sign-ups ────────────────────────────────────────────────
-- The sign-up form passes the invite code in the user's metadata.
-- A valid code links the new account to that house.

create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  v_code text := upper(trim(coalesce(new.raw_user_meta_data ->> 'invite_code', '')));
  v_unit uuid;
begin
  if v_code <> '' then
    update public.invites
       set uses = uses + 1
     where code = v_code and active
       and (expires_at is null or expires_at > now())
       and (max_uses is null or uses < max_uses)
    returning unit_id into v_unit;
  end if;

  insert into public.profiles (id, email, full_name, phone, unit_id)
  values (new.id, new.email,
          nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
          nullif(trim(new.raw_user_meta_data ->> 'phone'), ''),
          v_unit);
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Public lookup for the sign-up page: which house is this link for?
create function public.invite_info(p_code text) returns table (number text, street text, town text)
language sql stable security definer set search_path = public as $$
  select u.number, u.street, u.town
    from public.invites i join public.units u on u.id = i.unit_id
   where i.code = upper(trim(p_code)) and i.active
     and (i.expires_at is null or i.expires_at > now())
     and (i.max_uses is null or i.uses < i.max_uses);
$$;

-- For someone who already has an account: link it to a house with a code.
create function public.claim_invite(p_code text) returns uuid
language plpgsql security definer set search_path = public as $$
declare v_unit uuid;
begin
  if auth.uid() is null then raise exception 'Not signed in'; end if;
  update public.invites
     set uses = uses + 1
   where code = upper(trim(p_code)) and active
     and (expires_at is null or expires_at > now())
     and (max_uses is null or uses < max_uses)
  returning unit_id into v_unit;
  if v_unit is null then raise exception 'That link has expired or isn''t valid'; end if;
  update public.profiles set unit_id = v_unit where id = auth.uid();
  return v_unit;
end $$;

-- ── Admin actions ───────────────────────────────────────────────

create function public.admin_set_unit(p_user uuid, p_unit uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Admins only'; end if;
  update public.profiles set unit_id = p_unit where id = p_user;
end $$;

-- Rent posting. Adds one rent charge per house for the month, using each
-- house's rent amount. Running it twice for the same month does nothing.
create function public._post_monthly_rent(p_month date) returns integer
language plpgsql security definer set search_path = public as $$
declare v_count integer; v_period date := date_trunc('month', p_month)::date;
begin
  insert into public.charges (unit_id, kind, description, amount_cents, period, due_date)
  select id, 'rent', to_char(v_period, 'FMMonth YYYY') || ' rent', rent_cents, v_period, v_period
    from public.units where rent_cents > 0
  on conflict (unit_id, period) where kind = 'rent' do nothing;
  get diagnostics v_count = row_count;
  return v_count;
end $$;

create function public.post_monthly_rent(p_month date default current_date) returns integer
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Admins only'; end if;
  return public._post_monthly_rent(p_month);
end $$;

-- ── Permissions (row level security) ────────────────────────────

alter table public.units    enable row level security;
alter table public.profiles enable row level security;
alter table public.invites  enable row level security;
alter table public.charges  enable row level security;
alter table public.payments enable row level security;
alter table public.requests enable row level security;

-- Houses: residents see their own; admin sees and edits all.
create policy units_read  on public.units for select to authenticated using (public.is_admin() or id = public.my_unit());
create policy units_admin on public.units for all    to authenticated using (public.is_admin()) with check (public.is_admin());

-- Profiles: you see yourself; admin sees everyone. Residents may only
-- change their own name and phone (see column grants below).
create policy profiles_read   on public.profiles for select to authenticated using (id = auth.uid() or public.is_admin());
create policy profiles_update on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
revoke update on public.profiles from authenticated, anon;
grant update (full_name, phone) on public.profiles to authenticated;

-- Invites: admin only. (The sign-up page uses invite_info() instead.)
create policy invites_admin on public.invites for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Charges and payments: residents read their house's; admin manages all.
create policy charges_read   on public.charges  for select to authenticated using (public.is_admin() or unit_id = public.my_unit());
create policy charges_admin  on public.charges  for all    to authenticated using (public.is_admin()) with check (public.is_admin());
create policy payments_read  on public.payments for select to authenticated using (public.is_admin() or unit_id = public.my_unit());
create policy payments_admin on public.payments for all    to authenticated using (public.is_admin()) with check (public.is_admin());

-- Requests: residents read and file their house's; admin manages all.
create policy requests_read   on public.requests for select to authenticated using (public.is_admin() or unit_id = public.my_unit());
create policy requests_insert on public.requests for insert to authenticated
  with check (unit_id = public.my_unit() and user_id = auth.uid() and status = 'open');
create policy requests_admin  on public.requests for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Functions: lock down who can call what.
revoke execute on function public._post_monthly_rent(date) from public, anon, authenticated;
revoke execute on function public.post_monthly_rent(date)  from public, anon;
revoke execute on function public.admin_set_unit(uuid, uuid) from public, anon;
revoke execute on function public.claim_invite(text) from public, anon;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
grant  execute on function public.invite_info(text) to anon, authenticated;

-- ── Your four houses ────────────────────────────────────────────
-- Set each rent in the admin page after you log in.
insert into public.units (number, street, town, sort_order) values
  ('458', 'South Eagleville Road', 'Mansfield', 1),
  ('444', 'Middle Turnpike', null, 2),
  ('39',  'Trapella Road', 'Willimantic', 3),
  ('887', 'Stafford Road', 'Mansfield', 4);

-- ── Automatic rent on the 1st (9am UTC) ─────────────────────────
-- Only houses with a rent amount set get a charge.
create extension if not exists pg_cron;
select cron.schedule('post-monthly-rent', '0 9 1 * *', $$select public._post_monthly_rent(current_date)$$);
