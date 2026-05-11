import { useRouter } from "next/router"
import React, { useEffect, useMemo, useState } from "react"
import styled from "@emotion/styled"
import { DEFAULT_CATEGORY } from "src/constants"
import { parseQueryTagParam } from "src/libs/utils/normalizeTag"
import usePostsQuery from "src/hooks/usePostsQuery"
import PostCard from "src/routes/Feed/PostList/PostCard"
import { TPost } from "src/types"
import { filterPostsForFeedList } from "src/routes/Feed/feedFilter"
import { toSectionAnchorId } from "src/libs/utils/toSectionAnchorId"
import { catVars, tokenForCategory } from "src/constants/categoryColors"

type Props = { q: string }

const MAX_POSTS_PER_CATEGORY = 6

const GroupedPostList: React.FC<Props> = ({ q }) => {
  const router = useRouter()
  const data = usePostsQuery()
  const [expandedGroupTitles, setExpandedGroupTitles] = useState<
    Set<string>
  >(() => new Set())

  const currentTag = parseQueryTagParam(router.query.tag)
  const currentCategory = `${router.query.category || ``}` || DEFAULT_CATEGORY
  const currentOrder = `${router.query.order || ``}` || "desc"

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

  const groups = useMemo(() => {
    const map = new Map<string, TPost[]>()
    filtered.forEach((p) => {
      const c = (p.category?.[0] || "Other").trim().normalize("NFKC")
      if (!map.has(c)) map.set(c, [])
      map.get(c)!.push(p)
    })
    return Array.from(map.entries())
  }, [filtered])

  if (filtered.length === 0) {
    return <Empty>Nothing! 😺</Empty>
  }

  const singleCategory = currentCategory !== DEFAULT_CATEGORY

  const toggleGroupExpanded = (title: string) => {
    setExpandedGroupTitles((prev) => {
      const next = new Set(prev)
      if (next.has(title)) next.delete(title)
      else next.add(title)
      return next
    })
  }

  const clearCategory = () => {
    const next = { ...router.query }
    delete next.category
    router.push({ pathname: router.pathname, query: next })
  }

  return (
    <Wrapper>
      {singleCategory && (
        <CategoryFilterBar>
          <span className="label">
            Category: <strong>{currentCategory}</strong>
          </span>
          <ClearCategory type="button" onClick={clearCategory}>
            All categories
          </ClearCategory>
        </CategoryFilterBar>
      )}
      {groups.map(([title, posts]) => {
        const expanded = expandedGroupTitles.has(title)
        const capped =
          !singleCategory &&
          !expanded &&
          posts.length > MAX_POSTS_PER_CATEGORY
        const visiblePosts = singleCategory
          ? posts
          : capped
            ? posts.slice(0, MAX_POSTS_PER_CATEGORY)
            : posts
        const canToggle =
          !singleCategory && posts.length > MAX_POSTS_PER_CATEGORY

        return (
          <Group
            key={title}
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
                    onClick={() => toggleGroupExpanded(title)}
                    aria-expanded={expanded}
                  >
                    {expanded
                      ? "Show less"
                      : `View all (${posts.length})`}
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
      })}
    </Wrapper>
  )
}

export default GroupedPostList

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.25rem;
`

const CategoryFilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.75rem;
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  background: ${({ theme }) => theme.brand.surface2};
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.brand.textMuted};
  .label strong {
    color: ${({ theme }) => theme.brand.text};
    font-weight: 600;
  }
`

const ClearCategory = styled.button`
  padding: 0.25rem 0.65rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.brand.border};
  background: ${({ theme }) => theme.brand.surface};
  color: ${({ theme }) => theme.brand.link};
  font-size: 0.8125rem;
  cursor: pointer;
  &:hover {
    border-color: ${({ theme }) => theme.brand.link};
    background: ${({ theme }) => theme.brand.linkSoft};
  }
`
const Group = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  scroll-margin-top: 110px;
`
const GroupHead = styled.header`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  h2 {
    margin: 0;
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
  gap: 1.5rem;
  > * { margin-bottom: 0 !important; }

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`
const Empty = styled.p`
  color: ${({ theme }) => theme.brand.textFaint};
`
