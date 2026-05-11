import type { QueryClient } from "@tanstack/react-query"
import { ABOUT_SLUG } from "src/constants"
import { queryKey } from "src/constants/queryKey"
import { loadPublicPostCollections } from "src/libs/notion/fetchPublishedPosts"

export async function prefetchFeedStaticProps(client: QueryClient) {
  const { feed, detail } = await loadPublicPostCollections()
  await client.prefetchQuery(queryKey.posts(), () => feed)

  const aboutPost = detail.find((post) => post.slug === ABOUT_SLUG)
  if (!aboutPost) return

  await client.prefetchQuery(queryKey.post(ABOUT_SLUG), () => aboutPost)
}
