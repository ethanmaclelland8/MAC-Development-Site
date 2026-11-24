// Receives payment updates from Stripe and records them in the database.
// ACH takes about 4 business days: a payment is saved as "processing"
// when the resident submits it, then marked "succeeded" or "failed".
//
// Secrets (Supabase → Edge Functions → Secrets):
//   STRIPE_SECRET_KEY       sk_live_...
//   STRIPE_WEBHOOK_SECRET   whsec_...
//
// In Stripe → Developers → Webhooks, add this function's URL and select:
//   checkout.session.completed
//   checkout.session.async_payment_succeeded
//   checkout.session.async_payment_failed
import Stripe from "npm:stripe@17.7.0";
import { createClient } from "npm:@supabase/supabase-js@2.49.4";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
  httpClient: Stripe.createFetchHttpClient(),
});
const cryptoProvider = Stripe.createSubtleCryptoProvider();

Deno.serve(async (req) => {
  const signature = req.headers.get("Stripe-Signature");
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body, signature ?? "", Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "", undefined, cryptoProvider,
    );
  } catch (err) {
    console.error("Bad signature", err);
    return new Response("Invalid signature", { status: 400 });
  }

  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false },
  });

  const session = event.data.object as Stripe.Checkout.Session;
  const status =
    event.type === "checkout.session.async_payment_failed" ? "failed"
    : event.type === "checkout.session.async_payment_succeeded" ? "succeeded"
    : event.type === "checkout.session.completed" ? (session.payment_status === "paid" ? "succeeded" : "processing")
    : null;

  if (!status || !session.metadata?.unit_id) return new Response("ignored", { status: 200 });

  const row = {
    stripe_session_id: session.id,
    stripe_payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null,
    unit_id: session.metadata.unit_id,
    user_id: session.metadata.user_id || null,
    amount_cents: session.amount_total ?? 0,
    method: "ach",
    status,
    updated_at: new Date().toISOString(),
  };

  // Never move a finished payment back to "processing" if events arrive out of order.
  if (status === "processing") {
    const { data: existing } = await db.from("payments").select("status").eq("stripe_session_id", session.id).maybeSingle();
    if (existing && existing.status !== "processing") return new Response("ok", { status: 200 });
  }

  const { error } = await db.from("payments").upsert(row, { onConflict: "stripe_session_id" });
  if (error) {
    console.error(error);
    return new Response("Database error", { status: 500 }); // Stripe will retry
  }
  return new Response("ok", { status: 200 });
});
