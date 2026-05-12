import React from "react"
import styled from "@emotion/styled"
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
                <ViewAllButton
                  type="button"
                  onClick={onToggleExpand}
                  aria-expanded={expanded}
                >
                  {expanded ? "Show less" : `View all (${posts.length})`}
                </ViewAllButton>
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

const ViewAllButton = styled.button`
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--cat-ring);
  background: transparent;
  color: var(--cat-color);
  font-size: 0.8125rem;
  cursor: pointer;
  &:hover {
    background: var(--cat-soft);
    border-color: var(--cat-color);
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
