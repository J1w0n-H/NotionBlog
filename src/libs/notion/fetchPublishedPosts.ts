import { getPosts } from "src/apis"
import {
  applyNotionPublicationGate,
  type NotionPublicationPreset,
} from "src/libs/postFilters"
import type { TPost, TPosts } from "src/types"

type PostCollections = { raw: TPosts; feed: TPosts; detail: TPosts }

/**
 * Short-lived, per-process cache. `next build` renders every page in the same
 * worker(s); without this each page re-queried the whole database, which hit
 * Notion's rate limit and silently produced empty/404 pages. Kept short so a
 * Public → Private change still propagates within one ISR window.
 */
export const COLLECTIONS_TTL_MS = 10_000

let inFlight: Promise<PostCollections> | null = null
let cached: { at: number; value: PostCollections } | null = null
let lastGood: PostCollections | null = null

function toCollections(raw: TPosts): PostCollections {
  return {
    raw,
    feed: applyNotionPublicationGate(raw, "feed"),
    detail: applyNotionPublicationGate(raw, "detail"),
  }
}

async function fetchCollections(): Promise<PostCollections> {
  try {
    const value = toCollections(await getPosts())
    cached = { at: Date.now(), value }
    if (value.raw.length > 0) lastGood = value
    return value
  } catch (error) {
    console.error("Error loading posts from Notion:", error)
    // A transient Notion failure must not publish an empty feed / 404 every
    // post: reuse the last good result this instance saw. With none (cold
    // build), fall back to [] — the previous behaviour, so builds don't break.
    return lastGood ?? toCollections([])
  } finally {
    inFlight = null
  }
}

export async function loadPublicPostCollections(): Promise<PostCollections> {
  if (cached && Date.now() - cached.at < COLLECTIONS_TTL_MS) return cached.value
  inFlight ??= fetchCollections()
  return inFlight
}

/** Test hook: forget cached collections. */
export function resetPostCollectionsCache() {
  inFlight = null
  cached = null
  lastGood = null
}

/** Notion ingest + publication preset (feed, detail, sitemap, revalidate). */
export async function fetchPublishedPosts(
  preset: NotionPublicationPreset = "feed"
): Promise<TPosts> {
  const collections = await loadPublicPostCollections()
  return collections[preset]
}

export async function findPublishedDetailPostByPageId(
  pageId: string
): Promise<TPost | null> {
  const { detail } = await loadPublicPostCollections()
  return detail.find((post) => post.id === pageId) ?? null
}
