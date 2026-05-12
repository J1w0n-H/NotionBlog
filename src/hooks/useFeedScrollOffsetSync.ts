import { useEffect } from "react"
import { syncFeedScrollOffsetVar } from "src/libs/utils/feedScrollOffset"

const FEED_SCROLL_OFFSET_SELECTORS = [
  "[data-header]",
  "aside.lt[data-feed-section-nav-band]",
  '[aria-label="Top tags"]',
] as const

/** Keeps feed sticky stack CSS vars aligned with header, nav band, and tags. */
export function useFeedScrollOffsetSync(enabled = true): void {
  useEffect(() => {
    if (!enabled) return

    const bump = () => {
      syncFeedScrollOffsetVar()
    }

    const observed = new Set<Element>()
    const ro = new ResizeObserver(bump)

    const observeTargets = () => {
      for (const sel of FEED_SCROLL_OFFSET_SELECTORS) {
        const el = document.querySelector(sel)
        if (!el || observed.has(el)) continue
        ro.observe(el)
        observed.add(el)
      }
    }

    bump()
    observeTargets()

    window.addEventListener("resize", bump, { passive: true })

    const mo = new MutationObserver(() => {
      observeTargets()
      bump()
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener("resize", bump)
      mo.disconnect()
      ro.disconnect()
    }
  }, [enabled])
}
