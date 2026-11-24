# MAC Development Co. website

Live at **mdco.homes**. Hosted on GitHub Pages — every change saved to `main` publishes automatically in about a minute (see the **Actions** tab).

## Updating the site

Almost everything is in **`src/content.js`**. On GitHub: open the file → pencil icon → edit → **Commit changes**.

| To change… | Edit in `src/content.js` |
| --- | --- |
| The look (clean / fieldstone / navy) | `THEME` |
| Phone, email, mailing address | `CONTACT` |
| Zelle, Venmo, check details, online pay link | `PAYMENTS` |
| Home page headline and text | `HOME`, `SERVICES` |
| The houses, and which one is available | `PROPERTIES` |
| Downloadable files | Upload to `public/files/`, then add a line to `FILES` |

Preview a different look without changing anything: add `?look=fieldstone` (or `clean`, `navy`) to the address.

Direct links for tenants: `mdco.homes/#pay`, `mdco.homes/#contact`, `mdco.homes/#properties/887`.

## Files

- `src/content.js` — all text and settings
- `src/styles.css` — the three looks (colors and fonts at the top) and layout
- `src/App.jsx` — page structure; rarely needs editing
- `package-lock.json` — required for the deploy; don't delete it

## Running it on your computer (optional)

```
npm install
npm run dev
```
