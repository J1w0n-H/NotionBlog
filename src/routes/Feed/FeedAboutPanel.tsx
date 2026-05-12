import AboutDrawerContent from "src/components/AboutDrawerContent"
import FeedPanelScroll from "src/routes/Feed/FeedPanelScroll"
import FeedSidePanel from "src/routes/Feed/FeedSidePanel"

const FeedAboutPanel = () => {
  return (
    <FeedSidePanel edge="left" closeAriaLabel="Close About">
      <FeedPanelScroll>
        <AboutDrawerContent />
      </FeedPanelScroll>
    </FeedSidePanel>
  )
}

export default FeedAboutPanel
