/** Minimal shapes for Notion database query responses (official SDK). */

export type NotionRichTextItem = {
  plain_text?: string
  text?: { content?: string }
}

export type NotionPropertyValue = {
  title?: NotionRichTextItem[]
  rich_text?: NotionRichTextItem[]
  date?: { start?: string; end?: string | null }
  select?: { name?: string } | null
  multi_select?: Array<{ name?: string }>
  number?: number | null
  checkbox?: boolean
  files?: Array<{
    type?: string
    external?: { url?: string }
    file?: { url?: string }
  }>
  url?: string | null
}

export type NotionPageResult = {
  id: string
  properties: Record<string, NotionPropertyValue>
  cover?: {
    type: "external" | "file"
    external?: { url: string }
    file?: { url: string }
  }
  created_time: string
  last_edited_time: string
}

export type NotionQueryResponse = {
  results: NotionPageResult[]
}

export type NotionDatabaseProperty = {
  id: string
  name: string
  type: string
}

export type NotionDatabaseResponse = {
  properties: Record<string, NotionDatabaseProperty>
}
