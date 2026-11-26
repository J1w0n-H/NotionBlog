import { getPosts } from "src/apis"
import {
  applyNotionPublicationGate,
  type NotionPublicationPreset,
} from "src/libs/postFilters"
import type { TPost, TPosts } from "src/types"

type PostCollections = { raw: TPosts; feed: TPosts; detail: TPosts }

/** `next build` sets NEXT_PHASE for the whole build, workers included. */
const isBuildPhase = () => process.env.NEXT_PHASE === "phase-production-build"

/**
 * Per-process cache.
 * - Build: every page renders in the same worker(s); without sharing, each
 *   page re-queried the whole database and hit Notion's rate limit. A build
 *   only needs one consistent snapshot, so the TTL is long.
 * - Runtime (ISR / API): only coalesces near-simultaneous requests. Kept to a
 *   few seconds so a Public → Private change is never served from a stale
 *   snapshot for long; /api/revalidate bypasses it entirely.
 */
export const BUILD_COLLECTIONS_TTL_MS = 60_000
export const RUNTIME_COLLECTIONS_TTL_MS = 3_000
export const collectionsTtlMs = () =>
  isBuildPhase() ? BUILD_COLLECTIONS_TTL_MS : RUNTIME_COLLECTIONS_TTL_MS

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
    // A transient Notion failure must not publish an empty feed or cache a
    // 404 for public posts: reuse the last good snapshot this instance saw.
    if (lastGood) return lastGood
    // Cold build: [] keeps the build going (previous behaviour). Cold runtime:
    // throw, so ISR keeps serving the existing page instead of caching notFound.
    if (isBuildPhase()) return toCollections([])
    throw error
  } finally {
    inFlight = null
  }
}

export async function loadPublicPostCollections(
  options: { fresh?: boolean } = {}
): Promise<PostCollections> {
  if (options.fresh) {
    // Visibility-critical callers (revalidation) must see Notion's current
    // state, never a cached snapshot or someone else's in-flight request.
    inFlight = fetchCollections()
    return inFlight
  }
  if (cached && Date.now() - cached.at < collectionsTtlMs()) return cached.value
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
