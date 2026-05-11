import React from "react"
import styled from "@emotion/styled"
import { catVars, tokenForCategory } from "src/constants/categoryColors"
import { toSectionAnchorId } from "src/libs/utils/toSectionAnchorId"
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
        <GroupHead>
          <Marker />
          <h2>{title}</h2>
          <Count>{posts.length}</Count>
          {canToggle && (
            <ViewAllButton
              type="button"
              onClick={onToggleExpand}
              aria-expanded={expanded}
            >
              {expanded ? "Show less" : `View all (${posts.length})`}
            </ViewAllButton>
          )}
        </GroupHead>
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

const GroupHead = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.625rem;
  h2 {
    margin: 0;
    min-width: 0;
    font-size: 1.125rem;
    font-weight: 700;
    color: ${({ theme }) => theme.brand.text};
  }
`

const Marker = styled.span`
  width: 6px;
  height: 18px;
  border-radius: 2px;
  background: var(--cat-color);
`

const Count = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border: 1px solid var(--cat-ring);
  border-radius: 999px;
  color: var(--cat-color);
  background: var(--cat-soft);
`

const ViewAllButton = styled.button`
  flex-shrink: 0;
  margin-left: auto;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
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

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`
