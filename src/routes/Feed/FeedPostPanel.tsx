import { useState } from "react"
import PostDetailQueryView from "src/components/PostDetailQueryView"
import usePostQuery from "src/hooks/usePostQuery"
import { usePostPageState } from "src/hooks/usePostPageState"
import PageDetail from "src/routes/Detail/PageDetail"
import PostDetail from "src/routes/Detail/PostDetail"
import FeedPanelScroll from "src/routes/Feed/FeedPanelScroll"
import {
  Cat,
  PanelBody,
  PCloseText,
  PHead,
  PHeadClose,
  PHeadMeta,
  PProgBar,
  PTitle,
} from "src/routes/Feed/FeedPanelChrome"
import FeedSidePanel, { useFeedSidePanelCloseCtx } from "src/routes/Feed/FeedSidePanel"

/** Text "Close >>" button — reads close handler from FeedSidePanel context. */
const PostPanelCloseBtn = () => {
  const requestClose = useFeedSidePanelCloseCtx()
  return (
    <PCloseText
      type="button"
      aria-label="Back to feed"
      data-panel-close="true"
      onClick={() => requestClose?.()}
    >
      Close &raquo;
    </PCloseText>
  )
}

const FeedPostPanel = () => {
  const state = usePostPageState()
  const postData = usePostQuery()
  const [pct, setPct] = useState(0)

  const category = postData?.category?.[0]
  const title = postData?.title || ""

  return (
    <FeedSidePanel showClose={false} closeAriaLabel="Close post">
      <PHead>
        <PHeadClose>
          <PostPanelCloseBtn />
        </PHeadClose>
        <PHeadMeta>
          {category && <Cat>{category}</Cat>}
          <PTitle>{title}</PTitle>
        </PHeadMeta>
      </PHead>
      <PProgBar style={{ width: `${pct}%` }} />
      <PanelBody>
        <PostDetailQueryView
          state={state}
          statusScope="panel"
          statusSubject="post"
        >
          {(detail) =>
            detail.type[0] === "Page" ? (
              <FeedPanelScroll>
                <PageDetail />
              </FeedPanelScroll>
            ) : (
              <PostDetail variant="side" onScrollProgress={setPct} />
            )
          }
        </PostDetailQueryView>
      </PanelBody>
    </FeedSidePanel>
  )
}

export default FeedPostPanel
