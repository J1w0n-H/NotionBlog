import type { Block } from "notion-types"

// Matches newer react-notion-x / notion-utils `defaultMapImageUrl` behavior
// (notion-utils@6.16.0 npm build does not export it — inlined here).
const GIF_REGEXP = /(?:https?:\/\/)?[^\s]+\.gif(?=$|\?|#)/

/**
 * Map arbitrary Notion asset URLs to something the app / Notion proxy can load.
 * Keeps parity with react-notion-x (GIF passthrough, img.notionusercontent.com, etc.).
 */
export const customMapImageUrl = (url: string, block: Block): string => {
  if (!url) {
    throw new Error("URL can't be empty")
  }

  if (url.startsWith("data:")) {
    return url
  }

  if (GIF_REGEXP.test(url)) {
    return url
  }

  if (url.startsWith("https://images.unsplash.com")) {
    return url
  }

  try {
    const u = new URL(url)

    if (
      u.pathname.startsWith("/secure.notion-static.com") &&
      u.hostname.endsWith(".amazonaws.com")
    ) {
      if (
        u.searchParams.has("X-Amz-Credential") &&
        u.searchParams.has("X-Amz-Signature") &&
        u.searchParams.has("X-Amz-Algorithm")
      ) {
        return url
      }
    }

    if (u.hostname === "img.notionusercontent.com") {
      return url
    }
  } catch {
    // ignore invalid urls
  }

  let nextUrl = url
  if (nextUrl.startsWith("/images")) {
    nextUrl = `https://www.notion.so${nextUrl}`
  }

  nextUrl = `https://www.notion.so${
    nextUrl.startsWith("/image") ? nextUrl : `/image/${encodeURIComponent(nextUrl)}`
  }`

  const notionImageUrlV2 = new URL(nextUrl)
  let table = block.parent_table === "space" ? "block" : block.parent_table
  if (table === "collection" || table === "team") {
    table = "block"
  }
  notionImageUrlV2.searchParams.set("table", table)
  notionImageUrlV2.searchParams.set("id", block.id)
  notionImageUrlV2.searchParams.set("cache", "v2")

  return notionImageUrlV2.toString()
}
