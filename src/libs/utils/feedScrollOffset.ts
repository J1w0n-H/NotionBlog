/** Sticky header + tag row clearance for in-page feed section jumps */
export const FEED_SCROLL_OFFSET_VAR = "--feed-scroll-offset"
export const FEED_HEADER_HEIGHT_VAR = "--feed-header-height"
export const FEED_TAG_CHIPS_STICKY_TOP = `calc(var(${FEED_HEADER_HEIGHT_VAR}, 5.25rem) + 0.5rem)`

const FEED_SCROLL_GAP_PX = 12

function measureFeedHeaderHeightPx(): number {
  if (typeof document === "undefined") return 84

  const header = document.querySelector<HTMLElement>("[data-header]")
  return Math.ceil(header?.getBoundingClientRect().height ?? 84)
}

/** Viewport top → first line of section content (sticky stack + gap). */
export function measureFeedStickyStackHeightPx(): number {
  if (typeof document === "undefined") return 120

  let stack = measureFeedHeaderHeightPx()

  const tags = document.querySelector<HTMLElement>('[aria-label="Top tags"]')
  if (tags) {
    stack += tags.getBoundingClientRect().height
  }

  return Math.ceil(stack + FEED_SCROLL_GAP_PX)
}

export function syncFeedScrollOffsetVar(): number {
  const headerPx = measureFeedHeaderHeightPx()
  const px = measureFeedStickyStackHeightPx()
  document.documentElement.style.setProperty(
    FEED_HEADER_HEIGHT_VAR,
    `${headerPx}px`
  )
  document.documentElement.style.setProperty(FEED_SCROLL_OFFSET_VAR, `${px}px`)
  return px
}
