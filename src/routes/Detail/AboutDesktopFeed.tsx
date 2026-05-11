import Feed from "src/routes/Feed"
import FeedAboutPanel from "src/routes/Feed/FeedAboutPanel"
import {
  DesktopSlugLayout,
  MobileSlugLayout,
} from "src/routes/Feed/SlugFeedLayouts"
import AboutMobileDetail from "./AboutMobileDetail"
import useAboutPostQuery from "src/hooks/useAboutPostQuery"
import PostDetailLoading from "src/components/PostDetailLoading"

const AboutDesktopFeed = () => {
  const data = useAboutPostQuery()
  const isPage = data?.type[0] === "Page"

  return (
    <>
      <DesktopSlugLayout>
        <Feed leftPanel={<FeedAboutPanel />} />
      </DesktopSlugLayout>
      <MobileSlugLayout>
        {!data ? <PostDetailLoading /> : <AboutMobileDetail isPage={isPage} />}
      </MobileSlugLayout>
    </>
  )
}

export default AboutDesktopFeed
