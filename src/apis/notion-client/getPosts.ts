import { loadNotionDatabasePosts } from "src/libs/notion/loadNotionDatabasePosts"
import { TPosts } from "src/types"

let cachedPosts: TPosts | null = null
let postsInflight: Promise<TPosts> | null = null

const shouldCachePostsForProcess = () =>
  process.env.NEXT_PHASE === "phase-production-build"

export const getPosts = async () => {
  try {
    const notionToken = process.env.NOTION_API_KEY
    if (!notionToken) {
      console.warn("NOTION_API_KEY not found - returning empty posts array")
      return []
    }

    if (shouldCachePostsForProcess() && cachedPosts) return cachedPosts
    if (shouldCachePostsForProcess() && postsInflight) return postsInflight

    const load = loadNotionDatabasePosts(notionToken).then((posts) => {
      if (shouldCachePostsForProcess()) {
        cachedPosts = posts
      }
      return posts
    })

    if (shouldCachePostsForProcess()) {
      postsInflight = load.finally(() => {
        postsInflight = null
      })
      return await postsInflight
    }

    return await load
  } catch (error) {
    console.error("Error in getPosts:", error)

    if (error instanceof Error && error.message.includes("530")) {
      console.warn(
        "Notion API 530 error - returning empty posts array to prevent build failure"
      )
      return []
    }

    return []
  }
}
