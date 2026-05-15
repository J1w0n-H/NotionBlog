import { useEffect } from "react"
import { useRouter } from "next/router"
import { ABOUT_SLUG } from "src/constants"
import { useReturnToFeed } from "src/hooks/useReturnToFeed"
import { pickFeedListQuery } from "src/libs/utils/returnToFeed"

export function useAboutPanelToggle() {
  const router = useRouter()
  const returnToFeed = useReturnToFeed()
  const slug = `${router.query.slug ?? ""}`
  const isOpen =
    router.isReady && router.pathname === "/[slug]" && slug === ABOUT_SLUG

  const toggle = () => {
    if (isOpen) {
      returnToFeed({ scroll: false })
      return
    }
    void router.push(
      {
        pathname: `/${ABOUT_SLUG}`,
        query: pickFeedListQuery(router.query),
      },
      undefined,
      { scroll: false }
    )
  }

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") returnToFeed({ scroll: false })
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isOpen, returnToFeed])

  return { isOpen, toggle }
}
