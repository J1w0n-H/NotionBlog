import { useEffect, useRef } from "react"
import AboutDrawerContent from "src/components/AboutDrawerContent"
import FeedPanelScroll from "src/routes/Feed/FeedPanelScroll"
import FeedSidePanel from "src/routes/Feed/FeedSidePanel"

const FeedAboutPanel = () => {
  const scrollRootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRootRef.current) {
      scrollRootRef.current.scrollTop = 0
    }
  }, [])

  return (
    <FeedSidePanel edge="left" enterMotion="unfold" showClose={false}>
      <FeedPanelScroll ref={scrollRootRef}>
        <AboutDrawerContent scrollRootRef={scrollRootRef} />
      </FeedPanelScroll>
    </FeedSidePanel>
  )
}

export default FeedAboutPanel
