import { useCallback, useEffect, useRef, useState } from "react"
import {
  measureFeedStickyStackHeightPx,
  syncFeedScrollOffsetVar,
} from "src/libs/utils/feedScrollOffset"

export function useScrollSpy(spySectionIds: string[], routerPath: string) {
  const [activeId, setActiveId] = useState<string>(() => spySectionIds[0] ?? "")
  const rafRef = useRef<number | null>(null)
  const manualActiveRef = useRef<{ id: string; until: number } | null>(null)

  useEffect(() => {
    manualActiveRef.current = null
  }, [routerPath])

  const computeSpyIdFromScroll = useCallback((): string | null => {
    const resolved = spySectionIds
      .map((id) => {
        const el = document.getElementById(id)
        return el ? { id, el } : null
      })
      .filter(Boolean) as { id: string; el: HTMLElement }[]

    if (resolved.length === 0) return null

    const line = measureFeedStickyStackHeightPx()
    let active = resolved[0].id
    for (const { id, el } of resolved) {
      if (el.getBoundingClientRect().top <= line + 6) active = id
      else break
    }
    return active
  }, [spySectionIds])

  useEffect(() => {
    const computeActive = () => {
      rafRef.current = null
      const manual = manualActiveRef.current
      if (manual && Date.now() < manual.until) {
        setActiveId(manual.id)
        return
      }
      const next = computeSpyIdFromScroll()
      if (next != null) setActiveId(next)
    }

    const onScrollOrResize = () => {
      if (rafRef.current != null) return
      rafRef.current = window.requestAnimationFrame(computeActive)
    }

    window.addEventListener("scroll", onScrollOrResize, { passive: true })
    window.addEventListener("resize", onScrollOrResize)
    onScrollOrResize()

    return () => {
      window.removeEventListener("scroll", onScrollOrResize)
      window.removeEventListener("resize", onScrollOrResize)
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [computeSpyIdFromScroll, routerPath])

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    syncFeedScrollOffsetVar()
    manualActiveRef.current = { id, until: Date.now() + 1500 }
    const headerOffset = measureFeedStickyStackHeightPx() + 24
    const targetTop =
      el.getBoundingClientRect().top + window.scrollY - headerOffset
    window.scrollTo({ top: targetTop, behavior: "smooth" })
    setActiveId(id)
  }, [])

  return { activeId, scrollTo }
}
