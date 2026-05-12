import PostCard from "src/routes/Feed/PostList/PostCard"
import React, { useMemo } from "react"
import usePostsQuery from "src/hooks/usePostsQuery"
import { useFeedRouterFilters } from "src/hooks/useFeedRouterFilters"
import styled from "@emotion/styled"
import { filterPostsForFeedList } from "src/routes/Feed/feedFilter"
import { DEFAULT_CATEGORY, NOTION_PINNED_TAG } from "src/constants"
import { PINNED_SECTION_ACCENT } from "src/constants/feedSections"
import { catVars } from "src/constants/categoryColors"
import { FeedGroupHeading } from "src/routes/Feed/FeedGroupHeading"

type Props = {
  q: string
}

const PinnedPosts: React.FC<Props> = ({ q }) => {
  const data = usePostsQuery()
  const { tag: currentTag, order } = useFeedRouterFilters()

  const filteredPosts = useMemo(() => {
    const baseFiltered = filterPostsForFeedList(data, {
      q,
      tag: currentTag,
      category: DEFAULT_CATEGORY,
      order,
    })
    return baseFiltered.filter((post) => post.tags?.includes(NOTION_PINNED_TAG))
  }, [data, q, currentTag, order])

  if (filteredPosts.length === 0) return null

  return (
    <StyledWrapper id="section-pinned" style={catVars(PINNED_SECTION_ACCENT)}>
      <FeedGroupHeading title="Pinned" count={filteredPosts.length} />
      <Cards>
        {filteredPosts.map((post) => (
          <PostCard key={post.slug} data={post} />
        ))}
      </Cards>
    </StyledWrapper>
  )
}

export default PinnedPosts

const StyledWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  scroll-margin-top: var(--feed-scroll-offset, 7rem);
`

const Cards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`
