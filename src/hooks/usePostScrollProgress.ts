import { useEffect, useState, type RefObject } from "react"

/**
 * Normalized scroll depth in a scrollable root (0 at top, 1 at bottom).
 */
export function usePostScrollProgress(
  scrollRef: RefObject<HTMLElement | null>,
  enabled: boolean
): number {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!enabled) {
      setProgress(0)
      return
    }
    const el = scrollRef.current
    if (!el) return

    const measure = () => {
      const max = el.scrollHeight - el.clientHeight
      if (max <= 0) {
        setProgress(0)
        return
      }
      setProgress(Math.min(1, Math.max(0, el.scrollTop / max)))
    }

    el.addEventListener("scroll", measure, { passive: true })
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    measure()

    return () => {
      el.removeEventListener("scroll", measure)
      ro.disconnect()
    }
  }, [scrollRef, enabled])

  return progress
}
