import { useCallback, useEffect, useMemo, useState } from "react";
import { LogOut, Share2, UserMinus, Trash2, Link2, Power } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/auth";
import { CopyButton, Field, Notice, Spinner, Tabs, statusBadge, Badge } from "../ui";
import { address, day, friendlyError, go, joinLink, money, newCode, toCents } from "../lib/util";

const METHODS = [["zelle", "Zelle"], ["venmo", "Venmo"], ["check", "Check"], ["cash", "Cash"], ["other", "Other"]];
const today = () => new Date().toISOString().slice(0, 10);

export function AdminPage() {
  const { session, profile, loading } = useAuth();
  const [tab, setTab] = useState("homes");
  const [d, setD] = useState(null);
  const [flash, setFlash] = useState(null);

  useEffect(() => {
    if (!loading && !session) go("#login");
    else if (profile && profile.role !== "admin") go("#account");
  }, [loading, session, profile]);

  const load = useCallback(async () => {
    const [units, balances, people, invites, charges, payments, requests] = await Promise.all([
      supabase.from("units").select("*").order("sort_order"),
      supabase.from("unit_balances").select("*"),
      supabase.from("profiles").select("*").order("created_at"),
      supabase.from("invites").select("*").eq("active", true).order("created_at", { ascending: false }),
      supabase.from("charges").select("*").order("due_date", { ascending: false }).limit(300),
      supabase.from("payments").select("*").order("created_at", { ascending: false }).limit(300),
      supabase.from("requests").select("*").order("created_at", { ascending: false }),
    ]);
    setD({
      units: units.data ?? [], balances: Object.fromEntries((balances.data ?? []).map((b) => [b.unit_id, b])),
      people: people.data ?? [], invites: invites.data ?? [], charges: charges.data ?? [],
      payments: payments.data ?? [], requests: requests.data ?? [],
    });
  }, []);

  useEffect(() => { if (profile?.role === "admin") load(); }, [profile, load]);

  // Every admin action goes through here: run it, show the result, reload.
  const act = async (fn, ok) => {
    setFlash(null);
    const { error } = await fn();
    if (error) setFlash({ tone: "error", text: friendlyError(error) });
    else { if (ok) setFlash({ tone: "ok", text: ok }); await load(); }
    return !error;
  };

  const unitName = useMemo(() => Object.fromEntries((d?.units ?? []).map((u) => [u.id, address(u)])), [d]);

  if (loading || !profile || profile.role !== "admin" || !d) return <Spinner />;

  const totalDue = Object.values(d.balances).reduce((s, b) => s + Math.max(b.balance_cents, 0), 0);
  const processing = Object.values(d.balances).reduce((s, b) => s + b.processing_cents, 0);
  const openRequests = d.requests.filter((r) => r.status !== "done").length;

  return (
    <section className="container page app">
      <header className="app-head">
        <div><h1>Admin</h1><p className="lead">{session?.user?.email}</p></div>
        <button className="btn btn-secondary btn-sm" onClick={async () => { await supabase.auth.signOut(); go("#home"); }}><LogOut size={15} /> Log out</button>
      </header>

      <div className="stats">
        <div className="card stat"><span className="fine">Owed across all homes</span><strong>{money(totalDue)}</strong></div>
        <div className="card stat"><span className="fine">Bank payments processing</span><strong>{money(processing)}</strong></div>
        <div className="card stat"><span className="fine">Open requests</span><strong>{openRequests}</strong></div>
      </div>

      {flash && <Notice tone={flash.tone}>{flash.text}</Notice>}

      <Tabs value={tab} onChange={(t) => { setTab(t); setFlash(null); }} tabs={[
        { key: "homes", label: "Homes" },
        { key: "money", label: "Charges & payments" },
        { key: "requests", label: "Requests", count: openRequests },
      ]} />

      {tab === "homes" && (
        <div className="stack">
          {d.units.map((u) => (
            <HomeCard key={u.id} unit={u} balance={d.balances[u.id]} people={d.people.filter((p) => p.unit_id === u.id)}
              invite={d.invites.find((i) => i.unit_id === u.id)} act={act} />
          ))}
          <Unlinked people={d.people.filter((p) => !p.unit_id && p.role !== "admin")} units={d.units} act={act} />
        </div>
      )}

      {tab === "money" && <Money d={d} unitName={unitName} act={act} />}

      {tab === "requests" && (
        <div className="card card-pad">
          <h2 className="card-title">Maintenance and questions</h2>
          {!d.requests.length ? <p className="fine">No requests yet.</p> : (
            <ul className="rows">
              {d.requests.map((r) => {
                const who = d.people.find((p) => p.id === r.user_id);
                return (
                  <li key={r.id} className="row row-top">
                    <div className="row-main">
                      <span className="row-title">{r.category} — {unitName[r.unit_id]}</span>
                      <span className="row-text">{r.details}</span>
                      <span className="fine">{day(r.created_at)}{who ? ` · ${who.full_name || who.email}${who.phone ? ` · ${who.phone}` : ""}` : ""}</span>
                    </div>
                    <div className="row-side">
                      <select className="select-sm" value={r.status} aria-label="Status"
                        onChange={(e) => act(() => supabase.from("requests").update({ status: e.target.value }).eq("id", r.id))}>
                        <option value="open">Open</option><option value="in_progress">In progress</option><option value="done">Done</option>
                      </select>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}

function HomeCard({ unit, balance, people, invite, act }) {
  const [rent, setRent] = useState(unit.rent_cents ? (unit.rent_cents / 100).toFixed(2) : "");
  const link = invite ? joinLink(invite.code) : "";
  const share = () => navigator.share?.({ title: `Sign up — ${address(unit)}`, text: `Create your resident account for ${address(unit)}:`, url: link });

  const saveRent = (e) => {
    e.preventDefault();
    const cents = rent.trim() === "" ? 0 : toCents(rent);
    if (!Number.isFinite(cents) || cents < 0) return;
    act(() => supabase.from("units").update({ rent_cents: cents }).eq("id", unit.id), `Rent for ${address(unit)} saved.`);
  };

  return (
    <article className="card card-pad home-card">
      <div className="home-card-head">
        <h2 className="card-title"><span className="num num-sm">{unit.number}</span> {unit.street}</h2>
        <div className="home-balance">
          <span className="fine">Balance</span>
          <strong className={balance?.balance_cents > 0 ? "owed" : ""}>{money(balance?.balance_cents ?? 0)}</strong>
        </div>
      </div>

      <div className="home-grid">
        <form onSubmit={saveRent} className="inline-form">
          <Field label="Monthly rent" hint="Posted automatically on the 1st.">
            <span className="money-input"><span aria-hidden="true">$</span><input inputMode="decimal" value={rent} onChange={(e) => setRent(e.target.value)} placeholder="0.00" /></span>
          </Field>
          <button className="btn btn-secondary btn-sm">Save</button>
        </form>

        <div>
          <span className="field-label">Sign-up link</span>
          {invite ? (
            <div className="invite">
              <code className="invite-link">{link.replace(/^https?:\/\//, "")}</code>
              <div className="btn-row">
                <CopyButton text={link} label="Copy link" />
                {typeof navigator !== "undefined" && navigator.share && <button className="btn btn-secondary btn-sm" onClick={share}><Share2 size={15} /> Share</button>}
                <button className="btn btn-text btn-sm" onClick={() => act(() => supabase.from("invites").update({ active: false }).eq("code", invite.code), "Link turned off.")}><Power size={15} /> Turn off</button>
              </div>
              <span className="field-hint">Used {invite.uses}{invite.max_uses ? ` of ${invite.max_uses}` : ""} times · expires {day(invite.expires_at)}</span>
            </div>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={() => act(() => supabase.from("invites").insert({ code: newCode(), unit_id: unit.id }), "Sign-up link created. Copy it and text it to your residents.")}>
              <Link2 size={15} /> Create sign-up link
            </button>
          )}
        </div>
      </div>

      <span className="field-label">Residents</span>
      {!people.length ? <p className="fine">Nobody has signed up yet.</p> : (
        <ul className="rows">
          {people.map((p) => (
            <li key={p.id} className="row">
              <div className="row-main"><span className="row-title">{p.full_name || "No name"}</span><span className="fine">{p.email}{p.phone ? ` · ${p.phone}` : ""}</span></div>
              <button className="btn btn-text btn-sm" onClick={() => { if (window.confirm(`Remove ${p.full_name || p.email} from ${address(unit)}? They'll keep their login but won't see this home.`)) act(() => supabase.rpc("admin_set_unit", { p_user: p.id, p_unit: null }), "Resident removed."); }}>
                <UserMinus size={15} /> Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function Unlinked({ people, units, act }) {
  if (!people.length) return null;
  return (
    <div className="card card-pad">
      <h2 className="card-title">Accounts without a home</h2>
      <p className="fine">These people signed up without a valid link. Assign them, or ignore them — they can't see anything.</p>
      <ul className="rows">
        {people.map((p) => (
          <li key={p.id} className="row">
            <div className="row-main"><span className="row-title">{p.full_name || "No name"}</span><span className="fine">{p.email}</span></div>
            <select className="select-sm" defaultValue="" aria-label="Assign to home"
              onChange={(e) => e.target.value && act(() => supabase.rpc("admin_set_unit", { p_user: p.id, p_unit: e.target.value }), "Resident assigned.")}>
              <option value="">Assign to…</option>
              {units.map((u) => <option key={u.id} value={u.id}>{address(u)}</option>)}
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Money({ d, unitName, act }) {
  const first = d.units[0]?.id ?? "";
  const [pay, setPay] = useState({ unit_id: first, amount: "", method: "zelle", paid_on: today(), note: "" });
  const [chg, setChg] = useState({ unit_id: first, amount: "", kind: "utility", description: "", due_date: today() });
  const [filter, setFilter] = useState("");

  const recordPayment = async (e) => {
    e.preventDefault();
    const cents = toCents(pay.amount);
    if (!Number.isFinite(cents) || cents <= 0) return;
    const ok = await act(() => supabase.from("payments").insert({ unit_id: pay.unit_id, amount_cents: cents, method: pay.method, paid_on: pay.paid_on, note: pay.note || null, status: "succeeded" }), `Recorded ${money(cents)} for ${unitName[pay.unit_id]}.`);
    if (ok) setPay({ ...pay, amount: "", note: "" });
  };

  const addCharge = async (e) => {
    e.preventDefault();
    let cents = toCents(chg.amount);
    if (!Number.isFinite(cents) || cents === 0 || !chg.description.trim()) return;
    if (chg.kind === "credit") cents = -Math.abs(cents);
    const ok = await act(() => supabase.from("charges").insert({ unit_id: chg.unit_id, kind: chg.kind, description: chg.description.trim(), amount_cents: cents, due_date: chg.due_date }), `Added ${money(cents)} to ${unitName[chg.unit_id]}.`);
    if (ok) setChg({ ...chg, amount: "", description: "" });
  };

  const month = new Date().toLocaleDateString("en-US", { month: "long" });
  const rows = [
    ...d.charges.map((c) => ({ id: c.id, table: "charges", unit: c.unit_id, date: c.due_date, label: c.description, cents: c.amount_cents })),
    ...d.payments.map((p) => ({ id: p.id, table: "payments", unit: p.unit_id, date: p.paid_on, label: `${p.method === "ach" ? "Bank payment" : METHODS.find((m) => m[0] === p.method)?.[1] ?? p.method}${p.note ? ` — ${p.note}` : ""}`, cents: -p.amount_cents, status: p.status, ach: p.method === "ach" })),
  ].filter((r) => !filter || r.unit === filter).sort((a, b) => String(b.date).localeCompare(String(a.date)));

  const unitOptions = d.units.map((u) => <option key={u.id} value={u.id}>{address(u)}</option>);

  return (
    <div className="stack">
      <div className="app-grid">
        <form onSubmit={recordPayment} className="card card-pad form">
          <h2 className="card-title">Record a payment</h2>
          <p className="fine">For Zelle, Venmo, checks and cash. Bank payments made on the site are recorded automatically.</p>
          <Field label="Home"><select value={pay.unit_id} onChange={(e) => setPay({ ...pay, unit_id: e.target.value })}>{unitOptions}</select></Field>
          <div className="form-grid">
            <Field label="Amount"><span className="money-input"><span aria-hidden="true">$</span><input inputMode="decimal" required value={pay.amount} onChange={(e) => setPay({ ...pay, amount: e.target.value })} /></span></Field>
            <Field label="Method"><select value={pay.method} onChange={(e) => setPay({ ...pay, method: e.target.value })}>{METHODS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></Field>
            <Field label="Date received"><input type="date" value={pay.paid_on} onChange={(e) => setPay({ ...pay, paid_on: e.target.value })} /></Field>
            <Field label="Note (optional)"><input value={pay.note} onChange={(e) => setPay({ ...pay, note: e.target.value })} placeholder="Check #1042" /></Field>
          </div>
          <button className="btn btn-primary">Record payment</button>
        </form>

        <form onSubmit={addCharge} className="card card-pad form">
          <h2 className="card-title">Add a charge or credit</h2>
          <p className="fine">Utilities, fees, or a credit. Rent is added on the 1st automatically.</p>
          <Field label="Home"><select value={chg.unit_id} onChange={(e) => setChg({ ...chg, unit_id: e.target.value })}>{unitOptions}</select></Field>
          <div className="form-grid">
            <Field label="Type"><select value={chg.kind} onChange={(e) => setChg({ ...chg, kind: e.target.value })}>
              <option value="utility">Utility</option><option value="fee">Fee</option><option value="rent">Rent</option><option value="credit">Credit</option><option value="other">Other</option>
            </select></Field>
            <Field label="Amount"><span className="money-input"><span aria-hidden="true">$</span><input inputMode="decimal" required value={chg.amount} onChange={(e) => setChg({ ...chg, amount: e.target.value })} /></span></Field>
            <Field label="Description"><input required value={chg.description} onChange={(e) => setChg({ ...chg, description: e.target.value })} placeholder="November electric" /></Field>
            <Field label="Due"><input type="date" value={chg.due_date} onChange={(e) => setChg({ ...chg, due_date: e.target.value })} /></Field>
          </div>
          <button className="btn btn-primary">Add</button>
        </form>
      </div>

      <div className="card card-pad">
        <div className="card-head">
          <h2 className="card-title">History</h2>
          <div className="btn-row">
            <select className="select-sm" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter by home">
              <option value="">All homes</option>{unitOptions}
            </select>
            <button className="btn btn-secondary btn-sm" onClick={() => act(() => supabase.rpc("post_monthly_rent"), `${month} rent posted for every home with a rent amount.`)}>Post {month} rent now</button>
          </div>
        </div>
        {!rows.length ? <p className="fine">Nothing yet.</p> : (
          <ul className="rows">
            {rows.map((r) => (
              <li key={`${r.table}${r.id}`} className="row">
                <div className="row-main"><span className="row-title">{r.label}</span><span className="fine">{day(r.date)} · {unitName[r.unit]}</span></div>
                <div className="row-side">
                  <span className={`amount ${r.cents < 0 ? "amount-in" : ""}`}>{money(r.cents)}</span>
                  {r.status ? statusBadge(r.status) : <Badge>Charge</Badge>}
                  {!r.ach && (
                    <button className="icon-btn" aria-label="Delete" onClick={() => window.confirm(`Delete "${r.label}" (${money(r.cents)})?`) && act(() => supabase.from(r.table).delete().eq("id", r.id), "Deleted.")}>
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
