import { useRef } from "react"
import AboutDrawerContent from "src/components/AboutDrawerContent"
import FeedPanelScroll from "src/routes/Feed/FeedPanelScroll"
import FeedSidePanel from "src/routes/Feed/FeedSidePanel"

const FeedAboutPanel = () => {
  const scrollRootRef = useRef<HTMLDivElement>(null)

  return (
    <FeedSidePanel edge="left" closeAriaLabel="Close About">
      <FeedPanelScroll ref={scrollRootRef}>
        <AboutDrawerContent scrollRootRef={scrollRootRef} />
      </FeedPanelScroll>
    </FeedSidePanel>
  )
}

export default FeedAboutPanel
