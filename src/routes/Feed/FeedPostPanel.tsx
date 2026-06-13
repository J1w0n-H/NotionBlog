import { useState } from "react"
import { CONFIG } from "site.config"
import PostDetailQueryView from "src/components/PostDetailQueryView"
import usePostQuery from "src/hooks/usePostQuery"
import { usePostPageState } from "src/hooks/usePostPageState"
import PageDetail from "src/routes/Detail/PageDetail"
import PostDetail from "src/routes/Detail/PostDetail"
import FeedPanelScroll from "src/routes/Feed/FeedPanelScroll"
import {
  Cat,
  CloseBtn,
  FullLink,
  PanelBody,
  PHead,
  PProgBar,
  PTitle,
} from "src/routes/Feed/FeedPanelChrome"
import FeedSidePanel, { useFeedSidePanelCloseCtx } from "src/routes/Feed/FeedSidePanel"

/** Reads requestClose from FeedSidePanel context — must be rendered inside FeedSidePanel. */
const PostPanelCloseBtn = () => {
  const requestClose = useFeedSidePanelCloseCtx()
  return (
    <CloseBtn
      type="button"
      aria-label="Back to feed"
      data-panel-close="true"
      onClick={() => requestClose?.()}
    >
      ←
    </CloseBtn>
  )
}

const FeedPostPanel = () => {
  const state = usePostPageState()
  const postData = usePostQuery()
  const [pct, setPct] = useState(0)

  const category = postData?.category?.[0]
  const title = postData?.title || ""
  const slug = postData?.slug
  const fullUrl = slug
    ? `${String(CONFIG.link).replace(/\/+$/, "")}/${slug}`
    : undefined

  return (
    <FeedSidePanel showClose={false} closeAriaLabel="Close post">
      <PHead>
        <PostPanelCloseBtn />
        {category && <Cat>{category}</Cat>}
        <PTitle>{title}</PTitle>
        {fullUrl && (
          <FullLink
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open in full page"
          >
            ↗
          </FullLink>
        )}
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
