import type { Block } from "notion-types"
import type { PostDetail } from "src/types"
import { customMapImageUrl } from "src/libs/utils/notion/customMapImageUrl"

/**
 * Prefer mapped post thumbnail (Notion cover / “thumbnail” files column).
 * Fallback: root page block `format.page_cover` from the recordMap (e.g. after API fetch).
 */
export function resolvePostBannerImageUrl(
  detail: PostDetail
): string | undefined {
  const fromMeta = detail.thumbnail?.trim()
  if (fromMeta) return fromMeta

  const pageId = detail.id
  const pageBlock = detail.recordMap.block[pageId]?.value as
    | {
        type?: string
        format?: { page_cover?: string }
      }
    | undefined

  if (!pageBlock || pageBlock.type !== "page") return undefined

  const raw = pageBlock.format?.page_cover
  if (typeof raw !== "string" || !raw.trim()) return undefined

  const fakeBlock = { id: pageId, parent_table: "block" } as Block
  try {
    return customMapImageUrl(raw.trim(), fakeBlock)
  } catch {
    return raw.trim()
  }
}
