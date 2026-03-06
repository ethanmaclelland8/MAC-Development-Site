import { useState, useEffect, useRef } from "react";
import {
  Home, LogOut, ChevronRight, ChevronLeft, DollarSign, Shield, CreditCard,
  Send, MessageSquare, Zap, Flame, Sun, Droplets, TrendingUp,
  CheckCircle, AlertCircle, Users, Building, Settings,
  Plus, Check, X, ArrowUpRight, Calendar, FileText, Key,
  Megaphone, Eye, EyeOff, RefreshCw, Wallet,
  LayoutDashboard, Receipt, Mail, User, Phone, MapPin,
  Pencil, Trash2, UserPlus, Save,
  Landmark, ShieldCheck, Clock, Menu,
  Wrench, ArrowRight, FolderOpen, Upload, Download, File,
  BedDouble, Star, CalendarDays, ClipboardList,
  LogIn, Bed, Bath, Wifi, ParkingCircle, UtensilsCrossed,
  Tv, AirVent, WashingMachine, Smartphone, Activity, Lock, Fingerprint
} from "lucide-react";

/* ════════════ CONCRETE & STEEL THEME ════════════ */
const T = {
  bg: "#0E1117",         // deep charcoal
  bgCard: "#161B22",     // concrete dark
  bgElevated: "#1C2128", // raised slab
  bgHover: "#242B35",
  border: "#2D333B",     // steel edge
  text: "#E6EDF3",       // bright white
  textSecondary: "#9BA4B0", // worn concrete
  textMuted: "#636C76",   // shadow gray
  accent: "#4A8EC2",     // steel blue
  accentDim: "rgba(74,142,194,0.10)",
  accentBorder: "rgba(74,142,194,0.25)",
  green: "#4A8EC2",      // using blue for success
  greenDim: "rgba(74,142,194,0.08)",
  greenBorder: "rgba(74,142,194,0.20)",
  red: "#D9534F",
  redDim: "rgba(217,83,79,0.08)",
  redBorder: "rgba(217,83,79,0.18)",
  teal: "#4A8EC2",
  tealDim: "rgba(74,142,194,0.10)",
  blue: "#4A8EC2",       // primary steel blue
  navy: "#0E1117",
  orange: "#C2873A",     // warm accent
  orangeDim: "rgba(194,135,58,0.10)",
  orangeBorder: "rgba(194,135,58,0.25)",
  purple: "#7C8FAA",     // cool slate
  purpleDim: "rgba(124,143,170,0.10)",
  purpleBorder: "rgba(124,143,170,0.25)",
  pine: "#4A8EC2",
  birch: "#E6EDF3",      // white
  gold: "#9BA4B0",       // gray
  concrete: "#2D333B",   // concrete mid
  steel: "#4A8EC2",      // steel blue
  white: "#F0F3F6",      // clean white
};
const FN = `'Instrument Sans', -apple-system, sans-serif`;
const FB = `'IBM Plex Sans', -apple-system, sans-serif`;
const BIZ_PHONE = "(617) 999-0124";

const UTILS = [
  { key: "oil", label: "Oil", Icon: Droplets, color: "#C2873A" },
  { key: "electric", label: "Electric", Icon: Zap, color: "#9BA4B0" },
  { key: "solar", label: "Solar Credit", Icon: Sun, color: "#4A8EC2" },
  { key: "propane", label: "Propane", Icon: Flame, color: "#D9534F" },
];

const PAY_METHODS = [
  { key: "card", icon: CreditCard, label: "Credit / Debit Card", sub: "Visa, MC, Amex, Discover", fee: "2.9% + $0.30", time: "Instant", badge: null, color: T.purple },
  { key: "ach", icon: Landmark, label: "ACH Bank Transfer", sub: "Direct from bank", fee: "0.8% (max $5)", time: "3–5 days", badge: "Lowest Fee", color: T.green },
  { key: "zelle", icon: ArrowUpRight, label: "Zelle", sub: "Send to payments@mdco.homes", fee: "Free", time: "1–2 days", badge: null, color: T.blue },
  { key: "venmo", icon: Wallet, label: "Venmo", sub: "Send to @MACDevelopmentCo", fee: "Free", time: "1–2 days", badge: null, color: T.accent },
];

const AM = { wifi: { icon: Wifi, label: "WiFi" }, kitchen: { icon: UtensilsCrossed, label: "Kitchen" }, parking: { icon: ParkingCircle, label: "Parking" }, tv: { icon: Tv, label: "TV" }, ac: { icon: AirVent, label: "A/C" }, washer: { icon: WashingMachine, label: "Washer/Dryer" } };

const SMST = {
  booking_confirm: (p, c, d) => `Booking at ${p} confirmed! Code: ${c}. Check-in: ${d} after 3pm. Text anytime! - MAC Development`,
  checkin_reminder: (p, d) => `Reminder: Stay at ${p} starts tomorrow (${d}). Check-in after 3pm. - MAC Development`,
  checkout_reminder: (p, d) => `Checkout from ${p} tomorrow (${d}) by 11am. - MAC Development`,
  welcome: p => `Welcome to ${p}! WiFi: MACGuest2026 / Pass: welcome123. - MAC Development`,
  post_stay: (n, p) => `Hi ${n}! Thanks for staying at ${p}! - MAC Development`,
};

const INIT_PROPS = [
  { id: 1, name: "142 Oak Street", address: "142 Oak St, Unit A, Storrs, CT 06268", code: "142", bedrooms: 3, bathrooms: 2, sqft: 1400, yearBuilt: 2005, features: ["Central A/C", "In-unit laundry", "Hardwood floors", "Off-street parking", "Pet friendly"], description: "Spacious 3-bedroom unit with modern finishes, central air, and a private backyard. Walking distance to UConn campus." },
  { id: 2, name: "88 Maple Avenue", address: "88 Maple Ave, Mansfield, CT 06250", code: "88", bedrooms: 2, bathrooms: 1, sqft: 1050, yearBuilt: 2010, features: ["Updated kitchen", "Energy efficient", "Quiet neighborhood", "Garden access"], description: "Bright 2-bedroom apartment with energy-efficient appliances and a peaceful neighborhood setting." },
  { id: 3, name: "310 Cedar Lane", address: "310 Cedar Ln, Willimantic, CT 06226", code: "310", bedrooms: 4, bathrooms: 2, sqft: 1800, yearBuilt: 1998, features: ["Large basement", "Two-car garage", "Fireplace", "Solar panels", "Fenced yard"], description: "Large 4-bedroom home with a two-car garage, solar panels, and plenty of yard space for families." },
  { id: 4, name: "27 Birch Road", address: "27 Birch Rd, Coventry, CT 06238", code: "27", bedrooms: 1, bathrooms: 1, sqft: 650, yearBuilt: 2018, features: ["Modern build", "Stainless appliances", "Walk-in closet", "Covered patio"], description: "Cozy modern 1-bedroom with high-end finishes. Perfect for a single professional or couple." },
];

const INIT_STR = [
  { id: 101, name: "Lakefront Cottage", address: "15 Lake Shore Dr, Coventry, CT", code: "LAKE15", bedrooms: 2, bathrooms: 1, maxGuests: 4, nightlyRate: 149, cleaningFee: 75, sqft: 900, amenities: ["wifi", "kitchen", "parking", "tv", "ac"], description: "Charming lakefront cottage with stunning water views. Private dock access, kayaks provided. Perfect for a peaceful New England getaway.", features: ["Waterfront", "Private dock", "Kayaks included", "Fire pit", "Screened porch"], active: true, blockedDates: [],
    bookings: [
      { id: "BK1001", guestFirst: "Emily", guestLast: "Taylor", email: "emily@email.com", phone: "860-555-1234", confirmCode: "LAKE-7842", checkIn: "2026-03-10", checkOut: "2026-03-14", guests: 2, totalCost: 671, status: "confirmed", paidAmount: 671, payMethod: "card", created: "2026-02-20", smsLog: [{ id: 1, type: "booking_confirm", text: "Booking confirmed! Code: LAKE-7842", date: "2026-02-20", status: "delivered" }] },
      { id: "BK1002", guestFirst: "Robert", guestLast: "Kim", email: "rkim@email.com", phone: "617-555-9876", confirmCode: "LAKE-3291", checkIn: "2026-03-20", checkOut: "2026-03-23", guests: 3, totalCost: 522, status: "upcoming", paidAmount: 522, payMethod: "card", created: "2026-03-01", smsLog: [{ id: 2, type: "booking_confirm", text: "Booking confirmed! Code: LAKE-3291", date: "2026-03-01", status: "delivered" }] },
    ]
  },
  { id: 102, name: "Downtown Studio", address: "88 Main St, Apt 3B, Hartford, CT", code: "DT88", bedrooms: 1, bathrooms: 1, maxGuests: 2, nightlyRate: 99, cleaningFee: 50, sqft: 500, amenities: ["wifi", "kitchen", "tv", "ac", "washer"], description: "Modern studio in the heart of downtown Hartford. Walk to restaurants, theaters, and parks. Ideal for business travelers.", features: ["Downtown location", "Keyless entry", "Workspace desk", "Smart TV", "Coffee bar"], active: true, blockedDates: [], bookings: [] },
];

const mkData = () => ({
  1: { login: "oak142", password: "rent123", residents: ["Maria Santos", "Jorge Santos", "Ana Santos"], rent: 2800, securityDeposit: 2800, prepaidRent: 2800, balance: 0, autopay: true, autopayMethod: "card", autopayDay: 1, depositStartDate: "2024-06-01", depositEndDate: "2026-06-01", leaseStart: "2024-06-01", leaseEnd: "2026-06-01", rentDueDay: 1, utilities: { oil: 0, electric: 145.80, solar: -42, propane: 0 }, payments: [{ id: 1, date: "2026-02-01", amount: 2800, method: "Card", type: "Rent", status: "Cleared" }, { id: 2, date: "2026-01-02", amount: 2800, method: "Card", type: "Rent", status: "Cleared" }], messages: [{ id: 1, from: "admin", text: "Welcome to MAC Development!", date: "2024-06-01", read: true }, { id: 2, from: "resident", text: "When will the parking lot be repaved?", date: "2026-02-10", read: true }, { id: 3, from: "admin", text: "Parking lot repaving scheduled for April 2026.", date: "2026-02-11", read: false }], files: [{ id: "f1", name: "Lease Agreement 2024-2026.pdf", category: "Lease", date: "2024-06-01", size: "2.4 MB" }, { id: "f2", name: "Payment Guide.pdf", category: "Guide", date: "2026-01-15", size: "890 KB" }] },
  2: { login: "maple88", password: "rent123", residents: ["David Chen", "Lisa Chen"], rent: 2200, securityDeposit: 2200, prepaidRent: 1100, balance: 2200, autopay: false, autopayMethod: null, autopayDay: 1, depositStartDate: "2025-01-01", depositEndDate: "2027-01-01", leaseStart: "2025-01-01", leaseEnd: "2027-01-01", rentDueDay: 1, utilities: { oil: 220, electric: 0, solar: 0, propane: 88 }, payments: [{ id: 3, date: "2026-01-03", amount: 2200, method: "Zelle", type: "Rent", status: "Cleared" }], messages: [{ id: 4, from: "admin", text: "Rent for March is due on the 1st.", date: "2026-02-25", read: false }], files: [{ id: "f3", name: "Lease 2025-2027.pdf", category: "Lease", date: "2025-01-01", size: "2.1 MB" }] },
  3: { login: "cedar310", password: "rent123", residents: ["James Wilson", "Patricia Wilson", "Tom Wilson"], rent: 3100, securityDeposit: 3100, prepaidRent: 3100, balance: 0, autopay: true, autopayMethod: "card", autopayDay: 1, depositStartDate: "2023-09-01", depositEndDate: "2025-09-01", leaseStart: "2023-09-01", leaseEnd: "2025-09-01", rentDueDay: 1, utilities: { oil: 0, electric: 0, solar: -65, propane: 0 }, payments: [{ id: 5, date: "2026-03-01", amount: 3100, method: "Card", type: "Rent", status: "Cleared" }], messages: [], files: [] },
  4: { login: "birch27", password: "rent123", residents: ["Sarah Johnson"], rent: 1450, securityDeposit: 1450, prepaidRent: 725, balance: 1450, autopay: false, autopayMethod: null, autopayDay: 1, depositStartDate: "2025-03-01", depositEndDate: "2027-03-01", leaseStart: "2025-03-01", leaseEnd: "2027-03-01", rentDueDay: 1, utilities: { oil: 175, electric: 92, solar: 0, propane: 45 }, payments: [], messages: [{ id: 7, from: "resident", text: "Kitchen faucet is leaking.", date: "2026-02-28", read: true }], files: [] },
});

/* ════════════ HELPERS ════════════ */
const fmt = n => { const a = Math.abs(n), s = a.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); return n < 0 ? `-$${s}` : `$${s}`; };
const ord = n => n === 1 ? "1st" : n === 2 ? "2nd" : n === 3 ? "3rd" : `${n}th`;
const td = () => new Date().toISOString().split("T")[0];
const fmtD = d => { try { return new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }); } catch { return d; } };
const calcFee = (a, m) => m === "card" ? Math.round((a * 0.029 + 0.30) * 100) / 100 : m === "ach" ? Math.min(Math.round(a * 0.008 * 100) / 100, 5) : 0;
const calcDep = (p, s, e) => { if (!s || !e || !p) return { interest: 0, total: p || 0, days: 0, years: 0 }; const st = new Date(s), en = new Date(e), now = new Date(), eff = now < en ? now : en, days = Math.max(0, Math.floor((eff - st) / 86400000)), yrs = days / 365.25, i = Math.round(p * 0.015 * yrs * 100) / 100; return { interest: i, total: Math.round((p + i) * 100) / 100, days, years: Math.round(yrs * 100) / 100 }; };
const calcLate = (bal, due) => { if (bal <= 0) return 0; const now = new Date(), d = new Date(now.getFullYear(), now.getMonth(), due); return now <= d ? 0 : Math.floor((now - d) / 86400000) * 5; };
const genCode = pfx => `${pfx}-${Math.floor(1000 + Math.random() * 9000)}`;
const nightsB = (ci, co) => Math.max(0, Math.round((new Date(co) - new Date(ci)) / 86400000));
function useIsMobile(bp = 768) { const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1024); useEffect(() => { const h = () => setW(window.innerWidth); window.addEventListener("resize", h); return () => window.removeEventListener("resize", h); }, []); return w < bp; }

/* ════════════ GLOBAL STYLES — Nordic ════════════ */
function GlobalStyles() {
  return (<>
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=Playfair+Display:ital,wght@0,700;1,700&display=swap" rel="stylesheet" />
    <style>{`
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
      html{scroll-behavior:smooth}html,body{overflow-x:hidden;width:100%}
      ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${T.border};border-radius:3px}
      input,select,textarea{font-family:${FB};font-size:16px}
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
      @keyframes aurora{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
      .fi{animation:fadeIn .3s ease-out both}.su{animation:slideUp .25s ease-out both}
      .fis{animation:fadeInSlow .6s ease-out both}
    `}</style>
  </>);
}

/* ════════════ LOGO — Nordic variant ════════════ */
function MacDevLogo({ size = 52 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="52" height="52" rx="10" fill="#161B22" />
      <rect x="1" y="1" width="50" height="50" rx="9" stroke="#4A8EC2" strokeWidth="0.5" opacity="0.2" />
      <text x="26" y="24" textAnchor="middle" fontFamily="'Instrument Sans', sans-serif" fontWeight="700" fontSize="15" fill="#E6EDF3">MAC</text>
      <line x1="14" y1="30" x2="38" y2="30" stroke="#4A8EC2" strokeWidth="0.6" opacity="0.3" />
      <text x="26" y="39" textAnchor="middle" fontFamily="'IBM Plex Sans', sans-serif" fontWeight="400" fontSize="6" fill="#9BA4B0" opacity="0.8">DEVELOPMENT</text>
    </svg>
  );
}

/* ════════════ SHARED UI ════════════ */
const Badge = ({ children, variant = "default" }) => {
  const m = { default: [T.bgElevated, T.textSecondary, T.border], success: [T.greenDim, T.green, T.greenBorder], warning: [T.orangeDim, T.orange, T.orangeBorder], danger: [T.redDim, T.red, T.redBorder], accent: [T.accentDim, T.accent, T.accentBorder], purple: [T.purpleDim, T.purple, T.purpleBorder] };
  const [bg, c, bd] = m[variant] || m.default;
  return <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 9px", borderRadius: 6, fontSize: 10, fontWeight: 600, fontFamily: FB, background: bg, color: c, border: `1px solid ${bd}`, whiteSpace: "nowrap" }}>{children}</span>;
};

const Metric = ({ icon: Icon, label, value, sub, variant = "default", mob }) => {
  const acc = { default: [T.bgElevated, T.textSecondary], success: [T.greenDim, T.green], danger: [T.redDim, T.red], warning: [T.orangeDim, T.orange], accent: [T.accentDim, T.accent], purple: [T.purpleDim, T.purple] };
  const [ibg, ic] = acc[variant] || acc.default;
  return <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, padding: mob ? 12 : 18 }}>
    <div style={{ width: mob ? 30 : 38, height: mob ? 30 : 38, borderRadius: 10, background: ibg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}><Icon size={mob ? 14 : 18} color={ic} /></div>
    <div style={{ color: T.textMuted, fontSize: mob ? 9 : 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.6px", fontFamily: FB, marginBottom: 3 }}>{label}</div>
    <div style={{ color: T.text, fontSize: mob ? 18 : 28, fontWeight: 700, fontFamily: FN, letterSpacing: "-0.5px" }}>{value}</div>
    {sub && <div style={{ color: T.textMuted, fontSize: mob ? 10 : 12, fontFamily: FB, marginTop: 3 }}>{sub}</div>}
  </div>;
};

const Btn = ({ children, onClick, variant = "primary", style: ex, disabled, ...p }) => {
  const base = { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "10px 18px", border: "none", borderRadius: 10, cursor: disabled ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 600, fontFamily: FN, transition: "all .2s", opacity: disabled ? 0.5 : 1 };
  const v = { primary: { background: T.accent, color: "#fff" }, secondary: { background: T.bgElevated, color: T.textSecondary, border: `1px solid ${T.border}` }, ghost: { background: "transparent", color: T.textSecondary, border: `1px solid ${T.border}` }, success: { background: T.green, color: "#fff" }, danger: { background: T.redDim, color: T.red, border: `1px solid ${T.redBorder}` }, orange: { background: T.orange, color: "#fff" }, purple: { background: T.purple, color: "#fff" } };
  return <button onClick={disabled ? undefined : onClick} style={{ ...base, ...(v[variant] || v.primary), ...ex }} {...p}>{children}</button>;
};

const Inp = ({ label, dark, style: ex, ...p }) => <div style={{ marginBottom: 16, ...ex }}>{label && <label style={{ display: "block", color: dark ? T.textMuted : "#667085", fontSize: 11, fontWeight: 600, marginBottom: 6, fontFamily: FB, textTransform: "uppercase", letterSpacing: "0.4px" }}>{label}</label>}<input style={{ width: "100%", padding: "12px 14px", border: `1px solid ${dark ? T.border : "#D0D5DD"}`, borderRadius: 10, background: dark ? T.bgElevated : "#fff", color: dark ? T.text : "#1D2939", fontFamily: FB, fontSize: 14 }} {...p} /></div>;

const Sel = ({ label, children, ...p }) => <div style={{ marginBottom: 16 }}>{label && <label style={{ display: "block", color: T.textMuted, fontSize: 11, fontWeight: 600, marginBottom: 6, fontFamily: FB, textTransform: "uppercase", letterSpacing: "0.4px" }}>{label}</label>}<select style={{ width: "100%", padding: "12px 14px", border: `1px solid ${T.border}`, borderRadius: 10, background: T.bgElevated, color: T.text, fontFamily: FB, fontSize: 14 }} {...p}>{children}</select></div>;

const Modal = ({ title, subtitle, onClose, children, wide }) => <div style={{ position: "fixed", inset: 0, background: "rgba(8,10,14,0.80)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }} onClick={onClose}><div className="su" onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: wide ? 640 : 480, background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 20, padding: 28, maxHeight: "85vh", overflowY: "auto" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}><h3 style={{ color: T.text, fontSize: 18, fontWeight: 700, fontFamily: FN }}>{title}</h3><button onClick={onClose} style={{ background: T.bgElevated, border: `1px solid ${T.border}`, borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: T.textMuted, flexShrink: 0 }}><X size={14} /></button></div>{subtitle && <p style={{ color: T.textMuted, fontSize: 13, fontFamily: FB, marginBottom: 20 }}>{subtitle}</p>}{children}</div></div>;

const Toggle = ({ options, value, onChange }) => <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 16 }}>{options.map(o => <button key={o.value} onClick={() => onChange(o.value)} style={{ flex: 1, minWidth: 60, padding: "10px 10px", border: `1px solid ${value === o.value ? T.accent : T.border}`, borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: FB, background: value === o.value ? T.accentDim : T.bgElevated, color: value === o.value ? T.accent : T.textMuted }}>{o.label}</button>)}</div>;

const Card = ({ title, icon: Icon, action, children }) => <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 16, padding: 20, marginBottom: 16 }}>{(title || action) && <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}>{Icon && <Icon size={16} color={T.accent} />}<span style={{ color: T.text, fontSize: 15, fontWeight: 700, fontFamily: FN }}>{title}</span></div>{action}</div>}{children}</div>;

/* Payment Picker */
function PayPicker({ selected, onSelect, amount, compact }) {
  const fee = selected ? calcFee(parseFloat(amount) || 0, selected) : 0;
  const total = (parseFloat(amount) || 0) + fee;
  return <div>
    <div style={{ color: T.textMuted, fontSize: 11, fontWeight: 600, fontFamily: FB, textTransform: "uppercase", marginBottom: 8 }}>Payment Method</div>
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
      {PAY_METHODS.map(m => <button key={m.key} onClick={() => onSelect(m.key)} style={{ display: "flex", alignItems: "center", gap: compact ? 10 : 14, padding: compact ? "10px 12px" : "14px 18px", borderRadius: 12, cursor: "pointer", background: selected === m.key ? T.accentDim : T.bgCard, border: `1.5px solid ${selected === m.key ? T.accent : T.border}`, textAlign: "left" }}>
        <div style={{ width: compact ? 34 : 42, height: compact ? 34 : 42, borderRadius: 10, background: selected === m.key ? m.color : T.bgElevated, display: "flex", alignItems: "center", justifyContent: "center" }}><m.icon size={compact ? 15 : 20} color={selected === m.key ? "#fff" : T.textSecondary} /></div>
        <div style={{ flex: 1 }}><div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ color: T.text, fontSize: compact ? 12 : 14, fontWeight: 600 }}>{m.label}</span>{m.badge && <span style={{ padding: "2px 6px", borderRadius: 4, background: T.greenDim, color: T.green, fontSize: 9, fontWeight: 700 }}>{m.badge}</span>}</div><div style={{ color: T.textMuted, fontSize: 10, fontFamily: FB, marginTop: 1 }}>Fee: {m.fee} · {m.time}</div></div>
        <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${selected === m.key ? T.accent : T.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>{selected === m.key && <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.accent }} />}</div>
      </button>)}
    </div>
    {selected && amount && parseFloat(amount) > 0 && <div style={{ background: T.bgElevated, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14 }}>
      {[["Payment", fmt(parseFloat(amount))], ["Fee", fee > 0 ? fmt(fee) : "Free"]].map(([l, v], i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}><span style={{ color: T.textMuted, fontSize: 12, fontFamily: FB }}>{l}</span><span style={{ color: T.text, fontSize: 12, fontWeight: 600 }}>{v}</span></div>)}
      <div style={{ borderTop: `1px solid ${T.border}`, marginTop: 6, paddingTop: 6, display: "flex", justifyContent: "space-between" }}><span style={{ color: T.text, fontSize: 13, fontWeight: 700 }}>Total</span><span style={{ color: T.accent, fontSize: 16, fontWeight: 800 }}>{fmt(total)}</span></div>
    </div>}
  </div>;
}

/* SMS Log */
function SMSLog({ logs }) {
  const labels = { booking_confirm: "Confirmation", checkin_reminder: "Check-In", checkout_reminder: "Checkout", welcome: "Welcome", post_stay: "Follow-Up", custom: "Custom" };
  if (!logs?.length) return <p style={{ color: T.textMuted, fontSize: 11, fontFamily: FB, textAlign: "center", padding: 10 }}>No texts sent.</p>;
  return <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>{logs.map(l => <div key={l.id} style={{ background: T.bgElevated, border: `1px solid ${T.border}`, borderRadius: 8, padding: 10 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}><div style={{ display: "flex", alignItems: "center", gap: 4 }}><Smartphone size={10} color={T.green} /><span style={{ color: T.text, fontSize: 10, fontWeight: 600 }}>{labels[l.type] || l.type}</span></div><span style={{ color: T.textMuted, fontSize: 9, fontFamily: FB }}>{l.date}</span></div><div style={{ color: T.textSecondary, fontSize: 10, fontFamily: FB, lineHeight: 1.4 }}>{l.text}</div></div>)}</div>;
}

/* ════════════ PROPERTY INFO CARD (shared for STR + LTR) ════════════ */
function PropertyInfoCard({ prop, variant = "ltr", mob }) {
  const isSTR = variant === "str";
  return (
    <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden" }}>
      <div style={{ height: mob ? 120 : 160, background: `linear-gradient(135deg, #161B22, #1C2128, #0E1117)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, rgba(74,142,194,0.04), transparent, rgba(155,164,176,0.03))`, animation: "aurora 8s ease-in-out infinite", backgroundSize: "200% 200%" }} />
        {isSTR ? <BedDouble size={48} color={T.accent} style={{ opacity: 0.3 }} /> : <Building size={48} color={T.accent} style={{ opacity: 0.3 }} />}
        {isSTR && <div style={{ position: "absolute", top: 12, right: 12 }}><Badge variant="accent">{fmt(prop.nightlyRate)}/night</Badge></div>}
        {!isSTR && <div style={{ position: "absolute", top: 12, right: 12 }}><Badge variant="accent">{prop.bedrooms}BR / {prop.bathrooms}BA</Badge></div>}
      </div>
      <div style={{ padding: mob ? 16 : 22 }}>
        <h3 style={{ color: T.text, fontSize: mob ? 16 : 20, fontWeight: 700, marginBottom: 4, fontFamily: FN }}>{prop.name}</h3>
        <div style={{ color: T.textMuted, fontSize: 12, fontFamily: FB, marginBottom: 12, display: "flex", alignItems: "center", gap: 5 }}><MapPin size={12} /> {prop.address}</div>
        <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
          {prop.bedrooms != null && <span style={{ color: T.textSecondary, fontSize: 12, fontFamily: FB, display: "flex", alignItems: "center", gap: 4 }}><Bed size={12} /> {prop.bedrooms} Bed</span>}
          {prop.bathrooms != null && <span style={{ color: T.textSecondary, fontSize: 12, fontFamily: FB, display: "flex", alignItems: "center", gap: 4 }}><Bath size={12} /> {prop.bathrooms} Bath</span>}
          {prop.sqft && <span style={{ color: T.textSecondary, fontSize: 12, fontFamily: FB }}>{prop.sqft} sqft</span>}
          {isSTR && <span style={{ color: T.textSecondary, fontSize: 12, fontFamily: FB, display: "flex", alignItems: "center", gap: 4 }}><Users size={12} /> {prop.maxGuests} guests</span>}
        </div>
        {prop.description && <p style={{ color: T.textSecondary, fontSize: 13, fontFamily: FB, lineHeight: 1.6, marginBottom: 14 }}>{prop.description}</p>}
        {(prop.features || prop.amenities) && <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: isSTR ? 16 : 0 }}>
          {(prop.features || []).map((f, i) => <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 20, background: T.bgElevated, border: `1px solid ${T.border}`, fontSize: 10, fontFamily: FB, color: T.textSecondary }}><CheckCircle size={9} color={T.accent} />{f}</span>)}
          {isSTR && (prop.amenities || []).map(a => AM[a] && <span key={a} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 20, background: T.bgElevated, border: `1px solid ${T.border}`, fontSize: 10, fontFamily: FB, color: T.textSecondary }}>{(() => { const A = AM[a].icon; return <A size={9} />; })()}{AM[a].label}</span>)}
        </div>}
      </div>
    </div>
  );
}

/* ════════════ SITE NAV ════════════ */
function SiteNav({ page, setPage, portalUser, onLogout, mob }) {
  const [mm, setMM] = useState(false);
  const links = [{ key: "home", label: "Home" }, { key: "services", label: "Services" }, { key: "rentals", label: "Rentals" }, { key: "properties", label: "Our Properties" }, { key: "apply", label: "Apply" }, { key: "portal", label: portalUser ? "Dashboard" : "Portal" }, { key: "contact", label: "Contact" }];
  const nav = k => { setPage(k); setMM(false); window.scrollTo(0, 0); };
  return <header style={{ position: "sticky", top: 0, zIndex: 200, background: "rgba(14,17,23,0.88)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${T.border}` }}>
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: `0 ${mob ? 16 : 40}px`, height: mob ? 56 : 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div onClick={() => nav("home")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}><MacDevLogo size={mob ? 34 : 38} />{!mob && <span style={{ color: T.text, fontSize: 15, fontWeight: 700, fontFamily: FN }}>MAC Development</span>}</div>
      {!mob ? <nav style={{ display: "flex", alignItems: "center", gap: 3 }}>{links.map(l => <button key={l.key} onClick={() => nav(l.key)} style={{ padding: "7px 12px", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: FN, fontSize: 13, fontWeight: 600, background: page === l.key ? T.accentDim : "transparent", color: page === l.key ? T.accent : T.textSecondary }}>{l.label}</button>)}{portalUser && <button onClick={() => { onLogout(); nav("home"); }} style={{ marginLeft: 4, padding: "7px 12px", border: `1px solid ${T.border}`, borderRadius: 8, cursor: "pointer", fontFamily: FN, fontSize: 12, fontWeight: 600, background: "transparent", color: T.textMuted }}><LogOut size={14} /></button>}</nav>
      : <button onClick={() => setMM(!mm)} style={{ background: "transparent", border: "none", color: T.text, cursor: "pointer" }}>{mm ? <X size={20} /> : <Menu size={20} />}</button>}
    </div>
    {mob && mm && <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: T.bgCard, borderBottom: `1px solid ${T.border}`, padding: "8px 16px 16px", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>{links.map(l => <button key={l.key} onClick={() => nav(l.key)} style={{ display: "block", width: "100%", padding: "12px 10px", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: FN, fontSize: 15, fontWeight: 600, background: page === l.key ? T.accentDim : "transparent", color: page === l.key ? T.accent : T.textSecondary, textAlign: "left" }}>{l.label}</button>)}{portalUser && <button onClick={() => { onLogout(); nav("home"); }} style={{ display: "block", width: "100%", padding: "12px 10px", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: FN, fontSize: 15, fontWeight: 600, background: "transparent", color: T.red, textAlign: "left" }}>Sign Out</button>}</div>}
  </header>;
}

function Footer({ setPage, mob }) {
  return <footer style={{ borderTop: `1px solid ${T.border}`, background: T.bgCard }}><div style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "40px 20px" : "56px 40px" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: mob ? "flex-start" : "center", flexDirection: mob ? "column" : "row", gap: 20, marginBottom: 20 }}><div style={{ display: "flex", alignItems: "center", gap: 12 }}><MacDevLogo size={36} /><span style={{ color: T.text, fontSize: 14, fontWeight: 700, fontFamily: FN }}>MAC Development Co.</span></div></div><div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}><span style={{ color: T.textMuted, fontSize: 11, fontFamily: FB }}>© 2026 MAC Development Co. New England.</span><div style={{ display: "flex", alignItems: "center", gap: 5 }}><ShieldCheck size={12} color={T.accent} /><span style={{ color: T.textMuted, fontSize: 11, fontFamily: FB }}>Secured by Stripe</span></div></div></div></footer>;
}

/* ════════════ HOME — Concrete & Steel ════════════ */
function HomePage({ setPage, mob }) {
  const SERIF = `'Playfair Display', Georgia, serif`;
  return <div style={{ background: T.bg, fontFamily: FN }}>
    {/* ── HERO ── */}
    <section style={{ position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(170deg, #0E1117, #161B22 40%, #1C2128 70%, #0E1117)` }} />
      {/* Subtle geometric concrete texture */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.05) 35px, rgba(255,255,255,0.05) 36px)" }} />
      {/* Blue glow top */}
      <div style={{ position: "absolute", top: -200, left: "50%", transform: "translateX(-50%)", width: 800, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(74,142,194,0.06) 0%, transparent 60%)" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: mob ? "60px 20px 50px" : "100px 40px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: mob ? 40 : 60, alignItems: "center" }}>
          {/* Left — Copy */}
          <div>
            <div className="fis" style={{ animationDelay: "0.05s", display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 20, background: T.bgElevated, border: `1px solid ${T.border}`, marginBottom: 20 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.accent }} />
              <span style={{ color: T.textSecondary, fontSize: 11, fontWeight: 600, fontFamily: FB, textTransform: "uppercase", letterSpacing: "0.5px" }}>Property Management · New England</span>
            </div>
            <h1 className="fis" style={{ animationDelay: "0.1s", color: T.text, fontSize: mob ? 36 : 58, fontWeight: 700, letterSpacing: "-2px", lineHeight: 1.05, marginBottom: 22, fontFamily: FN }}>
              Built on{mob ? " " : <br />}<span style={{ fontFamily: SERIF, fontStyle: "italic", color: T.accent }}>trust.</span>{mob ? " " : <br />}Managed with care.
            </h1>
            <p className="fis" style={{ animationDelay: "0.2s", color: T.textSecondary, fontSize: mob ? 14 : 17, fontFamily: FB, lineHeight: 1.75, marginBottom: 32, maxWidth: 480 }}>
              MAC Development Co. provides residential property management and short-term rentals across Connecticut and New England. Secure online payments, 24/7 maintenance, and a dedicated resident portal.
            </p>
            <div className="fis" style={{ animationDelay: "0.3s", display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Btn onClick={() => setPage("portal")} style={{ padding: "14px 28px", fontSize: 15 }}>Resident Portal <ArrowRight size={16} /></Btn>
              <Btn variant="ghost" onClick={() => setPage("rentals")} style={{ padding: "14px 28px", fontSize: 15 }}>Book a Stay</Btn>
            </div>
            {/* Stats inline */}
            <div className="fis" style={{ animationDelay: "0.35s", display: "flex", gap: mob ? 20 : 32, marginTop: 36 }}>
              {[{ n: "4", l: "Properties" }, { n: "12+", l: "Years" }, { n: "98%", l: "Occupancy" }].map((s, i) => <div key={i}>
                <div style={{ color: T.text, fontSize: mob ? 24 : 32, fontWeight: 800, fontFamily: FN, letterSpacing: "-1px" }}>{s.n}</div>
                <div style={{ color: T.textMuted, fontSize: 10, fontWeight: 600, fontFamily: FB, textTransform: "uppercase", letterSpacing: "0.5px", marginTop: 2 }}>{s.l}</div>
              </div>)}
            </div>
          </div>

          {/* Right — Feature cards stack */}
          <div className="fis" style={{ animationDelay: "0.2s", display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { icon: Building, title: "Property Management", desc: "Full-service lease admin, inspections, move-in coordination, and compliance.", accent: T.accent },
              { icon: CreditCard, title: "Online Payments", desc: "Pay with credit card, ACH bank transfer, Zelle, or Venmo — all through Stripe.", accent: T.purple },
              { icon: BedDouble, title: "Short-Term Rentals", desc: "Furnished properties available for nightly or weekly stays with instant booking.", accent: T.orange },
              { icon: ShieldCheck, title: "Secure & Transparent", desc: "256-bit encryption, PCI-compliant payments, and a resident portal you can trust.", accent: T.textSecondary },
            ].map((c, i) => <div key={i} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, padding: mob ? 16 : 20, display: "flex", gap: 14, alignItems: "flex-start", transition: "border-color 0.2s" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${c.accent}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><c.icon size={18} color={c.accent} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ color: T.text, fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{c.title}</div>
                <div style={{ color: T.textMuted, fontSize: 12, fontFamily: FB, lineHeight: 1.5 }}>{c.desc}</div>
              </div>
              <ChevronRight size={14} color={T.textMuted} style={{ flexShrink: 0, marginTop: 4 }} />
            </div>)}
          </div>
        </div>
      </div>
    </section>

    {/* ── DIVIDER ── */}
    <div style={{ borderTop: `1px solid ${T.border}` }} />

    {/* ── CTA BAND ── */}
    <section style={{ background: T.bgCard }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "40px 20px" : "56px 40px", display: "flex", justifyContent: "space-between", alignItems: mob ? "flex-start" : "center", flexDirection: mob ? "column" : "row", gap: 20 }}>
        <div>
          <h2 style={{ color: T.text, fontSize: mob ? 20 : 26, fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 6 }}>Ready to find your next home?</h2>
          <p style={{ color: T.textMuted, fontSize: 14, fontFamily: FB }}>Browse available properties or submit an application today.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn onClick={() => setPage("properties")} style={{ padding: "12px 24px" }}>View Properties</Btn>
          <Btn variant="ghost" onClick={() => setPage("apply")} style={{ padding: "12px 24px" }}>Apply Now</Btn>
        </div>
      </div>
    </section>

    {/* ── PAYMENT METHODS ── */}
    <section style={{ background: T.bg }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "40px 20px" : "56px 40px", textAlign: "center" }}>
        <div style={{ color: T.textMuted, fontSize: 11, fontWeight: 600, fontFamily: FB, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 16 }}>Accepted Payment Methods</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
          {["Visa", "Mastercard", "Amex", "Discover", "ACH", "Zelle", "Venmo"].map(m =>
            <span key={m} style={{ padding: "6px 16px", borderRadius: 8, background: T.bgCard, border: `1px solid ${T.border}`, fontSize: 12, fontFamily: FB, fontWeight: 600, color: T.textSecondary }}>{m}</span>
          )}
        </div>
      </div>
    </section>

    <Footer setPage={setPage} mob={mob} />
  </div>;
}

/* ════════════ SERVICES (no payment info) ════════════ */
function ServicesPage({ setPage, mob }) {
  const items = [
    { icon: Building, title: "Property Management", pts: ["Lease administration & renewals", "Move-in / move-out coordination", "Property inspections & compliance"] },
    { icon: Wrench, title: "Maintenance & Repairs", pts: ["24/7 emergency response line", "Preventive maintenance programs", "Licensed contractor network"] },
    { icon: ShieldCheck, title: "Tenant Screening", pts: ["Embedded credit check via TransUnion SmartMove", "Criminal & eviction background checks", "Employment & landlord verification"] },
    { icon: BedDouble, title: "Short-Term Rental Management", pts: ["Fully managed vacation rentals", "Automated guest communication via SMS", "Calendar management & dynamic pricing"] },
  ];
  return <div style={{ background: T.bg, fontFamily: FN }}><section style={{ maxWidth: 1100, margin: "0 auto", padding: mob ? "50px 20px" : "80px 40px" }}><div style={{ textAlign: "center", marginBottom: 50 }}><h1 style={{ color: T.text, fontSize: mob ? 28 : 42, fontWeight: 700, letterSpacing: "-1px" }}>Our Services</h1><p style={{ color: T.textMuted, fontSize: 14, fontFamily: FB, marginTop: 10 }}>Complete property management across New England.</p></div><div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 20 }}>{items.map((item, i) => <div key={i} className="fis" style={{ animationDelay: `${i * 0.1}s`, background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 16, padding: mob ? 22 : 28 }}><div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}><div style={{ width: 52, height: 52, borderRadius: 14, background: T.accentDim, display: "flex", alignItems: "center", justifyContent: "center" }}><item.icon size={24} color={T.accent} /></div><h3 style={{ color: T.text, fontSize: 18, fontWeight: 700 }}>{item.title}</h3></div>{item.pts.map((pt, j) => <div key={j} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}><CheckCircle size={14} color={T.accent} style={{ flexShrink: 0 }} /><span style={{ color: T.textSecondary, fontSize: 13, fontFamily: FB }}>{pt}</span></div>)}</div>)}</div></section><Footer setPage={setPage} mob={mob} /></div>;
}

/* ════════════ OUR PROPERTIES PAGE ════════════ */
function PropertiesPage({ properties, strProps, setPage, mob }) {
  const [view, setView] = useState("ltr");
  return <div style={{ background: T.bg, fontFamily: FN }}>
    <section style={{ maxWidth: 1100, margin: "0 auto", padding: mob ? "40px 20px 80px" : "60px 40px 100px" }}>
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <h1 style={{ color: T.text, fontSize: mob ? 28 : 42, fontWeight: 700, letterSpacing: "-1px" }}>Our Properties</h1>
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 30 }}>
        <div style={{ display: "inline-flex", gap: 4, padding: 4, background: T.bgElevated, borderRadius: 12, border: `1px solid ${T.border}` }}>
          {[{ k: "ltr", l: "Long-Term Rentals" }, { k: "str", l: "Short-Term Stays" }].map(t =>
            <button key={t.k} onClick={() => setView(t.k)} style={{ padding: "10px 24px", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: FN, fontSize: 14, fontWeight: 700, background: view === t.k ? T.accent : "transparent", color: view === t.k ? "#fff" : T.textSecondary }}>{t.l}</button>
          )}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 20 }}>
        {view === "ltr" ? properties.map(p => <PropertyInfoCard key={p.id} prop={p} variant="ltr" mob={mob} />) : strProps.filter(p => p.active).map(p => <PropertyInfoCard key={p.id} prop={p} variant="str" mob={mob} />)}
      </div>
      <div style={{ textAlign: "center", marginTop: 30 }}>
        <Btn onClick={() => setPage(view === "ltr" ? "apply" : "rentals")} style={{ padding: "14px 32px", fontSize: 15 }}>
          {view === "ltr" ? "Apply Now" : "Book a Stay"} <ArrowRight size={16} />
        </Btn>
      </div>
    </section>
    <Footer setPage={setPage} mob={mob} />
  </div>;
}

/* ════════════ CONTACT (no phone/email public) ════════════ */
function ContactPage({ mob }) {
  const [sent, setSent] = useState(false);
  return <div style={{ background: T.bg, fontFamily: FN }}><section style={{ maxWidth: 700, margin: "0 auto", padding: mob ? "50px 20px 80px" : "80px 40px 100px" }}>
    <div style={{ textAlign: "center", marginBottom: 40 }}><h1 style={{ color: T.text, fontSize: mob ? 28 : 40, fontWeight: 700 }}>Get In Touch</h1><p style={{ color: T.textMuted, fontSize: 14, fontFamily: FB, marginTop: 8 }}>We'll respond within 24 hours.</p></div>
    <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 28 }}>{[{ icon: MapPin, l: "Location", v: "New England" }, { icon: Clock, l: "Hours", v: "Mon–Fri 8am–6pm" }].map((c, i) => <div key={i} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, padding: 18, display: "flex", gap: 14, alignItems: "center" }}><div style={{ width: 44, height: 44, borderRadius: 11, background: T.accentDim, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><c.icon size={20} color={T.accent} /></div><div><div style={{ color: T.textMuted, fontSize: 10, fontWeight: 600, fontFamily: FB, textTransform: "uppercase" }}>{c.l}</div><div style={{ color: T.text, fontSize: 14, fontWeight: 600, marginTop: 2 }}>{c.v}</div></div></div>)}</div>
    <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 18, padding: mob ? 22 : 28 }}>
      {sent ? <div style={{ textAlign: "center", padding: 40 }}><CheckCircle size={48} color={T.accent} style={{ marginBottom: 16 }} /><h3 style={{ color: T.text, fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Sent!</h3><p style={{ color: T.textMuted, fontFamily: FB, fontSize: 14 }}>We'll be in touch soon.</p></div>
      : <><div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: "0 16px" }}><Inp label="Name" dark placeholder="Your name" /><Inp label="Email" dark placeholder="you@email.com" /></div><Inp label="Subject" dark placeholder="What's this about?" /><div style={{ marginBottom: 16 }}><label style={{ display: "block", color: T.textMuted, fontSize: 11, fontWeight: 600, marginBottom: 6, fontFamily: FB, textTransform: "uppercase" }}>Message</label><textarea rows={4} placeholder="Your message..." style={{ width: "100%", padding: "12px 14px", border: `1px solid ${T.border}`, borderRadius: 10, background: T.bgElevated, color: T.text, fontFamily: FB, resize: "vertical", fontSize: 14 }} /></div><Btn onClick={() => setSent(true)} style={{ width: "100%", padding: 14 }}>Send <Send size={14} /></Btn></>}
    </div>
  </section></div>;
}

/* ════════════ APPLICATION — Official & Secure ════════════ */
function ApplicationPage({ mob, applications, setApplications }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", dob: "", ssn: "", driversLicense: "", currentAddress: "", currentLandlord: "", currentLandlordPhone: "", moveInDate: "", employer: "", jobTitle: "", annualIncome: "", ref1Name: "", ref1Phone: "", ref1Relation: "", ref2Name: "", ref2Phone: "", ref2Relation: "", pets: "no", petDetails: "", criminalHistory: "no", evictionHistory: "no", desiredProperty: "", occupants: "1" });
  const [creditConsent, setCreditConsent] = useState(false);
  const [creditProgress, setCreditProgress] = useState(0);
  const u = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const Fi = props => <Inp dark {...props} value={form[props.name] || ""} onChange={e => u(props.name, e.target.value)} />;

  const startCredit = () => {
    setCreditProgress(0);
    const iv = setInterval(() => {
      setCreditProgress(prev => { if (prev >= 100) { clearInterval(iv); setTimeout(() => setStep(3), 600); return 100; } return prev + Math.random() * 12 + 4; });
    }, 500);
  };
  const submitApp = () => {
    setApplications(prev => [...prev, { id: Date.now(), ...form, status: "pending", creditScore: Math.floor(Math.random() * 200) + 600, creditStatus: "completed", submittedDate: td(), applicationFee: 35 }]);
    setStep(4);
  };

  const securityBanner = <div style={{ background: `linear-gradient(135deg, ${T.accentDim}, rgba(91,155,213,0.06))`, border: `1px solid ${T.accentBorder}`, borderRadius: 14, padding: 18, marginBottom: 24 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}><div style={{ width: 40, height: 40, borderRadius: 10, background: T.accentDim, display: "flex", alignItems: "center", justifyContent: "center" }}><Lock size={18} color={T.accent} /></div><div><div style={{ color: T.text, fontSize: 14, fontWeight: 700 }}>Your Information Is Protected</div><div style={{ color: T.textMuted, fontSize: 11, fontFamily: FB }}>Bank-level security throughout the process</div></div></div>
    <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr 1fr", gap: 8 }}>
      {[{ i: Lock, l: "256-bit SSL Encryption" }, { i: ShieldCheck, l: "PCI DSS Level 1 Compliant" }, { i: Fingerprint, l: "Data Never Sold or Shared" }].map((s, j) => <div key={j} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", borderRadius: 8, background: "rgba(61,191,160,0.06)" }}><s.i size={12} color={T.accent} /><span style={{ color: T.textSecondary, fontSize: 10, fontFamily: FB }}>{s.l}</span></div>)}
    </div>
  </div>;

  if (step === 4) return <div style={{ background: T.bg, fontFamily: FN, minHeight: "80vh" }}><section style={{ maxWidth: 600, margin: "0 auto", padding: mob ? "60px 20px" : "100px 40px", textAlign: "center" }}><div style={{ width: 64, height: 64, borderRadius: 16, background: T.greenDim, border: `1px solid ${T.greenBorder}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}><CheckCircle size={32} color={T.accent} /></div><h2 style={{ color: T.text, fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Application Submitted</h2><p style={{ color: T.textMuted, fontSize: 14, fontFamily: FB, lineHeight: 1.6 }}>Your application, credit check, and $35 fee have been processed. We will contact you within 2–3 business days at {form.email}.</p>
    <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, padding: 20, marginTop: 20, textAlign: "left" }}><h4 style={{ color: T.text, fontSize: 13, fontWeight: 700, marginBottom: 10 }}>What Happens Next</h4>{["Credit & background report reviewed by management", "Employment & landlord references verified", "Decision emailed within 2–3 business days", "If approved: lease signing & deposit collection"].map((s, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0" }}><CheckCircle size={12} color={T.accent} /><span style={{ color: T.textSecondary, fontSize: 12, fontFamily: FB }}>{s}</span></div>)}</div>
    {securityBanner}
  </section></div>;

  return <div style={{ background: T.bg, fontFamily: FN }}><section style={{ maxWidth: 720, margin: "0 auto", padding: mob ? "40px 20px 80px" : "60px 40px 100px" }}>
    <div style={{ textAlign: "center", marginBottom: 24 }}>
      <div style={{ width: 60, height: 60, borderRadius: 16, background: T.accentDim, border: `1px solid ${T.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}><ClipboardList size={28} color={T.accent} /></div>
      <h1 style={{ color: T.text, fontSize: mob ? 24 : 34, fontWeight: 700, letterSpacing: "-0.5px" }}>Rental Application</h1>
      <p style={{ color: T.textMuted, fontSize: 13, fontFamily: FB, marginTop: 6 }}>All information is encrypted and handled with strict confidentiality.</p>
    </div>

    {/* Steps indicator */}
    <div style={{ display: "flex", justifyContent: "center", gap: 0, marginBottom: 28 }}>
      {[{ n: 1, l: "Application" }, { n: 2, l: "Credit Screening" }, { n: 3, l: "Payment" }].map((s, i) => <div key={s.n} style={{ display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, fontFamily: FN, background: step >= s.n ? T.accent : T.bgElevated, color: step >= s.n ? "#fff" : T.textMuted, border: `2px solid ${step >= s.n ? T.accent : T.border}`, transition: "all .3s" }}>{step > s.n ? <Check size={14} /> : s.n}</div>
          <span style={{ color: step >= s.n ? T.text : T.textMuted, fontSize: 10, fontWeight: 600, fontFamily: FB }}>{s.l}</span>
        </div>
        {i < 2 && <div style={{ width: mob ? 30 : 60, height: 2, background: step > s.n ? T.accent : T.border, marginBottom: 16, marginLeft: 4, marginRight: 4, borderRadius: 1 }} />}
      </div>)}
    </div>

    {securityBanner}

    {step === 1 && <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 20, padding: mob ? 20 : 30 }}>
      <h3 style={{ color: T.text, fontSize: 16, fontWeight: 700, marginBottom: 16, paddingBottom: 10, borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 8 }}><User size={16} color={T.accent} /> Personal Information</h3>
      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: "0 16px" }}><Fi name="firstName" label="First Name" placeholder="John" /><Fi name="lastName" label="Last Name" placeholder="Doe" /><Fi name="email" label="Email" type="email" placeholder="john@email.com" /><Fi name="phone" label="Phone" type="tel" placeholder="(555) 123-4567" /><Fi name="dob" label="Date of Birth" type="date" /><Fi name="ssn" label="Social Security #" placeholder="XXX-XX-XXXX" /></div>
      <div style={{ background: T.bgElevated, border: `1px solid ${T.border}`, borderRadius: 8, padding: 10, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}><Lock size={12} color={T.accent} /><span style={{ color: T.textMuted, fontSize: 10, fontFamily: FB }}>Your SSN is encrypted end-to-end and used only for credit screening. It is never stored on our servers.</span></div>

      <h3 style={{ color: T.text, fontSize: 16, fontWeight: 700, marginBottom: 16, marginTop: 20, paddingBottom: 10, borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 8 }}><Building size={16} color={T.accent} /> Property & Residence</h3>
      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: "0 16px" }}><Fi name="desiredProperty" label="Desired Property" placeholder="e.g. 142 Oak Street" /><Fi name="moveInDate" label="Move-In Date" type="date" /></div>
      <Fi name="currentAddress" label="Current Address" placeholder="123 Main St, City, ST, Zip" />
      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: "0 16px" }}><Fi name="currentLandlord" label="Current Landlord" /><Fi name="currentLandlordPhone" label="Landlord Phone" /></div>

      <h3 style={{ color: T.text, fontSize: 16, fontWeight: 700, marginBottom: 16, marginTop: 20, paddingBottom: 10, borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 8 }}><DollarSign size={16} color={T.accent} /> Employment</h3>
      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: "0 16px" }}><Fi name="employer" label="Employer" /><Fi name="jobTitle" label="Title" /><Fi name="annualIncome" label="Annual Income" type="number" /></div>

      <h3 style={{ color: T.text, fontSize: 16, fontWeight: 700, marginBottom: 16, marginTop: 20, paddingBottom: 10, borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 8 }}><Users size={16} color={T.accent} /> References</h3>
      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr 1fr", gap: "0 12px" }}><Fi name="ref1Name" label="Reference 1" /><Fi name="ref1Phone" label="Phone" /><Fi name="ref1Relation" label="Relation" /></div>
      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr 1fr", gap: "0 12px" }}><Fi name="ref2Name" label="Reference 2" /><Fi name="ref2Phone" label="Phone" /><Fi name="ref2Relation" label="Relation" /></div>

      <h3 style={{ color: T.text, fontSize: 16, fontWeight: 700, marginBottom: 16, marginTop: 20, paddingBottom: 10, borderBottom: `1px solid ${T.border}` }}>Additional</h3>
      <Toggle options={[{ value: "no", label: "No Pets" }, { value: "yes", label: "Has Pets" }]} value={form.pets} onChange={v => u("pets", v)} />
      <Toggle options={[{ value: "no", label: "No Criminal History" }, { value: "yes", label: "Has History" }]} value={form.criminalHistory} onChange={v => u("criminalHistory", v)} />
      <Toggle options={[{ value: "no", label: "No Prior Evictions" }, { value: "yes", label: "Has Prior Eviction" }]} value={form.evictionHistory} onChange={v => u("evictionHistory", v)} />

      <Btn onClick={() => setStep(2)} style={{ width: "100%", padding: 14, fontSize: 15, marginTop: 8 }}>Continue to Screening <ArrowRight size={16} /></Btn>
    </div>}

    {step === 2 && <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 20, padding: mob ? 20 : 30 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: T.purpleDim, display: "flex", alignItems: "center", justifyContent: "center" }}><Activity size={24} color={T.purple} /></div>
        <div><h3 style={{ color: T.text, fontSize: 18, fontWeight: 700, margin: 0 }}>Credit & Background Screening</h3><p style={{ color: T.textMuted, fontSize: 12, fontFamily: FB, margin: 0 }}>Powered by TransUnion SmartMove®</p></div>
      </div>

      <div style={{ background: T.bgElevated, border: `1px solid ${T.border}`, borderRadius: 14, padding: 20, marginBottom: 20 }}>
        <h4 style={{ color: T.text, fontSize: 14, fontWeight: 700, marginBottom: 12 }}>This screening includes:</h4>
        {["Full TransUnion credit report & score (soft pull — no impact to your credit)", "Nationwide criminal background search (all 50 states)", "National eviction records database", "OFAC / terrorist watchlist verification", "Income & employment insights report"].map((s, i) => <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "6px 0" }}><CheckCircle size={14} color={T.accent} style={{ flexShrink: 0, marginTop: 1 }} /><span style={{ color: T.textSecondary, fontSize: 12, fontFamily: FB, lineHeight: 1.5 }}>{s}</span></div>)}
      </div>

      <div style={{ background: T.bgElevated, border: `1px solid ${T.border}`, borderRadius: 14, padding: 18, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}><ShieldCheck size={16} color={T.accent} /><span style={{ color: T.text, fontSize: 13, fontWeight: 700 }}>Legal Authorization & Consent</span></div>
        <p style={{ color: T.textMuted, fontSize: 11, fontFamily: FB, lineHeight: 1.7 }}>By authorizing this screening, I, <strong style={{ color: T.text }}>{form.firstName} {form.lastName}</strong>, consent to MAC Development Co. obtaining my consumer credit report, criminal background check, and eviction history through TransUnion SmartMove® for the sole purpose of evaluating my rental application. This is a <strong style={{ color: T.accent }}>soft inquiry</strong> and will <strong style={{ color: T.accent }}>not affect my credit score</strong>. My personal information is protected under the Fair Credit Reporting Act (FCRA) and encrypted using 256-bit AES encryption. The $35 screening fee is non-refundable.</p>
      </div>

      <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer", marginBottom: 24, padding: 16, borderRadius: 12, background: creditConsent ? T.accentDim : T.bgElevated, border: `1px solid ${creditConsent ? T.accentBorder : T.border}`, transition: "all .2s" }}>
        <input type="checkbox" checked={creditConsent} onChange={e => setCreditConsent(e.target.checked)} style={{ marginTop: 3, width: 20, height: 20, accentColor: T.accent }} />
        <span style={{ color: T.text, fontSize: 13, fontFamily: FB, lineHeight: 1.6 }}>I authorize MAC Development Co. to run a credit and background check using my Social Security Number through TransUnion SmartMove®. I understand this is a soft inquiry that will not impact my credit score, and that the $35 fee is non-refundable.</span>
      </label>

      {creditProgress > 0 && creditProgress < 100 && <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><span style={{ color: T.text, fontSize: 13, fontWeight: 600 }}>Running screening...</span><span style={{ color: T.accent, fontSize: 13, fontWeight: 700 }}>{Math.min(Math.round(creditProgress), 100)}%</span></div>
        <div style={{ height: 8, borderRadius: 4, background: T.bgElevated, overflow: "hidden" }}><div style={{ height: "100%", width: `${Math.min(creditProgress, 100)}%`, background: `linear-gradient(90deg, ${T.accent}, #7CA8D0)`, borderRadius: 4, transition: "width 0.4s" }} /></div>
        <div style={{ color: T.textMuted, fontSize: 11, fontFamily: FB, marginTop: 8 }}>{creditProgress < 25 ? "🔐 Verifying identity..." : creditProgress < 50 ? "📊 Pulling credit report..." : creditProgress < 75 ? "🔍 Searching criminal & eviction records..." : "✅ Compiling report..."}</div>
      </div>}

      {creditProgress >= 100 && <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", background: T.greenDim, border: `1px solid ${T.greenBorder}`, borderRadius: 12, marginBottom: 20 }}><CheckCircle size={18} color={T.accent} /><span style={{ color: T.accent, fontSize: 14, fontWeight: 700 }}>Screening complete — report delivered to management.</span></div>}

      <div style={{ display: "flex", gap: 8 }}>
        <Btn variant="ghost" onClick={() => setStep(1)} style={{ flex: 1 }}>Back</Btn>
        <Btn variant="purple" onClick={startCredit} disabled={!creditConsent || creditProgress > 0} style={{ flex: 2, padding: 14 }}><Activity size={14} /> {creditProgress > 0 ? "Processing..." : "Authorize & Run Screening"}</Btn>
      </div>
    </div>}

    {step === 3 && <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 20, padding: mob ? 20 : 30 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", background: T.greenDim, border: `1px solid ${T.greenBorder}`, borderRadius: 12, marginBottom: 20 }}><CheckCircle size={16} color={T.accent} /><span style={{ color: T.accent, fontSize: 13, fontWeight: 600 }}>Screening complete — report delivered securely</span></div>
      <h3 style={{ color: T.text, fontSize: 18, fontWeight: 700, marginBottom: 18 }}>Application Fee — $35.00</h3>
      <div style={{ background: T.bgElevated, border: `1px solid ${T.border}`, borderRadius: 12, padding: 16, marginBottom: 20 }}>
        {[["Application & screening fee", "$35.00"], ["Credit processing fee (2.9% + $0.30)", "$1.32"], ["Total", "$36.32"]].map(([l, v], i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderTop: i === 2 ? `1px solid ${T.border}` : "none", marginTop: i === 2 ? 8 : 0, paddingTop: i === 2 ? 8 : 5 }}><span style={{ color: i === 2 ? T.text : T.textMuted, fontSize: i === 2 ? 14 : 12, fontWeight: i === 2 ? 700 : 400, fontFamily: FB }}>{l}</span><span style={{ color: i === 2 ? T.accent : T.text, fontSize: i === 2 ? 18 : 12, fontWeight: i === 2 ? 800 : 600 }}>{v}</span></div>)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginBottom: 16 }}><Lock size={13} color={T.accent} /><span style={{ color: T.textMuted, fontSize: 11, fontFamily: FB }}>Payment secured by Stripe · PCI Level 1 · 256-bit encryption</span></div>
      <Btn variant="purple" onClick={submitApp} style={{ width: "100%", padding: 14, fontSize: 15 }}><CreditCard size={16} /> Pay $36.32 & Submit Application</Btn>
    </div>}
  </section></div>;
}

/* ════════════ STR CALENDAR ════════════ */
function STRCal({ property, selIn, selOut, onSelect, mob }) {
  const [mo, setMo] = useState(0); const bd = new Date(); bd.setMonth(bd.getMonth() + mo);
  const yr = bd.getFullYear(), mn = bd.getMonth(), fd = new Date(yr, mn, 1).getDay(), dim = new Date(yr, mn + 1, 0).getDate();
  const mn2 = new Date(yr, mn).toLocaleString("default", { month: "long", year: "numeric" });
  const bk = new Set(); (property.bookings || []).forEach(b => { if (b.status === "confirmed" || b.status === "upcoming") { let d = new Date(b.checkIn); const e = new Date(b.checkOut); while (d < e) { bk.add(d.toISOString().split("T")[0]); d.setDate(d.getDate() + 1); } } });
  const tdy = td(); const days = []; for (let i = 0; i < fd; i++) days.push(null); for (let d = 1; d <= dim; d++) days.push(d);
  const hc = day => { if (!day) return; const ds = `${yr}-${String(mn + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`; if (ds < tdy || bk.has(ds)) return; if (!selIn || (selIn && selOut)) { onSelect(ds, null); } else { if (ds <= selIn) { onSelect(ds, null); return; } let d = new Date(selIn); const e = new Date(ds); let bl = false; while (d <= e) { if (bk.has(d.toISOString().split("T")[0])) { bl = true; break; } d.setDate(d.getDate() + 1); } if (bl) { onSelect(ds, null); return; } onSelect(selIn, ds); } };
  return <div><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><button onClick={() => setMo(m => m - 1)} style={{ background: T.bgElevated, border: `1px solid ${T.border}`, borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: T.textSecondary }}><ChevronLeft size={16} /></button><span style={{ color: T.text, fontSize: 14, fontWeight: 700 }}>{mn2}</span><button onClick={() => setMo(m => m + 1)} style={{ background: T.bgElevated, border: `1px solid ${T.border}`, borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: T.textSecondary }}><ChevronRight size={16} /></button></div><div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, textAlign: "center" }}>{["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => <div key={d} style={{ color: T.textMuted, fontSize: 10, fontWeight: 600, fontFamily: FB, padding: 6 }}>{d}</div>)}{days.map((day, i) => { if (!day) return <div key={`e${i}`} />; const ds = `${yr}-${String(mn + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`; const ip = ds < tdy, ib = bk.has(ds), is1 = ds === selIn, is2 = ds === selOut, ir = selIn && selOut && ds > selIn && ds < selOut, dis = ip || ib; return <button key={i} onClick={() => hc(day)} disabled={dis} style={{ padding: mob ? 6 : 8, border: "none", borderRadius: 6, cursor: dis ? "default" : "pointer", fontSize: 12, fontWeight: (is1 || is2) ? 700 : 500, fontFamily: FB, background: (is1 || is2) ? T.accent : ir ? T.accentDim : ib ? T.redDim : "transparent", color: (is1 || is2) ? "#fff" : ib ? T.red : ip ? T.textMuted + "55" : T.text, opacity: ip ? 0.4 : 1, textDecoration: ib ? "line-through" : "none" }}>{day}</button>; })}</div></div>;
}

/* ════════════ STR PUBLIC PAGE ════════════ */
function STRPage({ strProps, setStrProps, setPage, mob }) {
  const [selP, setSelP] = useState(null); const [ci, setCi] = useState(null); const [co, setCo] = useState(null);
  const [bf, setBf] = useState({ firstName: "", lastName: "", email: "", phone: "", guests: "1" });
  const [pm, setPm] = useState("card"); const [bStep, setBStep] = useState("browse"); const [cc, setCc] = useState("");
  const prop = selP ? strProps.find(p => p.id === selP) : null;
  const nts = (ci && co) ? nightsB(ci, co) : 0; const sub = prop ? nts * prop.nightlyRate : 0; const cl = prop ? prop.cleaningFee : 0;
  const fee = calcFee(sub + cl, pm); const total = sub + cl + fee;
  const book = () => { const code = genCode(prop.code); setCc(code); const nb = { id: `BK${Date.now()}`, guestFirst: bf.firstName, guestLast: bf.lastName, email: bf.email, phone: bf.phone, confirmCode: code, checkIn: ci, checkOut: co, guests: parseInt(bf.guests), totalCost: Math.round(total * 100) / 100, status: "upcoming", paidAmount: Math.round(total * 100) / 100, payMethod: pm, created: td(), smsLog: [{ id: Date.now(), type: "booking_confirm", text: SMST.booking_confirm(prop.name, code, fmtD(ci)), date: td(), status: "delivered" }] }; setStrProps(prev => prev.map(p => p.id === prop.id ? { ...p, bookings: [...(p.bookings || []), nb] } : p)); setBStep("done"); };

  if (bStep === "done") return <div style={{ background: T.bg, fontFamily: FN, minHeight: "80vh" }}><section style={{ maxWidth: 560, margin: "0 auto", padding: mob ? "60px 20px" : "100px 40px", textAlign: "center" }}><CheckCircle size={48} color={T.accent} style={{ marginBottom: 16 }} /><h2 style={{ color: T.text, fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Booking Confirmed!</h2><p style={{ color: T.textMuted, fontSize: 14, fontFamily: FB, marginBottom: 20 }}>Confirmation texted to {bf.phone} from {BIZ_PHONE}.</p><div style={{ background: T.orangeDim, border: `1px solid ${T.orangeBorder}`, borderRadius: 14, padding: 20, marginBottom: 24 }}><div style={{ color: T.textMuted, fontSize: 10, fontFamily: FB, textTransform: "uppercase", marginBottom: 4 }}>Confirmation Code</div><div style={{ color: T.orange, fontSize: 28, fontWeight: 800, fontFamily: FN, letterSpacing: "2px" }}>{cc}</div><div style={{ color: T.textMuted, fontSize: 11, fontFamily: FB, marginTop: 6 }}>Use this + last name for guest portal</div></div><Btn onClick={() => { setBStep("browse"); setSelP(null); setCi(null); setCo(null); }}>Browse More</Btn></section></div>;

  return <div style={{ background: T.bg, fontFamily: FN }}><section style={{ maxWidth: 1100, margin: "0 auto", padding: mob ? "40px 20px 80px" : "60px 40px 100px" }}>
    <div style={{ textAlign: "center", marginBottom: 30 }}><h1 style={{ color: T.text, fontSize: mob ? 26 : 36, fontWeight: 700 }}>Book Your Stay</h1></div>
    {bStep === "browse" && <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 20 }}>{strProps.filter(p => p.active).map(p => <div key={p.id}><PropertyInfoCard prop={p} variant="str" mob={mob} /><Btn variant="orange" onClick={() => { setSelP(p.id); setBStep("details"); }} style={{ width: "100%", padding: 12, marginTop: -1, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>Check Availability <CalendarDays size={14} /></Btn></div>)}</div>}
    {bStep === "details" && prop && <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 24 }}>
      <div><Card title={prop.name} icon={CalendarDays}><STRCal property={prop} selIn={ci} selOut={co} onSelect={(a, b) => { setCi(a); setCo(b); }} mob={mob} /></Card><Btn variant="ghost" onClick={() => { setBStep("browse"); setSelP(null); setCi(null); setCo(null); }} style={{ width: "100%" }}><ChevronLeft size={14} /> Back</Btn></div>
      <Card title="Guest Details"><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}><Inp dark label="First Name" value={bf.firstName} onChange={e => setBf(f => ({ ...f, firstName: e.target.value }))} /><Inp dark label="Last Name" value={bf.lastName} onChange={e => setBf(f => ({ ...f, lastName: e.target.value }))} /></div><Inp dark label="Email" type="email" value={bf.email} onChange={e => setBf(f => ({ ...f, email: e.target.value }))} /><Inp dark label="Phone (for texts)" type="tel" value={bf.phone} onChange={e => setBf(f => ({ ...f, phone: e.target.value }))} /><Inp dark label="Guests" type="number" min="1" max={prop.maxGuests} value={bf.guests} onChange={e => setBf(f => ({ ...f, guests: e.target.value }))} /><PayPicker selected={pm} onSelect={setPm} amount={sub + cl} compact /><Btn variant="orange" onClick={book} disabled={!ci || !co || !bf.firstName || !bf.lastName || !bf.email || !bf.phone} style={{ width: "100%", padding: 14, marginTop: 12 }}><CreditCard size={14} /> Book {ci && co ? fmt(total) : ""}</Btn></Card>
    </div>}
  </section><Footer setPage={setPage} mob={mob} /></div>;
}

/* ════════════ PORTAL LOGIN — no admin toggle ════════════ */
function PortalLogin({ onLogin, onRegister, onSTRLogin, allData, properties, setPage }) {
  const mob = useIsMobile();
  const [mode, setMode] = useState("login"); const [un, setUn] = useState(""); const [pw, setPw] = useState(""); const [sp, setSp] = useState(false);
  const [err, setErr] = useState(""); const [suc, setSuc] = useState("");
  const [rc, setRc] = useState(""); const [ru, setRu] = useState(""); const [rp, setRp] = useState(""); const [rpc, setRpc] = useState("");
  const [sc, setSc2] = useState(""); const [sl, setSl] = useState("");
  const sub = e => { e.preventDefault(); setErr(""); const r = onLogin(un, pw); if (r) setErr(r); };
  const reg = e => { e.preventDefault(); setErr(""); if (!rc || !ru || !rp) { setErr("All fields required"); return; } if (rp !== rpc) { setErr("Passwords don't match"); return; } const p = properties.find(p => p.code.toLowerCase() === rc.trim().toLowerCase()); if (!p) { setErr("Invalid house code"); return; } onRegister(p.id, ru.trim(), rp); setSuc("Account created."); setMode("login"); setUn(ru.trim()); };
  const strL = e => { e.preventDefault(); setErr(""); if (!sc || !sl) { setErr("Both fields required"); return; } const r = onSTRLogin(sc.trim().toUpperCase(), sl.trim()); if (r) setErr(r); };
  return <div style={{ maxWidth: 420, margin: "0 auto", padding: mob ? "40px 20px 80px" : "60px 20px 100px" }}>
    <div style={{ textAlign: "center", marginBottom: 32 }}><MacDevLogo size={52} /><h2 style={{ color: T.text, fontSize: 24, fontWeight: 700, marginTop: 16, marginBottom: 6, letterSpacing: "-0.5px" }}>Welcome</h2></div>
    <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 20, padding: mob ? 22 : 30 }}>
      <div style={{ display: "flex", gap: 0, marginBottom: 24, background: T.bgElevated, borderRadius: 10, padding: 3, border: `1px solid ${T.border}` }}>
        {[{ v: "login", l: "Sign In" }, { v: "register", l: "Register" }, { v: "str", l: "Guest" }].map(({ v, l }) => <button key={v} onClick={() => { setMode(v); setErr(""); setSuc(""); }} style={{ flex: 1, padding: "10px 8px", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: FN, background: mode === v ? (v === "str" ? T.orange : T.accent) : "transparent", color: mode === v ? "#fff" : T.textMuted }}>{l}</button>)}
      </div>

      {mode === "login" && <form onSubmit={sub}>
        <Inp dark label="Username" value={un} onChange={e => { setUn(e.target.value); setErr(""); }} placeholder="Your username" />
        <div style={{ position: "relative", marginBottom: 16 }}><Inp dark label="Password" type={sp ? "text" : "password"} value={pw} onChange={e => { setPw(e.target.value); setErr(""); }} style={{ marginBottom: 0 }} /><button type="button" onClick={() => setSp(!sp)} style={{ position: "absolute", right: 12, top: 34, background: "none", border: "none", cursor: "pointer", color: T.textMuted }}>{sp ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>
        <div style={{ background: T.bgElevated, border: `1px solid ${T.border}`, borderRadius: 8, padding: 10, marginBottom: 16 }}><p style={{ color: T.textMuted, fontSize: 11, fontFamily: FB }}>Demo: <strong style={{ color: T.accent }}>demo</strong> / <strong style={{ color: T.accent }}>demo123</strong> — or use your property login</p></div>
        {err && <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 12px", background: T.redDim, border: `1px solid ${T.redBorder}`, borderRadius: 8, marginBottom: 16 }}><AlertCircle size={14} color={T.red} /><span style={{ color: T.red, fontSize: 12, fontFamily: FB }}>{err}</span></div>}
        {suc && <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 12px", background: T.greenDim, border: `1px solid ${T.greenBorder}`, borderRadius: 8, marginBottom: 16 }}><CheckCircle size={14} color={T.accent} /><span style={{ color: T.accent, fontSize: 12, fontFamily: FB }}>{suc}</span></div>}
        <Btn type="submit" style={{ width: "100%", padding: 14 }}>Sign In</Btn>
      </form>}

      {mode === "register" && <form onSubmit={reg}><Inp dark label="House Code" value={rc} onChange={e => setRc(e.target.value)} placeholder="e.g. 142" /><Inp dark label="Username" value={ru} onChange={e => setRu(e.target.value)} /><Inp dark label="Password" type="password" value={rp} onChange={e => setRp(e.target.value)} /><Inp dark label="Confirm" type="password" value={rpc} onChange={e => setRpc(e.target.value)} />{err && <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 12px", background: T.redDim, border: `1px solid ${T.redBorder}`, borderRadius: 8, marginBottom: 16 }}><AlertCircle size={14} color={T.red} /><span style={{ color: T.red, fontSize: 12, fontFamily: FB }}>{err}</span></div>}<Btn type="submit" style={{ width: "100%", padding: 14 }}>Create Account</Btn></form>}

      {mode === "str" && <form onSubmit={strL}><div style={{ background: T.orangeDim, border: `1px solid ${T.orangeBorder}`, borderRadius: 10, padding: 14, marginBottom: 20 }}><p style={{ color: T.orange, fontSize: 12, fontFamily: FB }}>Enter your confirmation code + last name.</p></div><Inp dark label="Confirmation Code" value={sc} onChange={e => { setSc2(e.target.value); setErr(""); }} placeholder="e.g. LAKE-7842" /><Inp dark label="Last Name" value={sl} onChange={e => { setSl(e.target.value); setErr(""); }} />{err && <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 12px", background: T.redDim, border: `1px solid ${T.redBorder}`, borderRadius: 8, marginBottom: 16 }}><AlertCircle size={14} color={T.red} /><span style={{ color: T.red, fontSize: 12, fontFamily: FB }}>{err}</span></div>}<Btn variant="orange" type="submit" style={{ width: "100%", padding: 14 }}>Guest Portal <LogIn size={14} /></Btn></form>}
    </div>
  </div>;
}

/* ════════════ RESIDENT DASHBOARD ════════════ */
function ResidentDash({ propertyId, data, allData, setAllData, properties }) {
  const mob = useIsMobile(); const [tab, setTab] = useState("overview"); const [newMsg, setNewMsg] = useState("");
  const [payModal, setPayModal] = useState(false); const [autopayModal, setAutopayModal] = useState(false);
  const [payAmt, setPayAmt] = useState(""); const [payMethod, setPayMethod] = useState("card"); const [payFor, setPayFor] = useState("Rent");
  const [autopayDay, setAutopayDay] = useState(data.autopayDay || 1);
  const [newUser, setNewUser] = useState(data.login); const [newPass, setNewPass] = useState(""); const [acctMsg, setAcctMsg] = useState("");
  const msgRef = useRef(null);
  const prop = properties.find(p => p.id === propertyId);
  const totalUtils = Object.values(data.utilities).reduce((a, b) => a + Math.max(b, 0), 0);
  const lateFees = calcLate(data.balance, data.rentDueDay || 1);
  const depInfo = calcDep(data.securityDeposit, data.depositStartDate, data.depositEndDate);
  const totalOwed = Math.max(data.balance, 0) + totalUtils + lateFees;
  const unread = data.messages.filter(m => m.from === "admin" && !m.read).length;
  const upd = fn => { const u = { ...allData }; const p = { ...u[propertyId] }; fn(p); u[propertyId] = p; setAllData(u); };
  const handlePay = () => { const a = parseFloat(payAmt); if (isNaN(a) || a <= 0) return; const fee = calcFee(a, payMethod); const ml = payMethod === "card" ? "Card (Stripe)" : payMethod === "ach" ? "ACH (Stripe)" : payMethod; upd(p => { p.payments = [{ id: Date.now(), date: td(), amount: a, method: ml, type: payFor, status: payMethod === "card" ? "Cleared" : "Processing", fee }, ...p.payments]; if (payFor === "Rent") p.balance = Math.max(0, p.balance - a); else { const k = UTILS.find(ut => ut.label === payFor)?.key; if (k) p.utilities = { ...p.utilities, [k]: Math.max(0, p.utilities[k] - a) }; } }); setPayAmt(""); setPayModal(false); };
  const toggleAP = () => { upd(p => { p.autopay = !p.autopay; if (p.autopay) { p.autopayMethod = payMethod; p.autopayDay = autopayDay; } }); setAutopayModal(false); };
  const sendMsg = () => { if (!newMsg.trim()) return; upd(p => { p.messages = [...p.messages, { id: Date.now(), from: "resident", text: newMsg.trim(), date: td(), read: true }]; }); setNewMsg(""); };
  const saveAccount = () => { setAcctMsg(""); if (newUser.length < 3) { setAcctMsg("Min 3 chars"); return; } upd(p => { p.login = newUser; if (newPass.length >= 6) p.password = newPass; }); setAcctMsg("Updated!"); };
  useEffect(() => { if (tab === "messages" && msgRef.current) msgRef.current.scrollTop = msgRef.current.scrollHeight; }, [tab, data.messages.length]);
  useEffect(() => { if (tab === "messages") upd(p => { p.messages = p.messages.map(m => m.from === "admin" ? { ...m, read: true } : m); }); }, [tab]);

  const sections = ["overview", "payments", "utilities", "files", "messages", "account"];
  const secIcons = { overview: LayoutDashboard, payments: Receipt, utilities: Zap, files: FolderOpen, messages: MessageSquare, account: Settings };
  const secLabels = { overview: "Overview", payments: "Payments", utilities: "Utilities", files: "Files", messages: `Messages${unread ? ` (${unread})` : ""}`, account: "Account" };
  const pad = mob ? 16 : 28;

  return <div style={{ fontFamily: FN, overflowX: "hidden" }}>
    {/* Horizontal pill nav */}
    <div style={{ padding: `12px ${pad}px`, borderBottom: `1px solid ${T.border}`, background: T.bgCard }}>
      <div className="nav-scroll" style={{ gap: 6 }}>
        {sections.map(s => { const I = secIcons[s]; return <button key={s} onClick={() => setTab(s)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", border: "none", borderRadius: 20, cursor: "pointer", fontFamily: FB, fontSize: 12, fontWeight: 600, background: tab === s ? T.accent : T.bgElevated, color: tab === s ? "#fff" : T.textMuted, whiteSpace: "nowrap", transition: "all .2s" }}><I size={13} />{secLabels[s]}</button>; })}
      </div>
    </div>

    <main style={{ padding: pad, maxWidth: 1000, margin: "0 auto" }}>
      {tab === "overview" && <>
        {/* Private contact — residents only */}
        <div style={{ background: T.accentDim, border: `1px solid ${T.accentBorder}`, borderRadius: 12, padding: 14, marginBottom: 16, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}><Phone size={14} color={T.accent} /><span style={{ color: T.accent, fontSize: 13, fontFamily: FB, fontWeight: 600 }}>{BIZ_PHONE}</span><span style={{ color: T.border }}>·</span><Mail size={14} color={T.accent} /><span style={{ color: T.accent, fontSize: 13, fontFamily: FB, fontWeight: 600 }}>info@macdevelopmentco.com</span></div>
        <div className="mgrid" style={{ marginBottom: 16 }}><Metric icon={DollarSign} label="Rent Balance" value={fmt(data.balance)} mob={mob} variant={data.balance > 0 ? "danger" : "success"} sub={data.balance > 0 ? `Due the ${ord(data.rentDueDay || 1)}` : "Paid"} /><Metric icon={Shield} label="Deposit + Interest" value={fmt(depInfo.total)} mob={mob} variant="accent" sub={`+${fmt(depInfo.interest)} @ 1.5%/yr`} /><Metric icon={TrendingUp} label="Total Due" value={fmt(totalOwed)} sub={lateFees > 0 ? `Incl. ${fmt(lateFees)} late fees` : ""} mob={mob} variant={totalOwed > 0 ? "danger" : "success"} /></div>
        {lateFees > 0 && <div style={{ background: T.redDim, border: `1px solid ${T.redBorder}`, borderRadius: 12, padding: 14, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}><AlertCircle size={16} color={T.red} /><div><div style={{ color: T.red, fontSize: 12, fontWeight: 700 }}>Late Fee: {fmt(lateFees)}</div><div style={{ color: T.textMuted, fontSize: 10, fontFamily: FB }}>$5/day for overdue rent</div></div></div>}
        <div style={{ background: data.autopay ? T.greenDim : T.redDim, border: `1px solid ${data.autopay ? T.greenBorder : T.redBorder}`, borderRadius: 12, padding: 14, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}><div style={{ display: "flex", alignItems: "center", gap: 10 }}><RefreshCw size={14} color={data.autopay ? T.accent : T.red} /><div><div style={{ color: T.text, fontSize: 12, fontWeight: 700 }}>Autopay {data.autopay ? "Active" : "Off"}</div></div></div><Btn variant={data.autopay ? "ghost" : "primary"} onClick={() => setAutopayModal(true)} style={{ padding: "6px 14px", fontSize: 11 }}>{data.autopay ? "Edit" : "Enable"}</Btn></div>
        <Btn onClick={() => setPayModal(true)} style={{ width: "100%", padding: 14, fontSize: 15 }}><CreditCard size={16} /> Make a Payment</Btn>
      </>}
      {tab === "payments" && <>{data.payments.length === 0 ? <p style={{ color: T.textMuted, fontSize: 13, fontFamily: FB, textAlign: "center", padding: 30 }}>No payments yet.</p> : data.payments.map(p => <div key={p.id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}><div><div style={{ color: T.text, fontSize: 13, fontWeight: 600 }}>{p.type} — {p.method}</div><div style={{ color: T.textMuted, fontSize: 10, fontFamily: FB }}>{p.date}{p.fee > 0 ? ` · Fee: ${fmt(p.fee)}` : ""}</div></div><div style={{ textAlign: "right" }}><div style={{ color: T.accent, fontSize: 15, fontWeight: 700 }}>{fmt(p.amount)}</div><Badge variant={p.status === "Cleared" ? "success" : "warning"}>{p.status}</Badge></div></div>)}<Btn onClick={() => setPayModal(true)} style={{ width: "100%", marginTop: 10 }}><CreditCard size={14} /> Pay Now</Btn></>}
      {tab === "utilities" && <div className="ugrid">{UTILS.map(u => <div key={u.key} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: 16, textAlign: "center" }}><u.Icon size={22} color={u.color} style={{ marginBottom: 8 }} /><div style={{ color: T.textMuted, fontSize: 10, fontWeight: 600, fontFamily: FB, textTransform: "uppercase" }}>{u.label}</div><div style={{ color: data.utilities[u.key] > 0 ? T.red : data.utilities[u.key] < 0 ? T.accent : T.text, fontSize: 20, fontWeight: 700, marginTop: 4 }}>{fmt(data.utilities[u.key])}</div></div>)}</div>}
      {tab === "files" && <>{(data.files || []).length > 0 ? (data.files || []).map(f => <div key={f.id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}><div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 40, height: 40, borderRadius: 10, background: T.accentDim, display: "flex", alignItems: "center", justifyContent: "center" }}><File size={16} color={T.accent} /></div><div><div style={{ color: T.text, fontSize: 13, fontWeight: 600 }}>{f.name}</div><div style={{ color: T.textMuted, fontSize: 10, fontFamily: FB }}>{f.category} · {f.date}</div></div></div><Btn variant="ghost" style={{ padding: "6px 10px", fontSize: 10 }}><Download size={12} /></Btn></div>) : <div style={{ textAlign: "center", padding: 40 }}><FolderOpen size={32} color={T.textMuted} style={{ opacity: 0.4, marginBottom: 8 }} /><p style={{ color: T.textMuted, fontSize: 13, fontFamily: FB }}>No documents yet.</p></div>}</>}
      {tab === "messages" && <><div ref={msgRef} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, padding: 16, maxHeight: 400, overflowY: "auto", marginBottom: 14 }}>{data.messages.length === 0 ? <p style={{ color: T.textMuted, fontSize: 13, fontFamily: FB, textAlign: "center", padding: 20 }}>No messages.</p> : data.messages.map(m => <div key={m.id} style={{ marginBottom: 12, display: "flex", flexDirection: "column", alignItems: m.from === "resident" ? "flex-end" : "flex-start" }}><div style={{ maxWidth: "80%", padding: "10px 14px", borderRadius: 14, background: m.from === "resident" ? T.accent : T.bgElevated, border: m.from === "resident" ? "none" : `1px solid ${T.border}` }}><div style={{ color: m.from === "resident" ? "#fff" : T.text, fontSize: 13, fontFamily: FB, lineHeight: 1.5 }}>{m.text}</div></div><div style={{ color: T.textMuted, fontSize: 10, fontFamily: FB, marginTop: 4 }}>{m.from === "resident" ? "You" : "Management"} · {m.date}</div></div>)}</div><div style={{ display: "flex", gap: 8 }}><input value={newMsg} onChange={e => setNewMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMsg()} placeholder="Type a message..." style={{ flex: 1, padding: "12px 14px", border: `1px solid ${T.border}`, borderRadius: 10, background: T.bgElevated, color: T.text, fontFamily: FB, fontSize: 14 }} /><Btn onClick={sendMsg} style={{ padding: "12px 18px" }}><Send size={14} /></Btn></div></>}
      {tab === "account" && <Card title="Account Settings" icon={Settings}><Inp dark label="Username" value={newUser} onChange={e => setNewUser(e.target.value)} /><Inp dark label="New Password" type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Leave blank to keep" />{acctMsg && <div style={{ color: acctMsg.includes("!") ? T.accent : T.red, fontSize: 12, fontFamily: FB, marginBottom: 12 }}>{acctMsg}</div>}<Btn onClick={saveAccount} style={{ width: "100%" }}><Save size={14} /> Save</Btn></Card>}
    </main>

    {payModal && <Modal title="Make a Payment" subtitle={`Balance: ${fmt(totalOwed)}`} onClose={() => setPayModal(false)}><Sel label="Payment For" value={payFor} onChange={e => setPayFor(e.target.value)}><option value="Rent">Rent ({fmt(Math.max(data.balance, 0))})</option>{UTILS.map(u => data.utilities[u.key] > 0 && <option key={u.key} value={u.label}>{u.label} ({fmt(data.utilities[u.key])})</option>)}</Sel><Inp dark label="Amount" type="number" value={payAmt} onChange={e => setPayAmt(e.target.value)} placeholder="0.00" /><PayPicker selected={payMethod} onSelect={setPayMethod} amount={payAmt} compact />{(payMethod === "zelle" || payMethod === "venmo") && <div style={{ background: T.accentDim, border: `1px solid ${T.accentBorder}`, borderRadius: 8, padding: 10, marginTop: 8 }}><p style={{ color: T.accent, fontSize: 11, fontFamily: FB }}>{payMethod === "zelle" ? "Send to: payments@mdco.homes" : "Send to: @MACDevelopmentCo"}</p></div>}<Btn variant="success" onClick={handlePay} disabled={!payAmt || parseFloat(payAmt) <= 0} style={{ width: "100%", marginTop: 16 }}>Submit Payment</Btn></Modal>}
    {autopayModal && <Modal title="Autopay" onClose={() => setAutopayModal(false)}><Toggle options={[{ value: "card", label: "Card" }, { value: "ach", label: "ACH" }, { value: "zelle", label: "Zelle" }]} value={payMethod} onChange={setPayMethod} /><Sel label="Day" value={autopayDay} onChange={e => setAutopayDay(Number(e.target.value))}>{[1, 5, 10, 15].map(d => <option key={d} value={d}>{ord(d)}</option>)}</Sel><Btn variant={data.autopay ? "danger" : "success"} onClick={toggleAP} style={{ width: "100%" }}>{data.autopay ? "Disable" : "Enable"}</Btn></Modal>}
  </div>;
}

/* ════════════ STR GUEST DASH ════════════ */
function STRGuestDash({ booking, property, onLogout }) {
  const mob = useIsMobile(); const nts = nightsB(booking.checkIn, booking.checkOut);
  return <div style={{ fontFamily: FN, maxWidth: 700, margin: "0 auto", padding: mob ? 20 : 40 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}><h2 style={{ color: T.text, fontSize: 22, fontWeight: 700 }}>Guest Portal</h2><Btn variant="ghost" onClick={onLogout} style={{ fontSize: 12 }}><LogOut size={14} /></Btn></div>
    <Card title={property.name} icon={BedDouble}><div style={{ color: T.textMuted, fontSize: 12, fontFamily: FB, marginBottom: 14 }}>{property.address}</div><div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4, 1fr)", gap: 8 }}>{[["Check-In", booking.checkIn], ["Check-Out", booking.checkOut], ["Nights", nts], ["Code", booking.confirmCode], ["Status", booking.status], ["Paid", fmt(booking.totalCost)], ["Via", booking.payMethod === "card" ? "Card" : booking.payMethod], ["Guests", booking.guests]].map(([l, v], i) => <div key={i} style={{ background: T.bgElevated, borderRadius: 8, padding: 8 }}><div style={{ color: T.textMuted, fontSize: 9, fontWeight: 600, fontFamily: FB, textTransform: "uppercase" }}>{l}</div><div style={{ color: T.text, fontSize: 12, fontWeight: 600, marginTop: 2 }}>{v}</div></div>)}</div></Card>
    <Card title={`Texts from ${BIZ_PHONE}`} icon={Smartphone}><SMSLog logs={booking.smsLog} /><div style={{ background: T.bgElevated, border: `1px solid ${T.border}`, borderRadius: 8, padding: 10, marginTop: 10 }}><p style={{ color: T.textMuted, fontSize: 10, fontFamily: FB }}>Text us anytime at {BIZ_PHONE}.</p></div></Card>
    <Card title="Amenities" icon={Star}><div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{property.amenities.map(a => AM[a] && <span key={a} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 20, background: T.bgElevated, border: `1px solid ${T.border}`, fontSize: 11, fontFamily: FB, color: T.textSecondary }}>{(() => { const A = AM[a].icon; return <A size={13} />; })()}{AM[a].label}</span>)}</div></Card>
  </div>;
}

/* ════════════ ADMIN DASHBOARD ════════════ */
function AdminDash({ allData, setAllData, properties, setProperties, strProps, setStrProps, onLogout, applications }) {
  const mob = useIsMobile();
  const [tab, setTab] = useState("overview"); const [sel, setSel] = useState(null); const [selSTR, setSelSTR] = useState(null);
  const [msgT, setMsgT] = useState(null); const [admMsg, setAdmMsg] = useState("");
  const [chgMod, setChgMod] = useState(null); const [chgAmt, setChgAmt] = useState(""); const [chgType, setChgType] = useState("Rent");
  const [recMod, setRecMod] = useState(null); const [recAmt, setRecAmt] = useState(""); const [recMethod, setRecMethod] = useState("card"); const [recType, setRecType] = useState("Rent");
  const [addHouseMod, setAddHouseMod] = useState(false); const [editFinMod, setEditFinMod] = useState(null); const [delConfirm, setDelConfirm] = useState(null);
  const [ah, setAh] = useState({ name: "", address: "", code: "", rent: "", deposit: "", login: "", password: "" });
  const [ef, setEf] = useState({ rent: "", deposit: "", prepaid: "", balance: "", depositStart: "", depositEnd: "", rentDueDay: "1" });
  const [addSTRMod, setAddSTRMod] = useState(false);
  const [strForm, setStrForm] = useState({ name: "", address: "", code: "", bedrooms: "1", bathrooms: "1", maxGuests: "2", nightlyRate: "", cleaningFee: "", description: "" });
  const [smsModal, setSmsModal] = useState(null); const [smsType, setSmsType] = useState("custom"); const [smsText, setSmsText] = useState("");

  const totRev = Object.values(allData).reduce((s, d) => s + d.payments.reduce((a, p) => a + p.amount, 0), 0);
  const totOwed = Object.values(allData).reduce((s, d) => s + Math.max(d.balance, 0) + Object.values(d.utilities).reduce((a, b) => a + Math.max(b, 0), 0), 0);
  const strRev = strProps.reduce((s, p) => s + (p.bookings || []).reduce((a, b) => a + b.paidAmount, 0), 0);
  const totalUnread = Object.values(allData).reduce((s, d) => s + d.messages.filter(m => m.from === "resident" && !m.read).length, 0);
  const totalDeposits = Object.values(allData).reduce((s, d) => s + calcDep(d.securityDeposit, d.depositStartDate, d.depositEndDate).total, 0);
  const totalSMS = strProps.reduce((s, p) => s + (p.bookings || []).reduce((a, b) => a + (b.smsLog || []).length, 0), 0);

  const updP = (pid, fn) => { const u = { ...allData }; const p = { ...u[pid] }; fn(p); u[pid] = p; setAllData(u); };
  const addChg = pid => { const a = parseFloat(chgAmt); if (isNaN(a) || a <= 0) return; updP(pid, p => { if (chgType === "Rent") p.balance += a; else { const k = UTILS.find(u => u.label === chgType)?.key; if (k) p.utilities = { ...p.utilities, [k]: (p.utilities[k] || 0) + a }; } }); setChgMod(null); setChgAmt(""); };
  const recPay = pid => { const a = parseFloat(recAmt); if (isNaN(a) || a <= 0) return; const ml = recMethod === "card" ? "Card (Stripe)" : recMethod === "ach" ? "ACH (Stripe)" : recMethod; updP(pid, p => { p.payments = [{ id: Date.now(), date: td(), amount: a, method: ml, type: recType, status: recMethod === "card" ? "Cleared" : "Processing", fee: calcFee(a, recMethod) }, ...p.payments]; if (recType === "Rent") p.balance = Math.max(0, p.balance - a); else { const k = UTILS.find(u => u.label === recType)?.key; if (k) p.utilities = { ...p.utilities, [k]: Math.max(0, p.utilities[k] - a) }; } }); setRecMod(null); setRecAmt(""); };
  const sendM = pid => { if (!admMsg.trim()) return; if (pid === "broadcast") { const u = { ...allData }; Object.keys(u).forEach(k => { u[k] = { ...u[k], messages: [...u[k].messages, { id: Date.now() + parseInt(k), from: "admin", text: admMsg.trim(), date: td(), read: false }] }; }); setAllData(u); } else { updP(pid, p => { p.messages = [...p.messages, { id: Date.now(), from: "admin", text: admMsg.trim(), date: td(), read: false }]; }); } setAdmMsg(""); setMsgT(null); };
  const doAddHouse = () => { if (!ah.name.trim() || !ah.code.trim() || !ah.rent) return; const nid = Math.max(...properties.map(p => p.id), 0) + 1; setProperties(prev => [...prev, { id: nid, name: ah.name, address: ah.address, code: ah.code, bedrooms: 0, bathrooms: 0, sqft: 0, features: [], description: "" }]); setAllData(prev => ({ ...prev, [nid]: { login: ah.login || `house${ah.code}`, password: ah.password || "rent123", residents: [], rent: parseFloat(ah.rent), securityDeposit: parseFloat(ah.deposit) || 0, prepaidRent: 0, balance: 0, autopay: false, autopayMethod: null, autopayDay: 1, depositStartDate: td(), depositEndDate: "", leaseStart: td(), leaseEnd: "", rentDueDay: 1, utilities: { oil: 0, electric: 0, solar: 0, propane: 0 }, payments: [], messages: [], files: [] } })); setAddHouseMod(false); };
  const openEditFin = pid => { const d = allData[pid]; if (d) { setEf({ rent: String(d.rent), deposit: String(d.securityDeposit), prepaid: String(d.prepaidRent), balance: String(d.balance), depositStart: d.depositStartDate || "", depositEnd: d.depositEndDate || "", rentDueDay: String(d.rentDueDay || 1) }); setEditFinMod(pid); } };
  const doEditFin = () => { updP(editFinMod, p => { p.rent = parseFloat(ef.rent) || 0; p.securityDeposit = parseFloat(ef.deposit) || 0; p.prepaidRent = parseFloat(ef.prepaid) || 0; p.balance = parseFloat(ef.balance) || 0; p.depositStartDate = ef.depositStart; p.depositEndDate = ef.depositEnd; p.rentDueDay = parseInt(ef.rentDueDay) || 1; }); setEditFinMod(null); };
  const doDeleteHouse = pid => { setProperties(prev => prev.filter(p => p.id !== pid)); setAllData(prev => { const u = { ...prev }; delete u[pid]; return u; }); setSel(null); setDelConfirm(null); };
  const doAddSTR = () => { if (!strForm.name.trim() || !strForm.code.trim() || !strForm.nightlyRate) return; const nid = Math.max(...strProps.map(p => p.id), 200) + 1; setStrProps(prev => [...prev, { id: nid, name: strForm.name, address: strForm.address, code: strForm.code.toUpperCase(), bedrooms: parseInt(strForm.bedrooms), bathrooms: parseInt(strForm.bathrooms), maxGuests: parseInt(strForm.maxGuests), nightlyRate: parseFloat(strForm.nightlyRate), cleaningFee: parseFloat(strForm.cleaningFee) || 0, sqft: 0, amenities: ["wifi", "kitchen"], description: strForm.description, features: [], active: true, blockedDates: [], bookings: [] }]); setAddSTRMod(false); };
  const sendSMS = () => { if (!smsText.trim() || !smsModal) return; setStrProps(prev => prev.map(sp => ({ ...sp, bookings: (sp.bookings || []).map(b => b.id === smsModal.id ? { ...b, smsLog: [...(b.smsLog || []), { id: Date.now(), type: smsType, text: smsText.trim(), date: td(), status: "delivered" }] } : b) }))); setSmsModal(null); setSmsText(""); };

  const pad = mob ? 16 : 28;
  const sections = ["overview", "properties", "str", "applications", "messages"];
  const secIcons2 = { overview: LayoutDashboard, properties: Building, str: BedDouble, applications: ClipboardList, messages: MessageSquare };
  const secLabels2 = { overview: "Overview", properties: "Properties", str: "Rentals", applications: "Apps", messages: `Msgs${totalUnread ? ` (${totalUnread})` : ""}` };

  return <div style={{ fontFamily: FN, overflowX: "hidden" }}>
    <div style={{ padding: `12px ${pad}px`, borderBottom: `1px solid ${T.border}`, background: T.bgCard }}>
      <div className="nav-scroll" style={{ gap: 6 }}>
        {sections.map(s => { const I = secIcons2[s]; return <button key={s} onClick={() => { setTab(s); setSel(null); setSelSTR(null); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", border: "none", borderRadius: 20, cursor: "pointer", fontFamily: FB, fontSize: 12, fontWeight: 600, background: tab === s ? T.accent : T.bgElevated, color: tab === s ? "#fff" : T.textMuted, whiteSpace: "nowrap" }}><I size={13} />{secLabels2[s]}</button>; })}
      </div>
    </div>

    <main style={{ padding: pad, maxWidth: 1200, margin: "0 auto" }}>
      {tab === "overview" && <>
        <div className="mgrid4" style={{ marginBottom: 20 }}><Metric icon={DollarSign} label="LTR Revenue" value={fmt(totRev)} mob={mob} variant="success" /><Metric icon={TrendingUp} label="Outstanding" value={fmt(totOwed)} mob={mob} variant={totOwed > 0 ? "danger" : "success"} /><Metric icon={BedDouble} label="STR Revenue" value={fmt(strRev)} mob={mob} variant="accent" /><Metric icon={Shield} label="Deposits" value={fmt(totalDeposits)} mob={mob} variant="purple" sub="Incl. interest" /></div>
        <div className="mgrid" style={{ marginBottom: 20 }}><Metric icon={Smartphone} label="SMS Sent" value={totalSMS} mob={mob} /><Metric icon={MessageSquare} label="Unread" value={totalUnread} mob={mob} variant={totalUnread > 0 ? "warning" : "success"} /><Metric icon={ClipboardList} label="Applications" value={applications.length} mob={mob} variant="accent" /></div>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 16 }}>
          <Card title="Properties" icon={Building} action={<Btn onClick={() => setAddHouseMod(true)} style={{ padding: "5px 10px", fontSize: 10 }}><Plus size={10} /> Add</Btn>}>{properties.map(p => { const d = allData[p.id]; return <div key={p.id} onClick={() => { setTab("properties"); setSel(p.id); }} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${T.border}`, cursor: "pointer" }}><div style={{ color: T.text, fontSize: 13, fontWeight: 600 }}>{p.name}</div><Badge variant={d?.balance > 0 ? "danger" : "success"}>{d?.balance > 0 ? fmt(d.balance) : "Paid"}</Badge></div>; })}</Card>
          <Card title="Short-Term" icon={BedDouble} action={<Btn variant="orange" onClick={() => setAddSTRMod(true)} style={{ padding: "5px 10px", fontSize: 10 }}><Plus size={10} /> Add</Btn>}>{strProps.map(sp => <div key={sp.id} onClick={() => { setTab("str"); setSelSTR(sp.id); }} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${T.border}`, cursor: "pointer" }}><div style={{ color: T.text, fontSize: 13, fontWeight: 600 }}>{sp.name}</div><Badge variant="success">{(sp.bookings || []).length} bookings</Badge></div>)}</Card>
        </div>
      </>}

      {tab === "properties" && !sel && properties.map(p => { const d = allData[p.id]; const dep = calcDep(d?.securityDeposit, d?.depositStartDate, d?.depositEndDate); return <div key={p.id} onClick={() => setSel(p.id)} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, padding: 18, marginBottom: 12, cursor: "pointer" }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}><div><div style={{ color: T.text, fontSize: 17, fontWeight: 700 }}>{p.name}</div><div style={{ color: T.textMuted, fontSize: 11, fontFamily: FB }}>Code: {p.code} · Login: {d?.login}</div></div><Badge variant={d?.balance > 0 ? "danger" : "success"}>{d?.balance > 0 ? fmt(d.balance) : "Paid"}</Badge></div><div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>{[["Rent", fmt(d?.rent)], ["Dep+Int", fmt(dep.total)], ["Residents", d?.residents?.length], ["Payments", d?.payments?.length]].map(([l, v], i) => <div key={i} style={{ background: T.bgElevated, borderRadius: 8, padding: 8, textAlign: "center" }}><div style={{ color: T.textMuted, fontSize: 9, fontFamily: FB, textTransform: "uppercase" }}>{l}</div><div style={{ color: T.text, fontSize: 12, fontWeight: 600, marginTop: 2 }}>{v}</div></div>)}</div></div>; })}

      {tab === "properties" && sel && (() => { const p = properties.find(x => x.id === sel); const d = allData[sel]; if (!p || !d) return null; const dep = calcDep(d.securityDeposit, d.depositStartDate, d.depositEndDate); const lat = calcLate(d.balance, d.rentDueDay || 1); return <>
        <button onClick={() => setSel(null)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: T.accent, cursor: "pointer", fontFamily: FB, fontSize: 12, fontWeight: 600, marginBottom: 16 }}><ChevronLeft size={14} /> Back</button>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}><div><h2 style={{ color: T.text, fontSize: 22, fontWeight: 700 }}>{p.name}</h2><div style={{ color: T.textMuted, fontSize: 12, fontFamily: FB }}>{p.address} · Code: {p.code} · Login: {d.login}</div></div><div style={{ display: "flex", gap: 6 }}><Btn variant="ghost" onClick={() => openEditFin(sel)} style={{ padding: "6px 12px", fontSize: 11 }}><DollarSign size={11} /> Financials</Btn><Btn variant="danger" onClick={() => setDelConfirm(sel)} style={{ padding: "6px 12px", fontSize: 11 }}><Trash2 size={11} /></Btn></div></div>
        <div className="mgrid4" style={{ marginBottom: 16 }}><Metric icon={DollarSign} label="Rent" value={fmt(d.rent)} mob={mob} /><Metric icon={Shield} label="Dep+Int" value={fmt(dep.total)} mob={mob} variant="accent" sub={`+${fmt(dep.interest)}`} /><Metric icon={FileText} label="Prepaid" value={fmt(d.prepaidRent)} mob={mob} /><Metric icon={TrendingUp} label="Balance" value={fmt(d.balance)} mob={mob} variant={d.balance > 0 ? "danger" : "success"} sub={lat > 0 ? `+${fmt(lat)} late` : ""} /></div>
        <Card title={`Residents (${d.residents.length})`} icon={Users}>{d.residents.map((r, i) => <div key={i} style={{ padding: "6px 0", color: T.text, fontSize: 13, fontFamily: FB, borderBottom: `1px solid ${T.border}` }}>{r}</div>)}</Card>
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}><Btn onClick={() => setChgMod(sel)} style={{ fontSize: 12 }}><Plus size={12} /> Charge</Btn><Btn variant="success" onClick={() => setRecMod(sel)} style={{ fontSize: 12 }}><DollarSign size={12} /> Record Pay</Btn><Btn variant="ghost" onClick={() => setMsgT(sel)} style={{ fontSize: 12 }}><MessageSquare size={12} /> Message</Btn></div>
        <Card title={`Payments (${d.payments.length})`} icon={Receipt}>{d.payments.slice(0, 10).map(pay => <div key={pay.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${T.border}` }}><div><div style={{ color: T.text, fontSize: 12, fontWeight: 600 }}>{pay.type} — {pay.method}</div><div style={{ color: T.textMuted, fontSize: 10, fontFamily: FB }}>{pay.date}</div></div><div style={{ color: T.accent, fontSize: 14, fontWeight: 700 }}>{fmt(pay.amount)}</div></div>)}</Card>
      </>; })()}

      {tab === "str" && !selSTR && strProps.map(sp => <div key={sp.id} onClick={() => setSelSTR(sp.id)} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, padding: 18, marginBottom: 12, cursor: "pointer" }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><div><div style={{ color: T.text, fontSize: 17, fontWeight: 700 }}>{sp.name}</div><div style={{ color: T.textMuted, fontSize: 11, fontFamily: FB }}>{sp.address} · {fmt(sp.nightlyRate)}/night</div></div><div style={{ display: "flex", gap: 6 }}><Badge variant="success">{(sp.bookings || []).length} bookings</Badge><button onClick={e => { e.stopPropagation(); setStrProps(prev => prev.filter(p => p.id !== sp.id)); }} style={{ background: T.redDim, border: `1px solid ${T.redBorder}`, borderRadius: 6, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Trash2 size={12} color={T.red} /></button></div></div></div>)}

      {tab === "str" && selSTR && (() => { const sp = strProps.find(p => p.id === selSTR); if (!sp) return null; return <>
        <button onClick={() => setSelSTR(null)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: T.accent, cursor: "pointer", fontFamily: FB, fontSize: 12, fontWeight: 600, marginBottom: 16 }}><ChevronLeft size={14} /> Back</button>
        <h2 style={{ color: T.text, fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{sp.name}</h2>
        <div style={{ color: T.textMuted, fontSize: 12, fontFamily: FB, marginBottom: 20 }}>{sp.address} · Code: {sp.code}</div>
        <div className="mgrid4" style={{ marginBottom: 20 }}><Metric icon={DollarSign} label="Revenue" value={fmt((sp.bookings || []).reduce((a, b) => a + b.paidAmount, 0))} mob={mob} variant="success" /><Metric icon={CalendarDays} label="Bookings" value={(sp.bookings || []).length} mob={mob} /><Metric icon={Smartphone} label="Texts" value={(sp.bookings || []).reduce((a, b) => a + (b.smsLog || []).length, 0)} mob={mob} variant="accent" /><Metric icon={CreditCard} label="Card Pays" value={(sp.bookings || []).filter(b => b.payMethod === "card").length} mob={mob} variant="purple" /></div>
        {(sp.bookings || []).map(b => <Card key={b.id} title={`${b.guestFirst} ${b.guestLast}`} icon={User} action={<div style={{ display: "flex", gap: 4 }}><Badge variant={b.status === "confirmed" ? "success" : "accent"}>{b.status}</Badge><Btn onClick={() => { setSmsModal(b); setSmsType("custom"); setSmsText(""); }} style={{ padding: "4px 8px", fontSize: 9 }}><Send size={9} /> Text</Btn></div>}>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4, 1fr)", gap: 6, marginBottom: 10 }}>{[["In", b.checkIn], ["Out", b.checkOut], ["Code", b.confirmCode], ["Paid", fmt(b.paidAmount)]].map(([l, v], i) => <div key={i} style={{ background: T.bgElevated, borderRadius: 6, padding: 6 }}><div style={{ color: T.textMuted, fontSize: 8, fontFamily: FB, textTransform: "uppercase" }}>{l}</div><div style={{ color: T.text, fontSize: 10, fontWeight: 600 }}>{v}</div></div>)}</div>
          <SMSLog logs={b.smsLog} />
        </Card>)}
        <Card title="Calendar" icon={CalendarDays}><STRCal property={sp} selIn={null} selOut={null} onSelect={() => {}} mob={mob} /></Card>
      </>; })()}

      {tab === "applications" && <>{applications.length === 0 ? <Card><p style={{ color: T.textMuted, fontSize: 13, fontFamily: FB, textAlign: "center", padding: 20 }}>No applications yet.</p></Card> : applications.map(a => <Card key={a.id}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}><div><div style={{ color: T.text, fontSize: 16, fontWeight: 700 }}>{a.firstName} {a.lastName}</div><div style={{ color: T.textMuted, fontSize: 11, fontFamily: FB }}>{a.email} · {a.phone} · {a.submittedDate}</div></div><Badge variant={a.status === "approved" ? "success" : a.status === "denied" ? "danger" : "warning"}>{a.status}</Badge></div><div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(5, 1fr)", gap: 8, marginBottom: 12 }}>{[["Property", a.desiredProperty || "—"], ["Income", a.annualIncome ? `$${parseInt(a.annualIncome).toLocaleString()}` : "—"], ["Credit Score", a.creditScore], ["Move-In", a.moveInDate || "—"], ["Employer", a.employer || "—"]].map(([l, v], i) => <div key={i} style={{ background: T.bgElevated, borderRadius: 8, padding: 8 }}><div style={{ color: T.textMuted, fontSize: 9, fontFamily: FB, textTransform: "uppercase" }}>{l}</div><div style={{ color: l === "Credit Score" ? (v >= 700 ? T.accent : v >= 600 ? T.orange : T.red) : T.text, fontSize: 13, fontWeight: 600, marginTop: 2 }}>{v}</div></div>)}</div><div style={{ display: "flex", gap: 6 }}><Btn variant="success" style={{ fontSize: 11, padding: "6px 14px" }}><Check size={12} /> Approve</Btn><Btn variant="danger" style={{ fontSize: 11, padding: "6px 14px" }}><X size={12} /> Deny</Btn></div></Card>)}</>}

      {tab === "messages" && <><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}><h2 style={{ color: T.text, fontSize: 20, fontWeight: 700 }}>Messages</h2><Btn onClick={() => setMsgT("broadcast")} style={{ fontSize: 12 }}><Megaphone size={12} /> Broadcast</Btn></div>{properties.map(p => { const d = allData[p.id]; const ur = d?.messages?.filter(m => m.from === "resident" && !m.read).length || 0; return <div key={p.id} onClick={() => setMsgT(p.id)} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: 16, marginBottom: 8, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ color: T.text, fontSize: 14, fontWeight: 600 }}>{p.name}</div>{ur > 0 ? <Badge variant="danger">{ur}</Badge> : <span style={{ color: T.textMuted, fontSize: 10, fontFamily: FB }}>{d?.messages?.length || 0}</span>}</div>; })}</>}
    </main>

    {/* Modals */}
    {addHouseMod && <Modal title="Add Property" onClose={() => setAddHouseMod(false)}><Inp dark label="Name" value={ah.name} onChange={e => setAh({...ah,name:e.target.value})} /><Inp dark label="Address" value={ah.address} onChange={e => setAh({...ah,address:e.target.value})} /><Inp dark label="Code" value={ah.code} onChange={e => setAh({...ah,code:e.target.value})} /><Inp dark label="Rent" type="number" value={ah.rent} onChange={e => setAh({...ah,rent:e.target.value})} /><Inp dark label="Deposit" type="number" value={ah.deposit} onChange={e => setAh({...ah,deposit:e.target.value})} /><Inp dark label="Login" value={ah.login} onChange={e => setAh({...ah,login:e.target.value})} /><Inp dark label="Password" value={ah.password} onChange={e => setAh({...ah,password:e.target.value})} /><Btn onClick={doAddHouse} style={{width:"100%"}}>Add Property</Btn></Modal>}
    {editFinMod && <Modal title="Edit Financials" onClose={() => setEditFinMod(null)}><Inp dark label="Rent" type="number" value={ef.rent} onChange={e => setEf({...ef,rent:e.target.value})} /><Inp dark label="Deposit" type="number" value={ef.deposit} onChange={e => setEf({...ef,deposit:e.target.value})} /><Inp dark label="Prepaid" type="number" value={ef.prepaid} onChange={e => setEf({...ef,prepaid:e.target.value})} /><Inp dark label="Balance" type="number" value={ef.balance} onChange={e => setEf({...ef,balance:e.target.value})} /><Inp dark label="Deposit Start" type="date" value={ef.depositStart} onChange={e => setEf({...ef,depositStart:e.target.value})} /><Inp dark label="Deposit End" type="date" value={ef.depositEnd} onChange={e => setEf({...ef,depositEnd:e.target.value})} /><Inp dark label="Due Day" type="number" value={ef.rentDueDay} onChange={e => setEf({...ef,rentDueDay:e.target.value})} /><Btn onClick={doEditFin} style={{width:"100%"}}>Save</Btn></Modal>}
    {delConfirm && <Modal title="Delete Property" onClose={() => setDelConfirm(null)}><p style={{color:T.textMuted,fontSize:13,fontFamily:FB,marginBottom:16}}>Permanently delete this property?</p><div style={{display:"flex",gap:8}}><Btn variant="ghost" onClick={() => setDelConfirm(null)} style={{flex:1}}>Cancel</Btn><Btn variant="danger" onClick={() => doDeleteHouse(delConfirm)} style={{flex:1}}>Delete</Btn></div></Modal>}
    {msgT && <Modal title={msgT === "broadcast" ? "Broadcast" : properties.find(p => p.id === msgT)?.name || ""} onClose={() => { setMsgT(null); setAdmMsg(""); }}>{msgT !== "broadcast" && allData[msgT]?.messages && <div style={{maxHeight:250,overflowY:"auto",marginBottom:14}}>{allData[msgT].messages.map(m => <div key={m.id} style={{marginBottom:8,display:"flex",flexDirection:"column",alignItems:m.from==="admin"?"flex-end":"flex-start"}}><div style={{maxWidth:"80%",padding:"8px 12px",borderRadius:12,background:m.from==="admin"?T.accent:T.bgElevated}}><div style={{color:m.from==="admin"?"#fff":T.text,fontSize:12,fontFamily:FB}}>{m.text}</div></div></div>)}</div>}<textarea value={admMsg} onChange={e => setAdmMsg(e.target.value)} rows={3} placeholder="Type..." style={{width:"100%",padding:"12px 14px",border:`1px solid ${T.border}`,borderRadius:10,background:T.bgElevated,color:T.text,fontFamily:FB,resize:"vertical",marginBottom:16,fontSize:14}} /><Btn onClick={() => sendM(msgT)} style={{width:"100%"}}><Send size={14} /> Send</Btn></Modal>}
    {chgMod && <Modal title="Add Charge" onClose={() => {setChgMod(null);setChgAmt("");}}><Sel label="Type" value={chgType} onChange={e => setChgType(e.target.value)}><option value="Rent">Rent</option>{UTILS.map(u => <option key={u.key} value={u.label}>{u.label}</option>)}</Sel><Inp dark label="Amount" type="number" value={chgAmt} onChange={e => setChgAmt(e.target.value)} /><Btn onClick={() => addChg(chgMod)} style={{width:"100%"}}>Add</Btn></Modal>}
    {recMod && <Modal title="Record Payment" onClose={() => {setRecMod(null);setRecAmt("");}}><Sel label="For" value={recType} onChange={e => setRecType(e.target.value)}><option value="Rent">Rent</option>{UTILS.map(u => <option key={u.key} value={u.label}>{u.label}</option>)}</Sel><Inp dark label="Amount" type="number" value={recAmt} onChange={e => setRecAmt(e.target.value)} /><Toggle options={[{value:"card",label:"Card"},{value:"ach",label:"ACH"},{value:"Zelle",label:"Zelle"},{value:"Check",label:"Check"}]} value={recMethod} onChange={setRecMethod} /><Btn variant="success" onClick={() => recPay(recMod)} style={{width:"100%"}}>Record</Btn></Modal>}
    {addSTRMod && <Modal title="Add Rental" wide onClose={() => setAddSTRMod(false)}><Inp dark label="Name" value={strForm.name} onChange={e => setStrForm({...strForm,name:e.target.value})} /><Inp dark label="Address" value={strForm.address} onChange={e => setStrForm({...strForm,address:e.target.value})} /><Inp dark label="Code" value={strForm.code} onChange={e => setStrForm({...strForm,code:e.target.value})} /><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0 12px"}}><Inp dark label="Beds" type="number" value={strForm.bedrooms} onChange={e => setStrForm({...strForm,bedrooms:e.target.value})} /><Inp dark label="Baths" type="number" value={strForm.bathrooms} onChange={e => setStrForm({...strForm,bathrooms:e.target.value})} /><Inp dark label="Guests" type="number" value={strForm.maxGuests} onChange={e => setStrForm({...strForm,maxGuests:e.target.value})} /></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}><Inp dark label="Rate/Night" type="number" value={strForm.nightlyRate} onChange={e => setStrForm({...strForm,nightlyRate:e.target.value})} /><Inp dark label="Cleaning" type="number" value={strForm.cleaningFee} onChange={e => setStrForm({...strForm,cleaningFee:e.target.value})} /></div><Btn variant="orange" onClick={doAddSTR} style={{width:"100%"}}>Add</Btn></Modal>}
    {smsModal && <Modal title={`Text ${smsModal.guestFirst} ${smsModal.guestLast}`} subtitle={`To: ${smsModal.phone} · From: ${BIZ_PHONE}`} onClose={() => setSmsModal(null)}><Sel label="Template" value={smsType} onChange={e => { setSmsType(e.target.value); const sp = strProps.find(p => (p.bookings||[]).some(b => b.id === smsModal.id)); const pn = sp?.name||""; if(e.target.value==="checkin_reminder") setSmsText(SMST.checkin_reminder(pn,fmtD(smsModal.checkIn))); else if(e.target.value==="checkout_reminder") setSmsText(SMST.checkout_reminder(pn,fmtD(smsModal.checkOut))); else if(e.target.value==="welcome") setSmsText(SMST.welcome(pn)); else if(e.target.value==="post_stay") setSmsText(SMST.post_stay(smsModal.guestFirst,pn)); else if(e.target.value==="booking_confirm") setSmsText(SMST.booking_confirm(pn,smsModal.confirmCode,fmtD(smsModal.checkIn))); else setSmsText(""); }}><option value="custom">Custom</option><option value="booking_confirm">Confirmation</option><option value="checkin_reminder">Check-In</option><option value="welcome">Welcome</option><option value="checkout_reminder">Checkout</option><option value="post_stay">Thank You</option></Sel><textarea value={smsText} onChange={e => setSmsText(e.target.value)} rows={4} placeholder="Type..." style={{width:"100%",padding:"12px",border:`1px solid ${T.border}`,borderRadius:10,background:T.bgElevated,color:T.text,fontFamily:FB,resize:"vertical",marginBottom:16,fontSize:14}} /><Btn variant="success" onClick={sendSMS} disabled={!smsText.trim()} style={{width:"100%"}}><Send size={14} /> Send Text</Btn></Modal>}
  </div>;
}

/* ════════════ APP ════════════ */
export default function App() {
  const mob = useIsMobile();
  const [page, setPage] = useState("home");
  const [portalUser, setPortalUser] = useState(null);
  const [properties, setProperties] = useState(INIT_PROPS);
  const [allData, setAllData] = useState(mkData);
  const [strProps, setStrProps] = useState(INIT_STR);
  const [strGuest, setStrGuest] = useState(null);
  const [applications, setApplications] = useState([]);

  // Unified login — no separate admin toggle
  const handleLogin = (username, password) => {
    if (username === "admin" && password === "admin123") { setPortalUser({ type: "admin" }); return null; }
    if (username === "demo" && password === "demo123") { setPortalUser({ type: "resident", propertyId: 1 }); return null; }
    const found = Object.entries(allData).find(([, d]) => d.login === username && d.password === password);
    if (found) { setPortalUser({ type: "resident", propertyId: Number(found[0]) }); return null; }
    return "Invalid credentials";
  };
  const handleRegister = (propId, username, password) => setAllData(prev => { const u = { ...prev }; u[propId] = { ...u[propId], login: username, password }; return u; });
  const handleSTRLogin = (confirmCode, lastName) => {
    for (const sp of strProps) { const b = (sp.bookings || []).find(b => b.confirmCode.toUpperCase() === confirmCode.toUpperCase() && b.guestLast.toLowerCase() === lastName.toLowerCase()); if (b) { setStrGuest({ booking: b, property: sp }); setPortalUser({ type: "strguest" }); return null; } }
    return "No booking found.";
  };
  const handleLogout = () => { setPortalUser(null); setStrGuest(null); };

  useEffect(() => { const t = td(); setStrProps(prev => prev.map(sp => ({ ...sp, bookings: (sp.bookings || []).map(b => { if (b.checkOut < t && b.status !== "completed") return { ...b, status: "completed" }; if (b.checkIn <= t && b.checkOut >= t && b.status === "upcoming") return { ...b, status: "confirmed" }; return b; }) }))); }, []);

  return <div style={{ minHeight: "100vh", background: T.bg }}>
    <GlobalStyles />
    <SiteNav page={page} setPage={setPage} portalUser={portalUser} onLogout={handleLogout} mob={mob} />
    {page === "home" && <HomePage setPage={setPage} mob={mob} />}
    {page === "services" && <ServicesPage setPage={setPage} mob={mob} />}
    {page === "contact" && <ContactPage mob={mob} />}
    {page === "properties" && <PropertiesPage properties={properties} strProps={strProps} setPage={setPage} mob={mob} />}
    {page === "apply" && <ApplicationPage mob={mob} applications={applications} setApplications={setApplications} />}
    {page === "rentals" && <STRPage strProps={strProps} setStrProps={setStrProps} setPage={setPage} mob={mob} />}
    {page === "portal" && !portalUser && <PortalLogin onLogin={handleLogin} onRegister={handleRegister} onSTRLogin={handleSTRLogin} allData={allData} properties={properties} setPage={setPage} />}
    {page === "portal" && portalUser?.type === "admin" && <AdminDash allData={allData} setAllData={setAllData} properties={properties} setProperties={setProperties} strProps={strProps} setStrProps={setStrProps} onLogout={handleLogout} applications={applications} />}
    {page === "portal" && portalUser?.type === "resident" && <ResidentDash propertyId={portalUser.propertyId} data={allData[portalUser.propertyId]} allData={allData} setAllData={setAllData} properties={properties} />}
    {page === "portal" && portalUser?.type === "strguest" && strGuest && <STRGuestDash booking={strGuest.booking} property={strGuest.property} onLogout={handleLogout} />}
  </div>;
}
