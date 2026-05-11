import { useEffect, useState } from "react"

const FEED_DESKTOP_LAYOUT_QUERY = "(min-width: 1024px)"

export function useFeedDesktopLayoutActive(): boolean {
  const [active, setActive] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(FEED_DESKTOP_LAYOUT_QUERY)
    const sync = () => setActive(media.matches)

    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [])

  return active
}
