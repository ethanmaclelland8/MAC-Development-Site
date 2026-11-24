import { useState } from "react";
import { AlertCircle, CheckCircle2, Copy, Check, Eye, EyeOff, Info } from "lucide-react";

export function Logo({ size = 38 }) {
  return (
    <svg className="logo" width={size} height={size} viewBox="0 0 52 52" aria-hidden="true">
      <rect className="logo-bg" width="52" height="52" rx="12" />
      <text className="logo-fg" x="26" y="25" textAnchor="middle" fontWeight="800" fontSize="17">MAC</text>
      <line className="logo-line" x1="13" y1="31" x2="39" y2="31" strokeWidth="0.8" />
      <text className="logo-fg" x="26" y="41" textAnchor="middle" fontSize="6.2" fontWeight="600">DEVELOPMENT</text>
    </svg>
  );
}

export function Notice({ tone = "info", children }) {
  const Icon = tone === "error" || tone === "warn" ? AlertCircle : tone === "ok" ? CheckCircle2 : Info;
  return (
    <div className={`notice notice-${tone}`} role={tone === "error" ? "alert" : "status"}>
      <Icon size={18} aria-hidden="true" /><div>{children}</div>
    </div>
  );
}

export function Field({ label, hint, children }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

export function PasswordInput(props) {
  const [show, setShow] = useState(false);
  return (
    <span className="pw">
      <input {...props} type={show ? "text" : "password"} />
      <button type="button" className="pw-toggle" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"}>
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </span>
  );
}

export function CopyButton({ text, label = "Copy", className = "btn btn-secondary btn-sm" }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1800); }
    catch { window.prompt("Copy this:", text); }
  };
  return (
    <button type="button" className={className} onClick={copy}>
      {done ? <><Check size={15} /> Copied</> : <><Copy size={15} /> {label}</>}
    </button>
  );
}

export function Badge({ tone = "plain", children }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export const statusBadge = (status) =>
  status === "succeeded" ? <Badge tone="ok">Paid</Badge>
  : status === "processing" ? <Badge tone="warn">Processing</Badge>
  : status === "failed" ? <Badge tone="danger">Failed</Badge>
  : status === "open" ? <Badge tone="warn">Open</Badge>
  : status === "in_progress" ? <Badge tone="accent">In progress</Badge>
  : status === "done" ? <Badge tone="ok">Done</Badge>
  : <Badge>{status}</Badge>;

export function Spinner({ label = "Loading" }) {
  return <div className="spinner-wrap" role="status"><span className="spinner" /><span className="sr-only">{label}</span></div>;
}

export function Tabs({ tabs, value, onChange }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((t) => (
        <button key={t.key} role="tab" aria-selected={value === t.key} className="tab" onClick={() => onChange(t.key)}>
          {t.label}{t.count ? <span className="tab-count">{t.count}</span> : null}
        </button>
      ))}
    </div>
  );
}
