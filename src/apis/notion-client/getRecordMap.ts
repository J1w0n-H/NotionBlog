import { Client } from "@notionhq/client"

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

const convertRichText = (richTexts: any[]): any[] => {
  if (!richTexts || !Array.isArray(richTexts) || richTexts.length === 0)
    return [[""]]
  return richTexts.map((rt: any) => {
    const text = rt.plain_text || rt.text?.content || ""
    const annotations = rt.annotations || {}
    const marks: any[] = []
    if (annotations.bold) marks.push(["b"])
    if (annotations.italic) marks.push(["i"])
    if (annotations.strikethrough) marks.push(["s"])
    if (annotations.underline) marks.push(["_"])
    if (annotations.code) marks.push(["c"])
    const href = rt.text?.link?.url || rt.href
    if (href) marks.push(["a", href])
    if (annotations.color && annotations.color !== "default")
      marks.push(["h", annotations.color])
    return marks.length > 0 ? [text, marks] : [text]
  })
}

const fetchBlocksRecursively = async (
  notion: Client,
  blockId: string,
  blocks: Record<string, any>
): Promise<string[]> => {
  const childIds: string[] = []
  let cursor: string | undefined

  do {
    const response: any = await notion.blocks.children.list({
      block_id: blockId,
      page_size: 100,
      ...(cursor ? { start_cursor: cursor } : {}),
    })

    for (const block of response.results) {
      const internalType = TYPE_MAP[block.type] || "text"
      const blockContent = block[block.type] || {}
      const richTexts = blockContent.rich_text || []

      const value: any = {
        id: block.id,
        type: internalType,
        parent_id: blockId,
        parent_table: "block",
        alive: true,
        created_time: new Date(block.created_time).getTime(),
        last_edited_time: new Date(block.last_edited_time).getTime(),
      }

      if (block.type === "image") {
        const url =
          blockContent.file?.url || blockContent.external?.url || ""
        value.properties = { source: [[url]] }
        value.format = { display_source: url, block_width: 640 }
      } else if (block.type === "video") {
        const url =
          blockContent.file?.url || blockContent.external?.url || ""
        value.properties = { source: [[url]] }
      } else if (block.type === "code") {
        value.properties = {
          title: convertRichText(richTexts),
          language: [[blockContent.language || "plain text"]],
        }
      } else if (block.type === "to_do") {
        value.properties = {
          title: convertRichText(richTexts),
          checked: [[blockContent.checked ? "Yes" : "No"]],
        }
      } else if (block.type === "bookmark" || block.type === "embed") {
        const url = blockContent.url || ""
        value.properties = { link: [[url]], title: [[url]] }
      } else if (block.type === "callout") {
        value.properties = { title: convertRichText(richTexts) }
        if (blockContent.icon?.emoji)
          value.format = { page_icon: blockContent.icon.emoji }
      } else if (block.type === "table") {
        value.format = {
          table_block_column_header: blockContent.has_column_header,
          table_block_row_header: blockContent.has_row_header,
        }
      } else if (block.type === "table_row") {
        const cells: any[][] = blockContent.cells || []
        value.properties = {}
        cells.forEach((cell: any[], i: number) => {
          value.properties[`col${i}`] = convertRichText(cell)
        })
      } else if (richTexts.length > 0) {
        value.properties = { title: convertRichText(richTexts) }
      }

      blocks[block.id] = { value, role: "reader" }
      childIds.push(block.id)

      if (block.has_children) {
        const grandchildIds = await fetchBlocksRecursively(
          notion,
          block.id,
          blocks
        )
        blocks[block.id].value.content = grandchildIds
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

    const notion = new Client({ auth: apiKey })

    const page: any = await notion.pages.retrieve({ page_id: pageId })

    const titleProp =
      page.properties?.title?.title ||
      page.properties?.Name?.title ||
      []
    const pageTitle =
      titleProp.map((t: any) => t.plain_text || "").join("") || ""

    const blocks: Record<string, any> = {}

    blocks[pageId] = {
      value: {
        id: pageId,
        type: "page",
        parent_id:
          page.parent?.page_id || page.parent?.database_id || "",
        parent_table:
          page.parent?.type === "database_id" ? "collection" : "block",
        alive: !(page.in_trash ?? page.archived ?? false),
        properties: { title: [[pageTitle]] },
        format: {
          page_icon:
            page.icon?.emoji || page.icon?.external?.url || "",
          page_cover:
            page.cover?.external?.url || page.cover?.file?.url || "",
        },
        content: [],
        created_time: new Date(page.created_time).getTime(),
        last_edited_time: new Date(page.last_edited_time).getTime(),
      },
      role: "reader",
    }

    const childIds = await fetchBlocksRecursively(notion, pageId, blocks)
    blocks[pageId].value.content = childIds

    return {
      block: blocks,
      collection: {},
      collection_view: {},
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
  notion_user: {},
  signed_urls: {},
  preview_images: {},
})
