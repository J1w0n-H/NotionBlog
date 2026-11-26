import { CONFIG } from "site.config"
import { Client } from "@notionhq/client"
import type { TPosts } from "src/types"
import { queryAllDatabasePages } from "src/libs/notion/queryAllDatabasePages"
import {
  buildSchemaByPropId,
  mapNotionDatabasePage,
} from "src/libs/notion/mapNotionDatabasePage"

const MAX_ATTEMPTS = 4
const RETRY_BASE_MS = 1_000

/** 4xx other than 429 are config/permission errors — retrying won't help. */
function isRetryable(error: unknown): boolean {
  const status = (error as { status?: unknown } | null)?.status
  if (typeof status === "number") return status === 429 || status >= 500
  return true // network errors, timeouts, Cloudflare 530 without a status
}

function retryDelayMs(error: unknown, attempt: number): number {
  const headers = (error as { headers?: { get?: (k: string) => string | null } })
    ?.headers
  const retryAfter = Number(headers?.get?.("retry-after"))
  if (Number.isFinite(retryAfter) && retryAfter > 0) return retryAfter * 1_000
  return RETRY_BASE_MS * 2 ** (attempt - 1)
}

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  let lastError: unknown
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (attempt === MAX_ATTEMPTS || !isRetryable(error)) break
      await new Promise((r) => setTimeout(r, retryDelayMs(error, attempt)))
    }
  }
  throw lastError
}

/**
 * All rows of the posts database. Returns [] only when no API key is set
 * (local dev); a Notion failure throws so the caller can tell "failed" from
 * "empty" — see loadPublicPostCollections for the fallback policy.
 */
export const getPosts = async (): Promise<TPosts> => {
  const notionToken = process.env.NOTION_API_KEY
  if (!notionToken) {
    console.warn("NOTION_API_KEY not found - returning empty posts array")
    return []
  }

  const databaseId = CONFIG.notionConfig.pageId as string
  if (!databaseId) throw new Error("NOTION_PAGE_ID not configured")

  const notion = new Client({ auth: notionToken })
  const pages = await withRetry(() => queryAllDatabasePages(notion, databaseId))
  const schema = buildSchemaByPropId(pages)
  const posts = pages.map((page) => mapNotionDatabasePage(page, schema))

  posts.sort((a, b) => {
    const dateA = new Date(a.date?.start_date ?? a.createdTime).getTime()
    const dateB = new Date(b.date?.start_date ?? b.createdTime).getTime()
    return dateB - dateA
  })

  return posts
}
