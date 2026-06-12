import { useEffect, useLayoutEffect, useState } from "react"
import { FEED_DESKTOP_LAYOUT_QUERY } from "src/styles/feedBreakpoints"

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

export function useFeedDesktopLayoutActive(): boolean {
  const [active, setActive] = useState(false)

  useIsomorphicLayoutEffect(() => {
    const media = window.matchMedia(FEED_DESKTOP_LAYOUT_QUERY)
    const sync = () => setActive(media.matches)
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [])

  return active
}
