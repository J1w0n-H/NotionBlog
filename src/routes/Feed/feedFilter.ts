import { DEFAULT_CATEGORY } from "src/constants"
import { normalizeTagKey } from "src/libs/utils/normalizeTag"
import { TPost } from "src/types"

const UNCATEGORIZED = "Other"

export type FeedListFilters = {
  q: string
  /** URL ?tag */
  tag?: string
  /** resolved category route (📂 All = default) */
  category: string
  /** asc | desc */
  order: string
}

/** Same search rule as grouped list (matches summary optional). */
export function matchesFeedSearch(post: TPost, q: string): boolean {
  const tagContent = post.tags ? post.tags.join(" ") : ""
  const searchContent =
    post.title + (post.summary || "") + tagContent
  return searchContent.toLowerCase().includes(q.toLowerCase())
}

/** Same filtering + date order as `GroupedPostList`. */
export function filterPostsForFeedList(posts: TPost[], f: FeedListFilters): TPost[] {
  let out = posts.filter((post) => matchesFeedSearch(post, f.q))
  if (f.tag) {
    const want = normalizeTagKey(f.tag)
    out = out.filter((p) =>
      (p.tags ?? []).some((t) => normalizeTagKey(t) === want)
    )
  }
  if (f.category !== DEFAULT_CATEGORY) {
    out = out.filter((p) => p.category?.includes(f.category))
  }
  const sorted = [...out].sort((a, b) => {
    const dateA = new Date(a.date.start_date).getTime()
    const dateB = new Date(b.date.start_date).getTime()
    return f.order === "desc" ? dateB - dateA : dateA - dateB
  })
  return sorted
}

/** Encounter order = category groups order on screen. */
export function orderedCategoryTitles(filteredPosts: TPost[]): string[] {
  const seen = new Set<string>()
  const order: string[] = []
  for (const p of filteredPosts) {
    const title = (p.category?.[0] || UNCATEGORIZED).trim().normalize("NFKC")
    if (!seen.has(title)) {
      seen.add(title)
      order.push(title)
    }
  }
  return order
}
