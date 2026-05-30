import type { Block } from "notion-types"

/**
 * Map arbitrary Notion asset URLs to something the app / Notion proxy can load.
 * Non-GIF images go through www.notion.so/image/ so presigned S3 URLs are
 * refreshed on every request. GIFs bypass the proxy because the Notion proxy
 * redirects to img.notionusercontent.com/size/ which returns 422 for animated GIFs.
 * For img.notionusercontent.com GIF URLs that already contain /size/, the suffix
 * is stripped so the CDN serves the raw file instead of the image optimizer.
 */
export const customMapImageUrl = (url: string, block: Block): string => {
  if (!url) {
    throw new Error("URL can't be empty")
  }

  if (url.startsWith("data:")) {
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
      // /size/ does not support animated GIFs — strip it to serve the raw file.
      if (/\.gif(?=\/)/i.test(u.pathname)) {
        return url.replace("/size/", "/")
      }
      return url
    }
  } catch {
    // ignore invalid urls
  }

  // For non-img.notionusercontent.com GIF URLs (e.g. S3 presigned), return directly.
  if (/\.gif(?=$|\?|#)/i.test(url)) {
    return url
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
