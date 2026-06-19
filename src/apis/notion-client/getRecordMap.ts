import { Client } from "@notionhq/client"

type RichTextAnnotations = {
  bold?: boolean; italic?: boolean; strikethrough?: boolean
  underline?: boolean; code?: boolean; color?: string
}
type RichTextItem = {
  plain_text?: string
  text?: { content?: string; link?: { url?: string } }
  href?: string
  annotations?: RichTextAnnotations
}
type InlineToken = string | [string, ...string[]]

type LegacyBlockValue = {
  id: string; type: string; parent_id: string; parent_table: string
  alive: boolean; created_time: number; last_edited_time: number
  properties?: Record<string, InlineToken[][]>
  format?: Record<string, unknown>
  content?: string[]
}
type LegacyBlockEntry = { value: LegacyBlockValue; role: "reader" }

const UNSUPPORTED_BLOCK_TYPES = new Set(["ai_block"])

const TYPE_MAP: Record<string, string> = {
  paragraph: "text",
  heading_1: "header",
  heading_2: "sub_header",
  heading_3: "sub_sub_header",
  bulleted_list_item: "bulleted_list",
  numbered_list_item: "numbered_list",
  to_do: "to_do",
  toggle: "toggle",
  code: "code",
  quote: "quote",
  callout: "callout",
  divider: "divider",
  image: "image",
  video: "video",
  file: "file",
  pdf: "pdf",
  bookmark: "bookmark",
  embed: "embed",
  table: "table",
  table_row: "table_row",
  column_list: "column_list",
  column: "column",
  child_page: "page",
}

const convertRichText = (richTexts: RichTextItem[]): InlineToken[][] => {
  if (!richTexts || !Array.isArray(richTexts) || richTexts.length === 0)
    return [[""]]
  return richTexts.map((rt) => {
    const text = rt.plain_text ?? rt.text?.content ?? ""
    const ann = rt.annotations ?? {}
    const marks: [string, ...string[]][] = []
    if (ann.bold) marks.push(["b"])
    if (ann.italic) marks.push(["i"])
    if (ann.strikethrough) marks.push(["s"])
    if (ann.underline) marks.push(["_"])
    if (ann.code) marks.push(["c"])
    const href = rt.text?.link?.url ?? rt.href
    if (href) marks.push(["a", href])
    if (ann.color && ann.color !== "default") marks.push(["h", ann.color])
    return marks.length > 0 ? [text, marks] : [text]
  })
}

const isUnsupportedNotionBlockError = (error: unknown) => {
  if (!error || typeof error !== "object") return false
  const code = (error as { code?: string }).code
  const message = (error as { message?: string }).message
  return (
    code === "validation_error" &&
    typeof message === "string" &&
    message.includes("not supported via the API")
  )
}

const fetchBlocksRecursively = async (
  notion: Client,
  blockId: string,
  blocks: Record<string, LegacyBlockEntry>
): Promise<string[]> => {
  const childIds: string[] = []
  let cursor: string | undefined

  do {
    let response: Awaited<ReturnType<typeof notion.blocks.children.list>>
    try {
      response = await notion.blocks.children.list({
        block_id: blockId,
        page_size: 100,
        ...(cursor ? { start_cursor: cursor } : {}),
      })
    } catch (error) {
      if (isUnsupportedNotionBlockError(error)) {
        console.warn(
          `Skipping unsupported Notion children for block ${blockId}`
        )
        return childIds
      }
      throw error
    }

    for (const block of response.results) {
      if (UNSUPPORTED_BLOCK_TYPES.has(block.type)) {
        blocks[block.id] = {
          value: {
            id: block.id,
            type: "text",
            parent_id: blockId,
            parent_table: "block",
            alive: true,
            properties: {
              title: [["(Notion AI block is not available via API)"]],
            },
            created_time: new Date(block.created_time).getTime(),
            last_edited_time: new Date(block.last_edited_time).getTime(),
          },
          role: "reader",
        }
        childIds.push(block.id)
        continue
      }

      const internalType = TYPE_MAP[block.type] ?? "text"
      const blockContent = ((block as Record<string, unknown>)[block.type] ?? {}) as Record<string, unknown>
      const richTexts = (blockContent.rich_text as RichTextItem[] | undefined) ?? []

      const value: LegacyBlockValue = {
        id: block.id,
        type: internalType,
        parent_id: blockId,
        parent_table: "block",
        alive: true,
        created_time: new Date(block.created_time).getTime(),
        last_edited_time: new Date(block.last_edited_time).getTime(),
      }

      if (block.type === "image" || block.type === "video") {
        const src = blockContent as { file?: { url?: string }; external?: { url?: string } }
        const url = src.file?.url ?? src.external?.url ?? ""
        value.properties = { source: [[url]] }
        if (block.type === "image") value.format = { display_source: url, block_width: 640 }
      } else if (block.type === "code") {
        const src = blockContent as { language?: string }
        value.properties = {
          title: convertRichText(richTexts),
          language: [[src.language ?? "plain text"]],
        }
      } else if (block.type === "to_do") {
        const src = blockContent as { checked?: boolean }
        value.properties = {
          title: convertRichText(richTexts),
          checked: [[src.checked ? "Yes" : "No"]],
        }
      } else if (block.type === "bookmark" || block.type === "embed") {
        const url = (blockContent.url as string) ?? ""
        value.properties = { link: [[url]], title: [[url]] }
      } else if (block.type === "callout") {
        value.properties = { title: convertRichText(richTexts) }
        const icon = blockContent.icon as { emoji?: string } | undefined
        if (icon?.emoji) value.format = { page_icon: icon.emoji }
      } else if (block.type === "table") {
        const src = blockContent as { has_column_header?: boolean; has_row_header?: boolean }
        value.format = {
          table_block_column_header: src.has_column_header,
          table_block_row_header: src.has_row_header,
        }
      } else if (block.type === "table_row") {
        const cells = (blockContent.cells as RichTextItem[][]) ?? []
        value.properties = {}
        cells.forEach((cell, i) => {
          value.properties![`col${i}`] = convertRichText(cell)
        })
      } else if (richTexts.length > 0) {
        value.properties = { title: convertRichText(richTexts) }
      }

      blocks[block.id] = { value, role: "reader" }
      childIds.push(block.id)

      if (block.has_children) {
        try {
          const grandchildIds = await fetchBlocksRecursively(
            notion,
            block.id,
            blocks
          )
          blocks[block.id].value.content = grandchildIds
        } catch (error) {
          if (isUnsupportedNotionBlockError(error)) {
            console.warn(
              `Skipping unsupported Notion children for block ${block.id}`
            )
            blocks[block.id].value.content = []
            continue
          }
          throw error
        }
      }
    }

    cursor = response.has_more ? response.next_cursor : undefined
  } while (cursor)

  return childIds
}

export const getRecordMap = async (pageId: string) => {
  try {
    const apiKey = process.env.NOTION_API_KEY
    if (!apiKey) {
      console.error("NOTION_API_KEY not set")
      return emptyRecordMap()
    }

    const notion = new Client({ auth: apiKey, timeoutMs: 90_000 })

    const page = await notion.pages.retrieve({ page_id: pageId })
    const props = (page as { properties?: Record<string, unknown> }).properties ?? {}
    const titleProp = ((props.title ?? props.Name) as { title?: RichTextItem[] } | undefined)?.title ?? []
    const pageTitle = titleProp.map((t) => t.plain_text ?? "").join("")

    const blocks: Record<string, LegacyBlockEntry> = {}

    const p = page as {
      parent?: { page_id?: string; database_id?: string; type?: string }
      in_trash?: boolean; archived?: boolean
      icon?: { emoji?: string; external?: { url?: string } }
      cover?: { external?: { url?: string }; file?: { url?: string } }
      created_time: string; last_edited_time: string
    }
    blocks[pageId] = {
      value: {
        id: pageId,
        type: "page",
        parent_id: p.parent?.page_id ?? p.parent?.database_id ?? "",
        parent_table: p.parent?.type === "database_id" ? "collection" : "block",
        alive: !(p.in_trash ?? p.archived ?? false),
        properties: { title: [[pageTitle]] },
        format: {
          page_icon: p.icon?.emoji ?? p.icon?.external?.url ?? "",
          page_cover: p.cover?.external?.url ?? p.cover?.file?.url ?? "",
        },
        content: [],
        created_time: new Date(p.created_time).getTime(),
        last_edited_time: new Date(p.last_edited_time).getTime(),
      },
      role: "reader",
    }

    const childIds = await fetchBlocksRecursively(notion, pageId, blocks)
    blocks[pageId].value.content = childIds

    return {
      block: blocks,
      collection: {},
      collection_view: {},
      collection_query: {},
      notion_user: {},
      signed_urls: {},
      preview_images: {},
    }
  } catch (error) {
    console.error(`getRecordMap failed for page ${pageId}:`, error)
    return emptyRecordMap()
  }
}

const emptyRecordMap = () => ({
  block: {},
  collection: {},
  collection_view: {},
  collection_query: {},
  notion_user: {},
  signed_urls: {},
  preview_images: {},
})
