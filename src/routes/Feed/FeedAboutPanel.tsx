import AboutDrawerContent from "src/components/AboutDrawerContent"
import FeedPanelScroll from "src/routes/Feed/FeedPanelScroll"
import FeedSidePanel from "src/routes/Feed/FeedSidePanel"

const FeedAboutPanel = () => (
  <FeedSidePanel edge="left" enterMotion="unfold" showClose={false}>
    <FeedPanelScroll>
      <AboutDrawerContent />
    </FeedPanelScroll>
  </FeedSidePanel>
)

export default FeedAboutPanel
