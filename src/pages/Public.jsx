import { useEffect, useState } from "react";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { COMPANY, CONTACT, HOME, SERVICES, PROPERTIES } from "../content";
import { Notice, Field } from "../ui";
import { telHref } from "../lib/util";

const statusText = (p) => (p.available ? `Available ${p.available}` : "Leased");

/* ── Home ─────────────────────────────────────────────────────── */
export function HomePage() {
  const open = PROPERTIES.filter((p) => p.available);
  return (<>
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <h1 className="hero-title">{HOME.headline}</h1>
          <p className="hero-intro">{HOME.intro}</p>
          <div className="btn-row">
            <a href="#pay" className="btn btn-primary btn-lg">Pay rent</a>
            <a href="#properties" className="btn btn-secondary btn-lg">See the houses</a>
          </div>
        </div>
        <div className="directory">
          <h2 className="directory-title">Our homes</h2>
          <ul className="dir">
            {PROPERTIES.map((p) => (
              <li key={p.number}>
                <a href={`#properties/${p.number}`} className="dir-item">
                  <span className="num">{p.number}</span>
                  <span className="dir-street">{p.street}{p.town && <small>{p.town}</small>}</span>
                  <span className={`dir-status ${p.available ? "is-open" : ""}`}>{statusText(p)}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>

    {open.map((p) => (
      <section key={p.number} className="container band">
        <div className="feature">
          <div>
            <h2>{p.number} {p.street} is available {p.available}</h2>
            <p>{p.summary}</p>
          </div>
          <a href="#contact" className="btn btn-primary">Ask about {p.number}</a>
        </div>
      </section>
    ))}

    <section className="container band">
      <h2 className="band-title">What we do</h2>
      <div className="services">
        {SERVICES.map((s) => <div key={s.title} className="service"><h3>{s.title}</h3><p>{s.text}</p></div>)}
      </div>
    </section>

    <section className="container band band-last">
      <div className="tenant-strip">
        <div>
          <h2>Live in one of our homes?</h2>
          <p>Log in to pay rent by bank transfer, see your balance, and send maintenance requests.</p>
        </div>
        <div className="btn-row">
          <a href="#login" className="btn btn-on-strip">Log in</a>
          <a href="#join" className="btn btn-ghost-strip">Create account</a>
        </div>
      </div>
    </section>
  </>);
}

/* ── Properties ───────────────────────────────────────────────── */
export function PropertiesPage({ sub }) {
  useEffect(() => {
    if (sub) document.getElementById(`house-${sub}`)?.scrollIntoView({ block: "start" });
  }, [sub]);
  return (
    <section className="container page">
      <header className="page-head">
        <h1>Properties</h1>
        <p className="lead">Our homes in {COMPANY.region}, each renovated and managed by us.</p>
      </header>
      <div className="house-list">
        {PROPERTIES.map((p) => (
          <article key={p.number} id={`house-${p.number}`} className="house">
            <h2 className="house-title"><span className="num num-lg">{p.number}</span><span className="house-street">{p.street}</span></h2>
            <div className="house-body">
              <div className="house-meta">
                <span>{p.name}{p.town ? `, ${p.town}` : ""}</span>
                <span className={`dir-status ${p.available ? "is-open" : ""}`}>{statusText(p)}</span>
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

/* ── Contact ──────────────────────────────────────────────────── */
export function ContactPage() {
  const empty = { name: "", email: "", phone: "", property: "", topic: CONTACT.formTopics[0], message: "" };
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState("idle");
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
    CONTACT.phone && { icon: Phone, label: "Call or text", value: CONTACT.phone, href: telHref(CONTACT.phone) },
    CONTACT.email && { icon: Mail, label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
    CONTACT.mailingAddress && { icon: MapPin, label: "Mail", value: CONTACT.mailingAddress },
    CONTACT.hours && { icon: Clock, label: "Hours", value: CONTACT.hours },
  ].filter(Boolean);

  return (
    <section className="container narrow page">
      <header className="page-head"><h1>Contact</h1><p className="lead">Residents: log in to send a maintenance request so it's tracked.</p></header>
      <ul className="contact-list">
        {items.map((c) => {
          const inner = <><c.icon size={18} className="contact-icon" /><span className="fine">{c.label}</span><span className="contact-value">{c.value}</span></>;
          return <li key={c.label}>{c.href ? <a href={c.href} className="card contact-item">{inner}</a> : <div className="card contact-item">{inner}</div>}</li>;
        })}
      </ul>
      {CONTACT.emergencyNote && <Notice tone="warn">{CONTACT.emergencyNote}</Notice>}

      <div className="card card-pad gap-top">
        {status === "sent" ? (
          <div className="center">
            <h2>Message sent</h2>
            <p className="center">We'll reply by email.</p>
            <button className="btn btn-secondary" onClick={() => setStatus("idle")}>Send another message</button>
          </div>
        ) : (
          <form onSubmit={submit} className="form">
            <h2 className="card-title">Send a message</h2>
            <div className="form-grid">
              <Field label="Name"><input required value={form.name} onChange={set("name")} autoComplete="name" /></Field>
              <Field label="Email"><input required type="email" value={form.email} onChange={set("email")} autoComplete="email" /></Field>
              <Field label="Phone (optional)"><input type="tel" value={form.phone} onChange={set("phone")} autoComplete="tel" /></Field>
              <Field label="Topic"><select value={form.topic} onChange={set("topic")}>{CONTACT.formTopics.map((t) => <option key={t}>{t}</option>)}</select></Field>
            </div>
            <Field label="Property address, if you live in one of our homes"><input value={form.property} onChange={set("property")} /></Field>
            <Field label="Message"><textarea required rows={5} value={form.message} onChange={set("message")} /></Field>
            {status === "error" && <Notice tone="error">The message didn't send. Email {CONTACT.email} directly.</Notice>}
            <button type="submit" className="btn btn-primary btn-block" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : <>Send message <Send size={16} /></>}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

