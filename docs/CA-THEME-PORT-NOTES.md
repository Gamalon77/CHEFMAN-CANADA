# Chefman Canada — US design port + bilingual (EN / FR‑CA) setup

**Branch:** `test-bench` (synced to the Chefman CA **test** theme)
**Source design:** US theme *Concept* v4 (`chefmancom / main`)
**Strategy:** *Safe design port* — CA remains the base; US colors, fonts, and
specific redesigned sections were layered on; CA logos and app integrations
preserved.
**Localization model:** **English is the source language** (theme base +
Shopify primary); **French Canadian is a translation layer** served via Shopify
**Translate & Adapt**, and set as the default language shown to Canadian visitors.

> ⚠️ `test-bench` = your **test** theme. Nothing here touches live (`main`).

---

## 1. What changed in the theme (done in this repo)

### Design
- **Colors** → navy `#121e2a` + orange accent `#FB4616` (16 global settings).
  **CA logos, favicon, and social links preserved.**
- **Fonts** → **Instrument Sans** (Google Fonts, body 400 / headings 600) via
  `snippets/css-variables.liquid`.
- **Redesigned sections ported:** `video`, `main-collection-banner`,
  `collection-list`, `contact-form`, `main-list-collections`, `recently-viewed`.
- **Redesigned snippets ported:** `product-card`, `predictive-search`, `video`,
  `collection-card`.
- **Added US-only templates (28)** + their **8 sections** and **10 snippets**.
- **Renamed** the product line **"Performance Series" → "reForm Collection"** in
  all customer‑facing display text (handles/URLs/filenames unchanged — see §5).

### Localization (bilingual toggle)
- The header **language switcher is enabled** (desktop + mobile). It shows every
  language you **publish** in *Settings → Languages*.
- **Theme base content is English** (`en.default.json` is the default locale;
  template/section text is authored in English).
- **French UI strings** ship in `locales/fr.json` (normalized to Canadian French,
  e.g. "Courriel").
- **All 776 baked content strings were translated to Canadian French** (with
  imperial→metric conversion) and are provided as
  **`docs/fr-ca-translations.csv`** for loading into Translate & Adapt.

---

## 2. How the bilingual toggle works (what makes copy switch)

| Copy type | Switches automatically? | How |
|-----------|------------------------|-----|
| Theme UI (buttons, cart, forms, search, account) | ✅ Yes, already | `locales/en.default.json` ↔ `locales/fr.json` |
| Baked section/template content (headings, rich text, FAQ) | ⚠️ Only after setup | Register the **French** versions in **Translate & Adapt** (theme content). Source data is in `docs/fr-ca-translations.csv`. |
| Products, collections, pages, blogs, **menus** | ⚠️ Only after setup | Translate in **Translate & Adapt** (auto‑translate then review). |

**Why:** Shopify stores non‑primary‑language content in its database, not in the
theme. A template's JSON holds exactly one language (English here); the French is
layered on via Translate & Adapt. No theme code can swap baked content by locale.

---

## 3. Admin steps to make the toggle fully bilingual

1. **Publish languages.** *Settings → Languages* → keep **English** as primary;
   **Add language → French (Canada)**.
2. **Show French by default in Canada** (optional but matches the goal): in
   *Settings → Markets → Canada*, set **French (Canada)** as the default language
   for the market. English stays available via the toggle.
3. **Translate theme content** in **Translate & Adapt → Theme**: enter the French
   from **`docs/fr-ca-translations.csv`** (777 EN→FR‑CA pairs, already metric).
   *Tip:* export the app's CSV, then fill the French column by matching the
   English source against this file (I can script that match if you share the
   export, or bulk‑load via the Translation API if you provide an Admin API key).
4. **Translate products / collections / pages / blogs** in Translate & Adapt
   (use auto‑translate, then review). **Convert product‑spec measurements to
   metric** here too — those live in product data, not the theme.
5. **Translate navigation menus** (*Online Store → Navigation* labels via
   Translate & Adapt).

---

## 4. Intentionally KEPT CA (not ported) — and why

| File | Why |
|------|-----|
| `snippets/header-logo.liquid` | US version **hardcodes US logo SVGs** — kept CA logos. |
| `sections/footer.liquid` | US version hardcodes a US asset (`Chefman-Arcade.svg`). |
| `snippets/social-icons.liquid` | US version hardcodes a cross‑store WhatsApp image. |
| `sections/collage.liquid`, `collage-grid.liquid` | US redesign needs US‑only `theme.css` rules. |
| `assets/theme.css`, `theme.js`, other assets | Kept per the "safe" strategy (US assets carried store‑specific assumptions). |
| `snippets/wcp_*` | Kept to protect CA's currency/discount integration. |

---

## 5. Behavior / content to verify on the test theme

- **Product cards — sold‑out items:** the ported `product-card` shows a
  "Notify / Back in Stock" button (US design) instead of a disabled "Sold out"
  button; it needs the *Back in Stock* app or falls back to the product page.
  Tell me if you'd rather revert this.
- **`kettle-finder.liquid`** now labels a kettle type "reForm Collection" but its
  description still says *"the digital counterpart to reForm"* — in that finder
  those were two distinct lines. Confirm whether it should stay separate.
- **`performance-series` plumbing not renamed:** the collection **handle**
  (`/collections/performance-series`), template filenames
  (`collection.performance-series*.json`), and image files
  (`performance-series-banner2.jpg`) are unchanged — renaming them requires a
  matching collection‑handle + file rename in Shopify (plus a URL redirect). Say
  the word and I'll do the theme side once the handle is changed in admin.
- US‑added templates reference US products/collections/pages by handle — they'll
  be empty until matching CA resources exist (collections `chef-iq`,
  `slow-cookers`, etc.; the `coffee-*`/`kettle-*` pages).
- **Google Fonts:** Instrument Sans loads from `fonts.googleapis.com` — confirm
  this is OK for privacy (Québec Law 25); I can self‑host it if not.
- The contact page still lists a US address alongside the Canadian ones.

---

## 6. Preview / promote
- `test-bench` → your **test** theme (auto‑syncs on push).
- When approved, promote to live by merging `test-bench` → `main`.
