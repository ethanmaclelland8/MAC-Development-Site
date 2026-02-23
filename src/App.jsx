import { useState, useEffect, useRef } from "react";
import {
  Home, LogOut, ChevronRight, ChevronLeft, DollarSign, Shield, CreditCard,
  Send, MessageSquare, Zap, Flame, Sun, Droplets, TrendingUp,
  CheckCircle, AlertCircle, Users, Building, Settings,
  Plus, Check, X, ArrowUpRight, Calendar, FileText, Key,
  Megaphone, Eye, EyeOff, RefreshCw, Wallet,
  LayoutDashboard, Receipt, Mail, User, Phone, MapPin,
  Pencil, Trash2, UserPlus, UserMinus, Save,
  Landmark, ShieldCheck, Clock, Menu,
  Wrench, Paintbrush, TreePine, ArrowRight,
  FolderOpen, Upload, Download, File,
  Briefcase, Camera, ChevronDown, ExternalLink, ArrowLeftRight
} from "lucide-react";

/* ═══════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════ */
function useIsMobile(bp = 768) {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w < bp;
}

/* ═══════════════════════════════════════════
   THEME + CONSTANTS
   ═══════════════════════════════════════════ */
const T = {
  bg: "#0F1520", bgCard: "#161D2A", bgElevated: "#1C2535", bgHover: "#222C3D",
  border: "#253044", text: "#E8ECF1", textSecondary: "#8A95A8", textMuted: "#5C6880",
  accent: "#4A7FBF", accentDim: "rgba(74,127,191,0.12)", accentBorder: "rgba(74,127,191,0.28)",
  green: "#3BA55D", greenDim: "rgba(59,165,93,0.1)", greenBorder: "rgba(59,165,93,0.2)",
  red: "#E04848", redDim: "rgba(224,72,72,0.08)", redBorder: "rgba(224,72,72,0.18)",
  blue: "#4A90D9", blueDim: "rgba(74,144,217,0.1)", navy: "#1E2940",
  warm: "#F5F0EB", warmDark: "#2A2520", warmMid: "#D4C5B4", warmAccent: "#8B7355",
  gold: "#C9A84C", goldDim: "rgba(201,168,76,0.1)", goldBorder: "rgba(201,168,76,0.25)",
};
const FONT = `'Instrument Sans', -apple-system, sans-serif`;
const FONT_B = `'IBM Plex Sans', -apple-system, sans-serif`;

const UTILITIES = [
  { key: "oil", label: "Oil", Icon: Droplets, color: "#B07D2B" },
  { key: "electric", label: "Electric", Icon: Zap, color: "#E9C46A" },
  { key: "solar", label: "Solar Credit", Icon: Sun, color: "#F4A261" },
  { key: "propane", label: "Propane", Icon: Flame, color: "#E76F51" },
];

const INIT_PROPS = [
  { id: 1, name: "142 Oak Street", address: "142 Oak St, Unit A", code: "142" },
  { id: 2, name: "88 Maple Avenue", address: "88 Maple Ave", code: "88" },
  { id: 3, name: "310 Cedar Lane", address: "310 Cedar Ln", code: "310" },
  { id: 4, name: "27 Birch Road", address: "27 Birch Rd", code: "27" },
];

const ADMIN_USER = { username: "Ethan", password: "admin123" };

const mkData = () => ({
  1: { login: "oak142", password: "rent123", residents: ["Maria Santos", "Jorge Santos", "Ana Santos"], futureResidents: [], rent: 2800, securityDeposit: 2800, prepaidRent: 0, balance: 2800, autopay: true, autopayMethod: "ACH", autopayDay: 1, utilities: { oil: 0, electric: 142.50, solar: -38.20, propane: 0 }, payments: [{ id: 1, date: "2025-01-01", amount: 2800, method: "ACH", type: "Rent", status: "completed" }], messages: [{ id: 1, from: "admin", text: "Welcome to your resident portal!", date: "2025-01-01", read: true }], files: [{ id: 1, name: "Lease Agreement - 142 Oak St", category: "Lease", date: "2025-01-01", size: "2.4 MB" }, { id: 2, name: "Move-In Inspection Report", category: "Inspection", date: "2025-01-01", size: "1.1 MB" }] },
  2: { login: "maple88", password: "rent123", residents: ["David Chen", "Lisa Chen"], futureResidents: ["Tom Park"], rent: 2200, securityDeposit: 2200, prepaidRent: 500, balance: 0, autopay: false, autopayMethod: null, autopayDay: 1, utilities: { oil: 87.30, electric: 98.60, solar: 0, propane: 45.00 }, payments: [{ id: 1, date: "2025-01-03", amount: 2200, method: "Zelle", type: "Rent", status: "completed" }], messages: [], files: [{ id: 1, name: "Lease Agreement - 88 Maple Ave", category: "Lease", date: "2025-01-01", size: "2.1 MB" }] },
  3: { login: "cedar310", password: "rent123", residents: ["James Wilson", "Patricia Wilson", "Emily Wilson"], futureResidents: [], rent: 3100, securityDeposit: 3100, prepaidRent: 0, balance: 3100, autopay: false, autopayMethod: null, autopayDay: 1, utilities: { oil: 210.00, electric: 175.40, solar: -52.10, propane: 89.00 }, payments: [], messages: [{ id: 1, from: "admin", text: "Reminder: January rent is due.", date: "2025-01-05", read: false }], files: [] },
  4: { login: "birch27", password: "rent123", residents: ["Sarah Johnson"], futureResidents: ["Mike Reynolds", "Jane Reynolds"], rent: 1450, securityDeposit: 1450, prepaidRent: 200, balance: 0, autopay: true, autopayMethod: "Zelle", autopayDay: 1, utilities: { oil: 0, electric: 62.30, solar: -15.00, propane: 0 }, payments: [{ id: 1, date: "2025-01-01", amount: 1450, method: "Venmo", type: "Rent", status: "completed" }], messages: [], files: [{ id: 1, name: "Lease Agreement - 27 Birch Rd", category: "Lease", date: "2025-01-01", size: "1.9 MB" }, { id: 2, name: "Parking Assignment", category: "Other", date: "2025-01-05", size: "340 KB" }] },
});

const fmt = (n) => {
  const a = Math.abs(n);
  const s = a.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return n < 0 ? `-$${s}` : `$${s}`;
};
const ord = (n) => n === 1 ? "1st" : n === 2 ? "2nd" : n === 3 ? "3rd" : `${n}th`;
const today = () => new Date().toISOString().split("T")[0];

/* ═══════════════════════════════════════════
   PORTFOLIO DATA
   ═══════════════════════════════════════════ */
const IMG = "https://www.ethanm.me/images";
const PORTFOLIO_PROJECTS = [
  {
    id: 1, num: "01", title: "The Vinton", status: "Foundation",
    year: "2019 – Present", desc: "Victorian Tudor · 6BR/3BA · Student Rental · First BRRR Success",
    rooms: [
      { label: "Bathroom", before: `${IMG}/vinton-bathroom-before.jpg`, after: `${IMG}/vinton-bathroom-after.jpg` },
      { label: "Kitchen", before: `${IMG}/vinton-kitchen-before.jpg`, after: `${IMG}/vinton-kitchen-after.jpg` },
      { label: "Living Room", before: `${IMG}/vinton-livingroom-before.jpg`, after: `${IMG}/vinton-livingroom-after.jpg` },
      { label: "Bedroom", before: `${IMG}/vinton-bedroom-before.jpg`, after: `${IMG}/vinton-bedroom-after.jpg` },
    ],
  },
  {
    id: 2, num: "02", title: "Historic Stone Church", status: "Active",
    year: "2025 – Present", desc: "Built 1935 · Adaptive Reuse · Mixed-Use Conversion",
    rooms: [
      { label: "Exterior", before: `${IMG}/church-exterior-before.jpg`, after: `${IMG}/church-exterior-progress.jpg`, afterLabel: "In Progress" },
      { label: "Interior", before: `${IMG}/church-interior-before.jpg`, after: `${IMG}/church-interior-progress.jpg`, afterLabel: "In Progress" },
    ],
  },
  {
    id: 3, num: "03", title: "The Trap", status: "Completed",
    year: "2022 – 2023", desc: "Value-Add Acquisition · Full Systems Upgrade · BRRR Exit",
    rooms: [
      { label: "Kitchen", before: `${IMG}/trap-kitchen-before.jpg`, after: `${IMG}/trap-kitchen-after.jpg` },
      { label: "Living Room", before: `${IMG}/trap-livingroom1-before.jpg`, after: `${IMG}/trap-livingroom1-after.jpg` },
      { label: "Living Room 2", before: `${IMG}/trap-livingroom2-before.jpg`, after: `${IMG}/trap-livingroom2-after.jpg` },
      { label: "Bedroom", before: `${IMG}/trap-bedroom-before.jpg`, after: `${IMG}/trap-bedroom-after.jpg` },
      { label: "Bathroom", before: `${IMG}/trap-bathroom-before.jpg`, after: `${IMG}/trap-bathroom-after.jpg` },
    ],
  },
  {
    id: 4, num: "04", title: "Pool House", status: "Completed",
    year: "2023 – 2024", desc: "Premium Renovation · Pool Restoration · Luxury Positioning",
    rooms: [
      { label: "Exterior", before: `${IMG}/pool-exterior-1.jpg`, after: `${IMG}/pool-exterior-2.jpg`, beforeLabel: "View 1", afterLabel: "View 2" },
      { label: "Kitchen", before: `${IMG}/pool-kitchen.jpg` },
      { label: "Living Room", before: `${IMG}/pool-livingroom.jpg` },
    ],
  },
];

/* ═══════════════════════════════════════════
   GLOBAL STYLES
   ═══════════════════════════════════════════ */
function GlobalStyles() {
  return (<>
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700;800&family=IBM+Plex+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
    <style>{`
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
      html{scroll-behavior:smooth}
      html,body{overflow-x:hidden;width:100%}
      ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${T.border};border-radius:10px}
      input,select,textarea{font-family:${FONT_B};font-size:16px}
      input:focus,select:focus,textarea:focus{outline:none;border-color:${T.accent}!important;box-shadow:0 0 0 3px ${T.accentDim}!important}
      select option{background:${T.bgElevated};color:${T.text}}
      .nav-scroll{display:flex;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none}
      .nav-scroll::-webkit-scrollbar{display:none}
      .mgrid{display:grid;gap:10px;grid-template-columns:repeat(2,1fr)}
      @media(min-width:768px){.mgrid{grid-template-columns:repeat(3,1fr);gap:14px}}
      .mgrid4{display:grid;gap:10px;grid-template-columns:repeat(2,1fr)}
      @media(min-width:768px){.mgrid4{grid-template-columns:repeat(4,1fr);gap:14px}}
      .ugrid{display:grid;gap:8px;grid-template-columns:repeat(2,1fr)}
      @media(min-width:768px){.ugrid{grid-template-columns:repeat(4,1fr);gap:10px}}
      @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
      @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
      @keyframes fadeInSlow{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
      @keyframes pulse{0%,100%{opacity:0.4}50%{opacity:1}}
      @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
      .fi{animation:fadeIn .3s ease-out both}.su{animation:slideUp .25s ease-out both}
      .fis{animation:fadeInSlow .6s ease-out both}
    `}</style>
  </>);
}

/* ═══════════════════════════════════════════
   LOGO
   ═══════════════════════════════════════════ */
function MacDevLogo({ size = 52, light }) {
  const fill = light ? "#1E2940" : "#EAEDF2";
  const bg = light ? "#EAEDF2" : "#1E2940";
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <rect width="52" height="52" rx="8" fill={bg} />
      <text x="26" y="24" textAnchor="middle" fontFamily="'Instrument Sans', sans-serif" fontWeight="700" fontSize="18" fill={fill}>MAC</text>
      <line x1="12" y1="30" x2="40" y2="30" stroke={fill} strokeWidth="0.7" opacity="0.5" />
      <text x="26" y="40" textAnchor="middle" fontFamily="'IBM Plex Sans', sans-serif" fontWeight="400" fontSize="6.5" fill={fill} opacity="0.7">DEVELOPMENT CO</text>
    </svg>
  );
}

/* ═══════════════════════════════════════════
   SHARED UI COMPONENTS
   ═══════════════════════════════════════════ */
function Badge({ children, variant = "default" }) {
  const m = { default: [T.bgElevated, T.textSecondary, T.border], success: [T.greenDim, T.green, T.greenBorder], danger: [T.redDim, T.red, T.redBorder], warning: [T.goldDim, T.gold, T.goldBorder], accent: [T.accentDim, T.accent, T.accentBorder] };
  const [bg, c, bd] = m[variant] || m.default;
  return <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 9px", borderRadius: 6, fontSize: 10, fontWeight: 600, fontFamily: FONT_B, background: bg, color: c, border: `1px solid ${bd}` }}>{children}</span>;
}

function Metric({ icon: Icon, label, value, sub, variant = "default", mob }) {
  const acc = { default: [T.bgElevated, T.textSecondary], success: [T.greenDim, T.green], danger: [T.redDim, T.red], warning: [T.goldDim, T.gold], accent: [T.accentDim, T.accent] };
  const [ibg, ic] = acc[variant] || acc.default;
  return (
    <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: mob ? 12 : 18 }}>
      <div style={{ width: mob ? 30 : 36, height: mob ? 30 : 36, borderRadius: 9, background: ibg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}><Icon size={mob ? 14 : 17} color={ic} /></div>
      <div style={{ color: T.textMuted, fontSize: mob ? 9 : 11, fontWeight: 600, textTransform: "uppercase", fontFamily: FONT_B, letterSpacing: "0.5px", marginBottom: 4 }}>{label}</div>
      <div style={{ color: T.text, fontSize: mob ? 18 : 26, fontWeight: 700, fontFamily: FONT }}>{value}</div>
      {sub && <div style={{ color: T.textMuted, fontSize: mob ? 10 : 12, fontFamily: FONT_B, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", style: ex, ...p }) {
  const base = { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "10px 18px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: FONT, transition: "all .15s", whiteSpace: "nowrap" };
  const v = {
    primary: { background: T.accent, color: "#fff" },
    secondary: { background: T.bgElevated, color: T.textSecondary, border: `1px solid ${T.border}` },
    ghost: { background: "transparent", color: T.textSecondary, border: `1px solid ${T.border}` },
    success: { background: T.green, color: "#fff" },
    danger: { background: T.redDim, color: T.red, border: `1px solid ${T.redBorder}` },
    white: { background: "#fff", color: T.navy, fontWeight: 700 },
    outline: { background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.25)" },
  };
  return <button onClick={onClick} style={{ ...base, ...(v[variant] || v.primary), ...ex }} {...p}>{children}</button>;
}

function Inp({ label, dark, ...p }) {
  const bg = dark ? T.bgElevated : "#fff";
  const border = dark ? T.border : "#D0D5DD";
  const color = dark ? T.text : "#1D2939";
  const lbl = dark ? T.textMuted : "#667085";
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: "block", color: lbl, fontSize: 11, fontWeight: 600, fontFamily: FONT_B, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>{label}</label>}
      <input style={{ width: "100%", padding: "11px 13px", border: `1px solid ${border}`, borderRadius: 10, background: bg, color, fontFamily: FONT_B, fontSize: 14 }} {...p} />
    </div>
  );
}

function Sel({ label, children, ...p }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: "block", color: T.textMuted, fontSize: 11, fontWeight: 600, fontFamily: FONT_B, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>{label}</label>}
      <select style={{ width: "100%", padding: "11px 13px", border: `1px solid ${T.border}`, borderRadius: 10, background: T.bgElevated, color: T.text, fontFamily: FONT_B, fontSize: 14, appearance: "auto" }} {...p}>{children}</select>
    </div>
  );
}

function Modal({ title, subtitle, onClose, children, wide }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }} onClick={onClose}>
      <div className="su" style={{ width: "100%", maxWidth: wide ? 560 : 440, background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 18, padding: 28, maxHeight: "85vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <h3 style={{ color: T.text, fontSize: 18, fontWeight: 700, fontFamily: FONT, margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: T.bgElevated, border: `1px solid ${T.border}`, borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: T.textMuted, flexShrink: 0 }}><X size={14} /></button>
        </div>
        {subtitle && <p style={{ color: T.textMuted, fontSize: 13, fontFamily: FONT_B, marginBottom: 20, lineHeight: 1.5 }}>{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}

function Toggle({ options, value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 16 }}>
      {options.map(o => (
        <button key={o.value} onClick={() => onChange(o.value)} style={{ flex: 1, minWidth: 60, padding: "8px 12px", border: `1px solid ${value === o.value ? T.accent : T.border}`, borderRadius: 8, background: value === o.value ? T.accentDim : T.bgElevated, color: value === o.value ? T.accent : T.textSecondary, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: FONT_B }}>{o.label}</button>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════
   SITE NAVIGATION — FIXED HEADER
   ═══════════════════════════════════════════ */
function SiteNav({ page, setPage, portalUser, onLogout, mob }) {
  const [mobileMenu, setMobileMenu] = useState(false);
  const isPortal = page === "portal";
  const links = [
    { key: "home", label: "Home" },
    { key: "services", label: "Services" },
    { key: "portfolio", label: "Portfolio" },
    { key: "pay", label: "Pay Rent" },
    { key: "portal", label: portalUser ? "Dashboard" : "Resident Portal" },
    { key: "contact", label: "Contact" },
  ];
  const nav = (k) => { setPage(k); setMobileMenu(false); window.scrollTo(0, 0); };
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 200,
      background: "rgba(15,21,32,0.85)", backdropFilter: "blur(20px) saturate(1.4)",
      borderBottom: `1px solid rgba(37,48,68,0.6)`,
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        padding: `0 ${mob ? 16 : 40}px`,
        height: mob ? 56 : 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Logo area */}
        <div onClick={() => nav("home")} style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
          <MacDevLogo size={mob ? 32 : 36} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ color: T.text, fontSize: mob ? 13 : 15, fontWeight: 700, fontFamily: FONT, lineHeight: 1.1, letterSpacing: "-0.3px" }}>MAC Development</span>
            <span style={{ color: T.textMuted, fontSize: mob ? 9 : 10, fontWeight: 500, fontFamily: FONT_B, letterSpacing: "0.5px", textTransform: "uppercase" }}>Property Management</span>
          </div>
        </div>

        {/* Desktop nav */}
        {!mob ? (
          <nav style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {links.map(l => (
              <button key={l.key} onClick={() => nav(l.key)} style={{
                padding: "7px 14px", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: FONT,
                fontSize: 13, fontWeight: 500, transition: "all .15s",
                background: page === l.key ? T.accentDim : "transparent",
                color: page === l.key ? T.accent : T.textSecondary,
              }}>{l.label}</button>
            ))}
            {portalUser && (
              <button onClick={() => { onLogout(); nav("home"); }} style={{
                padding: "7px 14px", border: "none", borderRadius: 8, cursor: "pointer",
                fontFamily: FONT, fontSize: 13, fontWeight: 500, background: T.redDim, color: T.red,
                marginLeft: 4, display: "flex", alignItems: "center", gap: 6,
              }}><LogOut size={13} />Sign Out</button>
            )}
          </nav>
        ) : (
          <button onClick={() => setMobileMenu(!mobileMenu)} style={{
            background: "transparent", border: `1px solid ${T.border}`, borderRadius: 8,
            color: T.text, cursor: "pointer", width: 36, height: 36,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {mobileMenu ? <X size={18} /> : <Menu size={18} />}
          </button>
        )}
      </div>

      {/* Mobile menu */}
      {mob && mobileMenu && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          background: T.bgCard, borderBottom: `1px solid ${T.border}`,
          padding: "8px 16px 12px", zIndex: 300,
        }}>
          {links.map(l => (
            <button key={l.key} onClick={() => nav(l.key)} style={{
              display: "block", width: "100%", padding: "12px 8px", border: "none",
              background: page === l.key ? T.accentDim : "transparent",
              color: page === l.key ? T.accent : T.textSecondary,
              fontSize: 14, fontWeight: 500, fontFamily: FONT, cursor: "pointer",
              textAlign: "left", borderRadius: 8,
            }}>{l.label}</button>
          ))}
          {portalUser && (
            <button onClick={() => { onLogout(); nav("home"); }} style={{
              display: "flex", alignItems: "center", gap: 8, width: "100%",
              padding: "12px 8px", border: "none", background: T.redDim,
              color: T.red, fontSize: 14, fontWeight: 500, fontFamily: FONT,
              cursor: "pointer", textAlign: "left", borderRadius: 8, marginTop: 4,
            }}><LogOut size={14} />Sign Out</button>
          )}
        </div>
      )}
    </header>
  );
}

/* ═══════════════════════════════════════════
   HOME PAGE
   ═══════════════════════════════════════════ */
function HomePage({ setPage, mob }) {
  const SERIF = `'Playfair Display', Georgia, serif`;
  const services = [
    { icon: Building, title: "Property Management", desc: "Full-service oversight of residential rental operations." },
    { icon: Wrench, title: "Maintenance & Repairs", desc: "24/7 responsive maintenance coordination and tracking." },
    { icon: Paintbrush, title: "Renovation & Upgrades", desc: "Strategic property improvements that maximize value." },
    { icon: TreePine, title: "Landscaping & Grounds", desc: "Seasonal grounds maintenance, snow removal, and curb appeal." },
    { icon: DollarSign, title: "Financial Management", desc: "Online rent collection, expense tracking, and reporting." },
    { icon: ShieldCheck, title: "Resident Screening", desc: "Comprehensive background and credit screening for applicants." },
  ];
  const stats = [
    { num: "5+", label: "Properties Renovated" },
    { num: "0%", label: "Portfolio Vacancy" },
    { num: "$2M+", label: "Projects Managed" },
    { num: "24/7", label: "Maintenance Response" },
  ];
  return (
    <div style={{ background: T.bg, fontFamily: FONT }}>
      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(160deg, #111927 0%, #0F1520 40%, #131B2B 100%)` }} />
        <div style={{ position: "absolute", top: mob ? -100 : -160, right: mob ? -120 : -80, width: mob ? 300 : 500, height: mob ? 300 : 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(74,127,191,0.06) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: mob ? -80 : -120, left: mob ? -60 : -40, width: mob ? 240 : 400, height: mob ? 240 : 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,165,93,0.04) 0%, transparent 70%)" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: mob ? "50px 20px 40px" : "90px 40px 80px" }}>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: mob ? 36 : 60, alignItems: "center" }}>
            <div>
              <h1 className="fis" style={{ animationDelay: "0.1s", color: T.text, fontSize: mob ? 34 : 52, fontWeight: 700, letterSpacing: "-1.5px", lineHeight: 1.08, marginBottom: mob ? 16 : 24, fontFamily: FONT }}>
                Your Home,<br />Our Priority.
              </h1>
              <p className="fis" style={{ animationDelay: "0.2s", color: T.textSecondary, fontSize: mob ? 14 : 17, fontFamily: FONT_B, lineHeight: 1.7, marginBottom: mob ? 24 : 32, maxWidth: 480 }}>
                MAC Development Co. manages residential properties across New England. Quality maintenance, transparent financials, and responsive service — built for peace of mind.
              </p>
              <div className="fis" style={{ animationDelay: "0.3s", display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Btn variant="primary" onClick={() => setPage("portal")} style={{ padding: "14px 28px", fontSize: 14 }}>Resident Portal <ChevronRight size={16} /></Btn>
                <Btn variant="ghost" onClick={() => setPage("contact")} style={{ padding: "14px 28px", fontSize: 14, color: T.textSecondary }}>Contact Us</Btn>
              </div>
              {!mob && (
                <div className="fis" style={{ animationDelay: "0.4s", display: "flex", gap: 28, marginTop: 48 }}>
                  {stats.map((s, i) => (
                    <div key={i}>
                      <div style={{ color: T.text, fontSize: 24, fontWeight: 800, fontFamily: FONT }}>{s.num}</div>
                      <div style={{ color: T.textMuted, fontSize: 10, fontWeight: 600, fontFamily: FONT_B, textTransform: "uppercase", letterSpacing: "0.3px", marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { icon: Building, title: "Property Management", desc: "Full-service oversight from tenant screening to maintenance.", accent: T.accent },
                { icon: MessageSquare, title: "Direct Messaging", desc: "Communicate with your property manager anytime.", accent: T.green },
                { icon: FolderOpen, title: "Documents & Files", desc: "Access your lease, inspection reports, and notices.", accent: "#E9C46A" },
              ].map((card, i) => (
                <div key={i} className="fis" style={{ animationDelay: `${0.15 + i * 0.1}s`, background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, padding: mob ? 16 : 20, display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: `${card.accent}12`, border: `1px solid ${card.accent}28`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <card.icon size={20} color={card.accent} />
                  </div>
                  <div>
                    <div style={{ color: T.text, fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{card.title}</div>
                    <div style={{ color: T.textMuted, fontSize: 12, fontFamily: FONT_B, lineHeight: 1.4 }}>{card.desc}</div>
                  </div>
                </div>
              ))}
              {!mob && (
                <div className="fis" style={{ animationDelay: "0.5s", display: "flex", alignItems: "center", gap: 8, marginTop: 4, paddingLeft: 4 }}>
                  <Phone size={14} color={T.green} />
                  <span style={{ color: T.textSecondary, fontSize: 12, fontFamily: FONT_B }}>24/7 Emergency Line: (617) 999-0134</span>
                </div>
              )}
            </div>
          </div>
          {mob && (
            <div className="fis" style={{ animationDelay: "0.35s", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginTop: 32 }}>
              {stats.map((s, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ color: T.text, fontSize: 20, fontWeight: 800, fontFamily: FONT }}>{s.num}</div>
                  <div style={{ color: T.textMuted, fontSize: 9, fontWeight: 600, fontFamily: FONT_B, textTransform: "uppercase" }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <div style={{ borderTop: `1px solid ${T.border}` }} />
      {/* SERVICES */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "60px 20px" : "100px 40px" }}>
        <div style={{ textAlign: "center", marginBottom: mob ? 40 : 60 }}>
          <div style={{ color: T.accent, fontSize: 11, fontWeight: 700, fontFamily: FONT_B, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>What We Do</div>
          <h2 style={{ color: T.text, fontSize: mob ? 28 : 40, fontWeight: 700, letterSpacing: "-1px" }}>Full-Service Property Management</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
          {services.map((s, i) => (
            <div key={i} className="fis" style={{ animationDelay: `${i * 0.08}s`, background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 16, padding: mob ? 22 : 28 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: T.accentDim, border: `1px solid ${T.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <s.icon size={22} color={T.accent} />
              </div>
              <h3 style={{ color: T.text, fontSize: 17, fontWeight: 700, marginBottom: 10 }}>{s.title}</h3>
              <p style={{ color: T.textMuted, fontSize: 13, fontFamily: FONT_B, lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* PAY CTA */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "0 20px 60px" : "0 40px 80px" }}>
        <div style={{ background: `linear-gradient(135deg, ${T.navy}, #162038)`, borderRadius: 24, padding: mob ? "40px 24px" : "56px 48px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(74,127,191,0.08) 0%, transparent 70%)" }} />
          <div style={{ position: "relative", maxWidth: 600 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <CreditCard size={24} color={T.accent} />
              <span style={{ color: T.accent, fontSize: 12, fontWeight: 700, fontFamily: FONT_B, textTransform: "uppercase", letterSpacing: 1 }}>Online Payments</span>
            </div>
            <h2 style={{ color: T.text, fontSize: mob ? 26 : 36, fontWeight: 700, letterSpacing: "-1px", marginBottom: 16 }}>Pay Rent Securely Online</h2>
            <p style={{ color: T.textSecondary, fontSize: mob ? 14 : 16, fontFamily: FONT_B, lineHeight: 1.7, marginBottom: 28 }}>
              Set up ACH bank transfers, pay with Zelle or Venmo, and enroll in autopay. Secure, fast, and tracked in your resident dashboard.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Btn variant="primary" onClick={() => setPage("pay")} style={{ padding: "13px 28px" }}>Make a Payment <ArrowRight size={16} /></Btn>
              <Btn variant="ghost" onClick={() => setPage("portal")} style={{ padding: "13px 28px", color: T.textSecondary }}>View Dashboard</Btn>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 32, flexWrap: "wrap" }}>
            {["ACH Bank Transfer", "Zelle", "Venmo", "Autopay"].map(m => (
              <div key={m} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "rgba(255,255,255,0.05)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)" }}>
                <CheckCircle size={12} color={T.green} />
                <span style={{ color: T.textSecondary, fontSize: 11, fontFamily: FONT_B, fontWeight: 500 }}>{m}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer setPage={setPage} mob={mob} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   SERVICES PAGE
   ═══════════════════════════════════════════ */
function ServicesPage({ setPage, mob }) {
  const SERIF = `'Playfair Display', Georgia, serif`;
  const items = [
    { icon: Building, title: "Property Management", points: ["Lease administration & renewals", "Tenant screening & placement", "Monthly financial reporting", "Vendor management"] },
    { icon: Wrench, title: "Maintenance", points: ["24/7 emergency response", "Preventive maintenance programs", "Licensed contractor network", "Digital work order tracking"] },
    { icon: Paintbrush, title: "Renovations", points: ["Kitchen & bathroom remodels", "Full unit turnovers", "Energy efficiency upgrades", "Historic property restoration"] },
    { icon: DollarSign, title: "Financial Services", points: ["Online rent collection (ACH, Zelle, Venmo)", "Autopay enrollment", "Security deposit management", "Utility tracking & billing"] },
  ];
  return (
    <div style={{ background: T.bg, fontFamily: FONT }}>
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "50px 20px" : "80px 40px 60px" }}>
        <div style={{ textAlign: "center", marginBottom: mob ? 40 : 60 }}>
          <div style={{ color: T.accent, fontSize: 11, fontWeight: 700, fontFamily: FONT_B, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>Our Services</div>
          <h1 style={{ color: T.text, fontSize: mob ? 30 : 44, fontWeight: 700, letterSpacing: "-1px", marginBottom: 16 }}>
            Everything Your Property <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400 }}>Needs</span>
          </h1>
          <p style={{ color: T.textSecondary, fontSize: mob ? 14 : 16, fontFamily: FONT_B, maxWidth: 580, margin: "0 auto", lineHeight: 1.7 }}>
            From day-to-day management to major renovations, we handle every aspect of property operations.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 20 }}>
          {items.map((item, i) => (
            <div key={i} className="fis" style={{ animationDelay: `${i * 0.1}s`, background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 18, padding: mob ? 24 : 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: T.accentDim, border: `1px solid ${T.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <item.icon size={24} color={T.accent} />
                </div>
                <h3 style={{ color: T.text, fontSize: 20, fontWeight: 700 }}>{item.title}</h3>
              </div>
              {item.points.map((pt, j) => (
                <div key={j} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderTop: j === 0 ? `1px solid ${T.border}` : "none" }}>
                  <CheckCircle size={14} color={T.green} style={{ flexShrink: 0 }} />
                  <span style={{ color: T.textSecondary, fontSize: 13, fontFamily: FONT_B, fontWeight: 500 }}>{pt}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <Btn variant="primary" onClick={() => setPage("contact")} style={{ padding: "14px 32px", fontSize: 14 }}>Get in Touch <ArrowRight size={16} /></Btn>
        </div>
      </section>
      <Footer setPage={setPage} mob={mob} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   PORTFOLIO PAGE
   ═══════════════════════════════════════════ */
function PortfolioPage({ mob }) {
  const SERIF = `'Playfair Display', Georgia, serif`;
  const [open, setOpen] = useState(null);
  const [viewing, setViewing] = useState(null); // { src, label }
  const statusColor = (s) => s === "Active" ? "accent" : s === "Foundation" ? "success" : s === "Completed" ? "default" : "warning";

  return (
    <div style={{ background: T.bg, fontFamily: FONT }}>
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: mob ? "50px 20px 60px" : "80px 40px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: mob ? 40 : 60 }}>
          <div style={{ color: T.accent, fontSize: 11, fontWeight: 700, fontFamily: FONT_B, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>Portfolio</div>
          <h1 style={{ color: T.text, fontSize: mob ? 30 : 44, fontWeight: 700, letterSpacing: "-1px", marginBottom: 16 }}>
            Built With <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400 }}>Precision</span>
          </h1>
          <p style={{ color: T.textSecondary, fontSize: mob ? 14 : 16, fontFamily: FONT_B, maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
            Value-add acquisitions and full renovations using the BRRR strategy. Each project tells a story of transformation.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {PORTFOLIO_PROJECTS.map((proj) => {
            const isOpen = open === proj.id;
            return (
              <div key={proj.id} className="fis" style={{ animationDelay: `${(proj.id - 1) * 0.08}s`, background: T.bgCard, border: `1px solid ${isOpen ? T.accentBorder : T.border}`, borderRadius: 18, overflow: "hidden", transition: "border-color .2s" }}>
                {/* Header */}
                <button onClick={() => setOpen(isOpen ? null : proj.id)} style={{
                  width: "100%", display: "flex", alignItems: "center", gap: mob ? 14 : 20,
                  padding: mob ? "18px 16px" : "24px 28px", border: "none", background: "transparent", cursor: "pointer", textAlign: "left",
                }}>
                  <div style={{ color: T.accent, fontSize: mob ? 22 : 32, fontWeight: 800, fontFamily: FONT, opacity: 0.4, minWidth: mob ? 30 : 44 }}>{proj.num}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <h3 style={{ color: T.text, fontSize: mob ? 16 : 20, fontWeight: 700, margin: 0 }}>{proj.title}</h3>
                      <Badge variant={statusColor(proj.status)}>{proj.status}</Badge>
                    </div>
                    <div style={{ color: T.textMuted, fontSize: mob ? 11 : 13, fontFamily: FONT_B, marginTop: 4 }}>{proj.year} — {proj.desc}</div>
                  </div>
                  <ChevronDown size={18} color={T.textMuted} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .2s", flexShrink: 0 }} />
                </button>

                {/* Content */}
                {isOpen && (
                  <div style={{ padding: mob ? "0 16px 20px" : "0 28px 28px" }}>
                    <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 20 }}>
                      {proj.rooms.map((room, ri) => (
                        <div key={ri} style={{ marginBottom: ri < proj.rooms.length - 1 ? 20 : 0 }}>
                          <div style={{ color: T.textSecondary, fontSize: 11, fontWeight: 700, fontFamily: FONT_B, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>{room.label}</div>
                          <div style={{ display: "grid", gridTemplateColumns: room.after ? "1fr 1fr" : "1fr", gap: 10 }}>
                            <div onClick={() => setViewing({ src: room.before, label: room.beforeLabel || "Before" })} style={{ cursor: "pointer", position: "relative", borderRadius: 12, overflow: "hidden", aspectRatio: "16/10", background: T.bgElevated, border: `1px solid ${T.border}` }}>
                              <img src={room.before} alt={`${room.label} before`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} loading="lazy" onError={(e) => { e.target.style.display = "none"; }} />
                              <div style={{ position: "absolute", bottom: 8, left: 8, padding: "3px 10px", borderRadius: 6, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)", color: "#fff", fontSize: 10, fontWeight: 600, fontFamily: FONT_B }}>{room.beforeLabel || "Before"}</div>
                            </div>
                            {room.after && (
                              <div onClick={() => setViewing({ src: room.after, label: room.afterLabel || "After" })} style={{ cursor: "pointer", position: "relative", borderRadius: 12, overflow: "hidden", aspectRatio: "16/10", background: T.bgElevated, border: `1px solid ${T.border}` }}>
                                <img src={room.after} alt={`${room.label} after`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} loading="lazy" onError={(e) => { e.target.style.display = "none"; }} />
                                <div style={{ position: "absolute", bottom: 8, left: 8, padding: "3px 10px", borderRadius: 6, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)", color: "#fff", fontSize: 10, fontWeight: 600, fontFamily: FONT_B }}>{room.afterLabel || "After"}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Lightbox */}
      {viewing && (
        <div onClick={() => setViewing(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, cursor: "pointer" }}>
          <div style={{ maxWidth: 900, maxHeight: "85vh", position: "relative" }}>
            <img src={viewing.src} alt={viewing.label} style={{ maxWidth: "100%", maxHeight: "85vh", borderRadius: 12, objectFit: "contain" }} />
            <div style={{ position: "absolute", top: -36, right: 0, color: "#fff", fontSize: 12, fontFamily: FONT_B, opacity: 0.7 }}>{viewing.label} — click to close</div>
          </div>
        </div>
      )}

      <Footer setPage={() => {}} mob={mob} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   CONTACT PAGE
   ═══════════════════════════════════════════ */
function ContactPage({ mob }) {
  const [sent, setSent] = useState(false);
  return (
    <div style={{ background: T.bg, fontFamily: FONT }}>
      <section style={{ maxWidth: 800, margin: "0 auto", padding: mob ? "50px 20px 80px" : "80px 40px 100px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ color: T.accent, fontSize: 11, fontWeight: 700, fontFamily: FONT_B, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>Get In Touch</div>
          <h1 style={{ color: T.text, fontSize: mob ? 28 : 40, fontWeight: 700, letterSpacing: "-1px" }}>Contact Us</h1>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 20, marginBottom: 32 }}>
          {[
            { icon: Phone, label: "Phone", val: "(617) 999-0134" },
            { icon: Mail, label: "Email", val: "macdevelopmentco@gmail.com" },
            { icon: MapPin, label: "Office", val: "Brookline, MA" },
            { icon: Clock, label: "Hours", val: "Mon\u2013Fri 8am\u20136pm" },
          ].map((c, i) => (
            <div key={i} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, padding: 20, display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 11, background: T.accentDim, border: `1px solid ${T.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <c.icon size={20} color={T.accent} />
              </div>
              <div>
                <div style={{ color: T.textMuted, fontSize: 10, fontWeight: 600, fontFamily: FONT_B, textTransform: "uppercase", letterSpacing: "0.5px" }}>{c.label}</div>
                <div style={{ color: T.text, fontSize: 14, fontWeight: 600, marginTop: 2 }}>{c.val}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 18, padding: mob ? 24 : 36 }}>
          {sent ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              <CheckCircle size={48} color={T.green} style={{ marginBottom: 16 }} />
              <h3 style={{ color: T.text, fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Message Sent!</h3>
              <p style={{ color: T.textMuted, fontFamily: FONT_B, fontSize: 14 }}>We'll get back to you soon.</p>
            </div>
          ) : (
            <>
              <h3 style={{ color: T.text, fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Send a Message</h3>
              <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: "0 16px" }}>
                <Inp label="Name" dark placeholder="Your name" />
                <Inp label="Email" dark placeholder="you@email.com" />
              </div>
              <Inp label="Subject" dark placeholder="What's this about?" />
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", color: T.textMuted, fontSize: 11, fontWeight: 600, fontFamily: FONT_B, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Message</label>
                <textarea rows={4} placeholder="Your message..." style={{ width: "100%", padding: "11px 13px", border: `1px solid ${T.border}`, borderRadius: 10, background: T.bgElevated, color: T.text, fontFamily: FONT_B, fontSize: 14, resize: "vertical" }} />
              </div>
              <Btn variant="primary" onClick={() => setSent(true)} style={{ width: "100%", padding: 14, fontSize: 14 }}>Send Message <Send size={15} /></Btn>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PAY RENT PAGE
   ═══════════════════════════════════════════ */
function PayRentPage({ allData, properties, setAllData, setPage, mob }) {
  const [step, setStep] = useState("lookup");
  const [propCode, setPropCode] = useState("");
  const [payPass, setPayPass] = useState("");
  const [lookupErr, setLookupErr] = useState("");
  const [foundProp, setFoundProp] = useState(null);
  const [payMethod, setPayMethod] = useState(null);
  const [payAmt, setPayAmt] = useState("");
  const [payFor, setPayFor] = useState("Rent");
  const [achRoute, setAchRoute] = useState("");
  const [achAcct, setAchAcct] = useState("");
  const [achName, setAchName] = useState("");
  const [achType, setAchType] = useState("checking");
  const [processing, setProcessing] = useState(false);
  const [zelleConfirm, setZelleConfirm] = useState("");

  const lookup = () => {
    setLookupErr("");
    const prop = properties.find(p => p.code.toLowerCase() === propCode.trim().toLowerCase());
    if (!prop) { setLookupErr("Property not found. Check your house code."); return; }
    const d = allData[prop.id];
    if (d && d.password === payPass) {
      setFoundProp({ ...prop, data: d });
      setStep("method");
    } else {
      setLookupErr("Invalid credentials.");
    }
  };

  const processPayment = () => {
    const a = parseFloat(payAmt);
    if (isNaN(a) || a <= 0) return;
    setProcessing(true);
    setTimeout(() => {
      const u = { ...allData };
      const p = { ...u[foundProp.id] };
      const method = payMethod === "ach" ? "ACH" : payMethod === "zelle" ? "Zelle" : "Venmo";
      p.payments = [{ id: Date.now(), date: today(), amount: a, method, type: payFor, status: "completed" }, ...p.payments];
      if (payFor === "Rent") p.balance -= a;
      else { const k = UTILITIES.find(ut => ut.label === payFor)?.key; if (k) p.utilities = { ...p.utilities, [k]: p.utilities[k] - a }; }
      u[foundProp.id] = p;
      setAllData(u);
      setProcessing(false);
      setStep("done");
    }, 2200);
  };

  const totalOwed = foundProp ? (foundProp.data.balance > 0 ? foundProp.data.balance : 0) + Object.values(foundProp.data.utilities).reduce((a, b) => a + (b > 0 ? b : 0), 0) : 0;

  return (
    <div style={{ background: T.bg, fontFamily: FONT, minHeight: "80vh" }}>
      <section style={{ maxWidth: 560, margin: "0 auto", padding: mob ? "40px 20px 80px" : "60px 20px 100px" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: T.accentDim, border: `1px solid ${T.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <CreditCard size={26} color={T.accent} />
          </div>
          <h1 style={{ color: T.text, fontSize: mob ? 24 : 32, fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 8 }}>Pay Rent</h1>
          <p style={{ color: T.textMuted, fontSize: 14, fontFamily: FONT_B }}>Secure online payment portal</p>
        </div>

        {step === "lookup" && (
          <div className="fis" style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 18, padding: mob ? 24 : 32 }}>
            <h3 style={{ color: T.text, fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Verify Your Account</h3>
            <p style={{ color: T.textMuted, fontSize: 13, fontFamily: FONT_B, marginBottom: 24 }}>Enter your property code and password to continue.</p>
            <Inp dark label="House Code" value={propCode} onChange={e => { setPropCode(e.target.value); setLookupErr(""); }} placeholder="e.g. 142" />
            <Inp dark label="Account Password" type="password" value={payPass} onChange={e => { setPayPass(e.target.value); setLookupErr(""); }} placeholder="Your password" />
            {lookupErr && <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 14px", background: T.redDim, borderRadius: 8, marginBottom: 16 }}><AlertCircle size={14} color={T.red} /><span style={{ color: T.red, fontSize: 12, fontFamily: FONT_B }}>{lookupErr}</span></div>}
            <Btn variant="primary" onClick={lookup} style={{ width: "100%", padding: 14 }}>Continue <ChevronRight size={16} /></Btn>
            <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginTop: 16 }}>
              <ShieldCheck size={13} color={T.green} />
              <span style={{ color: T.textMuted, fontSize: 11, fontFamily: FONT_B }}>256-bit SSL encryption</span>
            </div>
          </div>
        )}

        {step === "method" && foundProp && (
          <div className="fis">
            <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 18, padding: mob ? 24 : 32 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                  <div style={{ color: T.text, fontSize: 16, fontWeight: 700 }}>{foundProp.name}</div>
                  <div style={{ color: T.textMuted, fontSize: 12, fontFamily: FONT_B, marginTop: 2 }}>{foundProp.address}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: totalOwed > 0 ? T.red : T.green, fontSize: 22, fontWeight: 800 }}>{fmt(totalOwed)}</div>
                  <div style={{ color: T.textMuted, fontSize: 10, fontFamily: FONT_B, textTransform: "uppercase" }}>Total Owed</div>
                </div>
              </div>
              <Sel label="Payment For" value={payFor} onChange={e => setPayFor(e.target.value)}>
                <option value="Rent">Rent ({fmt(foundProp.data.balance > 0 ? foundProp.data.balance : 0)} due)</option>
                {UTILITIES.map(u => {
                  const bal = foundProp.data.utilities[u.key];
                  return bal > 0 ? <option key={u.key} value={u.label}>{u.label} ({fmt(bal)} due)</option> : null;
                })}
              </Sel>
              <Inp dark label="Payment Amount" type="number" value={payAmt} onChange={e => setPayAmt(e.target.value)} placeholder="0.00" />
              <div style={{ color: T.textMuted, fontSize: 11, fontWeight: 600, fontFamily: FONT_B, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>Payment Method</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                {[
                  { key: "ach", icon: Landmark, label: "ACH Bank Transfer", sub: "Direct from your bank account", badge: "Lowest fees" },
                  { key: "zelle", icon: ArrowUpRight, label: "Zelle", sub: "Send to MAC Development Co." },
                  { key: "venmo", icon: Wallet, label: "Venmo", sub: "Send to @MACDevelopmentCo" },
                ].map(m => (
                  <button key={m.key} onClick={() => setPayMethod(m.key)} style={{
                    display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", borderRadius: 12, cursor: "pointer",
                    background: payMethod === m.key ? T.accentDim : T.bgCard,
                    border: `1.5px solid ${payMethod === m.key ? T.accent : T.border}`,
                    transition: "all .15s",
                  }}>
                    <div style={{ width: 42, height: 42, borderRadius: 10, background: payMethod === m.key ? T.accent : T.bgElevated, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <m.icon size={20} color={payMethod === m.key ? "#fff" : T.textSecondary} />
                    </div>
                    <div style={{ flex: 1, textAlign: "left" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ color: T.text, fontSize: 14, fontWeight: 600 }}>{m.label}</span>
                        {m.badge && <span style={{ padding: "2px 7px", borderRadius: 4, background: T.greenDim, color: T.green, fontSize: 9, fontWeight: 700 }}>{m.badge}</span>}
                      </div>
                      <div style={{ color: T.textMuted, fontSize: 11, fontFamily: FONT_B, marginTop: 2 }}>{m.sub}</div>
                    </div>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${payMethod === m.key ? T.accent : T.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {payMethod === m.key && <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.accent }} />}
                    </div>
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn variant="ghost" onClick={() => { setStep("lookup"); setFoundProp(null); }} style={{ flex: 1 }}>Back</Btn>
                <Btn variant="primary" onClick={() => { if (payMethod && payAmt) setStep(payMethod === "ach" ? "ach" : "confirm"); }} style={{ flex: 2 }}>Continue <ChevronRight size={15} /></Btn>
              </div>
            </div>
          </div>
        )}

        {step === "ach" && (
          <div className="fis">
            <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 18, padding: mob ? 24 : 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
                <div style={{ width: 44, height: 44, borderRadius: 11, background: T.accentDim, display: "flex", alignItems: "center", justifyContent: "center" }}><Landmark size={22} color={T.accent} /></div>
                <div>
                  <h3 style={{ color: T.text, fontSize: 16, fontWeight: 700, margin: 0 }}>Bank Details</h3>
                  <p style={{ color: T.textMuted, fontSize: 12, fontFamily: FONT_B, margin: 0 }}>Enter your bank account information</p>
                </div>
              </div>
              <Inp dark label="Account Holder Name" value={achName} onChange={e => setAchName(e.target.value)} placeholder="Full name on account" />
              <Inp dark label="Routing Number" value={achRoute} onChange={e => setAchRoute(e.target.value)} placeholder="9-digit routing number" />
              <Inp dark label="Account Number" value={achAcct} onChange={e => setAchAcct(e.target.value)} placeholder="Account number" />
              <div style={{ marginBottom: 16 }}>
                <div style={{ color: T.textMuted, fontSize: 11, fontWeight: 600, fontFamily: FONT_B, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Account Type</div>
                <Toggle options={[{ value: "checking", label: "Checking" }, { value: "savings", label: "Savings" }]} value={achType} onChange={setAchType} />
              </div>
              <div style={{ background: T.bgElevated, border: `1px solid ${T.border}`, borderRadius: 10, padding: 16, marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ color: T.textMuted, fontSize: 12, fontFamily: FONT_B }}>Payment</span>
                  <span style={{ color: T.text, fontSize: 14, fontWeight: 700 }}>{fmt(parseFloat(payAmt) || 0)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: T.textMuted, fontSize: 12, fontFamily: FONT_B }}>Processing Fee</span>
                  <span style={{ color: T.textMuted, fontSize: 12, fontFamily: FONT_B }}>$0.80</span>
                </div>
                <div style={{ borderTop: `1px solid ${T.border}`, marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: T.text, fontSize: 13, fontWeight: 600 }}>Total</span>
                  <span style={{ color: T.accent, fontSize: 16, fontWeight: 800 }}>{fmt((parseFloat(payAmt) || 0) + 0.80)}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn variant="ghost" onClick={() => setStep("method")} style={{ flex: 1 }}>Back</Btn>
                <Btn variant="primary" onClick={() => setStep("confirm")} style={{ flex: 2 }}>Review Payment</Btn>
              </div>
            </div>
          </div>
        )}

        {step === "confirm" && foundProp && (
          <div className="fis">
            <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 18, padding: mob ? 24 : 32 }}>
              <h3 style={{ color: T.text, fontSize: 18, fontWeight: 700, marginBottom: 20, textAlign: "center" }}>Confirm Payment</h3>
              <div style={{ background: T.bgElevated, borderRadius: 12, padding: 18, marginBottom: 24 }}>
                {[
                  ["Property", foundProp.name],
                  ["Payment for", payFor],
                  ["Method", payMethod === "ach" ? `ACH \u2022 ${achType} \u2022 ****${achAcct.slice(-4)}` : payMethod === "zelle" ? "Zelle" : "Venmo"],
                  ["Amount", fmt(parseFloat(payAmt) || 0)],
                  ...(payMethod === "ach" ? [["Fee", "$0.80"], ["Total", fmt((parseFloat(payAmt) || 0) + 0.80)]] : []),
                ].map(([label, val], i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < 4 ? `1px solid ${T.border}` : "none" }}>
                    <span style={{ color: T.textMuted, fontSize: 12, fontFamily: FONT_B }}>{label}</span>
                    <span style={{ color: label === "Total" || label === "Amount" ? T.accent : T.text, fontSize: label === "Total" ? 15 : 13, fontWeight: label === "Total" || label === "Amount" ? 700 : 500 }}>{val}</span>
                  </div>
                ))}
              </div>
              {payMethod !== "ach" && (
                <div style={{ background: T.accentDim, border: `1px solid ${T.accentBorder}`, borderRadius: 10, padding: 16, marginBottom: 16 }}>
                  <p style={{ color: T.accent, fontSize: 13, fontFamily: FONT_B, lineHeight: 1.5 }}>
                    {payMethod === "zelle" ? "Send your Zelle payment to: macdevelopmentco@gmail.com" : "Send your Venmo payment to: @MACDevelopmentCo"}
                  </p>
                  <p style={{ color: T.textMuted, fontSize: 11, fontFamily: FONT_B, marginTop: 6 }}>Include your property address in the memo.</p>
                </div>
              )}
              {payMethod !== "ach" && (
                <Inp dark label="Confirmation / Reference #" value={zelleConfirm} onChange={e => setZelleConfirm(e.target.value)} placeholder="Enter after sending" />
              )}
              <div style={{ display: "flex", gap: 8 }}>
                <Btn variant="ghost" onClick={() => setStep(payMethod === "ach" ? "ach" : "method")} style={{ flex: 1 }}>Back</Btn>
                <Btn variant="success" onClick={processPayment} style={{ flex: 2 }} disabled={processing}>
                  {processing ? <><span style={{ animation: "pulse 1s infinite" }}>Processing...</span></> : <>Submit Payment <Check size={15} /></>}
                </Btn>
              </div>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="fis" style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 18, padding: mob ? 32 : 44, textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: T.greenDim, border: `1px solid ${T.greenBorder}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <CheckCircle size={32} color={T.green} />
            </div>
            <h2 style={{ color: T.text, fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Payment Submitted</h2>
            <p style={{ color: T.textMuted, fontSize: 14, fontFamily: FONT_B, lineHeight: 1.6, marginBottom: 28 }}>
              {payMethod === "ach" ? "Your ACH transfer is being processed. Funds typically settle in 2-3 business days." : "Your payment has been recorded. Allow 1 business day for processing."}
            </p>
            <div style={{ background: T.bgElevated, borderRadius: 10, padding: 16, margin: "0 auto 28px", maxWidth: 200 }}>
              <div style={{ color: T.textMuted, fontSize: 10, fontFamily: FONT_B, textTransform: "uppercase" }}>Amount Paid</div>
              <div style={{ color: T.green, fontSize: 28, fontWeight: 800, marginTop: 4 }}>{fmt(parseFloat(payAmt) || 0)}</div>
            </div>
            <div style={{ display: "flex", gap: 8, flexDirection: "column" }}>
              <Btn variant="primary" onClick={() => setPage("portal")} style={{ width: "100%", padding: 14 }}>Go to Dashboard</Btn>
              <Btn variant="ghost" onClick={() => { setStep("lookup"); setFoundProp(null); setPayAmt(""); setPayMethod(null); }} style={{ width: "100%", padding: 14 }}>Make Another Payment</Btn>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════ */
function Footer({ setPage, mob }) {
  return (
    <footer style={{ borderTop: `1px solid ${T.border}`, background: T.bgCard }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "40px 20px" : "56px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: mob ? "flex-start" : "center", flexDirection: mob ? "column" : "row", gap: 20, marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <MacDevLogo size={36} />
            <span style={{ color: T.text, fontSize: 14, fontWeight: 700, fontFamily: FONT }}>MAC Development Co.</span>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["home", "services", "portfolio", "pay", "portal", "contact"].map(k => (
              <button key={k} onClick={() => { setPage(k); window.scrollTo(0, 0); }} style={{ padding: "6px 12px", border: "none", borderRadius: 6, background: "transparent", color: T.textMuted, fontSize: 12, cursor: "pointer", fontFamily: FONT_B, fontWeight: 500, textTransform: "capitalize" }}>{k === "pay" ? "Pay Rent" : k}</button>
            ))}
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <span style={{ color: T.textMuted, fontSize: 11, fontFamily: FONT_B }}>&copy; 2026 MAC Development Co. All rights reserved.</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ShieldCheck size={12} color={T.green} />
            <span style={{ color: T.textMuted, fontSize: 11, fontFamily: FONT_B }}>Payments secured with SSL encryption</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   PORTAL: UNIFIED LOGIN
   ═══════════════════════════════════════════ */
function PortalLogin({ onLogin, onRegister, allData, properties, setPage }) {
  const mob = useIsMobile();
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  // Register
  const [regCode, setRegCode] = useState("");
  const [regUser, setRegUser] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regPassC, setRegPassC] = useState("");

  const submit = (e) => {
    e.preventDefault(); setError(""); setSuccess("");
    if (!username.trim() || !password.trim()) { setError("Please enter username and password."); return; }
    // Check admin
    if (username.trim().toLowerCase() === ADMIN_USER.username.toLowerCase() && password === ADMIN_USER.password) {
      onLogin("admin", null);
      return;
    }
    // Check resident
    const err = onLogin("resident", { username: username.trim(), password });
    if (err) setError(err);
  };

  const register = (e) => {
    e.preventDefault(); setError(""); setSuccess("");
    if (!regCode.trim() || !regUser.trim() || !regPass.trim()) { setError("All fields are required."); return; }
    if (regPass !== regPassC) { setError("Passwords do not match"); return; }
    if (regUser.length < 3) { setError("Username must be at least 3 characters"); return; }
    if (regPass.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (regUser.trim().toLowerCase() === ADMIN_USER.username.toLowerCase()) { setError("That username is reserved."); return; }
    const prop = properties.find(p => p.code.toLowerCase() === regCode.trim().toLowerCase());
    if (!prop) { setError("Invalid property code."); return; }
    const taken = Object.values(allData).some(d => d.login === regUser.trim());
    if (taken) { setError("Username already taken"); return; }
    onRegister(prop.id, regUser.trim(), regPass);
    setSuccess("Account created! You can now sign in."); setMode("login"); setUsername(regUser.trim());
    setRegCode(""); setRegUser(""); setRegPass(""); setRegPassC("");
  };

  return (
    <div style={{ maxWidth: 440, margin: "0 auto", padding: mob ? "40px 20px 80px" : "60px 20px 100px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <MacDevLogo size={48} />
        <h2 style={{ color: T.text, fontSize: 22, fontWeight: 700, marginTop: 16, marginBottom: 6 }}>
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h2>
        <p style={{ color: T.textMuted, fontSize: 13, fontFamily: FONT_B }}>
          {mode === "login" ? "Sign in to your account" : "Register as a new resident"}
        </p>
      </div>

      <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 18, padding: mob ? 24 : 32 }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, marginBottom: 24, background: T.bgElevated, borderRadius: 10, padding: 3 }}>
          {[{ v: "login", l: "Sign In" }, { v: "register", l: "Create Account" }].map(({ v, l }) => (
            <button key={v} onClick={() => { setMode(v); setError(""); setSuccess(""); }} style={{
              flex: 1, padding: "9px 0", border: "none", borderRadius: 8, cursor: "pointer",
              fontFamily: FONT, fontSize: 13, fontWeight: 600, transition: "all .15s",
              background: mode === v ? T.bgCard : "transparent",
              color: mode === v ? T.text : T.textMuted,
              boxShadow: mode === v ? "0 1px 3px rgba(0,0,0,0.2)" : "none",
            }}>{l}</button>
          ))}
        </div>

        {mode === "login" && (
          <form onSubmit={submit}>
            <Inp dark label="Username" value={username} onChange={e => { setUsername(e.target.value); setError(""); }} placeholder="Enter your username" />
            <div style={{ position: "relative", marginBottom: 16 }}>
              <Inp dark label="Password" type={showPass ? "text" : "password"} value={password} onChange={e => { setPassword(e.target.value); setError(""); }} placeholder="Enter your password" />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, top: 32, background: "none", border: "none", color: T.textMuted, cursor: "pointer" }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {error && <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 14px", background: T.redDim, borderRadius: 8, marginBottom: 16 }}><AlertCircle size={14} color={T.red} /><span style={{ color: T.red, fontSize: 12, fontFamily: FONT_B }}>{error}</span></div>}
            {success && <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 14px", background: T.greenDim, borderRadius: 8, marginBottom: 16 }}><CheckCircle size={14} color={T.green} /><span style={{ color: T.green, fontSize: 12, fontFamily: FONT_B }}>{success}</span></div>}
            <Btn variant="primary" type="submit" style={{ width: "100%", padding: "13px", fontSize: 14 }}>Sign In <ChevronRight size={16} /></Btn>
          </form>
        )}

        {mode === "register" && (
          <form onSubmit={register}>
            <Inp dark label="Property Code" value={regCode} onChange={e => { setRegCode(e.target.value); setError(""); }} placeholder="Your house code (e.g. 142)" />
            <Inp dark label="Choose Username" value={regUser} onChange={e => { setRegUser(e.target.value); setError(""); }} placeholder="min 3 characters" />
            <Inp dark label="Choose Password" type="password" value={regPass} onChange={e => { setRegPass(e.target.value); setError(""); }} placeholder="min 6 characters" />
            <Inp dark label="Confirm Password" type="password" value={regPassC} onChange={e => { setRegPassC(e.target.value); setError(""); }} placeholder="Re-enter your password" />
            {error && <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 14px", background: T.redDim, borderRadius: 8, marginBottom: 16 }}><AlertCircle size={14} color={T.red} /><span style={{ color: T.red, fontSize: 12, fontFamily: FONT_B }}>{error}</span></div>}
            <Btn variant="primary" type="submit" style={{ width: "100%", padding: "13px", fontSize: 14 }}>Create Account <UserPlus size={15} /></Btn>
          </form>
        )}
      </div>
      <div style={{ textAlign: "center", marginTop: 16 }}>
        <button onClick={() => setPage("pay")} style={{ background: "none", border: "none", color: T.accent, fontSize: 13, cursor: "pointer", fontFamily: FONT_B }}>Just need to pay rent? Pay here →</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PORTAL: RESIDENT DASHBOARD
   ═══════════════════════════════════════════ */
function ResidentDash({ propertyId, data, allData, setAllData, onLogout, properties, setPage }) {
  const mob = useIsMobile();
  const [tab, setTab] = useState("overview");
  const [newMsg, setNewMsg] = useState("");
  const [payModal, setPayModal] = useState(false);
  const [autopayModal, setAutopayModal] = useState(false);
  const [payAmt, setPayAmt] = useState(""); const [payMethod, setPayMethod] = useState("ACH");
  const [autopayDay, setAutopayDay] = useState(data.autopayDay || 1);
  const [newUser, setNewUser] = useState(data.login); const [newPass, setNewPass] = useState("");
  const [acctMsg, setAcctMsg] = useState("");
  const msgRef = useRef(null);
  const prop = properties.find(p => p.id === propertyId);
  const totalUtils = Object.values(data.utilities).reduce((a, b) => a + (b > 0 ? b : 0), 0);
  const totalOwed = (data.balance > 0 ? data.balance : 0) + totalUtils;
  const unread = data.messages.filter(m => m.from === "admin" && !m.read).length;
  const upd = (fn) => { const u = { ...allData }; const p = { ...u[propertyId] }; fn(p); u[propertyId] = p; setAllData(u); };
  const handlePay = () => { const a = parseFloat(payAmt); if (isNaN(a) || a <= 0) return; upd(p => { p.payments = [{ id: Date.now(), date: today(), amount: a, method: payMethod, type: "Rent", status: "completed" }, ...p.payments]; p.balance -= a; }); setPayModal(false); setPayAmt(""); };
  const toggleAP = () => { upd(p => { p.autopay = !p.autopay; if (p.autopay) { p.autopayMethod = payMethod; p.autopayDay = autopayDay; } }); setAutopayModal(false); };
  const sendMsg = () => { if (!newMsg.trim()) return; upd(p => { p.messages = [...p.messages, { id: Date.now(), from: "resident", text: newMsg.trim(), date: today(), read: true }]; }); setNewMsg(""); setTimeout(() => msgRef.current?.scrollTo(0, msgRef.current.scrollHeight), 100); };
  const saveAccount = () => { setAcctMsg(""); if (newUser.length < 3) { setAcctMsg("Username must be at least 3 characters"); return; } upd(p => { p.login = newUser; if (newPass.length >= 6) p.password = newPass; }); setAcctMsg("Saved!"); };
  const navs = [{ key: "overview", label: mob ? "Home" : "Overview", Icon: LayoutDashboard }, { key: "payments", label: "Payments", Icon: Receipt }, { key: "utilities", label: "Utilities", Icon: Zap }, { key: "files", label: "Files", Icon: FolderOpen }, { key: "messages", label: `Messages${unread ? ` (${unread})` : ""}`, Icon: MessageSquare }, { key: "account", label: "Account", Icon: Settings }];
  const pad = mob ? 16 : 28;

  return (
    <div style={{ fontFamily: FONT, overflowX: "hidden", width: "100%" }}>
      <nav className="nav-scroll" style={{ padding: `0 ${mob ? 6 : pad}px`, height: mob ? 44 : 48, borderBottom: `1px solid ${T.border}`, alignItems: "center", background: T.bgCard }}>
        {navs.map(n => (<button key={n.key} onClick={() => setTab(n.key)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", border: "none", borderRadius: 7, cursor: "pointer", fontSize: mob ? 11 : 12, fontWeight: 600, fontFamily: FONT, whiteSpace: "nowrap", background: tab === n.key ? T.accentDim : "transparent", color: tab === n.key ? T.accent : T.textMuted, transition: "all .15s" }}><n.Icon size={mob ? 13 : 14} />{n.label}</button>))}
      </nav>
      <main style={{ padding: pad, maxWidth: 1000, margin: "0 auto" }}>
        {tab === "overview" && (<>
          <div className="mgrid" style={{ marginBottom: mob ? 10 : 20 }}>
            <Metric icon={DollarSign} label="Rent Balance" value={fmt(data.balance)} mob={mob} variant={data.balance > 0 ? "danger" : "success"} sub={data.balance > 0 ? "Payment due" : "Paid"} />
            <Metric icon={Shield} label="Security Deposit" value={fmt(data.securityDeposit)} mob={mob} />
            <Metric icon={FileText} label="Prepaid Rent" value={fmt(data.prepaidRent)} sub={data.prepaidRent > 0 ? "Credit on file" : "None"} mob={mob} variant={data.prepaidRent > 0 ? "success" : "default"} />
          </div>
          <div className="mgrid" style={{ marginBottom: mob ? 12 : 24 }}>
            <Metric icon={Calendar} label="Monthly Rent" value={fmt(data.rent)} sub="Due on the 1st" mob={mob} variant="accent" />
            <Metric icon={Zap} label="Utilities Due" value={fmt(totalUtils)} sub={totalUtils > 0 ? "Balance remaining" : "All clear"} mob={mob} variant={totalUtils > 0 ? "warning" : "success"} />
            <Metric icon={TrendingUp} label="Total Due" value={fmt(totalOwed)} sub={totalOwed > 0 ? "Outstanding balance" : "Nothing due"} mob={mob} variant={totalOwed > 0 ? "danger" : "success"} />
          </div>
          <div style={{ background: data.autopay ? T.greenDim : T.redDim, border: `1px solid ${data.autopay ? T.greenBorder : T.redBorder}`, borderRadius: 12, padding: mob ? 14 : 18, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}><RefreshCw size={16} color={data.autopay ? T.green : T.red} /><div><div style={{ color: T.text, fontSize: 13, fontWeight: 700 }}>Autopay {data.autopay ? "Active" : "Inactive"}</div><div style={{ color: T.textMuted, fontSize: 11, fontFamily: FONT_B }}>{data.autopay ? `${data.autopayMethod} on the ${ord(data.autopayDay)}` : "Set up automatic payments"}</div></div></div>
            <Btn variant={data.autopay ? "ghost" : "primary"} onClick={() => setAutopayModal(true)} style={{ padding: "7px 14px", fontSize: 12 }}>{data.autopay ? "Manage" : "Enable"}</Btn>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Btn variant="primary" onClick={() => setPayModal(true)} style={{ flex: 1, padding: 14 }}><DollarSign size={15} />Quick Pay</Btn>
            <Btn variant="secondary" onClick={() => setPage("pay")} style={{ flex: 1, padding: 14 }}><CreditCard size={15} />Full Payment Portal</Btn>
          </div>
          {(data.files || []).length > 0 && (
            <div onClick={() => setTab("files")} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: mob ? 14 : 18, marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <FolderOpen size={16} color={T.accent} />
                <div>
                  <div style={{ color: T.text, fontSize: mob ? 13 : 14, fontWeight: 600 }}>{(data.files || []).length} Document{(data.files || []).length !== 1 ? "s" : ""}</div>
                  <div style={{ color: T.textMuted, fontSize: 11, fontFamily: FONT_B, marginTop: 1 }}>View leases, notices, and reports</div>
                </div>
              </div>
              <ChevronRight size={16} color={T.textMuted} />
            </div>
          )}
        </>)}

        {tab === "payments" && (<>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}><h2 style={{ color: T.text, fontSize: mob ? 18 : 20, fontWeight: 700 }}>Payments</h2><Btn variant="primary" onClick={() => setPayModal(true)} style={{ padding: "7px 14px", fontSize: 12 }}><Plus size={14} />Record</Btn></div>
          {data.payments.length === 0 ? <p style={{ color: T.textMuted, fontFamily: FONT_B, fontSize: 13 }}>No payments recorded yet.</p> : <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>{data.payments.map(p => (<div key={p.id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 10, padding: mob ? 12 : 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={{ color: T.text, fontSize: 14, fontWeight: 600 }}>{fmt(p.amount)}</div><div style={{ color: T.textMuted, fontSize: 11, fontFamily: FONT_B }}>{p.date} • {p.method} • {p.type}</div></div><Badge variant="success">Completed</Badge></div>))}</div>}
        </>)}

        {tab === "utilities" && (<>
          <h2 style={{ color: T.text, fontSize: mob ? 18 : 20, fontWeight: 700, marginBottom: 16 }}>Utilities</h2>
          <div className="ugrid">{UTILITIES.map(u => (<div key={u.key} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 10, padding: mob ? 12 : 16, textAlign: "center" }}><u.Icon size={20} color={u.color} style={{ marginBottom: 8 }} /><div style={{ color: T.textMuted, fontSize: 10, fontFamily: FONT_B, textTransform: "uppercase", marginBottom: 4 }}>{u.label}</div><div style={{ color: data.utilities[u.key] > 0 ? T.red : data.utilities[u.key] < 0 ? T.green : T.text, fontSize: 18, fontWeight: 700 }}>{fmt(data.utilities[u.key])}</div></div>))}</div>
        </>)}

        {tab === "files" && (<>
          <h2 style={{ color: T.text, fontSize: mob ? 18 : 20, fontWeight: 700, marginBottom: 16 }}>Documents</h2>
          {(data.files || []).length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {(data.files || []).map((f) => (
                <div key={f.id} className="fi" style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: mob ? 14 : 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
                    <div style={{ width: mob ? 42 : 48, height: mob ? 42 : 48, borderRadius: 10, background: T.accentDim, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <File size={mob ? 18 : 20} color={T.accent} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ color: T.text, fontSize: mob ? 14 : 15, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
                      <div style={{ color: T.textMuted, fontSize: 11, fontFamily: FONT_B, marginTop: 3, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        <Badge variant={f.category === "Lease" ? "warning" : f.category === "Inspection" ? "accent" : "default"}>{f.category}</Badge>
                        <span style={{ marginLeft: 2 }}>{f.date}</span>
                        <span style={{ color: T.border }}>&middot;</span>
                        <span>{f.size}</span>
                      </div>
                    </div>
                  </div>
                  <Btn variant="ghost" onClick={() => {}} style={{ padding: "8px 12px", fontSize: 11 }}><Download size={13} />Download</Btn>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, padding: 40, textAlign: "center" }}>
              <FolderOpen size={36} color={T.textMuted} style={{ marginBottom: 12, opacity: 0.5 }} />
              <p style={{ color: T.textMuted, fontSize: 14, fontFamily: FONT_B, marginBottom: 4 }}>No documents yet</p>
              <p style={{ color: T.textMuted, fontSize: 12, fontFamily: FONT_B, opacity: 0.7 }}>Your property manager will upload documents here.</p>
            </div>
          )}
        </>)}

        {tab === "messages" && (<>
          <h2 style={{ color: T.text, fontSize: mob ? 18 : 20, fontWeight: 700, marginBottom: 16 }}>Messages</h2>
          <div ref={msgRef} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, padding: 16, maxHeight: 380, overflowY: "auto", marginBottom: 12 }}>
            {data.messages.length === 0 ? <p style={{ color: T.textMuted, fontFamily: FONT_B, fontSize: 13, textAlign: "center", padding: 20 }}>No messages yet.</p> :
              data.messages.map(m => (<div key={m.id} style={{ display: "flex", justifyContent: m.from === "resident" ? "flex-end" : "flex-start", marginBottom: 8 }}><div style={{ maxWidth: "80%", padding: "10px 14px", borderRadius: 12, background: m.from === "resident" ? T.accent : T.bgElevated, color: m.from === "resident" ? "#fff" : T.text }}><div style={{ fontSize: 13, fontFamily: FONT_B, lineHeight: 1.5 }}>{m.text}</div><div style={{ fontSize: 9, opacity: 0.6, marginTop: 4, fontFamily: FONT_B }}>{m.date}</div></div></div>))
            }
          </div>
          <div style={{ display: "flex", gap: 8 }}><input value={newMsg} onChange={e => setNewMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMsg()} placeholder="Type a message..." style={{ flex: 1, padding: "11px 13px", border: `1px solid ${T.border}`, borderRadius: 10, background: T.bgElevated, color: T.text, fontFamily: FONT_B, fontSize: 14 }} /><Btn variant="primary" onClick={sendMsg} style={{ padding: "11px 16px" }}><Send size={15} /></Btn></div>
        </>)}

        {tab === "account" && (<>
          <h2 style={{ color: T.text, fontSize: mob ? 18 : 20, fontWeight: 700, marginBottom: 16 }}>Account Settings</h2>
          <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, padding: mob ? 20 : 28 }}>
            <Inp dark label="Username" value={newUser} onChange={e => setNewUser(e.target.value)} />
            <Inp dark label="New Password" type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Leave blank to keep current" />
            {acctMsg && <div style={{ padding: "8px 14px", borderRadius: 8, background: acctMsg === "Saved!" ? T.greenDim : T.redDim, marginBottom: 12 }}><span style={{ color: acctMsg === "Saved!" ? T.green : T.red, fontSize: 12, fontFamily: FONT_B }}>{acctMsg}</span></div>}
            <Btn variant="primary" onClick={saveAccount} style={{ width: "100%", padding: 14 }}><Save size={15} />Save Changes</Btn>
          </div>
          <div style={{ marginTop: 20 }}>
            <h3 style={{ color: T.text, fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Property Info</h3>
            <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, padding: mob ? 16 : 22 }}>
              {[["Property", prop?.name], ["Address", prop?.address], ["Residents", data.residents.join(", ")], ["Monthly Rent", fmt(data.rent)]].map(([l, v], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 3 ? `1px solid ${T.border}` : "none" }}>
                  <span style={{ color: T.textMuted, fontSize: 12, fontFamily: FONT_B }}>{l}</span>
                  <span style={{ color: T.text, fontSize: 13, fontWeight: 500, textAlign: "right", maxWidth: "60%" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </>)}
      </main>
      {payModal && (<Modal title="Make a Payment" subtitle="Submit toward rent or utility balance" onClose={() => setPayModal(false)}><Inp dark label="Amount" type="number" value={payAmt} onChange={e => setPayAmt(e.target.value)} placeholder="0.00" /><Toggle options={[{ value: "ACH", label: "ACH" }, { value: "Zelle", label: "Zelle" }, { value: "Venmo", label: "Venmo" }]} value={payMethod} onChange={setPayMethod} /><Btn variant="success" onClick={handlePay} style={{ width: "100%", padding: 14 }}>Submit Payment <Check size={15} /></Btn></Modal>)}
      {autopayModal && (<Modal title="Autopay Settings" subtitle={`${fmt(data.rent)} monthly rent`} onClose={() => setAutopayModal(false)}><Toggle options={[{ value: "ACH", label: "ACH" }, { value: "Zelle", label: "Zelle" }, { value: "Venmo", label: "Venmo" }]} value={payMethod} onChange={setPayMethod} /><Sel label="Day of Month" value={autopayDay} onChange={e => setAutopayDay(Number(e.target.value))}>{Array.from({ length: 28 }, (_, i) => <option key={i + 1} value={i + 1}>{ord(i + 1)}</option>)}</Sel><Btn variant={data.autopay ? "danger" : "success"} onClick={toggleAP} style={{ width: "100%", padding: 14 }}>{data.autopay ? "Disable Autopay" : "Enable Autopay"}</Btn></Modal>)}
    </div>
  );
}

/* ═══════════════════════════════════════════
   PORTAL: ADMIN PROPERTY DETAIL
   ═══════════════════════════════════════════ */
function PropertyDetail({ sel, allData, properties, mob, updP, setSel, setChgMod, setRecMod, openEditHouse, openEditFin, setDelConfirm, setMsgT }) {
  const p = properties.find(x => x.id === sel);
  const d = allData[sel];
  const [newRes, setNewRes] = useState("");
  const [newFutureRes, setNewFutureRes] = useState("");
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [newFile, setNewFile] = useState({ name: "", category: "Lease" });
  if (!p || !d) return null;

  const addResident = () => { if (!newRes.trim()) return; updP(sel, pd => { pd.residents = [...pd.residents, newRes.trim()]; }); setNewRes(""); };
  const removeResident = (name) => { updP(sel, pd => { pd.residents = pd.residents.filter(r => r !== name); }); };
  const addFutureResident = () => { if (!newFutureRes.trim()) return; updP(sel, pd => { pd.futureResidents = [...(pd.futureResidents || []), newFutureRes.trim()]; }); setNewFutureRes(""); };
  const removeFutureResident = (name) => { updP(sel, pd => { pd.futureResidents = (pd.futureResidents || []).filter(r => r !== name); }); };
  const moveToCurrent = (name) => { updP(sel, pd => { pd.futureResidents = (pd.futureResidents || []).filter(r => r !== name); pd.residents = [...pd.residents, name]; }); };
  const moveAllToCurrent = () => { updP(sel, pd => { pd.residents = [...pd.residents, ...(pd.futureResidents || [])]; pd.futureResidents = []; }); };
  const addFile = () => { if (!newFile.name.trim()) return; updP(sel, pd => { pd.files = [...(pd.files || []), { id: Date.now(), name: newFile.name.trim(), category: newFile.category, date: today(), size: "1.0 MB" }]; }); setNewFile({ name: "", category: "Lease" }); setShowFileUpload(false); };
  const removeFile = (fid) => { updP(sel, pd => { pd.files = (pd.files || []).filter(f => f.id !== fid); }); };

  return (<>
    <button onClick={() => setSel(null)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: T.accent, cursor: "pointer", fontFamily: FONT, fontSize: 13, fontWeight: 600, marginBottom: 16, padding: 0 }}><ChevronLeft size={16} />All Properties</button>
    <div style={{ display: "flex", alignItems: "flex-start", gap: mob ? 10 : 14, marginBottom: 20, justifyContent: "space-between", flexWrap: "wrap" }}>
      <div style={{ display: "flex", alignItems: "center", gap: mob ? 10 : 14 }}>
        <div style={{ width: mob ? 40 : 48, height: mob ? 40 : 48, borderRadius: 13, background: T.accentDim, border: `1px solid ${T.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Building size={mob ? 18 : 22} color={T.accent} /></div>
        <div style={{ minWidth: 0 }}><h2 style={{ color: T.text, fontSize: mob ? 18 : 24, fontWeight: 700, margin: 0 }}>{p.name}</h2><div style={{ color: T.textMuted, fontSize: 12, fontFamily: FONT_B }}>{p.address} • Code: {p.code}</div></div>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <Btn variant="ghost" onClick={() => openEditHouse(sel)} style={{ padding: "6px 10px", fontSize: 11 }}><Pencil size={12} /></Btn>
        <Btn variant="danger" onClick={() => setDelConfirm(sel)} style={{ padding: "6px 10px", fontSize: 11 }}><Trash2 size={12} /></Btn>
      </div>
    </div>

    {/* Current Residents */}
    <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: mob ? 16 : 22, marginBottom: 16 }}>
      <h3 style={{ color: T.text, fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <Users size={15} color={T.accent} />Current Residents ({d.residents.length})
      </h3>
      {d.residents.length > 0 && <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>{d.residents.map(r => (
        <div key={r} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: T.bgElevated, borderRadius: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}><User size={13} color={T.textSecondary} /><span style={{ color: T.text, fontSize: 13, fontWeight: 500 }}>{r}</span></div>
          <button onClick={() => removeResident(r)} style={{ background: T.redDim, border: `1px solid ${T.redBorder}`, borderRadius: 6, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: T.red }}><UserMinus size={11} /></button>
        </div>
      ))}</div>}
      {d.residents.length === 0 && <p style={{ color: T.textMuted, fontSize: 12, fontFamily: FONT_B, marginBottom: 12 }}>No current residents.</p>}
      <div style={{ display: "flex", gap: 8 }}><input value={newRes} onChange={e => setNewRes(e.target.value)} placeholder="Add current resident" style={{ flex: 1, padding: "8px 12px", border: `1px solid ${T.border}`, borderRadius: 8, background: T.bgElevated, color: T.text, fontFamily: FONT_B, fontSize: 13 }} onKeyDown={e => e.key === "Enter" && addResident()} /><Btn variant="primary" onClick={addResident} style={{ padding: "8px 12px", fontSize: 11 }}><UserPlus size={13} /></Btn></div>
    </div>

    {/* Future Residents */}
    <div style={{ background: T.bgCard, border: `1px solid ${T.goldBorder}`, borderRadius: 12, padding: mob ? 16 : 22, marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ color: T.text, fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 8, margin: 0 }}>
          <Calendar size={15} color={T.gold} />Future Residents ({(d.futureResidents || []).length})
        </h3>
        {(d.futureResidents || []).length > 0 && (
          <Btn variant="ghost" onClick={moveAllToCurrent} style={{ padding: "5px 10px", fontSize: 10, color: T.gold, borderColor: T.goldBorder }}>
            <ArrowLeftRight size={11} />Move All to Current
          </Btn>
        )}
      </div>
      {(d.futureResidents || []).length > 0 && <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>{(d.futureResidents || []).map(r => (
        <div key={r} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: T.goldDim, borderRadius: 8, border: `1px solid ${T.goldBorder}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}><User size={13} color={T.gold} /><span style={{ color: T.text, fontSize: 13, fontWeight: 500 }}>{r}</span><Badge variant="warning">Future</Badge></div>
          <div style={{ display: "flex", gap: 4 }}>
            <button onClick={() => moveToCurrent(r)} title="Move to current" style={{ background: T.greenDim, border: `1px solid ${T.greenBorder}`, borderRadius: 6, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: T.green }}><ArrowRight size={11} /></button>
            <button onClick={() => removeFutureResident(r)} style={{ background: T.redDim, border: `1px solid ${T.redBorder}`, borderRadius: 6, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: T.red }}><UserMinus size={11} /></button>
          </div>
        </div>
      ))}</div>}
      {(d.futureResidents || []).length === 0 && <p style={{ color: T.textMuted, fontSize: 12, fontFamily: FONT_B, marginBottom: 12 }}>No future residents scheduled.</p>}
      <div style={{ display: "flex", gap: 8 }}><input value={newFutureRes} onChange={e => setNewFutureRes(e.target.value)} placeholder="Add future resident" style={{ flex: 1, padding: "8px 12px", border: `1px solid ${T.border}`, borderRadius: 8, background: T.bgElevated, color: T.text, fontFamily: FONT_B, fontSize: 13 }} onKeyDown={e => e.key === "Enter" && addFutureResident()} /><Btn variant="ghost" onClick={addFutureResident} style={{ padding: "8px 12px", fontSize: 11, borderColor: T.goldBorder, color: T.gold }}><UserPlus size={13} /></Btn></div>
    </div>

    {/* Financials */}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
      <h3 style={{ color: T.text, fontSize: 14, fontWeight: 700 }}>Financials</h3>
      <Btn variant="ghost" onClick={() => openEditFin(sel)} style={{ padding: "5px 10px", fontSize: 10 }}><Pencil size={11} />Edit</Btn>
    </div>
    <div className="mgrid4" style={{ marginBottom: 20 }}><Metric icon={DollarSign} label="Rent" value={fmt(d.rent)} mob={mob} variant="accent" /><Metric icon={Shield} label="Deposit" value={fmt(d.securityDeposit)} mob={mob} /><Metric icon={TrendingUp} label="Balance" value={fmt(d.balance)} mob={mob} variant={d.balance > 0 ? "danger" : "success"} /><Metric icon={FileText} label="Prepaid" value={fmt(d.prepaidRent)} mob={mob} variant={d.prepaidRent > 0 ? "success" : "default"} /></div>

    <h3 style={{ color: T.text, fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Utilities</h3>
    <div className="ugrid" style={{ marginBottom: 20 }}>{UTILITIES.map(u => (<div key={u.key} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 8, padding: 10, textAlign: "center" }}><u.Icon size={14} color={u.color} /><div style={{ color: T.textMuted, fontSize: 9, fontFamily: FONT_B, marginTop: 4 }}>{u.label}</div><div style={{ color: d.utilities[u.key] > 0 ? T.red : d.utilities[u.key] < 0 ? T.green : T.text, fontSize: 14, fontWeight: 700 }}>{fmt(d.utilities[u.key])}</div></div>))}</div>

    <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}><Btn variant="primary" onClick={() => setChgMod(sel)} style={{ padding: "8px 14px", fontSize: 12 }}><Plus size={13} />Add Charge</Btn><Btn variant="success" onClick={() => setRecMod(sel)} style={{ padding: "8px 14px", fontSize: 12 }}><DollarSign size={13} />Record Payment</Btn><Btn variant="ghost" onClick={() => setMsgT(sel)} style={{ padding: "8px 14px", fontSize: 12 }}><MessageSquare size={13} />Message</Btn></div>

    {/* Files */}
    <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: mob ? 16 : 22, marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ color: T.text, fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 8, margin: 0 }}><FolderOpen size={15} color={T.accent} />Files ({(d.files || []).length})</h3>
        <Btn variant="primary" onClick={() => setShowFileUpload(true)} style={{ padding: "6px 12px", fontSize: 11 }}><Upload size={12} />Add File</Btn>
      </div>
      {(d.files || []).length > 0 ? <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>{(d.files || []).map(f => (
        <div key={f.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: T.bgElevated, borderRadius: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <div style={{ width: 32, height: 32, borderRadius: 7, background: T.accentDim, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><File size={14} color={T.accent} /></div>
            <div style={{ minWidth: 0 }}>
              <div style={{ color: T.text, fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
              <div style={{ color: T.textMuted, fontSize: 10, fontFamily: FONT_B }}>{f.category} • {f.date} • {f.size}</div>
            </div>
          </div>
          <button onClick={() => removeFile(f.id)} style={{ background: T.redDim, border: `1px solid ${T.redBorder}`, borderRadius: 6, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: T.red, flexShrink: 0 }}><Trash2 size={11} /></button>
        </div>
      ))}</div> : <p style={{ color: T.textMuted, fontSize: 12, fontFamily: FONT_B }}>No files uploaded yet.</p>}
      {showFileUpload && (
        <div style={{ marginTop: 12, padding: 14, borderRadius: 9, background: T.bgElevated, border: `1px solid ${T.border}` }}>
          <Inp dark label="File Name" value={newFile.name} onChange={e => setNewFile({ ...newFile, name: e.target.value })} placeholder="e.g. Lease Agreement" />
          <Sel label="Category" value={newFile.category} onChange={e => setNewFile({ ...newFile, category: e.target.value })}>
            <option value="Lease">Lease</option><option value="Notice">Notice</option><option value="Inspection">Inspection</option><option value="Insurance">Insurance</option><option value="Other">Other</option>
          </Sel>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="ghost" onClick={() => { setShowFileUpload(false); setNewFile({ name: "", category: "Lease" }); }} style={{ flex: 1, fontSize: 11 }}>Cancel</Btn>
            <Btn variant="primary" onClick={addFile} style={{ flex: 1, fontSize: 11 }}><Upload size={12} />Upload</Btn>
          </div>
        </div>
      )}
    </div>

    <h3 style={{ color: T.text, fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Payments</h3>
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>{d.payments.length === 0 ? <p style={{ color: T.textMuted, fontFamily: FONT_B, fontSize: 12 }}>No payments yet.</p> : d.payments.map(pay => (<div key={pay.id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 8, padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><span style={{ color: T.text, fontSize: 13, fontWeight: 600 }}>{fmt(pay.amount)}</span><span style={{ color: T.textMuted, fontSize: 11, fontFamily: FONT_B, marginLeft: 8 }}>{pay.method} • {pay.type} • {pay.date}</span></div><Badge variant="success">Done</Badge></div>))}</div>
  </>);
}

/* ═══════════════════════════════════════════
   PORTAL: ADMIN DASHBOARD
   ═══════════════════════════════════════════ */
function AdminDash({ allData, setAllData, properties, setProperties, onLogout }) {
  const mob = useIsMobile();
  const [tab, setTab] = useState("overview");
  const [sel, setSel] = useState(null);
  const [msgT, setMsgT] = useState(null); const [admMsg, setAdmMsg] = useState("");
  const [chgMod, setChgMod] = useState(null); const [chgAmt, setChgAmt] = useState(""); const [chgType, setChgType] = useState("Rent");
  const [recMod, setRecMod] = useState(null); const [recAmt, setRecAmt] = useState(""); const [recMethod, setRecMethod] = useState("ACH"); const [recType, setRecType] = useState("Rent");
  const [addHouseMod, setAddHouseMod] = useState(false);
  const [editHouseMod, setEditHouseMod] = useState(null);
  const [editFinMod, setEditFinMod] = useState(null);
  const [delConfirm, setDelConfirm] = useState(null);
  const [ah, setAh] = useState({ name: "", address: "", code: "", rent: "", deposit: "", login: "", password: "" });
  const [eh, setEh] = useState({ name: "", address: "", code: "" });
  const [ef, setEf] = useState({ rent: "", deposit: "", prepaid: "", balance: "" });

  const totRev = Object.values(allData).reduce((s, d) => s + d.payments.reduce((a, p) => a + p.amount, 0), 0);
  const totOwed = Object.values(allData).reduce((s, d) => s + (d.balance > 0 ? d.balance : 0) + Object.values(d.utilities).reduce((a, b) => a + (b > 0 ? b : 0), 0), 0);
  const totDep = Object.values(allData).reduce((s, d) => s + d.securityDeposit, 0);
  const totUn = Object.values(allData).reduce((s, d) => s + d.messages.filter(m => m.from === "resident" && !m.read).length, 0);

  const updP = (pid, fn) => { const u = { ...allData }; const p = { ...u[pid] }; fn(p); u[pid] = p; setAllData(u); };
  const addChg = (pid) => { const a = parseFloat(chgAmt); if (isNaN(a) || a <= 0) return; updP(pid, p => { if (chgType === "Rent") p.balance += a; else { const k = UTILITIES.find(u => u.label === chgType)?.key; if (k) p.utilities = { ...p.utilities, [k]: p.utilities[k] + a }; } }); setChgMod(null); setChgAmt(""); };
  const recPay = (pid) => { const a = parseFloat(recAmt); if (isNaN(a) || a <= 0) return; updP(pid, p => { p.payments = [{ id: Date.now(), date: today(), amount: a, method: recMethod, type: recType, status: "completed" }, ...p.payments]; if (recType === "Rent") p.balance -= a; else { const k = UTILITIES.find(u => u.label === recType)?.key; if (k) p.utilities = { ...p.utilities, [k]: p.utilities[k] - a }; } }); setRecMod(null); setRecAmt(""); };
  const sendM = (pid) => { if (!admMsg.trim()) return; const u = { ...allData }; if (pid === "broadcast") { Object.keys(u).forEach(k => { u[k] = { ...u[k], messages: [...u[k].messages, { id: Date.now(), from: "admin", text: admMsg.trim(), date: today(), read: false }] }; }); } else { u[pid] = { ...u[pid], messages: [...u[pid].messages, { id: Date.now(), from: "admin", text: admMsg.trim(), date: today(), read: false }] }; } setAllData(u); setAdmMsg(""); setMsgT(null); };
  const doAddHouse = () => { if (!ah.name.trim() || !ah.code.trim() || !ah.rent) return; const nid = Math.max(0, ...properties.map(p => p.id)) + 1; setProperties(prev => [...prev, { id: nid, name: ah.name.trim(), address: ah.address.trim(), code: ah.code.trim() }]); setAllData(prev => ({ ...prev, [nid]: { login: ah.login.trim() || `house${ah.code}`, password: ah.password || "rent123", residents: [], futureResidents: [], rent: parseFloat(ah.rent) || 0, securityDeposit: parseFloat(ah.deposit) || 0, prepaidRent: 0, balance: 0, autopay: false, autopayMethod: null, autopayDay: 1, utilities: { oil: 0, electric: 0, solar: 0, propane: 0 }, payments: [], messages: [], files: [] } })); setAddHouseMod(false); setAh({ name: "", address: "", code: "", rent: "", deposit: "", login: "", password: "" }); };
  const openEditHouse = (pid) => { const p = properties.find(x => x.id === pid); if (p) { setEh({ name: p.name, address: p.address, code: p.code }); setEditHouseMod(pid); } };
  const doEditHouse = () => { if (!eh.name.trim() || !eh.code.trim()) return; setProperties(prev => prev.map(p => p.id === editHouseMod ? { ...p, name: eh.name.trim(), address: eh.address.trim(), code: eh.code.trim() } : p)); setEditHouseMod(null); };
  const openEditFin = (pid) => { const d = allData[pid]; if (d) { setEf({ rent: String(d.rent), deposit: String(d.securityDeposit), prepaid: String(d.prepaidRent), balance: String(d.balance) }); setEditFinMod(pid); } };
  const doEditFin = () => { updP(editFinMod, p => { p.rent = parseFloat(ef.rent) || 0; p.securityDeposit = parseFloat(ef.deposit) || 0; p.prepaidRent = parseFloat(ef.prepaid) || 0; p.balance = parseFloat(ef.balance) || 0; }); setEditFinMod(null); };
  const doDeleteHouse = (pid) => { setProperties(prev => prev.filter(p => p.id !== pid)); setAllData(prev => { const u = { ...prev }; delete u[pid]; return u; }); setSel(null); setDelConfirm(null); };

  const pad = mob ? 16 : 28;
  const navs = [{ key: "overview", label: mob ? "Home" : "Overview", Icon: LayoutDashboard }, { key: "properties", label: "Properties", Icon: Building }, { key: "messages", label: `Messages${totUn ? ` (${totUn})` : ""}`, Icon: MessageSquare }];

  return (
    <div style={{ fontFamily: FONT, overflowX: "hidden", width: "100%" }}>
      <nav className="nav-scroll" style={{ padding: `0 ${mob ? 6 : pad}px`, height: mob ? 44 : 48, borderBottom: `1px solid ${T.border}`, alignItems: "center", background: T.bgCard }}>
        {navs.map(n => (<button key={n.key} onClick={() => { setTab(n.key); setSel(null); }} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", border: "none", borderRadius: 7, cursor: "pointer", fontSize: mob ? 11 : 12, fontWeight: 600, fontFamily: FONT, whiteSpace: "nowrap", background: tab === n.key ? T.accentDim : "transparent", color: tab === n.key ? T.accent : T.textMuted, transition: "all .15s" }}><n.Icon size={mob ? 13 : 14} />{n.label}</button>))}
      </nav>
      <main style={{ padding: pad, maxWidth: 1100, margin: "0 auto" }}>
        {tab === "overview" && (<>
          <div className="mgrid4" style={{ marginBottom: mob ? 14 : 24 }}>
            <Metric icon={DollarSign} label="Revenue" value={fmt(totRev)} mob={mob} variant="success" />
            <Metric icon={TrendingUp} label="Outstanding" value={fmt(totOwed)} mob={mob} variant={totOwed > 0 ? "danger" : "success"} />
            <Metric icon={Shield} label="Deposits Held" value={fmt(totDep)} mob={mob} />
            <Metric icon={MessageSquare} label="Unread" value={totUn} mob={mob} variant={totUn > 0 ? "warning" : "default"} />
          </div>
          <h3 style={{ color: T.text, fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Properties</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {properties.map(p => {
              const d = allData[p.id]; if (!d) return null;
              const bal = (d.balance > 0 ? d.balance : 0) + Object.values(d.utilities).reduce((a, b) => a + (b > 0 ? b : 0), 0);
              return (
                <div key={p.id} onClick={() => { setTab("properties"); setSel(p.id); }} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: mob ? 14 : 18, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", transition: "border-color .15s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: T.accentDim, display: "flex", alignItems: "center", justifyContent: "center" }}><Building size={18} color={T.accent} /></div>
                    <div>
                      <div style={{ color: T.text, fontSize: 14, fontWeight: 700 }}>{p.name}</div>
                      <div style={{ color: T.textMuted, fontSize: 11, fontFamily: FONT_B }}>
                        {d.residents.length} resident{d.residents.length !== 1 ? "s" : ""}
                        {(d.futureResidents || []).length > 0 && <span style={{ color: T.gold }}> • {(d.futureResidents || []).length} future</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: bal > 0 ? T.red : T.green, fontSize: 16, fontWeight: 700 }}>{fmt(bal)}</div>
                    <div style={{ color: T.textMuted, fontSize: 10, fontFamily: FONT_B }}>outstanding</div>
                  </div>
                </div>
              );
            })}
          </div>
        </>)}

        {tab === "properties" && !sel && (<>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ color: T.text, fontSize: mob ? 18 : 20, fontWeight: 700 }}>Properties ({properties.length})</h2>
            <Btn variant="primary" onClick={() => setAddHouseMod(true)} style={{ padding: "8px 14px", fontSize: 12 }}><Plus size={14} />Add Property</Btn>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {properties.map(p => {
              const d = allData[p.id]; if (!d) return null;
              return (
                <div key={p.id} onClick={() => setSel(p.id)} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: mob ? 16 : 20, cursor: "pointer", transition: "border-color .15s" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ color: T.text, fontSize: 15, fontWeight: 700 }}>{p.name}</div>
                      <div style={{ color: T.textMuted, fontSize: 12, fontFamily: FONT_B, marginTop: 2 }}>{p.address} • Code: {p.code}</div>
                      <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                        <Badge variant="accent">{d.residents.length} current</Badge>
                        {(d.futureResidents || []).length > 0 && <Badge variant="warning">{(d.futureResidents || []).length} future</Badge>}
                        <Badge>{fmt(d.rent)}/mo</Badge>
                        {d.autopay && <Badge variant="success">Autopay</Badge>}
                      </div>
                    </div>
                    <ChevronRight size={18} color={T.textMuted} />
                  </div>
                </div>
              );
            })}
          </div>
        </>)}

        {tab === "properties" && sel && <PropertyDetail sel={sel} allData={allData} properties={properties} mob={mob} updP={updP} setSel={setSel} setChgMod={setChgMod} setRecMod={setRecMod} openEditHouse={openEditHouse} openEditFin={openEditFin} setDelConfirm={setDelConfirm} setMsgT={setMsgT} />}

        {tab === "messages" && (<>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ color: T.text, fontSize: mob ? 18 : 20, fontWeight: 700 }}>Messages</h2>
            <Btn variant="primary" onClick={() => setMsgT("broadcast")} style={{ padding: "8px 14px", fontSize: 12 }}><Megaphone size={14} />Broadcast</Btn>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {properties.map(p => {
              const d = allData[p.id]; if (!d) return null;
              const un = d.messages.filter(m => m.from === "resident" && !m.read).length;
              return (
                <div key={p.id} onClick={() => setMsgT(p.id)} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                  <div><div style={{ color: T.text, fontSize: 14, fontWeight: 600 }}>{p.name}</div><div style={{ color: T.textMuted, fontSize: 11, fontFamily: FONT_B }}>{d.messages.length} messages</div></div>
                  {un > 0 && <Badge variant="danger">{un} new</Badge>}
                </div>
              );
            })}
          </div>
        </>)}
      </main>

      {/* MODALS */}
      {addHouseMod && <Modal title="Add New Property" subtitle="Create a new house with login credentials" onClose={() => setAddHouseMod(false)} wide>
        <Inp dark label="Property Name" value={ah.name} onChange={e => setAh({ ...ah, name: e.target.value })} placeholder="e.g. 142 Oak Street" />
        <Inp dark label="Address" value={ah.address} onChange={e => setAh({ ...ah, address: e.target.value })} placeholder="Full address" />
        <Inp dark label="House Code" value={ah.code} onChange={e => setAh({ ...ah, code: e.target.value })} placeholder="e.g. 142" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Inp dark label="Monthly Rent" type="number" value={ah.rent} onChange={e => setAh({ ...ah, rent: e.target.value })} placeholder="0" />
          <Inp dark label="Security Deposit" type="number" value={ah.deposit} onChange={e => setAh({ ...ah, deposit: e.target.value })} placeholder="0" />
        </div>
        <Inp dark label="Login Username" value={ah.login} onChange={e => setAh({ ...ah, login: e.target.value })} placeholder="Resident login" />
        <Inp dark label="Login Password" value={ah.password} onChange={e => setAh({ ...ah, password: e.target.value })} placeholder="Resident password" />
        <Btn variant="primary" onClick={doAddHouse} style={{ width: "100%", padding: 14 }}>Create Property</Btn>
      </Modal>}

      {editHouseMod && <Modal title="Edit Property" onClose={() => setEditHouseMod(null)}>
        <Inp dark label="Name" value={eh.name} onChange={e => setEh({ ...eh, name: e.target.value })} />
        <Inp dark label="Address" value={eh.address} onChange={e => setEh({ ...eh, address: e.target.value })} />
        <Inp dark label="Code" value={eh.code} onChange={e => setEh({ ...eh, code: e.target.value })} />
        <Btn variant="primary" onClick={doEditHouse} style={{ width: "100%", padding: 14 }}>Save Changes</Btn>
      </Modal>}

      {editFinMod && <Modal title="Edit Financials" onClose={() => setEditFinMod(null)}>
        <Inp dark label="Monthly Rent" type="number" value={ef.rent} onChange={e => setEf({ ...ef, rent: e.target.value })} />
        <Inp dark label="Security Deposit" type="number" value={ef.deposit} onChange={e => setEf({ ...ef, deposit: e.target.value })} />
        <Inp dark label="Prepaid Rent" type="number" value={ef.prepaid} onChange={e => setEf({ ...ef, prepaid: e.target.value })} />
        <Inp dark label="Balance" type="number" value={ef.balance} onChange={e => setEf({ ...ef, balance: e.target.value })} />
        <Btn variant="primary" onClick={doEditFin} style={{ width: "100%", padding: 14 }}>Save</Btn>
      </Modal>}

      {delConfirm && <Modal title="Delete Property" onClose={() => setDelConfirm(null)}>
        <p style={{ color: T.textMuted, fontSize: 13, fontFamily: FONT_B, marginBottom: 20, lineHeight: 1.5 }}>Are you sure? This will permanently delete <strong style={{ color: T.text }}>{properties.find(p => p.id === delConfirm)?.name}</strong> and all its data.</p>
        <div style={{ display: "flex", gap: 8 }}><Btn variant="ghost" onClick={() => setDelConfirm(null)} style={{ flex: 1 }}>Cancel</Btn><Btn variant="danger" onClick={() => doDeleteHouse(delConfirm)} style={{ flex: 1 }}>Delete</Btn></div>
      </Modal>}

      {msgT && <Modal title={msgT === "broadcast" ? "Broadcast" : `Message — ${properties.find(p => p.id === msgT)?.name || ""}`} onClose={() => { setMsgT(null); setAdmMsg(""); }}>
        <textarea value={admMsg} onChange={e => setAdmMsg(e.target.value)} rows={4} placeholder="Type your message..." style={{ width: "100%", padding: "11px 13px", border: `1px solid ${T.border}`, borderRadius: 10, background: T.bgElevated, color: T.text, fontFamily: FONT_B, fontSize: 14, resize: "vertical", marginBottom: 16 }} />
        <Btn variant="primary" onClick={() => sendM(msgT)} style={{ width: "100%", padding: 14 }}><Send size={15} />Send</Btn>
      </Modal>}

      {chgMod && <Modal title="Add Charge" onClose={() => { setChgMod(null); setChgAmt(""); }}>
        <Sel label="Charge Type" value={chgType} onChange={e => setChgType(e.target.value)}>
          <option value="Rent">Rent</option>
          {UTILITIES.map(u => <option key={u.key} value={u.label}>{u.label}</option>)}
        </Sel>
        <Inp dark label="Amount" type="number" value={chgAmt} onChange={e => setChgAmt(e.target.value)} placeholder="0.00" />
        <Btn variant="primary" onClick={() => addChg(chgMod)} style={{ width: "100%", padding: 14 }}>Add Charge</Btn>
      </Modal>}

      {recMod && <Modal title="Record Payment" onClose={() => { setRecMod(null); setRecAmt(""); }}>
        <Sel label="Payment Type" value={recType} onChange={e => setRecType(e.target.value)}>
          <option value="Rent">Rent</option>
          {UTILITIES.map(u => <option key={u.key} value={u.label}>{u.label}</option>)}
        </Sel>
        <Toggle options={[{ value: "ACH", label: "ACH" }, { value: "Zelle", label: "Zelle" }, { value: "Venmo", label: "Venmo" }, { value: "Cash", label: "Cash" }]} value={recMethod} onChange={setRecMethod} />
        <Inp dark label="Amount" type="number" value={recAmt} onChange={e => setRecAmt(e.target.value)} placeholder="0.00" />
        <Btn variant="success" onClick={() => recPay(recMod)} style={{ width: "100%", padding: 14 }}>Record Payment</Btn>
      </Modal>}
    </div>
  );
}

/* ═══════════════════════════════════════════
   APP
   ═══════════════════════════════════════════ */
export default function App() {
  const mob = useIsMobile();
  const [page, setPage] = useState("home");
  const [portalUser, setPortalUser] = useState(null);
  const [properties, setProperties] = useState(INIT_PROPS);
  const [allData, setAllData] = useState(mkData);

  const handleLogin = (type, creds) => {
    if (type === "admin") { setPortalUser({ type: "admin" }); return null; }
    const found = Object.entries(allData).find(([, d]) => d.login === creds.username && d.password === creds.password);
    if (found) { setPortalUser({ type: "resident", propertyId: Number(found[0]) }); return null; }
    return "Invalid username or password.";
  };
  const handleRegister = (propId, username, password) => { setAllData(prev => { const u = { ...prev }; u[propId] = { ...u[propId], login: username, password }; return u; }); };
  const handleLogout = () => { setPortalUser(null); };

  return (
    <div style={{ minHeight: "100vh", background: T.bg }}>
      <GlobalStyles />
      <SiteNav page={page} setPage={setPage} portalUser={portalUser} onLogout={handleLogout} mob={mob} />
      {page === "home" && <HomePage setPage={setPage} mob={mob} />}
      {page === "services" && <ServicesPage setPage={setPage} mob={mob} />}
      {page === "portfolio" && <PortfolioPage mob={mob} />}
      {page === "contact" && <ContactPage mob={mob} />}
      {page === "pay" && <PayRentPage allData={allData} properties={properties} setAllData={setAllData} setPage={setPage} mob={mob} />}
      {page === "portal" && !portalUser && <PortalLogin onLogin={handleLogin} onRegister={handleRegister} allData={allData} properties={properties} setPage={setPage} />}
      {page === "portal" && portalUser?.type === "admin" && <AdminDash allData={allData} setAllData={setAllData} properties={properties} setProperties={setProperties} onLogout={handleLogout} />}
      {page === "portal" && portalUser?.type === "resident" && <ResidentDash propertyId={portalUser.propertyId} data={allData[portalUser.propertyId]} allData={allData} setAllData={setAllData} onLogout={handleLogout} properties={properties} setPage={setPage} />}
    </div>
  );
}
