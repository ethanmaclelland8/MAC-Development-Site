# MAC Development Co. — mac-dev.co

Company site plus a resident portal: residents create an account from a sign-up link, see their balance, pay rent by bank transfer (ACH through Stripe), and send maintenance requests. You get an admin page for rents, sign-up links, payments and requests.

Hosted on GitHub Pages. Every change saved to `main` publishes automatically in about a minute (see the **Actions** tab).

**First time?** Follow **[SETUP.md](SETUP.md)** to turn on logins and bank payments.

## Updating the site

Almost everything is in **`src/content.js`**. On GitHub: open the file → pencil icon → edit → **Commit changes**.

| To change… | Edit |
| --- | --- |
| The look (bright / sage / graphite) | `THEME` in `src/content.js` |
| Phone, email, mailing address | `CONTACT` in `src/content.js` |
| Zelle, Venmo, check details | `PAYMENTS` in `src/content.js` |
| Home page text | `HOME`, `SERVICES` in `src/content.js` |
| The houses, and which one is available | `PROPERTIES` in `src/content.js` |
| Supabase and Stripe public keys | `src/config.js` |
| Rents, balances, residents | Your admin page at mac-dev.co/#admin |

Preview a different look without changing anything: add `?look=sage` (or `bright`, `graphite`) to the address.

## Links to send people

- Pay rent: `mac-dev.co/#pay`
- Log in: `mac-dev.co/#login`
- One house: `mac-dev.co/#properties/887`
- Sign-up links: create them on your admin page

## Files

- `src/content.js` — public text and settings
- `src/config.js` — Supabase + Stripe public keys
- `src/styles.css` — the three looks (colors and fonts at the top) and layout
- `src/pages/` — the pages: public, pay, login/sign-up, resident account, admin
- `supabase/migrations/001_portal.sql` — database tables and permission rules
- `supabase/functions/` — the two Stripe functions (start a payment, record Stripe updates)
- `package-lock.json` — required for the deploy; don't delete it

## Running it on your computer (optional)

```
npm install
npm run dev
```
