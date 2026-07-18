/**
 * Webhook server. Shopify calls POST /webhooks/shopify when a product,
 * collection, page, etc. is created or updated. We verify the HMAC, ack
 * immediately, then translate in the background.
 *
 * Recommended webhook topics (create in the Shopify admin or via the API):
 *   products/create, products/update,
 *   collections/create, collections/update,
 *   pages/create, pages/update
 *
 * IMPORTANT: mount express.raw() so the exact bytes are available for HMAC
 * verification — JSON body parsing would change the payload and break it.
 */

import express, { type Request, type Response } from "express";
import { config } from "./config";
import { verifyWebhookHmac, gidFromWebhook } from "./shopify";
import { translateResource } from "./handler";

const app = express();

app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true, targetLocale: config.targetLocale, dryRun: config.dryRun });
});

app.post(
  "/webhooks/shopify",
  express.raw({ type: "application/json" }),
  (req: Request, res: Response) => {
    const raw: Buffer = req.body;
    const hmac = req.header("X-Shopify-Hmac-Sha256");

    if (!verifyWebhookHmac(raw, hmac)) {
      console.warn("Rejected webhook: invalid HMAC");
      res.status(401).send("invalid hmac");
      return;
    }

    const topic = req.header("X-Shopify-Topic") || "";

    let payload: { id?: number | string; admin_graphql_api_id?: string };
    try {
      payload = JSON.parse(raw.toString("utf8"));
    } catch {
      res.status(400).send("bad json");
      return;
    }

    // Shopify includes the GID directly on most payloads; fall back to building it.
    const gid =
      payload.admin_graphql_api_id ||
      (payload.id != null ? gidFromWebhook(topic, payload.id) : null);

    // Ack immediately — Shopify times out webhooks after ~5s.
    res.status(200).send("ok");

    if (!gid) {
      console.warn(`No usable resource id for topic "${topic}"`);
      return;
    }

    // Fire and forget; log any failure.
    translateResource(gid)
      .then((r) =>
        console.log(
          `Done ${r.resourceId}: ${r.fieldsTranslated}/${r.fieldsFound} translated` +
            (r.dryRun ? " (dry run)" : ""),
        ),
      )
      .catch((err) => console.error(`Translate failed for ${gid}:`, err));
  },
);

app.listen(config.port, () => {
  console.log(
    `fr-CA auto-translate listening on :${config.port} ` +
      `(locale=${config.targetLocale}, dryRun=${config.dryRun}, model=${config.model})`,
  );
});
