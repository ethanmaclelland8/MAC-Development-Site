export const money = (cents, { sign = false } = {}) => {
  const n = (cents ?? 0) / 100;
  const s = Math.abs(n).toLocaleString("en-US", { style: "currency", currency: "USD" });
  if (n < 0) return `−${s}`;
  return sign && n > 0 ? `+${s}` : s;
};

export const toCents = (value) => {
  const n = Number(String(value).replace(/[$,\s]/g, ""));
  return Number.isFinite(n) ? Math.round(n * 100) : NaN;
};

export const day = (d) =>
  d ? new Date(String(d).length === 10 ? `${d}T12:00:00` : d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

export const address = (u) => (u ? `${u.number} ${u.street}` : "");

export const telHref = (p) => `tel:${p.replace(/[^\d+]/g, "")}`;

export const go = (hash) => { window.location.hash = hash; };

// 8-character sign-up codes without look-alike letters (no 0/O, 1/I/L).
export const newCode = () => {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
};

export const joinLink = (code) => `${window.location.origin}/#join/${code}`;

export const friendlyError = (error) => {
  const m = String(error?.message || error || "");
  if (/invalid login credentials/i.test(m)) return "That email and password don't match. Try again or reset your password.";
  if (/already registered|already been registered/i.test(m)) return "There's already an account with that email. Log in instead.";
  if (/password should be at least/i.test(m)) return "Use a password with at least 8 characters.";
  if (/email not confirmed/i.test(m)) return "Confirm your email first — check your inbox for the link.";
  if (/rate limit/i.test(m)) return "Too many tries. Wait a few minutes and try again.";
  if (/failed to fetch|network/i.test(m)) return "Can't reach the server. Check your connection and try again.";
  return m || "Something went wrong. Try again.";
};
