function req(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name} (see .env.example)`);
  return v;
}

export const config = {
  shop: req("SHOPIFY_SHOP"),
  adminToken: req("SHOPIFY_ADMIN_TOKEN"),
  apiVersion: process.env.SHOPIFY_API_VERSION || "2025-01",
  webhookSecret: req("SHOPIFY_WEBHOOK_SECRET"),

  targetLocale: process.env.TARGET_LOCALE || "fr",
  skipFields: (process.env.SKIP_FIELDS || "handle")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),

  // ANTHROPIC_API_KEY is read directly by the SDK.
  model: process.env.MODEL || "claude-opus-4-8",

  port: parseInt(process.env.PORT || "3000", 10),
  dryRun: process.env.DRY_RUN === "true",
};
