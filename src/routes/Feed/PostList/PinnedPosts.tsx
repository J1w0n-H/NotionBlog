import PostCard from "src/routes/Feed/PostList/PostCard"
import React, { useMemo } from "react"
import { useRouter } from "next/router"
import usePostsQuery from "src/hooks/usePostsQuery"
import styled from "@emotion/styled"
import { filterPosts } from "./filterPosts"
import { DEFAULT_CATEGORY } from "src/constants"

type Props = {
  q: string
}

const PinnedPosts: React.FC<Props> = ({ q }) => {
  const data = usePostsQuery()
  const router = useRouter()
  const currentTag =
    `${router.query.tag ?? ""}`.length > 0
      ? `${router.query.tag}`
      : undefined
  const order = `${router.query.order || ``}` || "desc"

  const filteredPosts = useMemo(() => {
    const baseFiltered = filterPosts({
      posts: data,
      q,
      tag: currentTag,
      category: DEFAULT_CATEGORY,
      order,
    })
    return baseFiltered.filter((post) => post.tags?.includes("Pinned"))
  }, [data, q, currentTag, order])

  if (filteredPosts.length === 0) return null

  return (
    <StyledWrapper id="section-pinned">
      <div className="wrapper">
        <div className="header">📌 Pinned Posts</div>
      </div>
      <div className="my-2">
        {filteredPosts.map((post) => (
          <PostCard key={post.slug} data={post} />
        ))}
      </div>
    </StyledWrapper>
  )
}

export default PinnedPosts

const StyledWrapper = styled.div`
  position: relative;
  .wrapper {
    display: flex;
    margin-bottom: 1rem;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray6};
  }
  .header {
    display: flex;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    gap: 0.25rem;
    align-items: center;
    font-size: 1.25rem;
    line-height: 1.75rem;
    font-weight: 700;
    cursor: pointer;
  }
`
