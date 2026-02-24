/*
 * MAC Development Co. — Stripe Payment Worker
 * 
 * This Cloudflare Worker creates Stripe Checkout sessions for ACH payments.
 * It runs on Cloudflare's free tier (100k requests/day).
 *
 * ═══════════════════════════════════════════
 *   SETUP INSTRUCTIONS
 * ═══════════════════════════════════════════
 *
 *  1. Go to dash.cloudflare.com → sign up (free)
 *  2. Click "Workers & Pages" in the left sidebar
 *  3. Click "Create" → "Create Worker"
 *  4. Name it: mac-payments
 *  5. Click "Deploy" (deploys default hello-world)
 *  6. Click "Edit Code" → paste THIS ENTIRE FILE → "Deploy"
 *  7. Go to Settings → Variables → Add:
 *       - STRIPE_SECRET_KEY = sk_live_YOUR_SECRET_KEY (type: Secret)
 *       - SITE_URL = https://mdco.homes
 *  8. Your worker URL will be: https://mac-payments.YOURNAME.workers.dev
 *  9. Put that URL in STRIPE_CONFIG.backendUrl in your App.jsx
 * 10. Set STRIPE_CONFIG.enabled = true in App.jsx
 *
 * ═══════════════════════════════════════════
 */

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders(env.SITE_URL || "*"),
      });
    }

    const url = new URL(request.url);

    // ── Create Checkout Session ──
    if (url.pathname === "/create-checkout-session" && request.method === "POST") {
      try {
        const { amount, propertyName, propertyCode, payFor } = await request.json();

        // Validate
        if (!amount || amount <= 0) {
          return jsonResponse({ error: "Invalid amount" }, 400, env.SITE_URL);
        }
        if (amount > 50000) {
          return jsonResponse({ error: "Amount exceeds maximum" }, 400, env.SITE_URL);
        }

        // Create Stripe Checkout Session
        const session = await createCheckoutSession(env.STRIPE_SECRET_KEY, {
          amount: Math.round(amount * 100), // Convert to cents
          propertyName: propertyName || "Rent Payment",
          propertyCode: propertyCode || "",
          payFor: payFor || "Rent",
          returnUrl: `${env.SITE_URL || "https://mdco.homes"}/?payment=success&amount=${amount}`,
        });

        return jsonResponse({ clientSecret: session.client_secret }, 200, env.SITE_URL);

      } catch (err) {
        console.error("Checkout session error:", err);
        return jsonResponse({ error: "Failed to create payment session" }, 500, env.SITE_URL);
      }
    }

    // ── Check Session Status ──
    if (url.pathname === "/session-status" && request.method === "GET") {
      try {
        const sessionId = url.searchParams.get("session_id");
        if (!sessionId) {
          return jsonResponse({ error: "Missing session_id" }, 400, env.SITE_URL);
        }

        const session = await getSession(env.STRIPE_SECRET_KEY, sessionId);
        return jsonResponse({
          status: session.status,
          payment_status: session.payment_status,
          amount_total: session.amount_total,
        }, 200, env.SITE_URL);

      } catch (err) {
        return jsonResponse({ error: "Failed to retrieve session" }, 500, env.SITE_URL);
      }
    }

    return new Response("MAC Development Co. Payment API", { status: 200 });
  },
};

// ── Stripe API Helpers ──

async function createCheckoutSession(secretKey, { amount, propertyName, propertyCode, payFor, returnUrl }) {
  const params = new URLSearchParams();
  params.append("mode", "payment");
  params.append("ui_mode", "embedded");
  params.append("payment_method_types[]", "us_bank_account");
  params.append("line_items[0][price_data][currency]", "usd");
  params.append("line_items[0][price_data][product_data][name]", `${payFor} — ${propertyName}`);
  params.append("line_items[0][price_data][product_data][description]", `Property: ${propertyName}${propertyCode ? ` (Code: ${propertyCode})` : ""}`);
  params.append("line_items[0][price_data][unit_amount]", String(amount));
  params.append("line_items[0][quantity]", "1");
  params.append("return_url", returnUrl);
  // Optional: collect billing address
  params.append("payment_method_options[us_bank_account][financial_connections][permissions][]", "payment_method");
  params.append("payment_method_options[us_bank_account][verification_method]", "automatic");

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!res.ok) {
    const err = await res.json();
    console.error("Stripe error:", JSON.stringify(err));
    throw new Error(err.error?.message || "Stripe API error");
  }

  return res.json();
}

async function getSession(secretKey, sessionId) {
  const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
    headers: { "Authorization": `Bearer ${secretKey}` },
  });
  if (!res.ok) throw new Error("Failed to get session");
  return res.json();
}

// ── CORS ──

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function jsonResponse(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(origin),
    },
  });
}
