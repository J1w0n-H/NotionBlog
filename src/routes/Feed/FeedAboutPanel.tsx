import { useEffect, useRef, useState } from "react"
import AboutDrawerContent from "src/components/AboutDrawerContent"
import FeedPanelScroll from "src/routes/Feed/FeedPanelScroll"
import {
  Cat,
  PanelBody,
  PCloseText,
  PHead,
  PHeadMeta,
  PProgBar,
  PTitle,
} from "src/routes/Feed/FeedPanelChrome"
import FeedSidePanel from "src/routes/Feed/FeedSidePanel"
import { useAboutPanelMotion } from "src/contexts/AboutPanelMotionContext"
import useLanguage from "src/hooks/useLanguage"

const FeedAboutPanel = () => {
  const scrollRootRef = useRef<HTMLDivElement>(null)
  const aboutMotion = useAboutPanelMotion()
  const [language] = useLanguage()
  const isKo = language === "ko"
  const [pct, setPct] = useState(0)

  useEffect(() => {
    if (scrollRootRef.current) {
      scrollRootRef.current.scrollTop = 0
    }
    // Preload the post renderer chunk so TOC works immediately on About→Post navigation
    void import("react-notion-x")
  }, [])

  useEffect(() => {
    const c = scrollRootRef.current
    if (!c) return
    const sync = () => {
      const max = c.scrollHeight - c.clientHeight
      setPct(max > 0 ? Math.round((c.scrollTop / max) * 100) : 0)
    }
    c.addEventListener("scroll", sync, { passive: true })
    return () => c.removeEventListener("scroll", sync)
  }, [])

  return (
    <FeedSidePanel edge="right" enterMotion="unfold" showClose={false}>
      <PHead>
        <PCloseText
          type="button"
          aria-label="Back to feed"
          onClick={() => aboutMotion?.requestClose()}
        >
          &gt;&gt;
        </PCloseText>
        <PHeadMeta>
          <Cat>{isKo ? "전체 이야기" : "THE FULL STORY"}</Cat>
          <PTitle>{isKo ? "이력서 뒤의 이유" : "About — the why behind the résumé"}</PTitle>
        </PHeadMeta>
      </PHead>
      <PProgBar style={{ width: `${pct}%` }} />
      <PanelBody>
        <FeedPanelScroll ref={scrollRootRef}>
          <AboutDrawerContent scrollRootRef={scrollRootRef} />
        </FeedPanelScroll>
      </PanelBody>
    </FeedSidePanel>
  )
}

export default FeedAboutPanel
