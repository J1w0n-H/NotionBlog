/** Sticky header + tag row clearance for in-page feed section jumps */
export const FEED_SCROLL_OFFSET_VAR = "--feed-scroll-offset"

const FEED_SCROLL_GAP_PX = 12

/** Viewport top → first line of section content (sticky stack + gap). */
export function measureFeedStickyStackHeightPx(): number {
  if (typeof document === "undefined") return 120

  const header = document.querySelector<HTMLElement>("[data-header]")
  let stack = header?.getBoundingClientRect().height ?? 84

  const tags = document.querySelector<HTMLElement>('[aria-label="Top tags"]')
  if (tags) {
    stack += tags.getBoundingClientRect().height
  }

  return Math.ceil(stack + FEED_SCROLL_GAP_PX)
}

export function syncFeedScrollOffsetVar(): number {
  const px = measureFeedStickyStackHeightPx()
  document.documentElement.style.setProperty(FEED_SCROLL_OFFSET_VAR, `${px}px`)
  return px
}
