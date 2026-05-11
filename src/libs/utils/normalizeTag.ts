import { DEFAULT_CATEGORY } from "src/constants"

/** Zero-width & BOM strip + dash folding + trim + NFC (Notion / URL safe). */
export function normalizeTagKey(raw: string): string {
  return raw
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    /* Unicode hyphen / minus → ASCII hyphen */
    .replace(/[\u2212\u2010\u2011\u2013\u2014\uFE58\uFE63\uFF0D]/g, "-")
    .trim()
    .normalize("NFKC")
}

/**
 * Bucketing key so `-Community`, `--Community`, `−Community`(U+2212 등) 같은 변형은
 * 집계·필터가 같은 태그로 취급되게 한다 (\p{Pd} 연속 접두어만 제거).
 */
export function tagFamilyKey(raw: string): string {
  const n = normalizeTagKey(raw)
  const stripped = n.replace(/^\p{Pd}+/u, "").trim()
  return stripped.length > 0 ? stripped : n
}

/** 한 글 안에서 패밀리당 대표 문자열 하나(더 긴 표기 = `--` 접두 유지 우선). */
export function dedupeTagsForPost(tags: string[]): string[] {
  const byFamily = new Map<string, string>()
  for (const raw of tags) {
    const n = normalizeTagKey(raw)
    if (!n) continue
    const fk = tagFamilyKey(raw)
    const prev = byFamily.get(fk)
    if (prev == null || n.length > prev.length) {
      byFamily.set(fk, n)
    }
  }
  return [...byFamily.values()]
}

/**
 * Next `?category` — 첫 값만, trim + NFKC 후 비어 있거나 "📂 All"과 동일하면
 * `DEFAULT_CATEGORY`로 통일 (URL 공백/인코딩 때문에 그룹 헤더가 통째로 숨는 것 방지).
 */
export function parseQueryCategoryParam(category: unknown): string {
  if (category == null) return DEFAULT_CATEGORY
  const s = Array.isArray(category) ? category[0] : category
  if (typeof s !== "string") return DEFAULT_CATEGORY
  const t = s.trim().normalize("NFKC")
  if (t.length === 0) return DEFAULT_CATEGORY
  const all = DEFAULT_CATEGORY.trim().normalize("NFKC")
  return t === all ? DEFAULT_CATEGORY : t
}

/** Next `?tag` — first value only, never comma-joined array string. */
export function parseQueryTagParam(tag: unknown): string | undefined {
  if (tag == null) return undefined
  const s = Array.isArray(tag) ? tag[0] : tag
  if (typeof s !== "string") return undefined
  const n = normalizeTagKey(s)
  return n.length > 0 ? n : undefined
}
