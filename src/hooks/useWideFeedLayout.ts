import { useEffect, useState } from "react"

const QUERY = "(min-width: 1024px)"

export function useWideFeedLayout() {
  const [wide, setWide] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(QUERY)
    const apply = () => setWide(media.matches)
    apply()
    media.addEventListener("change", apply)
    return () => media.removeEventListener("change", apply)
  }, [])

  return wide
}
