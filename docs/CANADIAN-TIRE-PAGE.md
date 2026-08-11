# Canadian Tire page (`ct-showcase` template)

**Rebuilt Aug 11 using only the theme's own sections** — one `rich-text` header
plus twelve `image-with-text` sections (alternating image-left / image-right),
one per product. These are the same battle-tested sections the rest of the
store runs on (the Crispinator Resources page is built the same way), so they
render reliably and stack naturally on mobile: image, then copy, straight down
the page.

The earlier custom-section build (`sections/ct-showcase.liquid`,
`sections/partner-product-showcase.liquid`, `templates/page.canadian-tire.json`)
is superseded and can be deleted once this page is confirmed. Its unsolved
rendering issue on this store is documented at the bottom.

---

## 1. Finish the page (theme editor, ~10 minutes)

1. Make sure the **CT Catalog** page (Pages) has **Theme template: `ct-showcase`**.
2. Upload the 12 product photos from `chefman-ct-product-photos.zip` and
   `CT_Logo.png` to **Content → Files**.
3. Open the page in the theme editor. For each *Image with text* section, pick
   that product's photo (**Image** setting). Sections are ordered the same as
   the deck; each one's heading tells you which product it is.
4. In the top *Rich text* section, pick the Canadian Tire logo in the image
   block.
5. Point the QR code at the page URL.

Each product section shows: **title** (heading block), **colour · model number**
(subheading block, e.g. *Midnight · C27-2TJ-2M-CA1*), and the **blurb** (text
block). Delete the subheading block in any section if you don't want the model
line shown.

## 2. Editing copy

Everything is a normal theme-editor field now — click a section, edit the
heading/subheading/text blocks directly. No repo involvement.

## 3. French

Theme-section content translates the standard way: **Translate & Adapt →
(theme) → the ct-showcase template**, same as every other page on the store.
Auto-translate will do a decent first pass; our reviewed French for all twelve
titles and blurbs lives in `locales/fr.json` under `canadian_tire.cards.*`
(keys `name`/`blurb`) — copy from there for exact wording. Keep product names
(Obliterator, Crispinator, Grillinator, Fast-Boil, Lightning, TurboFry Touch,
Smart Touch, Roll 'n Go, Caffeinator Drip, MAX) untranslated; all measurements
are already metric in both languages.

## 4. Image tips

- Photos are all 2:3 portrait. `image_height` is set to 450px per section;
  adjust per-section if a shot needs more room.
- Every section also has an **image_mobile** setting for a phone-specific crop.
- The Roll 'n Go photo is composed wide (product low in frame) — it may look
  better with a taller `image_height` or a custom mobile crop.

---

## Appendix: the custom-section incident (unresolved, parked)

The original build used a custom grid section. On this store its headings —
`h1`, `h2`, later even a `role="heading"` paragraph inside an otherwise-working
container — were laid out and hit-testable with correct computed styles
(including a JS-injected yellow background) yet never painted, in multiple
browsers including incognito and mobile. Fifteen on-page diagnostics ruled out:
Liquid logic, stored settings, locale files, fonts (`display=swap`, loaded),
class-based CSS, stale sync (fresh filenames reproduced it), duplicate
sections, and browser extensions. The one store-side suspect never cleared is
whatever processes heading-like elements client-side. If a future custom
section shows the same symptom, start there — and note the theme's own
sections never exhibited it, which is why this page uses them.
