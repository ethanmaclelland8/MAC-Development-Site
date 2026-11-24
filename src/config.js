/* ═══════════════════════════════════════════════════════════════
   ONLINE ACCOUNTS + BANK PAYMENTS
   Paste three values here after following SETUP.md. All three are
   public keys made to sit in website code — never paste a secret key
   (sk_live_…, service_role) here.
   While these are empty, the site works without logins: the Pay rent
   page shows Zelle, Venmo and check only.
   ═══════════════════════════════════════════════════════════════ */
export const BACKEND = {
  supabaseUrl: "",            // Supabase → Project Settings → API → Project URL
  supabaseAnonKey: "",        // Supabase → Project Settings → API → anon public key
  stripePublishableKey: "",   // Stripe → Developers → API keys → Publishable key (pk_live_…)
};

export const backendReady = Boolean(BACKEND.supabaseUrl && BACKEND.supabaseAnonKey);
export const paymentsReady = backendReady && Boolean(BACKEND.stripePublishableKey);
