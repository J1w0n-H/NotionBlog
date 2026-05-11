import { getPosts } from "src/apis"
import {
  applyNotionPublicationGate,
  type NotionPublicationPreset,
} from "src/libs/postFilters"
import type { TPosts } from "src/types"

/** Notion ingest + publication preset (feed, detail, sitemap, revalidate). */
export async function fetchPublishedPosts(
  preset: NotionPublicationPreset = "feed"
): Promise<TPosts> {
  const raw = await getPosts()
  return applyNotionPublicationGate(raw, preset)
}
