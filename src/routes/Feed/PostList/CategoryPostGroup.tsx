import React from "react"
import styled from "@emotion/styled"
import { HiArrowDown, HiArrowUp } from "react-icons/hi"
import { catVars, tokenForCategory } from "src/constants/categoryColors"
import { toSectionAnchorId } from "src/libs/utils/toSectionAnchorId"
import {
  FeedGroupActions,
  FeedGroupHeading,
} from "src/routes/Feed/FeedGroupHeading"
import PostCard from "src/routes/Feed/PostList/PostCard"
import { TPost } from "src/types"

type Props = {
  title: string
  posts: TPost[]
  singleCategory: boolean
  expanded: boolean
  maxCollapsed: number
  onToggleExpand: () => void
}

const CategoryPostGroup: React.FC<Props> = ({
  title,
  posts,
  singleCategory,
  expanded,
  maxCollapsed,
  onToggleExpand,
}) => {
  const canToggle = !singleCategory && posts.length > maxCollapsed
  const visiblePosts =
    singleCategory || expanded || posts.length <= maxCollapsed
      ? posts
      : posts.slice(0, maxCollapsed)

  return (
    <Group
      id={toSectionAnchorId(title)}
      style={catVars(tokenForCategory(title))}
    >
      {!singleCategory && (
        <FeedGroupHeading
          title={title}
          count={posts.length}
          actions={
            canToggle ? (
              <FeedGroupActions>
                <ViewAllLink
                  type="button"
                  onClick={onToggleExpand}
                  aria-expanded={expanded}
                >
                  {expanded ? "Show less" : `View all ${posts.length}`}
                  <ViewAllIcon aria-hidden="true">
                    {expanded ? <HiArrowUp /> : <HiArrowDown />}
                  </ViewAllIcon>
                </ViewAllLink>
              </FeedGroupActions>
            ) : null
          }
        />
      )}
      <Cards>
        {visiblePosts.map((p) => (
          <PostCard key={p.id} data={p} />
        ))}
      </Cards>
    </Group>
  )
}

export default CategoryPostGroup

const Group = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  scroll-margin-top: var(--feed-scroll-offset, 7rem);
`

/* v2: outline pill → accent text link with a chevron that slides on hover.
 * Uses theme accent (crimson) per the unified accent rule, not the category
 * color, so "View all" reads as a global CTA instead of a category chip. */
const ViewAllLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.brand.accent};
  font-family: ${({ theme }) => theme.brand.fontSans};
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: color ${({ theme }) => theme.brand.durationFast}
    ${({ theme }) => theme.brand.ease};

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.brand.accentHover};
    text-decoration: underline;
    text-underline-offset: 3px;
    outline: none;
  }
`

const ViewAllIcon = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 0.875rem;
  transform: translateX(0);
  transition: transform ${({ theme }) => theme.brand.durationFast}
    ${({ theme }) => theme.brand.ease};

  ${ViewAllLink}:hover &,
  ${ViewAllLink}:focus-visible & {
    transform: translateX(2px);
  }
`

const Cards = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  align-items: stretch;
  gap: 1.5rem;
  > * {
    margin-bottom: 0 !important;
  }

  @container feed-main (min-width: 34rem) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @container feed-main (min-width: 52rem) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`
