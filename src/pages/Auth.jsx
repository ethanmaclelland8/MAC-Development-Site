import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/auth";
import { backendReady } from "../config";
import { CONTACT } from "../content";
import { Field, Notice, PasswordInput, Spinner } from "../ui";
import { friendlyError, go } from "../lib/util";

function AuthCard({ title, lead, children, footer }) {
  return (
    <section className="container auth-page">
      <div className="card card-pad auth-card">
        <h1 className="auth-title">{title}</h1>
        {lead && <p className="auth-lead">{lead}</p>}
        {children}
      </div>
      {footer && <div className="auth-footer">{footer}</div>}
    </section>
  );
}

function NotReady() {
  return (
    <AuthCard title="Resident accounts" lead="Online accounts are being set up.">
      <p>Until then, you can pay by Zelle, Venmo or check on the <a className="link" href="#pay">Pay rent</a> page, and reach us at <a className="link" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.</p>
    </AuthCard>
  );
}

/* ── Log in ───────────────────────────────────────────────────── */
export function LoginPage() {
  const { session, profile, loading } = useAuth();
  const [mode, setMode] = useState("login"); // login | forgot | sent
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session && profile) go(profile.role === "admin" ? "#admin" : "#account");
  }, [session, profile]);

  if (!backendReady) return <NotReady />;
  if (loading) return <Spinner />;

  const login = async (e) => {
    e.preventDefault(); setBusy(true); setError("");
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) setError(friendlyError(error));
  };

  const sendReset = async (e) => {
    e.preventDefault(); setBusy(true); setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/` });
    setBusy(false);
    if (error) setError(friendlyError(error)); else setMode("sent");
  };

  if (mode === "sent") {
    return (
      <AuthCard title="Check your email" lead={`If ${email} has an account, a link to set a new password is on its way.`}>
        <button className="btn btn-secondary btn-block" onClick={() => setMode("login")}>Back to log in</button>
      </AuthCard>
    );
  }

  if (mode === "forgot") {
    return (
      <AuthCard title="Reset your password" lead="We'll email you a link to set a new one.">
        <form onSubmit={sendReset} className="form">
          <Field label="Email"><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></Field>
          {error && <Notice tone="error">{error}</Notice>}
          <button className="btn btn-primary btn-block" disabled={busy}>{busy ? "Sending…" : "Email me a reset link"}</button>
          <button type="button" className="btn btn-text" onClick={() => { setMode("login"); setError(""); }}>Back to log in</button>
        </form>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Log in"
      lead="Pay rent, see your balance, and send maintenance requests."
      footer={<>New resident? Open the sign-up link we sent you, or <a className="link" href="#join">enter your code</a>.</>}
    >
      <form onSubmit={login} className="form">
        <Field label="Email"><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></Field>
        <Field label="Password"><PasswordInput required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" /></Field>
        {error && <Notice tone="error">{error}</Notice>}
        <button className="btn btn-primary btn-block" disabled={busy}>{busy ? "Logging in…" : "Log in"}</button>
        <button type="button" className="btn btn-text" onClick={() => { setMode("forgot"); setError(""); }}>Forgot password?</button>
      </form>
    </AuthCard>
  );
}

/* ── Create account from a sign-up link: #join/CODE ───────────── */
export function JoinPage({ code: rawCode }) {
  const code = (rawCode || "").toUpperCase();
  const { session, refresh } = useAuth();
  const [home, setHome] = useState(undefined); // undefined = checking, null = invalid
  const [typed, setTyped] = useState("");
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [confirmSent, setConfirmSent] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  useEffect(() => {
    if (!backendReady || !code) return;
    setHome(undefined);
    supabase.rpc("invite_info", { p_code: code }).then(({ data }) => setHome(data?.[0] ?? null));
  }, [code]);

  if (!backendReady) return <NotReady />;

  // No code yet: ask for it.
  if (!code) {
    return (
      <AuthCard title="Create your account" lead="Use the sign-up link we texted or emailed you. Or type the 8-character code from it here.">
        <form className="form" onSubmit={(e) => { e.preventDefault(); if (typed.trim()) go(`#join/${typed.trim().toUpperCase()}`); }}>
          <Field label="Sign-up code"><input value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="e.g. K7PM2QXA" autoCapitalize="characters" autoComplete="off" /></Field>
          <button className="btn btn-primary btn-block">Continue</button>
        </form>
      </AuthCard>
    );
  }

  if (home === undefined) return <Spinner />;

  if (home === null) {
    return (
      <AuthCard title="This link isn't working" lead="It may have expired or been turned off.">
        <p>Ask us for a new one: <a className="link" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>{CONTACT.phone && <> or {CONTACT.phone}</>}.</p>
        <a href="#join" className="btn btn-secondary btn-block gap-top">Enter a different code</a>
      </AuthCard>
    );
  }

  const homeLabel = `${home.number} ${home.street}${home.town ? `, ${home.town}` : ""}`;

  // Already logged in: just link this home to the account.
  if (session) {
    const claim = async () => {
      setBusy(true); setError("");
      const { error } = await supabase.rpc("claim_invite", { p_code: code });
      setBusy(false);
      if (error) setError(friendlyError(error)); else { await refresh(); go("#account"); }
    };
    return (
      <AuthCard title="Add this home to your account" lead={homeLabel}>
        {error && <Notice tone="error">{error}</Notice>}
        <button className="btn btn-primary btn-block" onClick={claim} disabled={busy}>{busy ? "Adding…" : `Add ${home.number} ${home.street}`}</button>
      </AuthCard>
    );
  }

  if (confirmSent) {
    return (
      <AuthCard title="Check your email" lead={`We sent a confirmation link to ${form.email}. Open it to finish setting up your account.`} />
    );
  }

  const signUp = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) { setError("Use a password with at least 8 characters."); return; }
    setBusy(true); setError("");
    const { data, error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        data: { invite_code: code, full_name: form.full_name.trim(), phone: form.phone.trim() },
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    setBusy(false);
    if (error) { setError(friendlyError(error)); return; }
    if (data.session) { await refresh(); go("#account"); }
    else setConfirmSent(true);
  };

  return (
    <AuthCard
      title="Create your account"
      lead={<>For <strong>{homeLabel}</strong></>}
      footer={<>Already have an account? <a className="link" href="#login">Log in</a>, then open this link again.</>}
    >
      <form onSubmit={signUp} className="form">
        <Field label="Full name"><input required value={form.full_name} onChange={set("full_name")} autoComplete="name" /></Field>
        <Field label="Email"><input required type="email" value={form.email} onChange={set("email")} autoComplete="email" /></Field>
        <Field label="Mobile phone (optional)"><input type="tel" value={form.phone} onChange={set("phone")} autoComplete="tel" /></Field>
        <Field label="Create a password" hint="At least 8 characters."><PasswordInput required minLength={8} value={form.password} onChange={set("password")} autoComplete="new-password" /></Field>
        {error && <Notice tone="error">{error}</Notice>}
        <button className="btn btn-primary btn-block" disabled={busy}>{busy ? "Creating account…" : "Create account"}</button>
      </form>
    </AuthCard>
  );
}

/* ── Set a new password (from the reset email) ───────────────── */
export function ResetPage() {
  const { session, loading } = useAuth();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  if (!backendReady) return <NotReady />;
  if (loading) return <Spinner />;
  if (!session) {
    return (
      <AuthCard title="This reset link has expired" lead="Request a new one and use it within an hour.">
        <a href="#login" className="btn btn-primary btn-block">Back to log in</a>
      </AuthCard>
    );
  }

  const save = async (e) => {
    e.preventDefault();
    if (password.length < 8) { setError("Use a password with at least 8 characters."); return; }
    setBusy(true); setError("");
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) setError(friendlyError(error)); else setDone(true);
  };

  if (done) {
    return (
      <AuthCard title="Password updated">
        <a href="#account" className="btn btn-primary btn-block">Go to my account</a>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Set a new password">
      <form onSubmit={save} className="form">
        <Field label="New password" hint="At least 8 characters."><PasswordInput required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" /></Field>
        {error && <Notice tone="error">{error}</Notice>}
        <button className="btn btn-primary btn-block" disabled={busy}>{busy ? "Saving…" : "Save password"}</button>
      </form>
    </AuthCard>
  );
}
