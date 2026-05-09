/** Zero-width & BOM strip + trim + canonical Unicode (Notion / URL / copy-paste safe). */
export function normalizeTagKey(raw: string): string {
  return raw
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
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
