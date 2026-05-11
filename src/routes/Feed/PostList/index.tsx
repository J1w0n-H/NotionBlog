import { useRouter } from "next/router"
import React, { useMemo } from "react"
import PostCard from "src/routes/Feed/PostList/PostCard"
import { DEFAULT_CATEGORY } from "src/constants"
import usePostsQuery from "src/hooks/usePostsQuery"
import { parseQueryTagParam } from "src/libs/utils/normalizeTag"
import { filterPostsForFeedList } from "src/routes/Feed/feedFilter"

type Props = {
  q: string
}

const PostList: React.FC<Props> = ({ q }) => {
  const router = useRouter()
  const data = usePostsQuery()

  const currentTag = parseQueryTagParam(router.query.tag)
  const currentCategory = `${router.query.category || ``}` || DEFAULT_CATEGORY
  const currentOrder = `${router.query.order || ``}` || "desc"

  const filteredPosts = useMemo(
    () =>
      filterPostsForFeedList(data, {
        q,
        tag: currentTag,
        category: currentCategory,
        order: currentOrder,
      }),
    [data, q, currentTag, currentCategory, currentOrder]
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
