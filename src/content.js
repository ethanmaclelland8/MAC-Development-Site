/* ═══════════════════════════════════════════════════════════════
   SITE CONTENT — edit this file to update the website.
   ───────────────────────────────────────────────────────────────
   • Change any text between the quotes.
   • To hide something, set it to "" (empty quotes).
   • To add an item to a list, copy an existing { ... } block,
     paste it below, and change the text. Keep the commas.
   • Save the file on GitHub ("Commit changes") and the live site
     updates by itself in about a minute.
   ═══════════════════════════════════════════════════════════════ */

/* ── LOOK ────────────────────────────────────────────────────────
   Pick one:  "clean"  "fieldstone"  "navy"
   To preview a look without changing it, add ?look=NAME to the
   address, e.g.  mdco.homes/?look=fieldstone                      */
export const THEME = "clean";

/* ── COMPANY ─────────────────────────────────────────────────── */
export const COMPANY = {
  name: "MAC Development Co.",
  shortName: "MAC Development",
  tagline: "Mansfield, Connecticut",            // small line under the logo
  region: "eastern Connecticut",
};

/* ── CONTACT ─────────────────────────────────────────────────── */
export const CONTACT = {
  phone: "(860) 608-8375",
  email: "ethan@mac-dev.co",
  mailingAddress: "P.O. Box 220, Mansfield, CT 06268",
  hours: "",                                     // e.g. "Mon–Fri 9am–5pm" ("" hides it)
  emergencyNote: "For urgent maintenance — no heat, a leak, no water — call instead of emailing.",

  // Contact form delivery. Leave "" and the form opens the visitor's
  // email app instead. To get messages delivered automatically, make a
  // free form at formspree.io and paste its URL here, e.g.
  // "https://formspree.io/f/abcdwxyz"
  formEndpoint: "",

  formTopics: ["General question", "Maintenance request", "Rental inquiry", "Billing question"],
};

/* ── PAYMENTS ────────────────────────────────────────────────── */
/* ⚠ VERIFY every value here before publishing — tenants send money
   to exactly what's shown. Set any method to "" to hide it.        */
export const PAYMENTS = {
  // Online rent platform (Baselane, TurboTenant, etc.).
  // Paste the tenant login / pay link from your platform. While this
  // is "", the "Pay online" option is hidden.
  online: {
    url: "",
    details: "Pay by bank transfer or card, set up autopay, and get a receipt every time.",
    fees: "",                                    // e.g. "Bank transfer: free. Card: 3.49%."
  },

  zelle: "macdevelopment",                       // Zelle email, phone, or tag
  venmo: "@ethandm8",

  check: {
    payableTo: "Ethan MacLelland",
    address: "P.O. Box 220\nMansfield, CT 06268",
  },

  memoNote: "Put your property address in the memo or note so we can match your payment.",
  dueNote: "Rent is due on the 1st of each month.",
};

/* ── HOME PAGE ───────────────────────────────────────────────── */
export const HOME = {
  headline: "We renovate homes in eastern Connecticut and rent them out ourselves.",
  intro:
    "MAC Development Co. owns and manages four rental homes. Every one was rebuilt by us, and tenants deal directly with the owner — not a management company.",
};

export const SERVICES = [
  {
    title: "Renovation",
    text: "We buy houses that need real work and rebuild them properly: electrical, plumbing, heating, roofs, kitchens, and baths.",
  },
  {
    title: "Adaptive reuse",
    text: "We take on buildings other people pass over, like the 1935 stone church on Stafford Road — now a four-bedroom home.",
  },
  {
    title: "Leasing and management",
    text: "We lease and look after every house ourselves. Rent is paid online and maintenance requests come straight to us.",
  },
];

/* ── PROPERTIES ──────────────────────────────────────────────────
   One block per house, shown in this order.
   available: "" means leased. Put a date (e.g. "January 2027") to
              show the house as available and feature it on the home page.
   facts:     any "Label": "value" pairs you want listed.            */
export const PROPERTIES = [
  {
    number: "458",
    street: "South Eagleville Road",
    town: "Mansfield",
    name: "The Vinton",
    available: "",
    facts: { "Style": "Victorian Tudor", "Bedrooms": "6", "Bathrooms": "3", "Ours since": "2019" },
    summary:
      "The house that started the company. Bought as a distressed property, we rebuilt every major system — electrical, plumbing, and HVAC — and renovated the interior on all three floors. It's now a six-bedroom rental minutes from UConn.",
  },
  {
    number: "444",
    street: "Middle Turnpike",
    town: "",
    name: "Pool House",
    available: "",
    facts: { "Renovated": "2023–2024", "Outdoors": "In-ground pool" },
    summary:
      "A renovation built around outdoor living. We restored the in-ground pool and hardscape, put in a new kitchen with custom cabinetry, and opened the living space into a bright, modern floor plan.",
  },
  {
    number: "39",
    street: "Trapella Road",
    town: "Willimantic",
    name: "The Trap",
    available: "",
    facts: { "Renovated": "2022–2023", "New": "Roof, furnace, water heater" },
    summary:
      "A full buy, renovate, rent, refinance project. New roof, furnace, and water heater, then a new kitchen, bathrooms, flooring, and paint throughout.",
  },
  {
    number: "887",
    street: "Stafford Road",
    town: "Mansfield",
    name: "The Church",
    available: "January 2027",
    facts: { "Built": "1935", "Bedrooms": "4", "Bathrooms": "2", "Listed": "CT State Register of Historic Places" },
    summary:
      "A 1935 stone church converted into a four-bedroom, two-bath home. The original masonry stays; everything behind the walls is new — electrical, plumbing, and HVAC — with custom solid-wood cabinetry and reclaimed mansion doors.",
  },
];

/* ── FILES ───────────────────────────────────────────────────── */
/* Upload the file to the  public/files/  folder on GitHub, then add a
   line here. "file" must match the file name exactly. While this list
   is empty, the Files page is hidden.                               */
export const FILES = [
  // { name: "Move-In Checklist", file: "move-in-checklist.pdf", date: "2026-12-01" },
];
