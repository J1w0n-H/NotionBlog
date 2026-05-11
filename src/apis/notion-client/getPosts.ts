import { CONFIG } from "site.config"
import { Client } from "@notionhq/client"
import {
  mapNotionDatabasePage,
  type NotionSchemaByPropId,
} from "src/libs/notion/mapNotionDatabasePage"
import { queryAllDatabasePages } from "src/libs/notion/queryAllDatabasePages"
import { comparePublishedAt } from "src/libs/notion/postDate"
import { TPosts } from "src/types"

/**
 * @param {{ includePages: boolean }} - false: posts only / true: include pages
 */

let cachedPosts: TPosts | null = null
let postsInflight: Promise<TPosts> | null = null

// TODO: react query를 사용해서 처음 불러온 뒤로는 해당데이터만 사용하도록 수정
export const getPosts = async () => {
  try {
    const notionToken = process.env.NOTION_API_KEY
    if (!notionToken) {
      console.warn("NOTION_API_KEY not found - returning empty posts array")
      return []
    }

    if (cachedPosts) return cachedPosts
    if (postsInflight) return postsInflight

    postsInflight = getPostsWithOfficialSDK()
      .then((posts) => {
        cachedPosts = posts
        return posts
      })
      .finally(() => {
        postsInflight = null
      })

    return await postsInflight
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

const getPostsWithOfficialSDK = async (): Promise<TPosts> => {
  const notionToken = process.env.NOTION_API_KEY!
  const databaseId = CONFIG.notionConfig.pageId as string

  if (!databaseId) {
    throw new Error("NOTION_PAGE_ID not configured")
  }

  const notion = new Client({
    auth: notionToken,
    timeoutMs: 90_000,
  })

  let metaByPropId: NotionSchemaByPropId = new Map()
  try {
    const dbResp = await notion.databases.retrieve({
      database_id: databaseId,
    })
    for (const propId of Object.keys(dbResp.properties)) {
      const sc = dbResp.properties[propId] as { name?: string; type?: string }
      metaByPropId.set(propId, {
        name: sc.name ?? propId,
        type: String(sc.type ?? ""),
      })
    }
  } catch {
    metaByPropId = new Map()
    console.warn(
      "Could not load Notion database schema — posts may be missing mapped fields"
    )
  }

  const pages = await queryAllDatabasePages(notion, databaseId)
  const posts = pages.map((page) => mapNotionDatabasePage(page, metaByPropId))

  posts.sort((a, b) => comparePublishedAt(a, b, "desc"))

  return posts
}
