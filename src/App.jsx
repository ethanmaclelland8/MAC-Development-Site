/* ═══════════════════════════════════════════════════════════════
   MAC Development Co. — website
   All text, contact info, payments, houses and files live in
   content.js. The three looks live in styles.css.
   ═══════════════════════════════════════════════════════════════ */
import { useEffect, useState } from "react";
import {
  Menu, X, Phone, Mail, MapPin, Clock, Copy, Check, ExternalLink,
  FileText, Download, AlertCircle, CheckCircle, Send,
} from "lucide-react";
import { THEME, COMPANY, CONTACT, PAYMENTS, HOME, SERVICES, PROPERTIES, FILES } from "./content";

/* ── Look: set in content.js, preview any look with ?look=NAME ─── */
const LOOK_FONTS = {
  clean: "https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400..900&display=swap",
  fieldstone: "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&display=swap",
  navy: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Condensed:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap",
};
const requestedLook = new URLSearchParams(window.location.search).get("look");
const LOOK = LOOK_FONTS[requestedLook] ? requestedLook : LOOK_FONTS[THEME] ? THEME : "clean";
document.documentElement.dataset.theme = LOOK;
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = LOOK_FONTS[LOOK];
document.head.appendChild(fontLink);

/* ── Routing: each page has its own link, e.g. mdco.homes/#pay ── */
const PAGES = [
  { key: "home", label: "Home" },
  { key: "properties", label: "Properties" },
  { key: "pay", label: "Pay rent" },
  { key: "files", label: "Files", hidden: FILES.length === 0 },
  { key: "contact", label: "Contact" },
].filter(p => !p.hidden);
const ALIASES = { portal: "pay", portfolio: "properties", services: "home" }; // old links keep working

function readRoute() {
  const [rawKey = "", sub = ""] = window.location.hash.replace(/^#\/?/, "").toLowerCase().split("/");
  const key = ALIASES[rawKey] || rawKey;
  return { page: PAGES.some(p => p.key === key) ? key : "home", sub };
}

function useRoute() {
  const [route, setRoute] = useState(readRoute);
  useEffect(() => {
    const onHash = () => { const r = readRoute(); setRoute(r); if (!r.sub) window.scrollTo(0, 0); };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  useEffect(() => {
    const label = PAGES.find(p => p.key === route.page)?.label;
    document.title = route.page === "home" ? `${COMPANY.name} — Rental homes in ${COMPANY.region}` : `${label} — ${COMPANY.name}`;
  }, [route.page]);
  return route;
}

const telHref = (p) => `tel:${p.replace(/[^\d+]/g, "")}`;
const address = (p) => `${p.number} ${p.street}`;
const statusText = (p) => (p.available ? `Available ${p.available}` : "Leased");

/* ── Small pieces ─────────────────────────────────────────────── */
function Logo({ size = 42 }) {
  return (
    <svg className="logo" width={size} height={size} viewBox="0 0 52 52" aria-hidden="true">
      <rect className="logo-bg" width="52" height="52" rx="8" />
      <text className="logo-fg" x="26" y="25" textAnchor="middle" fontWeight="800" fontSize="17">MAC</text>
      <line className="logo-line" x1="12" y1="31" x2="40" y2="31" strokeWidth="0.8" />
      <text className="logo-fg" x="26" y="41" textAnchor="middle" fontSize="6.4" fontWeight="500">DEVELOPMENT</text>
    </svg>
  );
}

function Status({ p }) {
  return <span className={`status ${p.available ? "status-open" : ""}`}>{statusText(p)}</span>;
}

function CopyButton({ text }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1800); }
    catch { /* clipboard blocked — the value is still on screen to copy by hand */ }
  };
  return (
    <button type="button" className="btn btn-secondary btn-sm" onClick={copy} aria-label={`Copy ${text}`}>
      {done ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
    </button>
  );
}

/* ── Header ───────────────────────────────────────────────────── */
function Header({ page }) {
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); }, [page]);
  return (
    <header className="header">
      <div className="container header-row">
        <a href="#home" className="brand">
          <Logo />
          <span className="brand-text">
            <span className="brand-name">{COMPANY.shortName}</span>
            <span className="brand-tag">{COMPANY.tagline}</span>
          </span>
        </a>
        <nav className={`nav ${open ? "nav-open" : ""}`} aria-label="Main">
          {PAGES.map(p => (
            <a key={p.key} href={`#${p.key}`} aria-current={page === p.key ? "page" : undefined}
              className={`nav-link ${p.key === "pay" ? "nav-pay" : ""}`}>{p.label}</a>
          ))}
        </nav>
        <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </header>
  );
}

/* ── Home ─────────────────────────────────────────────────────── */
function HomePage() {
  const open = PROPERTIES.filter(p => p.available);
  return (<>
    <section className="hero">
      <div className="container">
        <h1 className="hero-title">{HOME.headline}</h1>
        <p className="hero-intro">{HOME.intro}</p>
        <div className="btn-row">
          <a href="#properties" className="btn btn-primary btn-lg">See the houses</a>
          <a href="#pay" className="btn btn-secondary btn-lg">Pay rent</a>
        </div>
      </div>
      <div className="container">
        <ul className="house-row">
          {PROPERTIES.map(p => (
            <li key={p.number}>
              <a href={`#properties/${p.number}`} className="house-tile">
                <span className="num">{p.number}</span>
                <span className="house-tile-street">{p.street}{p.town ? `, ${p.town}` : ""}</span>
                <Status p={p} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>

    {open.map(p => (
      <section key={p.number} className="container band">
        <div className="available">
          <div>
            <h2>{address(p)} is available {p.available}</h2>
            <p>{p.summary}</p>
          </div>
          <a href="#contact" className="btn btn-primary">Ask about {p.number}</a>
        </div>
      </section>
    ))}

    <section className="container band">
      <h2 className="band-title">What we do</h2>
      <div className="services">
        {SERVICES.map((s, i) => <div key={i} className="service"><h3>{s.title}</h3><p>{s.text}</p></div>)}
      </div>
    </section>

    <section className="container band band-last">
      <div className="tenant-strip">
        <div>
          <h2>Current tenant?</h2>
          <p>Pay rent online, or send us a maintenance request.</p>
        </div>
        <div className="btn-row">
          <a href="#pay" className="btn btn-primary">Pay rent</a>
          <a href="#contact" className="btn btn-secondary">Request maintenance</a>
        </div>
      </div>
    </section>
  </>);
}

/* ── Properties ───────────────────────────────────────────────── */
function PropertiesPage({ sub }) {
  useEffect(() => {
    if (sub) document.getElementById(`house-${sub}`)?.scrollIntoView({ block: "start" });
  }, [sub]);
  return (
    <section className="container page">
      <div className="page-head">
        <h1>Properties</h1>
        <p className="lead">Our homes in {COMPANY.region}, each renovated and managed by us.</p>
      </div>
      <div className="house-list">
        {PROPERTIES.map(p => (
          <article key={p.number} id={`house-${p.number}`} className="house">
            <h2 className="house-title">
              <span className="num num-lg">{p.number}</span>
              <span className="house-street">{p.street}</span>
            </h2>
            <div className="house-body">
              <div className="house-meta">
                <span>{p.name}{p.town ? `, ${p.town}` : ""}</span>
                <Status p={p} />
              </div>
              <dl className="facts">
                {Object.entries(p.facts).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
              </dl>
              <p>{p.summary}</p>
              {p.available && <a href="#contact" className="btn btn-primary">Ask about this house</a>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ── Pay rent ─────────────────────────────────────────────────── */
function PayMethod({ title, note, children, action }) {
  return (
    <div className="pay-method">
      <div className="pay-body">
        <h3>{title}{note && <span className="tag">{note}</span>}</h3>
        {children}
      </div>
      {action && <div className="pay-action">{action}</div>}
    </div>
  );
}

function PayPage() {
  const { online, zelle, venmo, check } = PAYMENTS;
  const venmoUser = venmo.replace(/^@/, "");
  return (
    <section className="container narrow page">
      <div className="page-head">
        <h1>Pay rent</h1>
        <p className="lead">{PAYMENTS.dueNote}</p>
      </div>

      {online.url && (
        <a href={online.url} target="_blank" rel="noopener noreferrer" className="pay-online">
          <div className="pay-body">
            <h3>Pay online</h3>
            <p>{online.details}</p>
            {online.fees && <p className="fine">{online.fees}</p>}
          </div>
          <span className="btn btn-primary">Pay now <ExternalLink size={15} /></span>
        </a>
      )}

      {online.url && <h2 className="sub-head">Other ways to pay</h2>}
      <div className="pay-list">
        {zelle && (
          <PayMethod title="Zelle" note="No fee" action={<CopyButton text={zelle} />}>
            <p className="pay-value">{zelle}</p>
            <p className="fine">Send from your bank's app.</p>
          </PayMethod>
        )}
        {venmo && (
          <PayMethod title="Venmo"
            action={<a className="btn btn-secondary btn-sm" href={`https://venmo.com/u/${venmoUser}`} target="_blank" rel="noopener noreferrer">Open Venmo <ExternalLink size={13} /></a>}>
            <p className="pay-value">{venmo}</p>
          </PayMethod>
        )}
        {check.payableTo && (
          <PayMethod title="Check or money order" note="No fee">
            <p className="fine">Payable to</p>
            <p className="pay-value">{check.payableTo}</p>
            <p className="fine">Mail to</p>
            <p className="pay-value pre">{check.address}</p>
          </PayMethod>
        )}
      </div>

      {PAYMENTS.memoNote && <div className="notice"><AlertCircle size={16} /><span>{PAYMENTS.memoNote}</span></div>}
      <p className="fine center gap-top">Questions about your balance? <a href="#contact" className="link">Contact us</a>.</p>
    </section>
  );
}

/* ── Files ────────────────────────────────────────────────────── */
function FilesPage() {
  return (
    <section className="container narrow page">
      <div className="page-head">
        <h1>Files</h1>
        <p className="lead">Guides and forms for tenants.</p>
      </div>
      <div className="pay-list">
        {FILES.map((f, i) => (
          <div key={i} className="pay-method file-row">
            <FileText size={20} className="file-icon" />
            <div className="pay-body">
              <h3>{f.name}</h3>
              <p className="fine">{f.file.split(".").pop().toUpperCase()}{f.date ? `, updated ${f.date}` : ""}</p>
            </div>
            <a href={`/files/${f.file}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm"><Download size={14} /> Download</a>
          </div>
        ))}
      </div>
      <p className="fine center gap-top">Need something that isn't here? Email <a href={`mailto:${CONTACT.email}`} className="link">{CONTACT.email}</a>.</p>
    </section>
  );
}

/* ── Contact ──────────────────────────────────────────────────── */
function ContactPage() {
  const empty = { name: "", email: "", phone: "", property: "", topic: CONTACT.formTopics[0], message: "" };
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const subject = `[${form.topic}] Website message from ${form.name}`;
    if (!CONTACT.formEndpoint) {
      const body = `${form.message}\n\n— ${form.name}\n${form.email}${form.phone ? `\n${form.phone}` : ""}${form.property ? `\nProperty: ${form.property}` : ""}`;
      window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(CONTACT.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...form, _subject: subject }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent"); setForm(empty);
    } catch { setStatus("error"); }
  };

  const items = [
    CONTACT.phone && { icon: Phone, label: "Phone", value: CONTACT.phone, href: telHref(CONTACT.phone) },
    CONTACT.email && { icon: Mail, label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
    CONTACT.mailingAddress && { icon: MapPin, label: "Mail", value: CONTACT.mailingAddress },
    CONTACT.hours && { icon: Clock, label: "Hours", value: CONTACT.hours },
  ].filter(Boolean);

  return (
    <section className="container narrow page">
      <div className="page-head"><h1>Contact</h1></div>
      <ul className="contact-list">
        {items.map((c, i) => {
          const inner = <><c.icon size={18} className="contact-icon" /><span className="fine">{c.label}</span><span className="contact-value">{c.value}</span></>;
          return <li key={i}>{c.href ? <a href={c.href} className="contact-item">{inner}</a> : <div className="contact-item">{inner}</div>}</li>;
        })}
      </ul>
      {CONTACT.emergencyNote && <div className="notice notice-warn"><AlertCircle size={16} /><span>{CONTACT.emergencyNote}</span></div>}

      <div className="form-card">
        {status === "sent" ? (
          <div className="center sent">
            <CheckCircle size={40} className="ok" />
            <h2>Message sent</h2>
            <p>We'll reply by email.</p>
            <button className="btn btn-secondary" onClick={() => setStatus("idle")}>Send another message</button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <h2>Send a message</h2>
            <div className="form-grid">
              <label>Name<input required value={form.name} onChange={set("name")} autoComplete="name" /></label>
              <label>Email<input required type="email" value={form.email} onChange={set("email")} autoComplete="email" /></label>
              <label>Phone (optional)<input type="tel" value={form.phone} onChange={set("phone")} autoComplete="tel" /></label>
              <label>Topic<select value={form.topic} onChange={set("topic")}>{CONTACT.formTopics.map(t => <option key={t}>{t}</option>)}</select></label>
            </div>
            <label>Property address, if you're a tenant<input value={form.property} onChange={set("property")} /></label>
            <label>Message<textarea required rows={5} value={form.message} onChange={set("message")} /></label>
            {status === "error" && <div className="notice notice-error"><AlertCircle size={16} /><span>The message didn't send. Email {CONTACT.email} directly.</span></div>}
            <button type="submit" className="btn btn-primary btn-block" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : <>Send message <Send size={15} /></>}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

/* ── Footer ───────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-row">
        <div className="footer-brand">
          <a href="#home" className="brand"><Logo size={36} /><span className="brand-name">{COMPANY.name}</span></a>
          <p className="fine">
            {CONTACT.phone && <a href={telHref(CONTACT.phone)}>{CONTACT.phone}</a>}
            {CONTACT.phone && CONTACT.email && <br />}
            {CONTACT.email && <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>}
          </p>
        </div>
        <nav className="footer-nav" aria-label="Footer">{PAGES.map(p => <a key={p.key} href={`#${p.key}`}>{p.label}</a>)}</nav>
      </div>
      <div className="container fine footer-copy">© {new Date().getFullYear()} {COMPANY.name}</div>
    </footer>
  );
}

/* ── App ──────────────────────────────────────────────────────── */
export default function App() {
  const { page, sub } = useRoute();
  return (
    <div className="site">
      <Header page={page} />
      <main>
        {page === "home" && <HomePage />}
        {page === "properties" && <PropertiesPage sub={sub} />}
        {page === "pay" && <PayPage />}
        {page === "files" && <FilesPage />}
        {page === "contact" && <ContactPage />}
      </main>
      <Footer />
    </div>
  );
}
