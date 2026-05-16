import type { Block } from "notion-types"
import { defaultMapImageUrl } from "notion-utils"

/**
 * Keep feed thumbnails + Notion renderer on the same mapping as react-notion-x /
 * notion-utils (incl. `img.notionusercontent.com`, GIF, signed URLs).
 */
export const customMapImageUrl = (url: string, block: Block): string => {
  if (!url) {
    throw new Error("URL can't be empty")
  }
  const mapped = defaultMapImageUrl(url, block)
  if (!mapped) {
    throw new Error("URL can't be empty")
  }
  return mapped
}
