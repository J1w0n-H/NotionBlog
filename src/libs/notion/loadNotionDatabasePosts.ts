import { CONFIG } from "site.config"
import { Client } from "@notionhq/client"
import {
  mapNotionDatabasePage,
  type NotionSchemaByPropId,
} from "src/libs/notion/mapNotionDatabasePage"
import { queryAllDatabasePages } from "src/libs/notion/queryAllDatabasePages"
import { comparePublishedAt } from "src/libs/notion/postDate"
import type { TPosts } from "src/types"

export async function loadNotionDatabasePosts(
  notionToken: string
): Promise<TPosts> {
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
