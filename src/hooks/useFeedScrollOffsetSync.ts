import { useEffect } from "react"
import { syncFeedScrollOffsetVar } from "src/libs/utils/feedScrollOffset"

/** Keeps `--feed-scroll-offset` aligned with sticky header + tag chips. */
export function useFeedScrollOffsetSync(): void {
  useEffect(() => {
    const bump = () => {
      syncFeedScrollOffsetVar()
    }

    bump()

    window.addEventListener("resize", bump, { passive: true })

    const ro = new ResizeObserver(bump)
    for (const sel of ["[data-header]", '[aria-label="Top tags"]']) {
      const el = document.querySelector(sel)
      if (el) ro.observe(el)
    }

    return () => {
      window.removeEventListener("resize", bump)
      ro.disconnect()
    }
  }, [])
}
