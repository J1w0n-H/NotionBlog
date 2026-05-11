import type { QueryClient } from "@tanstack/react-query"
import { getRecordMap } from "src/apis"
import { queryKey } from "src/constants/queryKey"
import { loadPublicPostCollections } from "src/libs/notion/fetchPublishedPosts"
import { isUsableRecordMap } from "src/libs/notion/isUsableRecordMap"

export async function prefetchSlugStaticProps(
  client: QueryClient,
  slug: string
) {
  const { feed, detail } = await loadPublicPostCollections()
  await client.prefetchQuery(queryKey.posts(), () => feed)

  const postDetail = detail.find((post) => post.slug === slug)
  if (!postDetail) return null

  const recordMap = await getRecordMap(postDetail.id)
  const payload = isUsableRecordMap(postDetail.id, recordMap)
    ? { ...postDetail, recordMap }
    : postDetail

  await client.prefetchQuery(queryKey.post(slug), () => payload)
  return postDetail
}
