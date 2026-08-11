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

## 2. Images

The 12 product photos were pulled from `CanadianTireSelectedSKUs.pptx` and are
supplied separately as `chefman-ct-product-photos.zip`. They are clean lifestyle
shots with no text or pricing baked in, and every one is **exactly 2:3 portrait**
(750×1125, 600×900 or 1024×1536), which is why the card image shape defaults to
2:3 — the photos fill it with no letterboxing.

**To load them:** Content → **Files** → upload all 12 → then in the theme editor
pick each one on its card (**Image**). File names match the products.

### Replacing an image

Every card has two independent image slots, so a deck photo can always be swapped:

| Setting | What it does |
|---------|--------------|
| **Image** | Overrides the product's featured image. Also how you give art to a product that isn't on the store yet. |
| **Image — phone only** | Optional. Used *instead* of the above below 640px, via a `<picture>` source. For when the main shot is composed wide and reads badly on a phone. |

Section-level controls (apply to all cards, under **Card images**):
- **Image shape** — 2:3 (default), 3:4, 4:5, square, or natural.
- **Image fit** — *Contain* shows the whole photo (default, never crops a product);
  *Cover* fills the card and crops the edges.
- **Crop focus** — centre/top/bottom/left/right, used only with *Cover*.

One to watch: the **Roll 'n Go warming mat** photo is composed wide, so in a
portrait card the product sits low with empty wall above it. Either supply a
tighter crop in the **Image — phone only** slot, or switch fit to *Cover* with
crop focus *Bottom*.

---

## 3. Assign the products

Each card's **Learn more** button and fallback title come from a **product
picker**. 11 of 12 still need one assigned — the deck lists **US** model numbers
(e.g. `C38-8W7-1M-US1`) while the page uses the CA SKUs, and these products
weren't in my catalogue snapshot, so I did not guess and risk pointing a button
at the wrong product in front of a buyer.

**Theme editor → the page → Partner product showcase → click a card:**
- **Product** — search by name. Fills in the link, the image (if you haven't set
  one) and uses Shopify's own product translations for the title.
- **Link override** — use instead if the product isn't on the CA store yet.

| Card | CA model | Deck model | Product assigned? |
|------|----------|-----------|-------------------|
| Obliterator High-Speed Blender + 2 Travel Jars | C27-2TJ-2M-CA1 | C27-2TJ-2M-1US1 | ❌ |
| Caffeinator Drip 14-Cup Coffee Maker | C14-DR14-1M-CA2 | C14-DR14-1M | ❌ |
| Fast-Boil 1.2 L Glass Kettle + Tea Infuser | RJ11-12-TI-CA | RJ11-12-TI | ❌ |
| Lightning 1.8 L Digital Kettle | RJ11-18-SCTI-DG-HP-CA | RJ11-18-SCTI-HP | ❌ |
| TurboFry Touch Easy-View Air Fryer | RJ38-6TW-BLACK-DS-CA | RJ38-6TW-BLACK | ❌ |
| Crispinator 7.6 L Digital Air Fryer | C38-8W7-1M-CA1 | C38-8W7-1M-US1 | ❌ |
| Smart Touch 2-Slice Digital Toaster | RJ31-SS-T-2S-CA | RJ31-SS-T-2S | ❌ |
| Smart Touch 4-Slice Digital Toaster | RJ31-SS-T-4S-CA | RJ31-SS-T-4S | ❌ |
| Roll 'n Go Rollable Warming Mat | RJ22-S-BLUE-CA | RJ22-S-BLUE | ✅ `roll-n-go-food-warming-mat` |
| Crispinator MAX Toaster Oven + Air Fryer | C50-T25-1SS-CA1 | C50-T25-SS | ❌ |
| 3 L Stainless Steel Deep Fryer | RJ07-32-SS-D-CA | RJ07-32-SS-D | ❌ |
| Grillinator Submersible Panini Press + Grill | C02-S-1M-CA2 | C02-S-1M | ❌ |

A card with no product still renders (title + blurb) but shows a dashed
placeholder where the image goes and hides its button — so it's obvious at a
glance which cards are still unwired.

### Two specs to confirm

1. **TurboFry Touch Easy-View air fryer** — the CA SKU list calls it a
   *5.5 L Digital Air Fryer*, but the deck says **6-quart** (≈ 5.7 L). The title
   and blurb currently state **no capacity** rather than pick a number. Confirm
   which is right for Canada and it goes in.
2. **Lightning kettle** — the CA SKU carries `-DG-` (dual glass) which the US
   model (`RJ11-18-SCTI-HP`) does not, so the CA unit may differ from the deck
   spec. Copy currently describes only what the deck confirms: 1.8 L, 1750 W,
   25% faster, five presets.

All other copy is taken directly from the deck's feature lists, with imperial
converted to metric (450°F → 232 °C, 500°F → 260 °C, 8 qt → 7.6 L,
48 oz → 1.4 L, 72 oz → 2.1 L, 13" → 33 cm, 9"×13" → 23 × 33 cm,
10"×9" → 25 × 23 cm, 250–450°F → 121–232 °C).

---

## 4. How the bilingual copy works

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

## 5. Layout

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

## 6. Canadian Tire logo

Currently loaded from the URL supplied with the request:
`cdn.shopify.com/s/files/1/0714/7647/8117/files/CT_Logo.png`

That's a **cross-store CDN hotlink** — it works, but it depends on a file in
another store staying put. Before the event, upload `CT_Logo.png` to
**Content → Files** on the CA store and pick it in the section's **Partner logo**
setting; the picker takes priority over the URL. Logo height is adjustable
(default 56px), and the alt text is set to "Canadian Tire".

---

## 7. Optional toggles

- **Show colour + model number on cards** — off by default. Every card already
  stores its colourway and model number, so flipping this on adds a small line
  like `Midnight · C27-2TJ-2M-CA1` under each title. Useful for a buyer-facing
  presentation; not shown to regular shoppers.
- **Small label above the logo** — e.g. "Prepared for". Left blank because a typed
  label would be English-only.
- Heading, intro and button label are all blank in the template, which means
  "use the bilingual locale copy". Type into them only if you want to override.
