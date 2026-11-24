# Turning on logins and bank payments

About 45 minutes, mostly copy and paste. Until you finish, mac-dev.co works without logins and the Pay rent page shows Zelle, Venmo and check.

You'll set up two free accounts:

- **Supabase** stores logins, balances, payments and maintenance requests.
- **Stripe** moves the money. Bank (ACH) payments cost 0.8%, capped at $5 per payment, and you pay it, not the resident.

> Tip: do it all in **Stripe test mode** first (keys start with `pk_test_` / `sk_test_`), make a fake payment with Stripe's test bank, then swap in the live keys.

---

## 1. Supabase — database and logins

1. Go to **supabase.com** → sign up → **New project**. Name it `mac-dev`, pick region **East US**, set a database password and save it somewhere.
2. Open **SQL Editor** → **New query**. Paste the entire file `supabase/migrations/001_portal.sql` from this repo → **Run**. It should say *Success*.
3. **Authentication → Sign In / Providers → Email**: turn **off** "Confirm email" → Save.
   *Residents are then logged in as soon as they sign up with their link. The link itself is the proof they live there.*
4. **Authentication → URL Configuration**: set **Site URL** to `https://mac-dev.co`. Under Redirect URLs add `https://mac-dev.co/**`.
5. Make your admin login: **Authentication → Users → Add user → Create new user**. Enter `ethan@mac-dev.co` and a password, check **Auto Confirm User**. Then in **SQL Editor** run:
   ```sql
   update public.profiles set role = 'admin' where email = 'ethan@mac-dev.co';
   ```
6. **Project Settings → API**: copy the **Project URL** and the **anon public** key. On GitHub, open `src/config.js` → pencil icon → paste them in → **Commit changes**.

## 2. Stripe — bank payments

1. Go to **stripe.com** → sign up → finish **Activate payments** (business details and the bank account where rent should land).
2. **Settings → Payment methods**: make sure **ACH Direct Debit** is on.
3. **Developers → API keys**:
   - Copy the **Publishable key** (`pk_live_…`) into `src/config.js` on GitHub.
   - Keep the **Secret key** (`sk_live_…`) for the next step. **Never put it on GitHub.**

## 3. Payment functions (in Supabase)

1. **Edge Functions → Deploy a new function → Via editor**. Name it `create-checkout`. Replace the sample code with `supabase/functions/create-checkout/index.ts` from this repo → **Deploy**.
2. Do it again with the name `stripe-webhook` and the file `supabase/functions/stripe-webhook/index.ts`. After it deploys, open its **Details** and turn **off** "Enforce JWT verification" (Stripe can't log in; the function checks Stripe's signature instead) → Save.
3. In **Stripe → Developers → Webhooks**, add a destination (webhook endpoint):
   - URL: `https://YOUR-PROJECT.supabase.co/functions/v1/stripe-webhook` (your Project URL + `/functions/v1/stripe-webhook`)
   - Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`
   - Save, then copy the **Signing secret** (`whsec_…`).
4. **Supabase → Edge Functions → Secrets** → add three:

   | Name | Value |
   | --- | --- |
   | `STRIPE_SECRET_KEY` | `sk_live_…` |
   | `STRIPE_WEBHOOK_SECRET` | `whsec_…` |
   | `SITE_URL` | `https://mac-dev.co` |

5. Optional: **Stripe → Settings → Customer emails** → turn on receipts for successful payments.

## 4. Point mac-dev.co at GitHub

1. Merge the pull request (that publishes the site).
2. This repo → **Settings → Pages → Custom domain**: enter `mac-dev.co` → Save. Tick **Enforce HTTPS** once it's offered (can take an hour).
3. At the company where you bought mac-dev.co, open its DNS settings:
   - Delete the old records that point the domain at its current host.
   - Add four **A** records for `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Add a **CNAME** record: `www` → `ethanmaclelland8.github.io`
4. For **mdco.homes**, set up a URL forward to `https://mac-dev.co` at its registrar so old links keep working.

## 5. Use it

1. Log in at **mac-dev.co/#login** → you land on **Admin**.
2. For each house: type the **monthly rent** → Save. Rent is then added to each house's balance automatically on the 1st.
3. Tap **Create sign-up link** → **Copy link** (or **Share**) → text it to everyone who lives there. One link per house works for all roommates.
4. When Zelle, Venmo or check payments come in, record them under **Charges & payments**. Bank payments made on the site record themselves.

---

## Good to know

- **Bank payments take about 4 business days.** They show as *Processing* right away and count toward the balance, so residents don't pay twice. If one bounces, it flips to *Failed* and the balance comes back.
- **Password resets need an email service.** Supabase's built-in email only reaches people on your Supabase team, so residents won't get reset emails until you connect one. The free plan at **resend.com** works: verify mac-dev.co there, then paste its SMTP details into **Supabase → Authentication → Emails → SMTP Settings**. Until then, if someone forgets their password: Supabase → Authentication → Users → delete them, and they sign up again with their house's link. Their payment history stays with the house.
- **The free Supabase plan pauses after a week with no activity.** The included GitHub job (`.github/workflows/keep-alive.yml`) pings it every 3 days. Supabase Pro ($25/month) never pauses and adds daily backups.
- **The keys in `config.js` are public keys** — they're designed to be visible in website code. The database rules only let each resident see their own house, and only you see everything.
- **Your rent amounts are not in this repo.** They live in your Supabase database, so they don't show up on the public GitHub page.
