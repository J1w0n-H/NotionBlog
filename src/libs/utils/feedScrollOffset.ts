import { FEED_TABLET_LAYOUT_QUERY } from "src/styles/feedBreakpoints"

/** Sticky header + tag row clearance for in-page feed section jumps */
export const FEED_SCROLL_OFFSET_VAR = "--feed-scroll-offset"
export const FEED_HEADER_HEIGHT_VAR = "--feed-header-height"
export const FEED_SECTION_NAV_BAND_HEIGHT_VAR = "--feed-section-nav-band-height"
export const FEED_TAG_CHIPS_STICKY_TOP = `calc(var(${FEED_HEADER_HEIGHT_VAR}, 5.25rem) + 0.5rem + var(${FEED_SECTION_NAV_BAND_HEIGHT_VAR}, 0px))`

const FEED_SCROLL_GAP_PX = 12
const FEED_SECTION_NAV_BAND_SELECTOR = "aside.lt[data-feed-section-nav-band]"

function measureFeedHeaderHeightPx(): number {
  if (typeof document === "undefined") return 84

  const header = document.querySelector<HTMLElement>("[data-header]")
  return Math.ceil(header?.getBoundingClientRect().height ?? 84)
}

function isFeedSectionNavInScrollStack(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia(FEED_TABLET_LAYOUT_QUERY).matches
}

function measureFeedSectionNavBandHeightPx(): number {
  if (!isFeedSectionNavInScrollStack()) return 0

  const band = document.querySelector<HTMLElement>(FEED_SECTION_NAV_BAND_SELECTOR)
  if (!band) return 0

  const style = window.getComputedStyle(band)
  if (style.display === "none" || style.visibility === "hidden") return 0

  const height = band.getBoundingClientRect().height
  return height > 0 ? Math.ceil(height) : 0
}

/** Viewport top → first line of section content (sticky stack + gap). */
export function measureFeedStickyStackHeightPx(): number {
  if (typeof document === "undefined") return 120

  let stack = measureFeedHeaderHeightPx()
  stack += measureFeedSectionNavBandHeightPx()

  const tags = document.querySelector<HTMLElement>('[aria-label="Top tags"]')
  if (tags) {
    stack += tags.getBoundingClientRect().height
  }

  return Math.ceil(stack + FEED_SCROLL_GAP_PX)
}

export function syncFeedScrollOffsetVar(): number {
  const headerPx = measureFeedHeaderHeightPx()
  const sectionNavBandPx = measureFeedSectionNavBandHeightPx()
  const px = measureFeedStickyStackHeightPx()

  document.documentElement.style.setProperty(
    FEED_HEADER_HEIGHT_VAR,
    `${headerPx}px`
  )
  document.documentElement.style.setProperty(
    FEED_SECTION_NAV_BAND_HEIGHT_VAR,
    `${sectionNavBandPx}px`
  )
  document.documentElement.style.setProperty(FEED_SCROLL_OFFSET_VAR, `${px}px`)
  return px
}
