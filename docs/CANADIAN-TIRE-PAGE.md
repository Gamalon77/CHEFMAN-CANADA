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
| **Image** | The card's photo. Swap in anything here — a different deck export, a retouched version, or a fresh studio shot. |
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

## 3. The deck is the source of truth

**`CanadianTireSelectedSKUs.pptx` is the authority for this page.** Every title,
feature and photo comes from it — not from the CA product catalogue. Nothing on
the page reads from Shopify product data, so the page is complete once the 12
images are uploaded.

Consequences worth knowing:

- **No product needs to be assigned.** The **Product** picker on each card is
  optional and left empty on all 12; it only matters if you later switch cards to
  be clickable.
- **Cards are not clickable.** There are no "Learn more" buttons, and neither the
  image nor the title is a link. (See §7 to turn that on later.)
- Titles follow the deck's own product naming, e.g. *TurboFry Touch 5.7 L
  Easy-View Air Fryer*, *Crispinator MAX Digital Toaster Oven + Air Fryer*,
  *Grillinator Submersible Panini Press & Grill*.

Cards still carry their CA model number and colourway as reference fields (and §7
can display them), mapped to the deck as follows:

| Card | CA model | Deck model |
|------|----------|-----------|
| Obliterator High-Speed Blender | C27-2TJ-2M-CA1 | C27-2TJ-2M-1US1 |
| Caffeinator Drip 14-Cup Coffee Maker | C14-DR14-1M-CA2 | C14-DR14-1M |
| Fast-Boil 1.2 L Electric Kettle with Tea Infuser | RJ11-12-TI-CA | RJ11-12-TI |
| Lightning 1.8 L Electric Kettle | RJ11-18-SCTI-DG-HP-CA | RJ11-18-SCTI-HP |
| TurboFry Touch 5.7 L Easy-View Air Fryer | RJ38-6TW-BLACK-DS-CA | RJ38-6TW-BLACK |
| Crispinator 7.6 L Digital Air Fryer | C38-8W7-1M-CA1 | C38-8W7-1M-US1 |
| Smart Touch 2-Slice Digital Toaster | RJ31-SS-T-2S-CA | RJ31-SS-T-2S |
| Smart Touch 4-Slice Digital Toaster | RJ31-SS-T-4S-CA | RJ31-SS-T-4S |
| Roll 'n Go Rollable Warming Mat | RJ22-S-BLUE-CA | RJ22-S-BLUE |
| Crispinator MAX Digital Toaster Oven + Air Fryer | C50-T25-1SS-CA1 | C50-T25-SS |
| 3 L Stainless Steel Deep Fryer | RJ07-32-SS-D-CA | RJ07-32-SS-D |
| Grillinator Submersible Panini Press & Grill | C02-S-1M-CA2 | C02-S-1M |

### Metric conversions applied

All imperial figures in the deck were converted for both languages:
6 qt → 5.7 L · 8 qt → 7.6 L · 48 oz → 1.4 L · 72 oz → 2.1 L ·
450°F → 232 °C · 500°F → 260 °C · 250–450°F → 121–232 °C ·
13″ → 33 cm · 9″×13″ → 23 × 33 cm · 10″×9″ → 25 × 23 cm.

Per the deck the air fryer is **6-quart (5.7 L)**, not the 5.5 L shown on the CA
SKU list. The Lightning kettle's CA unit is confirmed identical to the deck spec.

Product, brand and feature names are left untranslated: Obliterator,
Caffeinator Drip, Fast-Boil, Lightning, TurboFry Touch, Easy-View, Crispinator,
MAX, Smart Touch, Roll 'n Go, Grillinator, Hi-Fry, Auto-Blend, Bagel, Frozen.

---

## 4. Editing the copy

**You can edit any card's wording yourself, in either language, from the theme
editor — no repo change and no Translate & Adapt import.**

Each card has four copy fields, and **all four arrive pre-filled** with the copy
written from the deck, so you can read and adjust the real text in the editor
rather than guessing at an invisible default:

| Field | Appears on |
|-------|-----------|
| **Title (English)** / **Blurb (English)** | the English page only |
| **Title (French)** / **Blurb (French)** | the French page only |

Every card renders as **image → title → blurb**; the title sits directly above
its description.

The two languages are independent: correcting the French blurb does not disturb
the English one, and vice versa. Clear a field entirely and the card falls back
to the same copy held in the locale files, so a card can never end up blank.

The section decides which pair to use from the current request locale
(`request.locale.iso_code`, matching both `fr` and `fr-CA`).

### Where the default copy lives

- `locales/en.default.json` → `canadian_tire`
- `locales/fr.json` → `canadian_tire`

**Why locale files rather than Translate & Adapt:** they are theme *code*, so they
sync through GitHub, travel to every theme (including duplicates), and switch
instantly with the language toggle — no import step and nothing bound to a single
theme ID. For an event page that has to work in both languages on the day, that is
far more reliable. The per-card override fields above then give you editor-level
control on top, which is the best of both.

So: small wording fixes → theme editor. Permanent changes you want in the repo →
the two locale files (or ask me).

---

## 5. Layout

Mobile-first, all in scoped CSS in the section (no dependency on utility classes
that aren't in this theme's compiled `theme.css`):

| Viewport | Columns |
|----------|---------|
| Phone (base) | **1** — the 12 cards run in a single line, as requested |
| ≥ 640px | 2 |
| ≥ 1024px | **4** — 12 cards = 3 rows of 4 |

Card order is top-to-bottom the same as the deck list. Each card is image →
title → blurb, with images on a light plate using `object-fit: contain` so
nothing is cropped.

---

## 6. Canadian Tire logo

**If the logo isn't appearing, this is why.** It is currently loaded from the URL
supplied with the request:
`cdn.shopify.com/s/files/1/0714/7647/8117/files/CT_Logo.png`

That's a **cross-store CDN hotlink** — it points at a file in a different
Shopify store, so it can fail for reasons outside this theme (the file moving,
or the other store restricting access). I could not verify the URL from my
sandbox, so treat it as unconfirmed. The reliable fix: upload `CT_Logo.png` to
**Content → Files** on the CA store and pick it in the section's **Partner logo**
setting; the picker takes priority over the URL. Logo height is adjustable
(default 56px), and the alt text is set to "Canadian Tire".

---

## 7. Optional toggles

- **Make cards clickable** — off by default, per the brief. Turning it on adds a
  button to each card and links the image and title. It needs a destination, so
  fill in each card's **Product** or **Link** first, or the button stays hidden.
- **Show colour + model number on cards** — off by default. Every card already
  stores its colourway and model number, so flipping this on adds a small line
  like `Midnight · C27-2TJ-2M-CA1` under each title. Useful for a buyer-facing
  presentation; not shown to regular shoppers.
- **Small label above the logo** — e.g. "Prepared for". Left blank because a typed
  label would be English-only.
- Heading, intro and button label are all blank in the template, which means
  "use the bilingual locale copy". Type into them only if you want to override.
