import React, { useCallback, useEffect, useMemo, useState } from "react"
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
import { RESUME_OWNED_CATEGORIES } from "src/constants/resumeSections"

type Props = { q: string }

const MAX_POSTS_PER_CATEGORY = 6

const GroupedPostList: React.FC<Props> = ({ q }) => {
  const data = usePostsQuery()
  const { tag: currentTag, category: currentCategory, order: currentOrder } =
    useFeedRouterFilters()

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
    () =>
      groupPostsByCategoryTitle(filtered).filter(
        ([title]) => !RESUME_OWNED_CATEGORIES.has(title)
      ),
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

  if (filtered.length === 0) {
    return <Empty>Nothing! 😺</Empty>
  }

  const singleCategory = currentCategory !== DEFAULT_CATEGORY

  return (
    <Wrapper>
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
          maxCollapsed={MAX_POSTS_PER_CATEGORY}
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
  gap: 2.25rem;
`

const Empty = styled.p`
  color: ${({ theme }) => theme.brand.textFaint};
`
