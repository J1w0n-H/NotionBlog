import { fetchPublishedPosts } from "src/libs/notion/fetchPublishedPosts"

export async function getDetailStaticPaths() {
  const posts = await fetchPublishedPosts("detail")
  return {
    paths: posts.map((post) => `/${post.slug}`),
    fallback: true as const,
  }
}
