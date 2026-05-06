import { useRouter } from "next/router"
import React, { useMemo } from "react"
import styled from "@emotion/styled"
import { DEFAULT_CATEGORY } from "src/constants"
import usePostsQuery from "src/hooks/usePostsQuery"
import PostCard from "src/routes/Feed/PostList/PostCard"
import { TPost } from "src/types"

type Props = { q: string }

const UNCATEGORIZED = "Other"

const GroupedPostList: React.FC<Props> = ({ q }) => {
  const router = useRouter()
  const data = usePostsQuery()

  const currentTag = `${router.query.tag || ``}` || undefined
  const currentCategory = `${router.query.category || ``}` || DEFAULT_CATEGORY
  const currentOrder = `${router.query.order || ``}` || "desc"

  const filtered = useMemo(() => {
    let out = data
    out = out.filter((post) => {
      const tagContent = post.tags ? post.tags.join(" ") : ""
      const searchContent = post.title + (post.summary || "") + tagContent
      return searchContent.toLowerCase().includes(q.toLowerCase())
    })
    if (currentTag) {
      out = out.filter((p) => p.tags?.includes(currentTag))
    }
    if (currentCategory !== DEFAULT_CATEGORY) {
      out = out.filter((p) => p.category?.includes(currentCategory))
    }
    if (currentOrder !== "desc") out = [...out].reverse()
    return out
  }, [data, q, currentTag, currentCategory, currentOrder])

  const groups = useMemo(() => {
    const map = new Map<string, TPost[]>()
    filtered.forEach((p) => {
      const c = p.category?.[0] || UNCATEGORIZED
      if (!map.has(c)) map.set(c, [])
      map.get(c)!.push(p)
    })
    return Array.from(map.entries())
  }, [filtered])

  if (filtered.length === 0) {
    return <Empty>Nothing! 😺</Empty>
  }

  const singleCategory = currentCategory !== DEFAULT_CATEGORY

  return (
    <Wrapper>
      {groups.map(([title, posts]) => (
        <Group key={title}>
          {!singleCategory && (
            <GroupHead>
              <Marker />
              <h2>{title}</h2>
              <Count>{posts.length}</Count>
            </GroupHead>
          )}
          <Cards>
            {posts.map((p) => (
              <PostCard key={p.id} data={p} />
            ))}
          </Cards>
        </Group>
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
const Group = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`
const GroupHead = styled.header`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  h2 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.gray12};
  }
`
const Marker = styled.span`
  width: 6px;
  height: 18px;
  border-radius: 2px;
  background: ${({ theme }) => theme.colors.indigo10};
`
const Count = styled.span`
  font-family: ui-monospace, "JetBrains Mono", Menlo, monospace;
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.gray6};
  border-radius: 999px;
  color: ${({ theme }) => theme.colors.gray10};
`
const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
  > * { margin-bottom: 0 !important; }
`
const Empty = styled.p`
  color: ${({ theme }) => theme.colors.gray10};
`
