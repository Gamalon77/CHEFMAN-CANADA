# Chefman Canada — US design port + French‑Canadian / metric localization

**Branch:** `test-bench` (synced to the Chefman CA **test** theme)
**Source design:** US theme *Concept* v4 (`chefmancom / main`)
**Strategy chosen:** *Safe design port* — CA remains the base; US colors, fonts,
and specific redesigned sections were layered on; CA content, logos, and app
integrations were preserved.

> ⚠️ This is a `test-bench` change for review. Nothing here touches the live
> (`main`) theme. Preview on the connected test theme, then we promote to `main`.

---

## 1. What changed in the theme (done in this repo)

### Design
- **Colors** → navy `#121e2a` + orange accent `#FB4616` (16 global color settings
  in `config/settings_data.json`). **CA logos, favicon, white logos, and social
  links were preserved** (not overwritten).
- **Fonts** → **Instrument Sans** (Google Fonts, body 400 / headings 600) via
  `snippets/css-variables.liquid`. The theme's Poppins output is disabled.
- **Redesigned sections ported from US:** `video`, `main-collection-banner`,
  `collection-list`, `contact-form`, `main-list-collections`, `recently-viewed`.
- **Redesigned snippets ported from US:** `product-card`, `predictive-search`,
  `video`, `collection-card`.
- **Added US-only templates (28)** plus their **8 sections** and **10 snippets**
  (additive — see §4 for ones that need CA products/collections).

### Localization
- **French is now the default storefront + editor locale**
  (`locales/fr.default.json`, `locales/fr.default.schema.json`); **English kept
  available** (`locales/en.json`, `locales/en.schema.json`).
- French locale **normalized to Canadian French** (e.g., "Courriel").
- **776 baked content strings** (headings, buttons, FAQ, section copy) across
  templates, header/footer/overlay groups, and settings were **translated to
  Canadian French**, with **all imperial units converted to metric** (°F→°C,
  in→cm, lb→kg, qt/cup→L/mL) using French formatting (e.g., `100 °C`, `1,8 L`).
  HTML, Liquid, and brand/model names were preserved.

---

## 2. Intentionally KEPT CA (not ported) — and why

| File | Why it was kept |
|------|-----------------|
| `snippets/header-logo.liquid` | US version **hardcodes US logo SVGs** — porting would replace CA logos (you asked to keep them). |
| `sections/footer.liquid` | US version **hardcodes a US asset** (`Chefman-Arcade.svg`). CA footer keeps its content; it still gets the new colors/fonts. |
| `snippets/social-icons.liquid` | US version hardcodes a cross‑store WhatsApp image. |
| `sections/collage.liquid`, `sections/collage-grid.liquid` (+ snippets) | US redesign needs CSS rules that live only in US `theme.css`; porting would render unstyled states. |
| `assets/theme.css`, `assets/theme.js`, other assets | Kept per the "safe" strategy; US assets carried store‑specific assumptions (a newsletter‑disabled layout, an iubenda cookie‑app hide). |
| `snippets/wcp_*` (currency/discount app) | Kept to protect CA's pricing/discount integration. |

These can be revisited later if you want a closer match to the US look.

---

## 3. Behavior change to verify on the test theme

- **Product cards — sold‑out items:** the ported `product-card` now shows a
  **"Notify / Back in Stock"** button (from the US design) instead of a disabled
  "Sold out" button. It opens the *Back in Stock* app popup **if that app is
  installed**; otherwise it **links to the product page** (graceful fallback).
  If you don't want this on CA, we revert `snippets/product-card.liquid`.

---

## 4. MUST be done in Shopify Admin (cannot be done from the theme repo)

The theme controls layout + theme UI text. The **content a shopper reads**
(products, collections, pages, menus) lives in the Shopify **database**, so the
following has to happen in admin:

1. **Publish the language.** Settings → Languages → add **French (Canada)**; set
   it as the store's default/primary if you want French‑first URLs. Keep English
   as a secondary language. (The theme is already configured for French‑default +
   English.)
2. **Translate database content** with **Translate & Adapt** (free Shopify app)
   or **Markets**:
   - Product **titles, descriptions, options, and metafields**
   - **Collection** titles/descriptions
   - **Page** and **blog** content
   - **Navigation menu** labels (Online Store → Navigation)
   - The **English secondary** versions of the baked section content (the theme
     now holds French as the primary text; English is layered here).
3. **Convert product‑spec MEASUREMENTS to metric in product data.** Dimensions,
   capacities, wattage, and temperatures in **product descriptions/metafields**
   are in the DB — convert them in admin or via a CSV/metafield update. (The
   theme's own baked copy was already converted.)
4. **Wire up the added US templates** — they reference US products/collections/
   pages by handle and will be **empty until matching CA resources exist** or the
   templates are assigned:
   - Collections: `chef-iq`, `new-iceman`, `performance-series-2026`,
     `promo-activation`, `slow-cookers`
   - Pages: `coffee-capsule/drip/espresso/finder`, `kettle-*` (finder, fast-boil,
     gooseneck, keep-warm, stainless-steel, tea-infuser, temperature-control),
     `bean-catcher`, `scoop-catcher`, `perfect-pour`, `brand-promoters(-20)`,
     `consent`, `rj54-cs-getting-started`, `user-guide-with-video`,
     `video-playlist`; product template `coming-soon`
   - `search.bss.product.labels.liquid` and `search.wlm-api.liquid` depend on the
     BSS / WLM apps being installed.
5. **Google Fonts note:** Instrument Sans loads from `fonts.googleapis.com`.
   Confirm this is acceptable for performance/privacy (Québec Law 25 / PIPEDA);
   if not, we can self‑host the font in `assets/`.
6. **Contact page** still lists a US address (`131 Greene St, New York`) alongside
   the Canadian ones — update store locations in admin as needed.

---

## 5. How to preview / promote
- `test-bench` → your **test** theme (auto‑syncs on push). Review there.
- When approved, promote to live by merging `test-bench` → `main` (the live theme).
