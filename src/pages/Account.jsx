import { useCallback, useEffect, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Landmark, LogOut } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/auth";
import { BACKEND, paymentsReady } from "../config";
import { CONTACT, PAYMENTS } from "../content";
import { Field, Notice, PasswordInput, Spinner, Tabs, statusBadge } from "../ui";
import { address, day, friendlyError, go, money, toCents } from "../lib/util";
import { OtherWays } from "./Pay";

let stripePromise = null;
const getStripe = () => (stripePromise ??= loadStripe(BACKEND.stripePublishableKey));

/* Charges and payments merged into one list, newest first. */
export function ledger(charges, payments) {
  return [
    ...charges.map((c) => ({ id: `c${c.id}`, date: c.due_date, label: c.description, cents: c.amount_cents, kind: "charge" })),
    ...payments.map((p) => ({
      id: `p${p.id}`, date: p.paid_on || p.created_at, cents: -p.amount_cents, kind: "payment", status: p.status,
      label: p.method === "ach" ? "Bank payment" : `Payment — ${p.method === "check" ? "check" : p.method[0].toUpperCase() + p.method.slice(1)}`,
    })),
  ].sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

export function Ledger({ rows, empty = "Nothing here yet." }) {
  if (!rows.length) return <p className="fine">{empty}</p>;
  return (
    <ul className="rows">
      {rows.map((r) => (
        <li key={r.id} className="row">
          <div className="row-main">
            <span className="row-title">{r.label}</span>
            <span className="fine">{day(r.date)}</span>
          </div>
          <div className="row-side">
            <span className={`amount ${r.cents < 0 ? "amount-in" : ""}`}>{money(r.cents)}</span>
            {r.kind === "payment" && statusBadge(r.status)}
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ── Bank payment with Stripe Embedded Checkout ──────────────── */
function BankPay({ balanceCents, onDone }) {
  const [stage, setStage] = useState("amount"); // amount | loading | checkout | done
  const [amount, setAmount] = useState(balanceCents > 0 ? (balanceCents / 100).toFixed(2) : "");
  const [error, setError] = useState("");
  const mountRef = useRef(null);
  const checkoutRef = useRef(null);

  useEffect(() => () => { checkoutRef.current?.destroy(); }, []);

  const start = async (e) => {
    e.preventDefault();
    const cents = toCents(amount);
    if (!Number.isFinite(cents) || cents < 100) { setError("Enter an amount of at least $1."); return; }
    setError(""); setStage("loading");
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", { body: { amount_cents: cents } });
      if (error) {
        const detail = await error.context?.json?.().catch(() => null);
        throw new Error(detail?.error || "The payment couldn't be started. Try again in a minute.");
      }
      const stripe = await getStripe();
      checkoutRef.current = await stripe.initEmbeddedCheckout({
        fetchClientSecret: async () => data.client_secret,
        onComplete: () => { checkoutRef.current?.destroy(); checkoutRef.current = null; setStage("done"); setTimeout(onDone, 2500); },
      });
      setStage("checkout");
      setTimeout(() => checkoutRef.current?.mount(mountRef.current), 0);
    } catch (err) {
      setError(friendlyError(err)); setStage("amount");
    }
  };

  const cancel = () => { checkoutRef.current?.destroy(); checkoutRef.current = null; setStage("amount"); };

  if (stage === "done") {
    return (
      <Notice tone="ok">
        <strong>Payment submitted.</strong> Bank transfers take about 4 business days. It shows as processing until then, and your balance already reflects it.
      </Notice>
    );
  }

  return (
    <div className="bank-pay">
      {(stage === "amount" || stage === "loading") && (
        <form onSubmit={start} className="pay-form">
          <Field label="Amount">
            <span className="money-input"><span aria-hidden="true">$</span>
              <input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" disabled={stage === "loading"} />
            </span>
          </Field>
          <button className="btn btn-primary" disabled={stage === "loading"}>
            <Landmark size={17} /> {stage === "loading" ? "Opening…" : "Pay by bank"}
          </button>
        </form>
      )}
      {error && <Notice tone="error">{error}</Notice>}
      {stage === "checkout" && (
        <>
          <div ref={mountRef} className="checkout-mount" />
          <button className="btn btn-text" onClick={cancel}>Cancel and change amount</button>
        </>
      )}
      {stage === "amount" && <p className="fine">No fee. You'll connect your bank securely through Stripe.</p>}
    </div>
  );
}

/* ── No home linked yet ──────────────────────────────────────── */
function LinkHome({ onLinked }) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setError("");
    const { error } = await supabase.rpc("claim_invite", { p_code: code });
    setBusy(false);
    if (error) setError(friendlyError(error)); else onLinked();
  };
  return (
    <div className="card card-pad">
      <h2 className="card-title">Link your home</h2>
      <p>Your account isn't connected to a home yet. Enter the 8-character code from your sign-up link.</p>
      <form onSubmit={submit} className="form gap-top">
        <Field label="Sign-up code"><input value={code} onChange={(e) => setCode(e.target.value)} autoCapitalize="characters" /></Field>
        {error && <Notice tone="error">{error}</Notice>}
        <button className="btn btn-primary" disabled={busy}>{busy ? "Linking…" : "Link my home"}</button>
      </form>
    </div>
  );
}

/* ── Resident dashboard ──────────────────────────────────────── */
export function AccountPage() {
  const { session, profile, loading, refresh } = useAuth();
  const [tab, setTab] = useState("overview");
  const [data, setData] = useState(null);
  const [checkoutReturn] = useState(() => new URLSearchParams(window.location.search).has("checkout"));

  useEffect(() => {
    if (checkoutReturn) window.history.replaceState(null, "", `${window.location.pathname}${window.location.hash}`);
  }, [checkoutReturn]);

  useEffect(() => {
    if (!loading && !session) go("#login");
    if (profile?.role === "admin") go("#admin");
  }, [loading, session, profile]);

  const load = useCallback(async () => {
    if (!profile?.unit_id) return;
    const [bal, charges, payments, requests] = await Promise.all([
      supabase.from("unit_balances").select("*").eq("unit_id", profile.unit_id).maybeSingle(),
      supabase.from("charges").select("*").order("due_date", { ascending: false }).limit(200),
      supabase.from("payments").select("*").order("created_at", { ascending: false }).limit(200),
      supabase.from("requests").select("*").order("created_at", { ascending: false }),
    ]);
    setData({
      balance: bal.data?.balance_cents ?? 0,
      processing: bal.data?.processing_cents ?? 0,
      charges: charges.data ?? [], payments: payments.data ?? [], requests: requests.data ?? [],
    });
  }, [profile?.unit_id]);

  useEffect(() => { load(); }, [load]);

  if (loading || !profile) return <Spinner />;

  const signOut = async () => { await supabase.auth.signOut(); go("#home"); };
  const first = (profile.full_name || "").split(" ")[0];

  return (
    <section className="container page app">
      <header className="app-head">
        <div>
          <h1>{first ? `Hi, ${first}` : "Your account"}</h1>
          <p className="lead">{profile.units ? `${address(profile.units)}${profile.units.town ? `, ${profile.units.town}` : ""}` : session?.user?.email}</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={signOut}><LogOut size={15} /> Log out</button>
      </header>

      {!profile.unit_id ? <LinkHome onLinked={refresh} /> : !data ? <Spinner /> : (<>
        <Tabs value={tab} onChange={setTab} tabs={[
          { key: "overview", label: "Overview" },
          { key: "activity", label: "Activity" },
          { key: "requests", label: "Requests", count: data.requests.filter((r) => r.status !== "done").length },
          { key: "profile", label: "Profile" },
        ]} />

        {tab === "overview" && (
          <div className="app-grid">
            <div className="card card-pad balance-card">
              {checkoutReturn && <Notice tone="ok">Payment submitted. It shows as processing for about 4 business days.</Notice>}
              <p className="fine">Amount due</p>
              <p className="balance">{money(Math.max(data.balance, 0))}</p>
              {data.balance === 0 && <p className="fine">You're all paid up.</p>}
              {data.balance < 0 && <p className="fine">You have a {money(-data.balance)} credit.</p>}
              {data.processing > 0 && <p className="fine">{money(data.processing)} in bank payments is processing.</p>}
              <p className="fine">{PAYMENTS.dueNote}</p>
              {paymentsReady
                ? <BankPay key={data.balance} balanceCents={data.balance} onDone={load} />
                : <Notice>Bank payments aren't switched on yet. Use one of the options below.</Notice>}
            </div>
            <div className="card card-pad">
              <h2 className="card-title">Recent activity</h2>
              <Ledger rows={ledger(data.charges, data.payments).slice(0, 6)} />
              <button className="btn btn-text" onClick={() => setTab("activity")}>See all activity</button>
            </div>
            <details className="card card-pad other-ways">
              <summary>Other ways to pay: Zelle, Venmo, check</summary>
              <OtherWays compact />
              <p className="fine gap-top">These are recorded by hand, so they can take a day or two to show here.</p>
            </details>
          </div>
        )}

        {tab === "activity" && (
          <div className="card card-pad">
            <h2 className="card-title">Charges and payments</h2>
            <Ledger rows={ledger(data.charges, data.payments)} />
          </div>
        )}

        {tab === "requests" && <Requests unitId={profile.unit_id} userId={profile.id} items={data.requests} onChange={load} />}
        {tab === "profile" && <Profile profile={profile} email={session?.user?.email} onSaved={refresh} />}
      </>)}
    </section>
  );
}

function Requests({ unitId, userId, items, onChange }) {
  const [category, setCategory] = useState("Maintenance");
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setMsg(null);
    const { error } = await supabase.from("requests").insert({ unit_id: unitId, user_id: userId, category, details: details.trim() });
    setBusy(false);
    if (error) setMsg({ tone: "error", text: friendlyError(error) });
    else { setDetails(""); setMsg({ tone: "ok", text: "Request sent. We'll be in touch." }); onChange(); }
  };
  return (
    <div className="app-grid">
      <div className="card card-pad">
        <h2 className="card-title">New request</h2>
        <form onSubmit={submit} className="form">
          <Field label="Type">
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>Maintenance</option><option>Question</option><option>Other</option>
            </select>
          </Field>
          <Field label="What's going on?" hint="Where it is, when it started, and a good time to come by.">
            <textarea required rows={5} value={details} onChange={(e) => setDetails(e.target.value)} />
          </Field>
          {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
          <button className="btn btn-primary" disabled={busy}>{busy ? "Sending…" : "Send request"}</button>
        </form>
        {CONTACT.emergencyNote && <p className="fine gap-top">{CONTACT.emergencyNote} {CONTACT.phone}</p>}
      </div>
      <div className="card card-pad">
        <h2 className="card-title">Your requests</h2>
        {!items.length ? <p className="fine">No requests yet.</p> : (
          <ul className="rows">
            {items.map((r) => (
              <li key={r.id} className="row row-top">
                <div className="row-main"><span className="row-title">{r.category}</span><span className="row-text">{r.details}</span><span className="fine">{day(r.created_at)}</span></div>
                <div className="row-side">{statusBadge(r.status)}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Profile({ profile, email, onSaved }) {
  const [name, setName] = useState(profile.full_name || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(null);
  const save = async (e) => {
    e.preventDefault(); setMsg(null);
    const { error } = await supabase.from("profiles").update({ full_name: name.trim(), phone: phone.trim() }).eq("id", profile.id);
    if (error) return setMsg({ tone: "error", text: friendlyError(error) });
    if (password) {
      if (password.length < 8) return setMsg({ tone: "error", text: "Use a password with at least 8 characters." });
      const { error: pwError } = await supabase.auth.updateUser({ password });
      if (pwError) return setMsg({ tone: "error", text: friendlyError(pwError) });
      setPassword("");
    }
    setMsg({ tone: "ok", text: "Saved." }); onSaved();
  };
  return (
    <div className="card card-pad narrow-card">
      <h2 className="card-title">Profile</h2>
      <form onSubmit={save} className="form">
        <Field label="Email"><input value={email} disabled /></Field>
        <Field label="Full name"><input value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="Mobile phone"><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
        <Field label="New password" hint="Leave blank to keep your current password."><PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" /></Field>
        {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
        <button className="btn btn-primary">Save changes</button>
      </form>
    </div>
  );
}
