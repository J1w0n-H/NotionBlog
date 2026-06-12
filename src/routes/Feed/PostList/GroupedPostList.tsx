import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import styled from "@emotion/styled"
import { DEFAULT_CATEGORY } from "src/constants"
import usePostsQuery from "src/hooks/usePostsQuery"
import { useFeedRouterFilters } from "src/hooks/useFeedRouterFilters"
import {
  filterPostsForFeedList,
  groupPostsByCategoryTitle,
} from "src/routes/Feed/feedFilter"
import CategoryPostGroup from "src/routes/Feed/PostList/CategoryPostGroup"
import FeedCategoryUrlBar from "src/routes/Feed/PostList/FeedCategoryUrlBar"

type Props = { q: string }

// How many rows each category shows when collapsed.
// Breakpoints match the @container queries in Cards (34rem → 2-col, 46rem → 3-col).
const CATEGORY_COLLAPSED_ROWS: Record<string, number> = {
  Projects: 2,
}

function useContainerCols(ref: React.RefObject<HTMLDivElement>): number {
  const [cols, setCols] = useState(3)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => {
      const w = el.getBoundingClientRect().width
      if (w >= 736) setCols(3)       // ≥46rem
      else if (w >= 544) setCols(2)  // ≥34rem
      else setCols(1)
    }
    const ro = new ResizeObserver(update)
    ro.observe(el)
    update()
    return () => ro.disconnect()
  }, [ref])
  return cols
}

const GroupedPostList: React.FC<Props> = ({ q }) => {
  const data = usePostsQuery()
  const { tag: currentTag, category: currentCategory, order: currentOrder } =
    useFeedRouterFilters()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const cols = useContainerCols(wrapperRef)

  const [expandedGroupTitles, setExpandedGroupTitles] = useState<
    Set<string>
  >(() => new Set())

  useEffect(() => {
    setExpandedGroupTitles(new Set())
  }, [currentCategory, currentTag, currentOrder, q])

  const filtered = useMemo(
    () =>
      filterPostsForFeedList(data, {
        q,
        tag: currentTag,
        category: currentCategory,
        order: currentOrder,
      }),
    [data, q, currentTag, currentCategory, currentOrder]
  )

  const groups = useMemo(
    () => groupPostsByCategoryTitle(filtered),
    [filtered]
  )

  const toggleGroupExpanded = useCallback((title: string) => {
    setExpandedGroupTitles((prev) => {
      const next = new Set(prev)
      if (next.has(title)) next.delete(title)
      else next.add(title)
      return next
    })
  }, [])

  const maxCollapsedFor = useCallback(
    (title: string) => (CATEGORY_COLLAPSED_ROWS[title] ?? 1) * cols,
    [cols]
  )

  if (filtered.length === 0) {
    return <Empty>Nothing! 😺</Empty>
  }

  const singleCategory = currentCategory !== DEFAULT_CATEGORY

  return (
    <Wrapper ref={wrapperRef}>
      {singleCategory && (
        <FeedCategoryUrlBar categoryLabel={currentCategory} />
      )}
      {groups.map(([title, posts]) => (
        <CategoryPostGroup
          key={title}
          title={title}
          posts={posts}
          singleCategory={singleCategory}
          expanded={expandedGroupTitles.has(title)}
          maxCollapsed={maxCollapsedFor(title)}
          onToggleExpand={() => toggleGroupExpanded(title)}
        />
      ))}
    </Wrapper>
  )
}

export default GroupedPostList

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  min-width: 0;
`

const Empty = styled.p`
  color: ${({ theme }) => theme.brand.textFaint};
`
