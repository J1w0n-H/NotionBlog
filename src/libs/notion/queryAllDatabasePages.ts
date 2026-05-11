import type { Client } from "@notionhq/client"

type DatabasePage = {
  id: string
  created_time: string
  last_edited_time?: string
  properties?: Record<string, unknown>
  cover?: {
    type?: string
    external?: { url?: string }
    file?: { url?: string }
  }
}

export async function queryAllDatabasePages(
  notion: Client,
  databaseId: string
): Promise<DatabasePage[]> {
  const results: DatabasePage[] = []
  let cursor: string | undefined

  do {
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: cursor,
    })

    for (const row of response.results) {
      if (!("properties" in row)) continue
      results.push(row as DatabasePage)
    }

    cursor = response.has_more ? response.next_cursor ?? undefined : undefined
  } while (cursor)

  return results
}
