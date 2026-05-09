/** Zero-width & BOM strip + dash folding + trim + NFC (Notion / URL safe). */
export function normalizeTagKey(raw: string): string {
  return raw
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    /* Unicode hyphen / minus → ASCII - (avoids 카운트≠필터) */
    .replace(/[\u2212\u2010\u2011\u2013\u2014\uFE58\uFE63\uFF0D]/g, "-")
    .trim()
    .normalize("NFKC")
}

/** Next `?tag` — first value only, never comma-joined array string. */
export function parseQueryTagParam(tag: unknown): string | undefined {
  if (tag == null) return undefined
  const s = Array.isArray(tag) ? tag[0] : tag
  if (typeof s !== "string") return undefined
  const n = normalizeTagKey(s)
  return n.length > 0 ? n : undefined
}
