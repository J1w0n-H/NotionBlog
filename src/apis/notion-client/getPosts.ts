import { CONFIG } from "site.config"
import { Client } from "@notionhq/client"
import {
  buildNotionSchemaFromDatabase,
  mapNotionDatabasePage,
} from "src/libs/notion/mapNotionDatabasePage"
import { comparePublishedAt } from "src/libs/notion/postDate"
import { queryAllDatabasePages } from "src/libs/notion/queryAllDatabasePages"
import type { TPost, TPosts } from "src/types"

export const getPosts = async (): Promise<TPosts> => {
  try {
    const notionToken = process.env.NOTION_API_KEY
    if (!notionToken) {
      console.warn("NOTION_API_KEY not found - returning empty posts array")
      return []
    }

    return await getPostsWithOfficialSDK(notionToken)
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

function withPublicationDefaults(post: TPost): TPost {
  return {
    ...post,
    status: post.status?.length ? post.status : ["Public"],
    type: post.type?.length ? post.type : ["Post"],
  }
}

const getPostsWithOfficialSDK = async (notionToken: string): Promise<TPosts> => {
  const databaseId = CONFIG.notionConfig.pageId as string

  if (!databaseId) {
    throw new Error("NOTION_PAGE_ID not configured")
  }

  const notion = new Client({ auth: notionToken })

  const [database, pages] = await Promise.all([
    notion.databases.retrieve({ database_id: databaseId }),
    queryAllDatabasePages(notion, databaseId),
  ])

  const schema = buildNotionSchemaFromDatabase(
    database.properties as Record<string, { name: string; type: string }>
  )

  const posts = pages.map((page) =>
    withPublicationDefaults(mapNotionDatabasePage(page, schema))
  )

  posts.sort((a, b) => comparePublishedAt(a, b, "desc"))

  return posts
}
