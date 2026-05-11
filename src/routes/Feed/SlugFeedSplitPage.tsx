import type { FC, ReactNode } from "react"
import Feed from "src/routes/Feed"
import FeedAboutPanel from "src/routes/Feed/FeedAboutPanel"
import FeedPostPanel from "src/routes/Feed/FeedPostPanel"
import {
  DesktopSlugLayout,
  MobileSlugLayout,
} from "src/routes/Feed/SlugFeedLayouts"

export type FeedSplitPanel = "post" | "about"

type Props = {
  panel: FeedSplitPanel
  mobile: ReactNode
  postPanel?: ReactNode
  aboutPanel?: ReactNode
}

const SlugFeedSplitPage: FC<Props> = ({
  panel,
  mobile,
  postPanel = <FeedPostPanel />,
  aboutPanel = <FeedAboutPanel />,
}) => {
  return (
    <>
      <DesktopSlugLayout>
        <Feed
          leftPanel={panel === "about" ? aboutPanel : undefined}
          rightPanel={panel === "post" ? postPanel : undefined}
        />
      </DesktopSlugLayout>
      <MobileSlugLayout>{mobile}</MobileSlugLayout>
    </>
  )
}

export default SlugFeedSplitPage
