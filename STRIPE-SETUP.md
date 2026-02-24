# Stripe Payment Integration — Setup Guide

## How It Works

Your site now has three real payment methods:

1. **ACH Bank Transfer** (via Stripe) — Tenant enters bank details directly on your site. Stripe processes the payment. Money hits your account in 3-5 business days. Fee: 0.8%.

2. **Zelle** — Tenant sees your Zelle email + instructions. They send from their bank app. You confirm receipt. No fees.

3. **Venmo** — Same flow as Zelle but with your Venmo handle. Fee: 1.9% + $0.10 for business accounts.

---

## Step 1: Create Stripe Account (5 min)

1. Go to [stripe.com](https://stripe.com) → Sign Up
2. Business name: **MAC Development Co.**
3. Business type: Your LLC or sole proprietorship
4. Enter your EIN
5. Add your bank account for payouts
6. Complete identity verification

## Step 2: Get Your API Keys

1. In Stripe Dashboard → **Developers** → **API Keys**
2. Copy your **Publishable key** (`pk_live_...`)
3. Copy your **Secret key** (`sk_live_...`)
4. Keep the secret key safe — never put it in frontend code

## Step 3: Enable ACH Payments in Stripe

1. Stripe Dashboard → **Settings** → **Payment Methods**
2. Enable **ACH Direct Debit** (also called "US bank account")
3. This lets tenants pay directly from their bank account

## Step 4: Deploy the Backend Worker (10 min)

The backend is a tiny Cloudflare Worker (free) that securely creates payment sessions.

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → Create account (free)
2. Click **Workers & Pages** in left sidebar
3. Click **Create** → **Create Worker**
4. Name it: `mac-payments`
5. Click **Deploy** (this deploys a placeholder)
6. Click **Edit Code**
7. Delete everything in the editor
8. Open the `worker.js` file from this package
9. Copy ALL of its contents → Paste into the Cloudflare editor
10. Click **Deploy**
11. Go to **Settings** → **Variables and Secrets**
12. Add these environment variables:

| Variable | Value | Type |
|----------|-------|------|
| STRIPE_SECRET_KEY | sk_live_YOUR_SECRET_KEY | **Encrypt** (secret) |
| SITE_URL | https://mdco.homes | Text |

13. Your worker URL is: `https://mac-payments.YOURNAME.workers.dev`

## Step 5: Update Your Site Code

Open `src/App.jsx` and find the `STRIPE_CONFIG` section near the top. Update:

```js
const STRIPE_CONFIG = {
  publishableKey: "pk_live_YOUR_ACTUAL_KEY",
  backendUrl: "https://mac-payments.YOURNAME.workers.dev",
  enabled: true,  // ← Change to true
};
```

Also update `PAYMENT_INFO` with your real details:

```js
const PAYMENT_INFO = {
  zelleEmail: "your-real-zelle-email@gmail.com",
  venmoHandle: "@YourVenmoHandle",
  companyName: "MAC Development Co.",
};
```

## Step 6: Push Changes

```bash
git add .
git commit -m "Enable Stripe payments"
git push
```

Wait for GitHub Actions to deploy (~1 min), then test at https://mdco.homes

---

## Testing

### Test Mode (recommended first)
Use Stripe's test keys instead of live keys:
- Publishable: `pk_test_...`
- Secret: `sk_test_...`

Test bank account: Use routing `110000000` and account `000123456789`

### Go Live
Swap test keys for live keys in both:
1. `App.jsx` → STRIPE_CONFIG.publishableKey
2. Cloudflare Worker → STRIPE_SECRET_KEY variable

---

## Payment Flow Summary

```
Tenant visits mdco.homes → Pay Rent
    ↓
Enters house code + password → Verified
    ↓
Sees balance, enters amount, picks method
    ↓
┌─── ACH ──────────────────────────────────┐
│ Stripe Checkout form loads ON your site   │
│ Tenant enters bank details                │
│ Stripe processes ACH transfer             │
│ 3-5 business days to settle               │
│ 0.8% fee                                  │
└───────────────────────────────────────────┘
┌─── Zelle ────────────────────────────────┐
│ Shows your Zelle email + instructions     │
│ Tenant sends from their bank app          │
│ Enters confirmation number on site        │
│ Instant transfer, no fees                 │
└───────────────────────────────────────────┘
┌─── Venmo ────────────────────────────────┐
│ Shows your Venmo handle + instructions    │
│ Tenant sends from Venmo app               │
│ Enters confirmation on site               │
│ Instant transfer, 1.9% + $0.10 fee       │
└───────────────────────────────────────────┘
```

## Monthly Costs

| Service | Cost |
|---------|------|
| Stripe | 0.8% per ACH transaction (capped at $5) |
| Cloudflare Worker | Free (100k requests/day) |
| GitHub Pages | Free |
| Zelle | Free |
| Venmo Business | 1.9% + $0.10 per transaction |
