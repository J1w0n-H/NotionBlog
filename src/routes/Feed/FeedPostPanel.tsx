import styled from "@emotion/styled"
import PostDetailQueryView from "src/components/PostDetailQueryView"
import { usePostPageState } from "src/hooks/usePostPageState"
import PostDetailContentSwitcher from "src/routes/Detail/PostDetailContentSwitcher"
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
          {() => <PostDetailContentSwitcher variant="side" />}
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
