import type { QueryClient } from "@tanstack/react-query"
import { ABOUT_SLUG } from "src/constants"
import { queryKey } from "src/constants/queryKey"
import { loadPublicPostCollections } from "src/libs/notion/fetchPublishedPosts"
import { prefetchAboutPostQuery } from "src/libs/notion/prefetchAboutPostQuery"

export async function prefetchFeedStaticProps(client: QueryClient) {
  const { feed, detail } = await loadPublicPostCollections()
  await client.prefetchQuery(queryKey.posts(), () => feed)

  const aboutPost = detail.find((post) => post.slug === ABOUT_SLUG)
  if (!aboutPost) return

  await prefetchAboutPostQuery(client, aboutPost)
}
