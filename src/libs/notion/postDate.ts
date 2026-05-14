import type { TPost } from "src/types"

/** Published/sort instant: Notion Date column, else page `createdTime`. */
export function effectivePublishedAt(post: Pick<TPost, "date" | "createdTime">): Date {
  const raw = post.date?.start_date ?? post.createdTime
  const parsed = new Date(raw)
  return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed
}

/**
 * Comparator for the post feed.
 *
 * Primary key: the post's effective published instant (Notion `date` column
 * falling back to `createdTime`).
 *
 * Tie-breaker: alphabetical title comparison, following the same direction
 * as the primary sort. ASC → A→Z within a day, DESC → Z→A within a day.
 * Without this tie-breaker the order of same-date posts was effectively
 * "most recently edited first" (Notion's API default) and shifted around
 * whenever any of those posts were edited.
 */
export function comparePublishedAt(
  a: Pick<TPost, "date" | "createdTime"> & { title?: string },
  b: Pick<TPost, "date" | "createdTime"> & { title?: string },
  order: "asc" | "desc"
): number {
  const diff = effectivePublishedAt(a).getTime() - effectivePublishedAt(b).getTime()
  if (diff !== 0) {
    return order === "desc" ? -diff : diff
  }
  const titleDiff = (a.title ?? "").localeCompare(b.title ?? "", undefined, {
    sensitivity: "base",
  })
  return order === "desc" ? -titleDiff : titleDiff
}
