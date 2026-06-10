import { useEffect } from "react"
import { syncFeedScrollOffsetVar } from "src/libs/utils/feedScrollOffset"

const FEED_SCROLL_OFFSET_SELECTORS = [
  "[data-header]",
  "aside[data-feed-section-nav-band]",
  '[aria-label="Top tags"]',
] as const

/** Keeps feed sticky stack CSS vars aligned with header, nav band, and tags. */
export function useFeedScrollOffsetSync(enabled = true): void {
  useEffect(() => {
    if (!enabled) return

    const bump = () => {
      syncFeedScrollOffsetVar()
    }

    const ro = new ResizeObserver(bump)

    for (const sel of FEED_SCROLL_OFFSET_SELECTORS) {
      const el = document.querySelector(sel)
      if (el) ro.observe(el)
    }

    bump()
    window.addEventListener("resize", bump, { passive: true })

    return () => {
      window.removeEventListener("resize", bump)
      ro.disconnect()
    }
  }, [enabled])
}
