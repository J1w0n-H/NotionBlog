import type { QueryClient } from "@tanstack/react-query"
import { getRecordMap } from "src/apis"
import { queryKey } from "src/constants/queryKey"
import { fetchPublishedPosts } from "src/libs/notion/fetchPublishedPosts"

export async function prefetchSlugStaticProps(
  client: QueryClient,
  slug: string
) {
  const postDetail = (await fetchPublishedPosts("detail")).find(
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
