/* ═══════════════════════════════════════════════════════════════
   MAC Development Co. — mac-dev.co
   Text and settings: content.js · Login + bank payment keys: config.js
   Looks: styles.css · Pages: pages/
   ═══════════════════════════════════════════════════════════════ */
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { THEME, COMPANY, CONTACT } from "./content";
import { backendReady } from "./config";
import { AuthProvider, useAuth } from "./lib/auth";
import { telHref } from "./lib/util";
import { Logo } from "./ui";
import { HomePage, PropertiesPage, ContactPage } from "./pages/Public";
import { PayPage } from "./pages/Pay";
import { LoginPage, JoinPage, ResetPage } from "./pages/Auth";
import { AccountPage } from "./pages/Account";
import { AdminPage } from "./pages/Admin";

/* ── Look: set in content.js; preview any look with ?look=NAME ── */
const LOOK_FONTS = {
  bright: "https://fonts.googleapis.com/css2?family=Figtree:wght@400..800&display=swap",
  sage: "https://fonts.googleapis.com/css2?family=Onest:wght@400..800&display=swap",
  graphite: "https://fonts.googleapis.com/css2?family=Manrope:wght@400..800&display=swap",
};
const requested = new URLSearchParams(window.location.search).get("look");
const LOOK = LOOK_FONTS[requested] ? requested : LOOK_FONTS[THEME] ? THEME : "bright";
document.documentElement.dataset.theme = LOOK;
const fontLink = Object.assign(document.createElement("link"), { rel: "stylesheet", href: LOOK_FONTS[LOOK] });
document.head.appendChild(fontLink);

/* ── Routing: mac-dev.co/#pay, #login, #join/CODE, #properties/887 ── */
const PUBLIC_PAGES = [
  { key: "home", label: "Home" },
  { key: "properties", label: "Properties" },
  { key: "pay", label: "Pay rent" },
  { key: "contact", label: "Contact" },
];
const ALL = ["home", "properties", "pay", "contact", "login", "join", "reset", "account", "admin"];
const ALIASES = { portal: "login", portfolio: "properties", services: "home", signup: "join", dashboard: "account" };

function readRoute() {
  const raw = window.location.hash.replace(/^#\/?/, "");
  if (/access_token=|error_description=/.test(raw)) return { page: "home", sub: "" }; // email link; auth.jsx redirects
  const [k = "", sub = ""] = raw.split("/");
  const key = ALIASES[k.toLowerCase()] || k.toLowerCase();
  return { page: ALL.includes(key) ? key : "home", sub: decodeURIComponent(sub) };
}

function useRoute() {
  const [route, setRoute] = useState(readRoute);
  useEffect(() => {
    const onHash = () => { const r = readRoute(); setRoute(r); if (!r.sub || r.page !== "properties") window.scrollTo(0, 0); };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  useEffect(() => {
    const names = { home: "", properties: "Properties", pay: "Pay rent", contact: "Contact", login: "Log in", join: "Create account", reset: "New password", account: "My account", admin: "Admin" };
    document.title = names[route.page] ? `${names[route.page]} — ${COMPANY.name}` : `${COMPANY.name} — Rental homes in ${COMPANY.region}`;
  }, [route.page]);
  return route;
}

/* ── Header ───────────────────────────────────────────────────── */
function Header({ page }) {
  const { session, profile } = useAuth();
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); }, [page]);
  const accountHref = profile?.role === "admin" ? "#admin" : "#account";
  const accountLabel = profile?.role === "admin" ? "Admin" : "My account";
  return (
    <header className="header">
      <div className="container header-row">
        <a href="#home" className="brand">
          <Logo />
          <span className="brand-text"><span className="brand-name">{COMPANY.shortName}</span><span className="brand-tag">{COMPANY.tagline}</span></span>
        </a>
        <nav className={`nav ${open ? "nav-open" : ""}`} aria-label="Main">
          {PUBLIC_PAGES.map((p) => (
            <a key={p.key} href={`#${p.key}`} className="nav-link" aria-current={page === p.key ? "page" : undefined}>{p.label}</a>
          ))}
          {backendReady && (session
            ? <a href={accountHref} className="btn btn-primary btn-sm nav-cta">{accountLabel}</a>
            : <a href="#login" className="btn btn-primary btn-sm nav-cta">Resident login</a>)}
        </nav>
        <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>{open ? <X size={20} /> : <Menu size={20} />}</button>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-row">
        <div className="footer-brand">
          <a href="#home" className="brand"><Logo size={32} /><span className="brand-name">{COMPANY.name}</span></a>
          <p className="fine">
            {CONTACT.phone && <a href={telHref(CONTACT.phone)}>{CONTACT.phone}</a>}
            {CONTACT.phone && CONTACT.email && <br />}
            {CONTACT.email && <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>}
          </p>
        </div>
        <nav className="footer-nav" aria-label="Footer">
          {PUBLIC_PAGES.map((p) => <a key={p.key} href={`#${p.key}`}>{p.label}</a>)}
          {backendReady && <a href="#login">Resident login</a>}
        </nav>
      </div>
      <div className="container fine footer-copy">© {new Date().getFullYear()} {COMPANY.name}</div>
    </footer>
  );
}

function Pages() {
  const { page, sub } = useRoute();
  const needsBackend = ["account", "admin"].includes(page) && !backendReady;
  return (
    <div className="site">
      <Header page={page} />
      <main>
        {page === "home" && <HomePage />}
        {page === "properties" && <PropertiesPage sub={sub} />}
        {page === "pay" && <PayPage />}
        {page === "contact" && <ContactPage />}
        {(page === "login" || needsBackend) && <LoginPage />}
        {page === "join" && <JoinPage code={sub} />}
        {page === "reset" && <ResetPage />}
        {page === "account" && !needsBackend && <AccountPage />}
        {page === "admin" && !needsBackend && <AdminPage />}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return <AuthProvider><Pages /></AuthProvider>;
}
