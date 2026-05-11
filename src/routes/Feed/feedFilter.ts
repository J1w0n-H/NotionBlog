/**
 * Feed **URL + 검색어** 필터 (클라이언트). 입력 `posts`는 이미
 * `applyNotionPublicationGate(..., "feed")`를 통과한 캐시라고 가정.
 * @see src/libs/postFilters.ts
 */
import { DEFAULT_CATEGORY } from "src/constants"
import { comparePublishedAt } from "src/libs/notion/postDate"
import { tagFamilyKey } from "src/libs/utils/normalizeTag"
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
    const wantFam = tagFamilyKey(f.tag)
    out = out.filter((p) =>
      (p.tags ?? []).some((t) => tagFamilyKey(t) === wantFam)
    )
  }
  if (f.category !== DEFAULT_CATEGORY) {
    out = out.filter((p) => p.category?.includes(f.category))
  }
  const order = f.order === "desc" ? "desc" : "asc"
  const sorted = [...out].sort((a, b) => comparePublishedAt(a, b, order))
  return sorted
}

/**
 * 필터된 글을 카테고리 제목별로 묶음. 등장 순서 = 그룹 순서 (Map 삽입 순).
 * @see orderedCategoryTitles
 */
export function groupPostsByCategoryTitle(
  posts: TPost[]
): [string, TPost[]][] {
  const map = new Map<string, TPost[]>()
  for (const p of posts) {
    const title = (p.category?.[0] || UNCATEGORIZED).trim().normalize("NFKC")
    if (!map.has(title)) map.set(title, [])
    map.get(title)!.push(p)
  }
  return [...map.entries()]
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
