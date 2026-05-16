import styled from "@emotion/styled"
import PostDetailQueryView from "src/components/PostDetailQueryView"
import { usePostPageState } from "src/hooks/usePostPageState"
import PageDetail from "src/routes/Detail/PageDetail"
import PostDetail from "src/routes/Detail/PostDetail"
import FeedPanelScroll from "src/routes/Feed/FeedPanelScroll"
import FeedSidePanel from "src/routes/Feed/FeedSidePanel"

const FeedPostPanel = () => {
  const state = usePostPageState()

  return (
    <FeedSidePanel closeAriaLabel="Close post">
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
              <PostDetail />
            )
          }
        </PostDetailQueryView>
      </PanelBody>
    </FeedSidePanel>
  )
}

export default FeedPostPanel

const PanelBody = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
