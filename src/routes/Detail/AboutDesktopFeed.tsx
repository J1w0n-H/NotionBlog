import SlugAboutMobileView from "src/routes/Feed/SlugAboutMobileView"
import SlugFeedSplitPage from "src/routes/Feed/SlugFeedSplitPage"

const AboutDesktopFeed = () => {
  return <SlugFeedSplitPage panel="about" mobile={<SlugAboutMobileView />} />
}

export default AboutDesktopFeed
