import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { useRouter } from "next/router"
import { ABOUT_SLUG } from "src/constants"
import { useReturnToFeed } from "src/hooks/useReturnToFeed"
import { pickFeedListQuery } from "src/libs/utils/returnToFeed"
import { FEED_SIDE_PANEL_UNFOLD_MS } from "src/routes/Feed/FeedSidePanel"

type AboutPanelMotionValue = {
  isOpen: boolean
  closing: boolean
  toggle: () => void
  requestClose: () => void
}

const AboutPanelMotionContext = createContext<AboutPanelMotionValue | null>(null)

export function AboutPanelMotionProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const returnToFeed = useReturnToFeed()
  const [closing, setClosing] = useState(false)
  const closingRef = useRef(false)

  const slug = `${router.query.slug ?? ""}`
  const isOpen =
    router.isReady && router.pathname === "/[slug]" && slug === ABOUT_SLUG

  const requestClose = useCallback(() => {
    if (!isOpen || closingRef.current) return
    closingRef.current = true
    setClosing(true)
    window.setTimeout(() => {
      returnToFeed({ scroll: false })
      closingRef.current = false
      setClosing(false)
    }, FEED_SIDE_PANEL_UNFOLD_MS)
  }, [isOpen, returnToFeed])

  const open = useCallback(() => {
    void router.push(
      {
        pathname: `/${ABOUT_SLUG}`,
        query: pickFeedListQuery(router.query),
      },
      undefined,
      { scroll: false }
    )
  }, [router])

  const toggle = useCallback(() => {
    if (isOpen) requestClose()
    else open()
  }, [isOpen, open, requestClose])

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") requestClose()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isOpen, requestClose])

  const value = useMemo(
    () => ({ isOpen, closing, toggle, requestClose }),
    [isOpen, closing, toggle, requestClose]
  )

  return (
    <AboutPanelMotionContext.Provider value={value}>
      {children}
    </AboutPanelMotionContext.Provider>
  )
}

export function useAboutPanelMotion() {
  return useContext(AboutPanelMotionContext)
}
