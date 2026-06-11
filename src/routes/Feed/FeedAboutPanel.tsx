import { useEffect, useRef, useState } from "react"
import styled from "@emotion/styled"
import AboutDrawerContent from "src/components/AboutDrawerContent"
import FeedPanelScroll from "src/routes/Feed/FeedPanelScroll"
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
        <CloseBtn
          type="button"
          aria-label="Back to feed"
          onClick={() => aboutMotion?.requestClose()}
        >
          ←
        </CloseBtn>
        <Cat>{isKo ? "전체 이야기" : "THE FULL STORY"}</Cat>
        <PTitle>{isKo ? "이력서 뒤의 이유" : "About — the why behind the résumé"}</PTitle>
      </PHead>
      <PProgBar style={{ width: `${pct}%` }} />
      <FeedPanelScroll ref={scrollRootRef}>
        <AboutDrawerContent scrollRootRef={scrollRootRef} />
      </FeedPanelScroll>
    </FeedSidePanel>
  )
}

export default FeedAboutPanel

/* ── header (.phead from mock) ── */

const PHead = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  background: rgba(12, 9, 24, 0.82);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-soft, rgba(255,255,255,.08));
  z-index: 5;
`

const CloseBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  font-family: var(--font-mono, "JetBrains Mono", monospace);
  font-size: 16px;
  color: var(--text, #f1eefb);
  background: var(--surface-2, #1c1838);
  border: 1px solid var(--border, rgba(255,255,255,.16));
  border-radius: 9px;
  padding: 0;
  cursor: pointer;
  flex: none;
  transition: border-color 0.15s, box-shadow 0.15s;

  &:hover {
    border-color: var(--accent, #9b6cff);
    box-shadow: var(--glow-sm, 0 0 10px rgba(155,108,255,.4));
  }
`

const Cat = styled.span`
  font-family: var(--font-mono, "JetBrains Mono", monospace);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent, #9b6cff);
  border: 1px solid rgba(155,108,255,.4);
  border-radius: 999px;
  padding: 3px 10px;
  flex: none;
`

const PTitle = styled.span`
  font-size: 14.5px;
  font-weight: 600;
  color: var(--text, #f1eefb);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
`

/* ── reading progress bar (.pprog from mock) ── */

const PProgBar = styled.div`
  flex: 0 0 auto;
  height: 2px;
  background: linear-gradient(
    90deg,
    var(--link, #2fe6ff),
    var(--accent, #9b6cff),
    var(--signal, #ff5cd0)
  );
  box-shadow: 0 0 8px rgba(155,108,255,.5);
  transition: width 0.12s linear;
`
