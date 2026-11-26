import { fetchPublishedPosts } from "src/libs/notion/fetchPublishedPosts"

export async function getDetailStaticPaths() {
  const posts = await fetchPublishedPosts("detail")
  return {
    paths: posts.map((post) => `/${post.slug}`),
    // "blocking": an unknown or Private slug gets a real 404 status instead of
    // a 200 fallback shell (soft-404).
    fallback: "blocking" as const,
  }
}
