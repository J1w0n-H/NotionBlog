import PostCard from "src/routes/Feed/PostList/PostCard"
import React, { useMemo } from "react"
import { HiOutlineStar } from "react-icons/hi"
import usePostsQuery from "src/hooks/usePostsQuery"
import { useFeedRouterFilters } from "src/hooks/useFeedRouterFilters"
import styled from "@emotion/styled"
import { filterPostsForFeedList } from "src/routes/Feed/feedFilter"
import { DEFAULT_CATEGORY, NOTION_PINNED_TAG } from "src/constants"
import { PINNED_VARS } from "src/constants/categoryColors"
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
    <StyledWrapper id="section-pinned" style={PINNED_VARS}>
      <FeedGroupHeading
        title="Pinned"
        count={filteredPosts.length}
        description="hand-picked work · keep these in view"
      />
      <PinnedSurface>
        <StarBadge aria-hidden="true">
          <HiOutlineStar />
        </StarBadge>
        <Cards>
          {filteredPosts.map((post) => (
            <PostCard key={post.slug} data={post} />
          ))}
        </Cards>
      </PinnedSurface>
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

/* v2: pinned strip gets a subtle clay-textured background so it visually
 * separates from regular category groups, plus a small star badge in the
 * top-left to label the strip without leaning on the heading alone. */
const PinnedSurface = styled.div`
  position: relative;
  padding: 1.25rem 1rem 1rem;
  border-radius: var(--radius-lg);
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  background-color: ${({ theme }) => theme.brand.accentSoft};
  background-image:
    radial-gradient(
      circle at 18% 22%,
      var(--accent-ring) 0,
      transparent 60%
    ),
    radial-gradient(
      circle at 82% 78%,
      var(--accent-ring) 0,
      transparent 55%
    );
  background-blend-mode: soft-light;
`

const StarBadge = styled.span`
  position: absolute;
  top: -0.6rem;
  left: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: var(--radius-pill);
  border: 1px solid ${({ theme }) => theme.brand.accentRing};
  background: ${({ theme }) => theme.brand.surface};
  color: ${({ theme }) => theme.brand.accent};
  font-size: 0.9rem;
  box-shadow: ${({ theme }) => theme.brand.shadowSm};
`

const Cards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`
