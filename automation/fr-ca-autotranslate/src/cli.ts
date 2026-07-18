/**
 * CLI for one-off / backfill translation, without going through a webhook.
 *
 * Usage:
 *   npm run backfill -- gid://shopify/Product/1234567890
 *   npm run backfill -- gid://shopify/Product/123 gid://shopify/Collection/456
 *
 * Honors DRY_RUN in .env — set DRY_RUN=true first to preview without writing.
 */

import { translateResource } from "./handler";

async function main() {
  const gids = process.argv.slice(2).filter((a) => a.startsWith("gid://"));

  if (gids.length === 0) {
    console.error("Usage: npm run backfill -- <resource-gid> [<resource-gid> ...]");
    console.error("Example: npm run backfill -- gid://shopify/Product/1234567890");
    process.exit(1);
  }

  for (const gid of gids) {
    try {
      const r = await translateResource(gid);
      console.log(
        `${r.resourceId}: ${r.fieldsTranslated}/${r.fieldsFound} translated` +
          (r.skipped.length ? `, skipped ${r.skipped.length}` : "") +
          (r.dryRun ? " (dry run)" : ""),
      );
    } catch (err) {
      console.error(`Failed ${gid}:`, err);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
