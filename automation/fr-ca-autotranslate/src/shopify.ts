/**
 * Thin Shopify Admin GraphQL client for translation read/write, plus webhook
 * HMAC verification.
 *
 * Docs:
 *   - translatableResource query:   https://shopify.dev/docs/api/admin-graphql/latest/queries/translatableResource
 *   - translationsRegister mutation: https://shopify.dev/docs/api/admin-graphql/latest/mutations/translationsRegister
 */

import crypto from "node:crypto";
import { config } from "./config";

const endpoint = `https://${config.shop}/admin/api/${config.apiVersion}/graphql.json`;

async function graphql<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": config.adminToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Shopify GraphQL HTTP ${res.status}: ${body.slice(0, 500)}`);
  }

  const json = (await res.json()) as { data?: T; errors?: unknown };
  if (json.errors) {
    throw new Error(`Shopify GraphQL errors: ${JSON.stringify(json.errors).slice(0, 800)}`);
  }
  return json.data as T;
}

/** One translatable field of a resource, with the digest needed to write it back. */
export interface TranslatableField {
  key: string;
  /** English source value. */
  value: string;
  /** Required by translationsRegister to prove we translated the current source. */
  digest: string;
  /** Source locale of the value (e.g. "en"). */
  locale: string;
}

const TRANSLATABLE_QUERY = /* GraphQL */ `
  query translatable($id: ID!) {
    translatableResource(resourceId: $id) {
      resourceId
      translatableContent {
        key
        value
        digest
        locale
      }
    }
  }
`;

/** Fetch every translatable field for a resource GID (product, page, collection, ...). */
export async function getTranslatableContent(resourceId: string): Promise<TranslatableField[]> {
  const data = await graphql<{
    translatableResource: {
      translatableContent: Array<{ key: string; value: string | null; digest: string | null; locale: string }>;
    } | null;
  }>(TRANSLATABLE_QUERY, { id: resourceId });

  const resource = data.translatableResource;
  if (!resource) return [];

  return resource.translatableContent
    .filter((c): c is { key: string; value: string; digest: string; locale: string } =>
      Boolean(c.value) && Boolean(c.digest),
    )
    .map((c) => ({ key: c.key, value: c.value, digest: c.digest, locale: c.locale }));
}

const REGISTER_MUTATION = /* GraphQL */ `
  mutation register($id: ID!, $translations: [TranslationInput!]!) {
    translationsRegister(resourceId: $id, translations: $translations) {
      translations {
        key
        locale
        value
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export interface RegisterInput {
  key: string;
  value: string;
  /** Must be the digest from the matching TranslatableField at translation time. */
  translatableContentDigest: string;
}

/** Write translations for a resource into the target locale. */
export async function registerTranslations(
  resourceId: string,
  translations: RegisterInput[],
): Promise<void> {
  if (translations.length === 0) return;

  const payload = translations.map((t) => ({
    locale: config.targetLocale,
    key: t.key,
    value: t.value,
    translatableContentDigest: t.translatableContentDigest,
  }));

  const data = await graphql<{
    translationsRegister: { userErrors: Array<{ field: string[]; message: string }> };
  }>(REGISTER_MUTATION, { id: resourceId, translations: payload });

  const errors = data.translationsRegister.userErrors;
  if (errors && errors.length) {
    throw new Error(`translationsRegister userErrors: ${JSON.stringify(errors)}`);
  }
}

/**
 * Verify a Shopify webhook's HMAC-SHA256 signature against the raw request body.
 * Uses a constant-time comparison to avoid timing leaks.
 */
export function verifyWebhookHmac(rawBody: Buffer, hmacHeader: string | undefined): boolean {
  if (!hmacHeader) return false;

  const digest = crypto
    .createHmac("sha256", config.webhookSecret)
    .update(rawBody)
    .digest("base64");

  const a = Buffer.from(digest, "utf8");
  const b = Buffer.from(hmacHeader, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/**
 * Build a Shopify Admin GID from a webhook payload's numeric id + topic.
 * e.g. topic "products/update", id 123 -> "gid://shopify/Product/123".
 */
export function gidFromWebhook(topic: string, numericId: number | string): string | null {
  const resource = topic.split("/")[0]; // "products", "collections", "pages", ...
  const typeMap: Record<string, string> = {
    products: "Product",
    collections: "Collection",
    pages: "Page",
    articles: "Article",
    blogs: "Blog",
  };
  const type = typeMap[resource];
  if (!type) return null;
  return `gid://shopify/${type}/${numericId}`;
}
