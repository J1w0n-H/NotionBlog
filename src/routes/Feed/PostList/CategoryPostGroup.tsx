import React from "react"
import styled from "@emotion/styled"
import { catVars, tokenForCategory } from "src/constants/categoryColors"
import { toSectionAnchorId } from "src/libs/utils/toSectionAnchorId"
import {
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
        <FeedGroupHeading title={title} count={posts.length} />
      )}
      <Cards $count={posts.length}>
        {visiblePosts.map((p) => (
          <PostCard key={p.id} data={p} />
        ))}
      </Cards>
      {!singleCategory && canToggle ? (
        <ViewAllBar
          type="button"
          onClick={onToggleExpand}
          aria-expanded={expanded}
        >
          {expanded ? (
            <>
              show less <ViewAllCaret aria-hidden="true">↑</ViewAllCaret>
            </>
          ) : (
            <>
              view all {posts.length}{" "}
              <ViewAllCaret aria-hidden="true">↓</ViewAllCaret>
            </>
          )}
        </ViewAllBar>
      ) : null}
    </Group>
  )
}

export default CategoryPostGroup

const Group = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
  scroll-margin-top: var(--feed-scroll-offset, 7rem);
`

/* v2-ish: full-width bar under the card grid — inline with group, not floating right */
const ViewAllBar = styled.button`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  margin: 0;
  padding: 0.55rem 0.85rem;
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  border-radius: var(--radius-md);
  background: ${({ theme }) => theme.brand.surface2};
  color: ${({ theme }) => theme.brand.textMuted};
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.6875rem;
  font-weight: 650;
  letter-spacing: 0.06em;
  text-transform: lowercase;
  cursor: pointer;
  transition:
    border-color ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease},
    background ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease},
    color ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease};

  &:hover,
  &:focus-visible {
    border-color: ${({ theme }) => theme.brand.border};
    background: ${({ theme }) => theme.brand.surface};
    color: ${({ theme }) => theme.brand.text};
    outline: none;
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px ${({ theme }) => theme.brand.accentSoft};
  }
`

const ViewAllCaret = styled.span`
  display: inline-block;
  font-size: 0.8125rem;
  line-height: 1;
  opacity: 0.85;
  transition:
    transform ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease},
    opacity ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease};

  ${ViewAllBar}:hover &, ${ViewAllBar}:focus-visible & {
    transform: translateY(1px);
    opacity: 1;
  }
`

const Cards = styled.div<{ $count: number }>`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: stretch;
  gap: 1rem;
  > * {
    margin-bottom: 0 !important;
  }

  @container feed-main (min-width: 34rem) {
    grid-template-columns: repeat(${({ $count }) => Math.min($count, 2)}, minmax(0, 1fr));
  }

  /* Slightly below old 52rem so 1024px-wide viewports (nav + feed) still hit 3 columns. */
  @container feed-main (min-width: 46rem) {
    grid-template-columns: repeat(${({ $count }) => Math.min($count, 3)}, minmax(0, 1fr));
  }
`
