/**
 * Orchestration: given a resource GID, fetch its English source fields,
 * translate them, and register the fr-CA translations back into Shopify.
 */

import { config } from "./config";
import {
  getTranslatableContent,
  registerTranslations,
  type RegisterInput,
} from "./shopify";
import { translateItems, type TranslatableItem } from "./translate";

export interface TranslateResult {
  resourceId: string;
  fieldsFound: number;
  fieldsTranslated: number;
  dryRun: boolean;
  skipped: string[];
}

/** Fields whose value is code/ids/urls rather than prose — never translate. */
function isTranslatableValue(value: string): boolean {
  const v = value.trim();
  if (!v) return false;
  // Pure number, or number with a unit-less token — nothing to localize.
  if (/^[\d.,\s]+$/.test(v)) return false;
  // A bare URL or handle-like slug.
  if (/^https?:\/\/\S+$/.test(v)) return false;
  return true;
}

/**
 * Translate one resource end to end.
 * Respects config.skipFields (e.g. "handle") and config.dryRun.
 */
export async function translateResource(resourceId: string): Promise<TranslateResult> {
  const fields = await getTranslatableContent(resourceId);

  const skipped: string[] = [];
  const toTranslate: Array<{ key: string; value: string; digest: string }> = [];

  for (const f of fields) {
    if (config.skipFields.includes(f.key)) {
      skipped.push(`${f.key} (skip-field)`);
      continue;
    }
    if (!isTranslatableValue(f.value)) {
      skipped.push(`${f.key} (non-prose)`);
      continue;
    }
    toTranslate.push(f);
  }

  const items: TranslatableItem[] = toTranslate.map((f) => ({ key: f.key, value: f.value }));
  const translations = items.length ? await translateItems(items) : new Map<string, string>();

  const digestByKey = new Map(toTranslate.map((f) => [f.key, f.digest]));
  const register: RegisterInput[] = [];
  for (const [key, value] of translations) {
    const digest = digestByKey.get(key);
    if (!digest) continue;
    register.push({ key, value, translatableContentDigest: digest });
  }

  if (config.dryRun) {
    console.log(`[DRY_RUN] ${resourceId} — ${register.length} field(s) would be written:`);
    for (const r of register) {
      console.log(`  ${r.key}: ${r.value.slice(0, 120)}${r.value.length > 120 ? "…" : ""}`);
    }
  } else {
    await registerTranslations(resourceId, register);
    console.log(`[WROTE] ${resourceId} — ${register.length} field(s) into "${config.targetLocale}"`);
  }

  return {
    resourceId,
    fieldsFound: fields.length,
    fieldsTranslated: register.length,
    dryRun: config.dryRun,
    skipped,
  };
}
