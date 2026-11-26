/**
 * Single source of truth for category order across the feed.
 *
 * Categories cycle through the 8-slot palette by index:
 *   slot = idx % 8 → reverse / systems / ctf / crypto / lime / research / rose / cyan
 *
 * To add a new category in Notion → append to the bottom of this array; the next
 * palette slot is assigned automatically (no other code changes required).
 *
 * "Other" is an explicit "could not classify" channel — not a fallback for
 * categories missing from this list. Missing categories still get a stable
 * palette slot (see `paletteIndexForCategory`) and sort after listed ones.
 */
export const FEED_CATEGORY_ORDER = [
  "Education",
  "Work Experience",
  // — Current Notion categories (2026 relabel). Order = feed order. —
  "Research",
  "Engineering",
  "Insights",
  "Conferences",
  "Community",
  "Life & Career",
  // — Legacy labels, kept so older rows still sort/colour consistently. —
  "Projects",
  "ExtraCurricular",
  "Life",
  "Career / Talks / Community",
  "Activities",
  "Personal",
  "Personal Life",
  "Cloud Security",
  "Detection & Response (Observability)",
  "Security Research (AI Security)",
  "Cryptography & TLS",
  "Reverse Engineering",
  "CTF Writeups",
  "Systems & RTOS",
  "Research Notes",
  "Infrastructure Engineering",
  "Other",
] as const

export type FeedCategoryLabel = (typeof FEED_CATEGORY_ORDER)[number]

/** -1 when the label is missing or not in `FEED_CATEGORY_ORDER`. */
export function indexOfCategory(label?: string): number {
  if (!label) return -1
  const normalized = label.trim().normalize("NFKC")
  return FEED_CATEGORY_ORDER.indexOf(normalized as FeedCategoryLabel)
}

/** Used by feedFilter to sort groups in the feed list (palette order = list order). */
export function rankFeedCategory(label: string): number {
  const idx = indexOfCategory(label)
  return idx === -1 ? FEED_CATEGORY_ORDER.length + 1 : idx
}

/**
 * Palette slot for any category label. Listed categories use their list
 * index; a category added in Notion but not listed here still gets a stable
 * colour (hash of the label) instead of collapsing into the grey "Other".
 * Returns -1 only for empty labels and the explicit "Other" channel.
 */
export function paletteIndexForCategory(label?: string): number {
  const idx = indexOfCategory(label)
  if (idx !== -1) return idx
  const normalized = label?.trim().normalize("NFKC") ?? ""
  if (!normalized || normalized === "Other") return -1
  let hash = 0
  for (const ch of normalized) hash = (hash * 31 + ch.codePointAt(0)!) >>> 0
  return hash
}
