import { useMemo } from "react"
import { useFeedRouterFilters } from "src/hooks/useFeedRouterFilters"
import usePostsQuery from "src/hooks/usePostsQuery"
import {
  feedHasPinnedSection,
  filterPinnedPostsForFeed,
  filterPostsForFeedList,
  type FeedListFilters,
} from "src/routes/Feed/feedFilter"

type FeedFilterOverrides = Partial<Pick<FeedListFilters, "category" | "tag" | "order">>

export function useFeedFilteredPosts(
  q: string,
  overrides?: FeedFilterOverrides
) {
  const posts = usePostsQuery()
  const { tag, category, order } = useFeedRouterFilters()
  const resolvedTag = overrides?.tag ?? tag
  const resolvedCategory = overrides?.category ?? category
  const resolvedOrder = overrides?.order ?? order

  return useMemo(
    () =>
      filterPostsForFeedList(posts, {
        q,
        tag: resolvedTag,
        category: resolvedCategory,
        order: resolvedOrder,
      }),
    [posts, q, resolvedTag, resolvedCategory, resolvedOrder]
  )
}

export function useFeedHasPinnedSection(q: string) {
  const posts = usePostsQuery()
  const { tag, order } = useFeedRouterFilters()

  return useMemo(
    () => feedHasPinnedSection(posts, { q, tag, order }),
    [posts, q, tag, order]
  )
}

export function useFeedPinnedPosts(q: string) {
  const posts = usePostsQuery()
  const { tag, order } = useFeedRouterFilters()

  return useMemo(
    () => filterPinnedPostsForFeed(posts, { q, tag, order }),
    [posts, q, tag, order]
  )
}
