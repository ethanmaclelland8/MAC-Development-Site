// Starts an ACH bank payment for the signed-in resident.
// Returns a Stripe Embedded Checkout client secret that the website
// shows on mac-dev.co. The amount is checked here, on the server.
//
// Secrets (Supabase → Edge Functions → Secrets):
//   STRIPE_SECRET_KEY   sk_live_...
//   SITE_URL            https://mac-dev.co
import Stripe from "npm:stripe@17.7.0";
import { createClient } from "npm:@supabase/supabase-js@2.49.4";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
  httpClient: Stripe.createFetchHttpClient(),
});
const SITE_URL = (Deno.env.get("SITE_URL") ?? "https://mac-dev.co").replace(/\/$/, "");

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const reply = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const MIN_CENTS = 100;          // $1
const MAX_CENTS = 2_000_000;    // $20,000

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return reply({ error: "Use POST." }, 405);

  try {
    const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
      auth: { persistSession: false },
    });

    // Who is paying?
    const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
    const { data: auth, error: authError } = await db.auth.getUser(token);
    const user = auth?.user;
    if (authError || !user) return reply({ error: "Your session ended. Log in again to pay." }, 401);

    const { data: profile } = await db
      .from("profiles")
      .select("id, full_name, unit_id, stripe_customer_id, units(number, street)")
      .eq("id", user.id)
      .single();
    if (!profile?.unit_id || !profile.units) {
      return reply({ error: "Your account isn't linked to a home yet. Use the sign-up link from your landlord." }, 400);
    }

    // How much?
    const body = await req.json().catch(() => ({}));
    const amount = Math.round(Number(body.amount_cents));
    if (!Number.isFinite(amount) || amount < MIN_CENTS || amount > MAX_CENTS) {
      return reply({ error: "Enter an amount between $1 and $20,000." }, 400);
    }

    // Reuse one Stripe customer per resident so saved bank accounts show up next time.
    let customer = profile.stripe_customer_id as string | null;
    if (!customer) {
      const created = await stripe.customers.create({
        email: user.email ?? undefined,
        name: profile.full_name ?? undefined,
        metadata: { user_id: user.id },
      });
      customer = created.id;
      await db.from("profiles").update({ stripe_customer_id: customer }).eq("id", user.id);
    }

    // deno-lint-ignore no-explicit-any
    const unit = profile.units as any;
    const home = `${unit.number} ${unit.street}`;
    const metadata = { unit_id: profile.unit_id, user_id: user.id };

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      mode: "payment",
      customer,
      payment_method_types: ["us_bank_account"],
      payment_method_options: {
        us_bank_account: { financial_connections: { permissions: ["payment_method"] } },
      },
      line_items: [{
        quantity: 1,
        price_data: { currency: "usd", unit_amount: amount, product_data: { name: `Rent payment — ${home}` } },
      }],
      payment_intent_data: { description: `Rent — ${home}`, metadata },
      metadata,
      redirect_on_completion: "if_required",
      return_url: `${SITE_URL}/?checkout={CHECKOUT_SESSION_ID}#account`,
    });

    return reply({ client_secret: session.client_secret });
  } catch (err) {
    console.error(err);
    return reply({ error: "The payment couldn't be started. Try again in a minute." }, 500);
  }
});
