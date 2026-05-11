import type { QueryClient } from "@tanstack/react-query"
import { getPosts, getRecordMap } from "src/apis"
import { queryKey } from "src/constants/queryKey"
import { applyNotionPublicationGate } from "src/libs/postFilters"

export async function prefetchSlugStaticProps(
  client: QueryClient,
  slug: string
) {
  const rawPosts = await getPosts()
  const feedPosts = applyNotionPublicationGate(rawPosts, "feed")
  await client.prefetchQuery(queryKey.posts(), () => feedPosts)

  const postDetail = applyNotionPublicationGate(rawPosts, "detail").find(
    (post) => post.slug === slug
  )
  if (!postDetail) return null

  const recordMap = await getRecordMap(postDetail.id)
  await client.prefetchQuery(queryKey.post(slug), () => ({
    ...postDetail,
    recordMap,
  }))
  return postDetail
}
