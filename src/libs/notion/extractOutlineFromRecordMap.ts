import type { ExtendedRecordMap } from "notion-types"

export type NotionOutlineItem = {
  id: string
  depth: 2 | 3
  text: string
}

const HEADING_DEPTH: Record<string, 2 | 3 | undefined> = {
  /** Notion API `heading_1` after `getRecordMap` TYPE_MAP. */
  header: 2,
  sub_header: 2,
  sub_sub_header: 3,
  heading_2: 2,
  heading_3: 3,
}

function richTextToPlainText(value: unknown): string {
  if (typeof value === "string") return value
  if (!Array.isArray(value)) return ""
  if (typeof value[0] === "string") return value[0]
  return value.map(richTextToPlainText).filter(Boolean).join("")
}

function extractPlainTextFromNotionTitle(value: unknown): string {
  if (!Array.isArray(value)) return ""
  return value
    .map((segment) => {
      const text = richTextToPlainText(segment).trim()
      return text
    })
    .filter(Boolean)
    .join(" ")
    .trim()
}

function findPageBlockId(blockMap: ExtendedRecordMap["block"]): string | null {
  const entries = Object.entries(blockMap ?? {})
  const page = entries.find(([, b]) => b?.value?.type === "page")
  return page?.[0] ?? entries[0]?.[0] ?? null
}

/** Depth-first block ids starting from the page's direct children (document order). */
function collectBlockIdsPreorder(
  blockMap: ExtendedRecordMap["block"],
  pageId: string
): string[] {
  const ordered: string[] = []
  const walk = (id: string) => {
    ordered.push(id)
    const kids = blockMap[id]?.value?.content
    if (!Array.isArray(kids)) return
    for (const child of kids) {
      if (typeof child === "string") walk(child)
    }
  }
  const top = blockMap[pageId]?.value?.content
  if (!Array.isArray(top)) return ordered
  for (const child of top) {
    if (typeof child === "string") walk(child)
  }
  return ordered
}

/**
 * Collects h2 / h3 headings from a react-notion-x `recordMap` in document order.
 * Supports `getRecordMap` internal types (`header` ← heading_1, `sub_header`, `sub_sub_header`)
 * and legacy `heading_2` / `heading_3` when present.
 */
export function extractOutlineFromRecordMap(
  recordMap: ExtendedRecordMap | null | undefined
): NotionOutlineItem[] {
  if (!recordMap?.block) return []
  const blockMap = recordMap.block
  const pageId = findPageBlockId(blockMap)
  if (!pageId) return []

  const ordered = collectBlockIdsPreorder(blockMap, pageId)
  const out: NotionOutlineItem[] = []

  for (const id of ordered) {
    const wrap = blockMap[id]
    const v = wrap?.value
    if (!v?.type) continue
    const depth = HEADING_DEPTH[v.type]
    if (!depth) continue
    const props = v.properties as Record<string, unknown> | undefined
    if (!props) continue
    const text = extractPlainTextFromNotionTitle(props.title)
    if (!text) continue
    const blockId = (v.id as string | undefined) ?? id
    out.push({ id: blockId, depth, text })
  }

  return out
}
