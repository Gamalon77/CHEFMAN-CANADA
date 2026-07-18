# Chefman CA — French-Canadian auto-translate service

A small TypeScript service that keeps the Chefman **Canada** storefront's
French translations in sync with English content **automatically**. When a
product, collection, or page is created or updated in Shopify, the store fires
a webhook here; the service translates the new/changed English fields to
Canadian French (fr-CA) — converting measurements to metric — and writes the
translations back through Shopify's Translation API.

It reuses the exact same rules that produced the bulk
[`docs/fr-ca-translations.csv`](../../docs/fr-ca-translations.csv) import:
brand/product names are never translated, all imperial units are converted to
metric, and HTML/Liquid is preserved.

> This lives in `automation/` on purpose — Shopify's GitHub integration only
> syncs recognized theme folders, so this service is **ignored by the theme
> sync**. It is deployed separately (see below), not as part of the theme.

---

## How it works

```
Shopify (product/collection/page create|update)
        │  webhook (HMAC-signed)
        ▼
  POST /webhooks/shopify   ── verify HMAC ── ack 200 ── (background) ─┐
        │                                                             │
        ▼                                                             │
  Shopify Admin GraphQL: translatableResource                        │
        │  (English source fields + digests)                         │
        ▼                                                             │
  Claude (claude-opus-4-8): translate → fr-CA + metric               │
        │  (structured output: key → value)                          │
        ▼                                                             │
  Shopify Admin GraphQL: translationsRegister  ◄─────────────────────┘
        (writes fr translations, keyed by digest)
```

- **`src/rules.ts`** — the fr-CA system prompt: do-not-translate names,
  metric conversion rules, HTML/Liquid preservation, Québec conventions,
  glossary.
- **`src/translate.ts`** — Claude call via structured output (Zod schema),
  chunked so large descriptions stay within limits.
- **`src/shopify.ts`** — `translatableResource` read, `translationsRegister`
  write, and webhook HMAC verification.
- **`src/handler.ts`** — per-resource orchestration (fetch → filter → translate
  → register), honoring `DRY_RUN` and `SKIP_FIELDS`.
- **`src/server.ts`** — Express webhook endpoint + `/health`.
- **`src/cli.ts`** — backfill / dry-run a specific resource by GID.

---

## Setup

### 1. Create a Shopify custom app

In the Shopify admin: **Settings → Apps and sales channels → Develop apps →
Create an app**. Grant these Admin API scopes:

- `read_translations`, `write_translations`
- `read_products`
- `read_content` (pages / blogs / articles)
- `read_online_store_navigation` (menus, optional)
- `read_locales`

Install the app, then copy the **Admin API access token** (`shpat_…`) and the
app's **API secret key** (used to verify webhook HMACs).

Make sure French (`fr`, or `fr-CA` if you use it) is a **published** locale
under **Settings → Languages**, or `translationsRegister` will reject writes.

### 2. Configure

```bash
cp .env.example .env
# fill in SHOPIFY_SHOP, SHOPIFY_ADMIN_TOKEN, SHOPIFY_WEBHOOK_SECRET, ANTHROPIC_API_KEY
```

Keep `DRY_RUN=true` while testing — it translates and logs but never writes
back to Shopify.

### 3. Install & run

```bash
npm install
npm run dev      # watch mode (tsx)
# or
npm run build && npm start
```

### 4. Test before wiring up webhooks

Dry-run a single resource (get its GID from the Shopify admin URL or API):

```bash
npm run backfill -- gid://shopify/Product/1234567890
```

With `DRY_RUN=true` this prints the fr-CA translations it *would* write. Set
`DRY_RUN=false` to actually register them.

### 5. Register webhooks

Point these topics at `https://<your-deployment>/webhooks/shopify`
(Shopify admin **Settings → Notifications → Webhooks**, or via the Admin API),
using the same API secret as `SHOPIFY_WEBHOOK_SECRET`:

- `products/create`, `products/update`
- `collections/create`, `collections/update`
- `pages/create`, `pages/update`

The service verifies every webhook's HMAC and returns `401` if it doesn't
match, so only Shopify can trigger a translation.

---

## Deploying

Any Node host works (Render, Railway, Fly.io, a container, a small VM). It's a
stateless HTTP service — just set the env vars and expose the port. Requirements:

- Node 18+ (uses the built-in global `fetch`).
- A public HTTPS URL for the webhook endpoint.
- `ANTHROPIC_API_KEY` with access to `claude-opus-4-8`.

### Cost / rate notes

- One resource update = one (or a few, for long descriptions) Claude calls.
  Product descriptions dominate token cost.
- Swap `MODEL` to `claude-sonnet-5` or `claude-haiku-4-5` in `.env` to trade
  translation quality for lower cost/latency.
- The webhook acks Shopify immediately (before translating) so it never trips
  Shopify's ~5s webhook timeout.

---

## What it does **not** do

- It does not translate the theme's UI strings (`{{ ... | t }}`). Those live in
  the theme's `locales/*.json` and are edited in the repo.
- It does not touch `handle` fields by default (translating a handle changes the
  URL). Adjust via `SKIP_FIELDS`.
- It does not re-translate unchanged content. Shopify's `translationsRegister`
  is keyed by the source **digest**, so a translation stays valid until the
  English source changes — at which point the next `*/update` webhook refreshes
  it.
- It is one-directional (EN → fr-CA). English is the source of truth.

---

## Keeping rules in sync

The translation rules in `src/rules.ts` mirror
[`docs/CA-THEME-PORT-NOTES.md`](../../docs/CA-THEME-PORT-NOTES.md) and the
glossary in [`docs/fr-ca-translations.csv`](../../docs/fr-ca-translations.csv).
If you add a new product line or brand name that must stay in English, add it to
`DO_NOT_TRANSLATE` in `src/rules.ts`.
