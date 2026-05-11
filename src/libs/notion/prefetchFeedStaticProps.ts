import type { QueryClient } from "@tanstack/react-query"
import { getPosts, getRecordMap } from "src/apis"
import { ABOUT_SLUG } from "src/constants"
import { queryKey } from "src/constants/queryKey"
import { applyNotionPublicationGate } from "src/libs/postFilters"

export async function prefetchFeedStaticProps(client: QueryClient) {
  const rawPosts = await getPosts()
  const posts = applyNotionPublicationGate(rawPosts, "feed")
  await client.prefetchQuery(queryKey.posts(), () => posts)

  const aboutPost = applyNotionPublicationGate(rawPosts, "detail").find(
    (post) => post.slug === ABOUT_SLUG
  )
  if (!aboutPost) return

  const recordMap = await getRecordMap(aboutPost.id)
  await client.prefetchQuery(queryKey.post(ABOUT_SLUG), () => ({
    ...aboutPost,
    recordMap,
  }))
}
