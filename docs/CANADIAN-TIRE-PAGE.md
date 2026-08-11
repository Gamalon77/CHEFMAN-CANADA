# Canadian Tire showcase page

A mobile-first, bilingual product showcase built for the Canadian Tire
presentation (accessed at the event by QR code).

**Files**
| File | What it is |
|------|------------|
| `sections/partner-product-showcase.liquid` | The section (grid + cards + partner logo) |
| `templates/page.canadian-tire.json` | The page template, pre-loaded with all 12 cards |
| `locales/en.default.json` → `canadian_tire.*` | English copy |
| `locales/fr.json` → `canadian_tire.*` | Canadian French copy |

---

## 1. Publish the page (2 minutes, admin)

1. **Online Store → Pages → Add page.**
2. Title it (e.g. *Canadian Tire*). The title is **not** shown on the page — the
   heading comes from the locale files so it can be bilingual — so the title only
   affects the URL.
3. On the right, under **Theme template**, choose **`canadian-tire`**.
4. **Save.** The page lives at `/pages/canadian-tire` (or whatever handle you set);
   French is served at the market's French URL, e.g. `/fr/pages/canadian-tire`.
5. Point the QR code at that URL.

> The template deliberately does **not** include the `main-page` section, so
> anything typed into the page's body editor will not render. That's intentional:
> body content would be English-only until registered in Translate & Adapt,
> whereas the section's copy is bilingual out of the box.

---

## 2. Assign the products

Each card gets its image, link and fallback title from a **product picker**.
11 of the 12 cards still need a product assigned (see the list below) — my product
data snapshot predates these SKUs, so I did not guess and risk pointing a
"Learn more" button at the wrong product in front of a buyer.

**Theme editor → the page → Partner product showcase → click a card:**
- **Product** — search the product by name. This fills in the image, the link, and
  uses Shopify's own product translations for the title.
- **Link override** — use this instead if the product isn't on the CA store yet
  (paste any URL).
- **Image override** — use if you want a specific hero shot rather than the
  product's featured image.

Cards are already labelled with the model number so you know which is which:

| Card | Model | Product assigned? |
|------|-------|-------------------|
| Obliterator Blender + 2 Travel Jars | C27-2TJ-2M-CA1 | ❌ needs product |
| Caffeinator 14-Cup Drip Coffee Maker | C14-DR14-1M-CA2 | ❌ needs product |
| 1.2 L Glass & Stainless Kettle | RJ11-12-TI-CA | ❌ needs product |
| Dual-Glass Digital Kettle | RJ11-18-SCTI-DG-HP-CA | ❌ needs product |
| 5.5 L Digital Air Fryer | RJ38-6TW-BLACK-DS-CA | ❌ needs product |
| Crispinator Air Fryer | C38-8W7-1M-CA1 | ❌ needs product |
| 2-Slice Smart Touch Toaster | RJ31-SS-T-2S-CA | ❌ needs product |
| 4-Slice Smart Touch Toaster | RJ31-SS-T-4S-CA | ❌ needs product |
| Roll n' Go Food Warming Mat | RJ22-S-BLUE-CA | ✅ `roll-n-go-food-warming-mat` |
| Crispinator MAX TOAF | C50-T25-1SS-CA1 | ❌ needs product |
| 3 L Deep Fryer | RJ07-32-SS-D-CA | ❌ needs product |
| Grillinator Submersible Grill | C02-S-1M-CA2 | ❌ needs product |

A card with no product still renders (title + blurb) but shows a dashed
placeholder where the image goes and hides its button — so it's obvious at a
glance which cards are still unwired.

---

## 3. How the bilingual copy works

Unlike the rest of the theme's baked content, this page's copy lives in the
**theme locale files**, not Translate & Adapt:

- `locales/en.default.json` → `canadian_tire`
- `locales/fr.json` → `canadian_tire`

**Why:** locale files are theme *code*. They sync through GitHub, travel to every
theme (including duplicates), and switch instantly with the header language
toggle — no import step, and nothing bound to a single theme ID. For a
time-boxed event page that has to work in both languages on the day, that is far
more reliable than a Translate & Adapt import.

**Trade-off:** copy edits happen in those two JSON files (in the repo) rather than
in the theme editor. If you'd rather hand copy control to the marketing team in
the editor, type text into a card's **Title override** / **Blurb override** — that
wins over the locale value, but it will then be English-only unless it's also
registered in Translate & Adapt.

Product **titles** are a special case: when a card has a product assigned and no
title override, the title comes from the product itself, so it uses the product
translations already loaded in Translate & Adapt.

---

## 4. Layout

Mobile-first, all in scoped CSS in the section (no dependency on utility classes
that aren't in this theme's compiled `theme.css`):

| Viewport | Columns |
|----------|---------|
| Phone (base) | **1** — the 12 cards run in a single line, as requested |
| ≥ 640px | 2 |
| ≥ 1024px | **4** — 12 cards = 3 rows of 4 |

Card order is top-to-bottom the same as the source list. Product images use
`object-fit: contain` on a light plate so nothing gets cropped, and the
"Learn more" button is pinned to the bottom of each card so buttons line up
across a row. On phones the button is full-width for an easier tap target.

---

## 5. Canadian Tire logo

Currently loaded from the URL supplied with the request:
`cdn.shopify.com/s/files/1/0714/7647/8117/files/CT_Logo.png`

That's a **cross-store CDN hotlink** — it works, but it depends on a file in
another store staying put. Before the event, upload `CT_Logo.png` to
**Content → Files** on the CA store and pick it in the section's **Partner logo**
setting; the picker takes priority over the URL. Logo height is adjustable
(default 56px), and the alt text is set to "Canadian Tire".

---

## 6. Optional toggles

- **Show colour + model number on cards** — off by default. Every card already
  stores its colourway and model number, so flipping this on adds a small line
  like `Midnight · C27-2TJ-2M-CA1` under each title. Useful for a buyer-facing
  presentation; not shown to regular shoppers.
- **Small label above the logo** — e.g. "Prepared for". Left blank because a typed
  label would be English-only.
- Heading, intro and button label are all blank in the template, which means
  "use the bilingual locale copy". Type into them only if you want to override.
