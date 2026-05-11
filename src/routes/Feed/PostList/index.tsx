import React, { useMemo } from "react"
import PostCard from "src/routes/Feed/PostList/PostCard"
import usePostsQuery from "src/hooks/usePostsQuery"
import { useFeedRouterFilters } from "src/hooks/useFeedRouterFilters"
import { filterPostsForFeedList } from "src/routes/Feed/feedFilter"

type Props = {
  q: string
}

const PostList: React.FC<Props> = ({ q }) => {
  const data = usePostsQuery()
  const { tag, category, order } = useFeedRouterFilters()

  const filteredPosts = useMemo(
    () =>
      filterPostsForFeedList(data, {
        q,
        tag,
        category,
        order,
      }),
    [data, q, tag, category, order]
  )

  return (
    <>
      {filteredPosts.map((post) => (
        <PostCard key={post.slug} data={post} />
      ))}
    </>
  )
}

export default PostList
