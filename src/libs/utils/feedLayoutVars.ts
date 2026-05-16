import { variables } from "src/styles/variables"

export const FEED_NAV_WIDTH_VAR = "--feed-nav-width"
export const FEED_LIST_WIDTH_VAR = "--feed-list-width"
export const FEED_ABOUT_PANEL_WIDTH_VAR = "--feed-about-panel-width"
export const FEED_ABOUT_TAB_WIDTH_VAR = "--feed-about-tab-width"
export const FEED_POST_PANEL_MIN_WIDTH_VAR = "--feed-post-panel-min-width"

/** When About/post panel is open on desktop, nav column uses this width (dots-only rail). */
export const FEED_NAV_DOCK_WIDTH_PX = 56

export type FeedLayoutMode = "index" | "post" | "about"

export type FeedLayoutWidths = {
  navWidthPx: number
  listWidthPx: number
  aboutPanelWidthPx: number
  aboutTabWidthPx: number
  postPanelMinWidthPx: number
}

export const feedLayoutBounds = {
  navWidthPx: { min: 180, max: 280 },
  listWidthPx: { min: 512, max: 960 },
  aboutPanelWidthPx: { min: 560, max: 1040 },
  aboutTabWidthPx: { min: 88, max: 88 },
  postPanelMinWidthPx: { min: 384, max: 384 },
} as const

export const defaultFeedLayoutWidths: FeedLayoutWidths = {
  navWidthPx: variables.feedNavWidth,
  listWidthPx: variables.feedListWidth,
  aboutPanelWidthPx: variables.feedAboutWidth,
  aboutTabWidthPx: variables.feedAboutTabWidth,
  postPanelMinWidthPx: 384,
}

export function clampFeedLayoutWidth(
  value: number,
  min: number,
  max: number
): number {
  return Math.min(max, Math.max(min, value))
}

export function resolveFeedLayoutWidths(
  widths: Partial<FeedLayoutWidths> = {}
): FeedLayoutWidths {
  return {
    navWidthPx: clampFeedLayoutWidth(
      widths.navWidthPx ?? defaultFeedLayoutWidths.navWidthPx,
      feedLayoutBounds.navWidthPx.min,
      feedLayoutBounds.navWidthPx.max
    ),
    listWidthPx: clampFeedLayoutWidth(
      widths.listWidthPx ?? defaultFeedLayoutWidths.listWidthPx,
      feedLayoutBounds.listWidthPx.min,
      feedLayoutBounds.listWidthPx.max
    ),
    aboutPanelWidthPx: clampFeedLayoutWidth(
      widths.aboutPanelWidthPx ?? defaultFeedLayoutWidths.aboutPanelWidthPx,
      feedLayoutBounds.aboutPanelWidthPx.min,
      feedLayoutBounds.aboutPanelWidthPx.max
    ),
    aboutTabWidthPx: clampFeedLayoutWidth(
      widths.aboutTabWidthPx ?? defaultFeedLayoutWidths.aboutTabWidthPx,
      feedLayoutBounds.aboutTabWidthPx.min,
      feedLayoutBounds.aboutTabWidthPx.max
    ),
    postPanelMinWidthPx: clampFeedLayoutWidth(
      widths.postPanelMinWidthPx ?? defaultFeedLayoutWidths.postPanelMinWidthPx,
      feedLayoutBounds.postPanelMinWidthPx.min,
      feedLayoutBounds.postPanelMinWidthPx.max
    ),
  }
}

export function syncFeedLayoutVars(widths: Partial<FeedLayoutWidths> = {}) {
  if (typeof document === "undefined") return resolveFeedLayoutWidths(widths)

  const resolved = resolveFeedLayoutWidths(widths)
  const root = document.documentElement

  root.style.setProperty(FEED_NAV_WIDTH_VAR, `${resolved.navWidthPx}px`)
  root.style.setProperty(FEED_LIST_WIDTH_VAR, `${resolved.listWidthPx}px`)
  root.style.setProperty(
    FEED_ABOUT_PANEL_WIDTH_VAR,
    `${resolved.aboutPanelWidthPx}px`
  )
  root.style.setProperty(
    FEED_ABOUT_TAB_WIDTH_VAR,
    `${resolved.aboutTabWidthPx}px`
  )
  root.style.setProperty(
    FEED_POST_PANEL_MIN_WIDTH_VAR,
    `${resolved.postPanelMinWidthPx}px`
  )

  return resolved
}
