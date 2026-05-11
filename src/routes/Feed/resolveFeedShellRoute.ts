import { ABOUT_SLUG } from "src/constants"
import type { FeedPanelMode } from "src/routes/Feed/FeedShellContext"

export type FeedShellRouteState = {
  panelMode: FeedPanelMode
  activeSlug: string | null
}

export function resolveFeedShellRouteState(input: {
  pathname: string
  isReady: boolean
  slug: string
}): FeedShellRouteState {
  if (!input.isReady || input.pathname !== "/[slug]") {
    return { panelMode: "index", activeSlug: null }
  }

  const slug = input.slug.trim()
  if (!slug) {
    return { panelMode: "index", activeSlug: null }
  }

  if (slug === ABOUT_SLUG) {
    return { panelMode: "about", activeSlug: slug }
  }

  return { panelMode: "post", activeSlug: slug }
}
