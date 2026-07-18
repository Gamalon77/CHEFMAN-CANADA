/**
 * Translation via Claude, using structured outputs so we always get back a
 * clean key -> value mapping (no prose, no markdown fences to strip).
 */

import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { config } from "./config";
import { SYSTEM_PROMPT } from "./rules";

// ANTHROPIC_API_KEY is read from the environment by the SDK.
const client = new Anthropic();

export interface TranslatableItem {
  key: string;
  value: string;
}

const OutputSchema = z.object({
  translations: z.array(
    z.object({
      key: z.string(),
      value: z.string(),
    }),
  ),
});

/** Roughly the max source characters to send in one request. Keeps output
 * comfortably under max_tokens even with French expansion + markup. */
const CHUNK_CHARS = 6000;

function chunk(items: TranslatableItem[]): TranslatableItem[][] {
  const chunks: TranslatableItem[][] = [];
  let current: TranslatableItem[] = [];
  let size = 0;

  for (const item of items) {
    const len = item.value.length + item.key.length;
    // A single oversized item still gets its own chunk.
    if (current.length > 0 && size + len > CHUNK_CHARS) {
      chunks.push(current);
      current = [];
      size = 0;
    }
    current.push(item);
    size += len;
  }
  if (current.length > 0) chunks.push(current);
  return chunks;
}

async function translateChunk(items: TranslatableItem[]): Promise<Map<string, string>> {
  const response = await client.beta.messages.parse({
    model: config.model,
    max_tokens: 16000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content:
          "Translate the `value` of each item to Canadian French (fr-CA) per the rules. " +
          "Return every item with its original `key`.\n\n" +
          JSON.stringify({ items }, null, 2),
      },
    ],
    output_format: betaZodOutputFormat(OutputSchema),
  });

  const parsed = response.parsed_output;
  const out = new Map<string, string>();
  if (!parsed) return out;
  for (const t of parsed.translations) {
    out.set(t.key, t.value);
  }
  return out;
}

/**
 * Translate a list of {key, value} items. Returns a map of key -> translated
 * value. Keys that the model failed to return are simply absent from the map
 * (the caller skips writing those).
 */
export async function translateItems(items: TranslatableItem[]): Promise<Map<string, string>> {
  const result = new Map<string, string>();
  const chunks = chunk(items);

  for (const c of chunks) {
    const translated = await translateChunk(c);
    for (const [k, v] of translated) result.set(k, v);
  }
  return result;
}
