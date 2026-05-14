import { ABOUT_SLUG } from "src/constants"
import type { FeedPanelMode } from "src/routes/Feed/FeedShellContext"

export type FeedShellRouteState = {
  panelMode: FeedPanelMode
  activeSlug: string | null
}

/**
 * Normalizes the dynamic `[slug]` segment from `router.query.slug` (or any
 * string source) so it compares equal to `TPost.slug` from Notion. Next.js
 * may surface `slug` as `string | string[]`; URL encoding can drift from
 * the stored slug; trim/decode keeps the feed shell + PostCard in sync.
 */
export function normalizeFeedPathSlug(value: unknown): string {
  if (value == null) return ""
  const raw = Array.isArray(value) ? value[0] : value
  if (typeof raw !== "string") return ""
  let s = raw.trim()
  if (!s) return ""
  try {
    s = decodeURIComponent(s)
  } catch {
    /* keep s */
  }
  return s.trim()
}

export function resolveFeedShellRouteState(input: {
  pathname: string
  isReady: boolean
  slug: unknown
}): FeedShellRouteState {
  if (!input.isReady || input.pathname !== "/[slug]") {
    return { panelMode: "index", activeSlug: null }
  }

  const slug = normalizeFeedPathSlug(input.slug)
  if (!slug) {
    return { panelMode: "index", activeSlug: null }
  }

  if (slug === ABOUT_SLUG) {
    return { panelMode: "about", activeSlug: slug }
  }

  return { panelMode: "post", activeSlug: slug }
}
