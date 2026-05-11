import type { TPost } from "src/types"

/** Published/sort instant: Notion Date column, else page `createdTime`. */
export function effectivePublishedAt(post: Pick<TPost, "date" | "createdTime">): Date {
  const raw = post.date?.start_date ?? post.createdTime
  const parsed = new Date(raw)
  return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed
}

export function comparePublishedAt(
  a: Pick<TPost, "date" | "createdTime">,
  b: Pick<TPost, "date" | "createdTime">,
  order: "asc" | "desc"
): number {
  const diff = effectivePublishedAt(a).getTime() - effectivePublishedAt(b).getTime()
  return order === "desc" ? -diff : diff
}
