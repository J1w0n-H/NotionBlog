import { getPosts } from "src/apis"
import {
  applyNotionPublicationGate,
  type NotionPublicationPreset,
} from "src/libs/postFilters"
import type { TPosts } from "src/types"

export async function loadPublicPostCollections() {
  const raw = await getPosts()
  return {
    raw,
    feed: applyNotionPublicationGate(raw, "feed"),
    detail: applyNotionPublicationGate(raw, "detail"),
  }
}

/** Notion ingest + publication preset (feed, detail, sitemap, revalidate). */
export async function fetchPublishedPosts(
  preset: NotionPublicationPreset = "feed"
): Promise<TPosts> {
  const collections = await loadPublicPostCollections()
  return collections[preset]
}
