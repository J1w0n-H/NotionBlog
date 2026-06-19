import { CONFIG } from "site.config"
import { Client } from "@notionhq/client"
import type { TPosts } from "src/types"
import { queryAllDatabasePages } from "src/libs/notion/queryAllDatabasePages"
import {
  buildSchemaByPropId,
  mapNotionDatabasePage,
} from "src/libs/notion/mapNotionDatabasePage"

export const getPosts = async (): Promise<TPosts> => {
  const notionToken = process.env.NOTION_API_KEY
  if (!notionToken) {
    console.warn("NOTION_API_KEY not found - returning empty posts array")
    return []
  }

  const databaseId = CONFIG.notionConfig.pageId as string
  if (!databaseId) throw new Error("NOTION_PAGE_ID not configured")

  try {
    const notion = new Client({ auth: notionToken })
    const pages = await queryAllDatabasePages(notion, databaseId)
    const schema = buildSchemaByPropId(pages)
    const posts = pages.map((page) => mapNotionDatabasePage(page, schema))

    posts.sort((a, b) => {
      const dateA = new Date(a.date?.start_date ?? a.createdTime).getTime()
      const dateB = new Date(b.date?.start_date ?? b.createdTime).getTime()
      return dateB - dateA
    })

    return posts
  } catch (error) {
    console.error("Error in getPosts:", error)
    return []
  }
}
