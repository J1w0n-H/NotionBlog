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
 * categories missing from this list. Missing categories resolve to token
 * `other` via `tokenForCategory()` and render with the neutral palette.
 */
export const FEED_CATEGORY_ORDER = [
  "Education",
  "Work Experience",
  "Projects",
  "Conferences",
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
