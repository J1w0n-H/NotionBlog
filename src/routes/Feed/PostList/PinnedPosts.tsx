import PostCard from "src/routes/Feed/PostList/PostCard"
import React from "react"
import styled from "@emotion/styled"
import { useFeedPinnedPosts } from "src/hooks/useFeedFilteredPosts"

type Props = {
  q: string
}

const PinnedPosts: React.FC<Props> = ({ q }) => {
  const filteredPosts = useFeedPinnedPosts(q)

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
  scroll-margin-top: var(--feed-scroll-offset, 7rem);
  .my-2 {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
  .wrapper {
    display: flex;
    margin-bottom: 1rem;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid ${({ theme }) => theme.brand.borderSoft};
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
