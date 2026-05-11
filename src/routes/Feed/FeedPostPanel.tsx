import { type ReactNode } from "react"
import styled from "@emotion/styled"
import PostDetailLoading from "src/components/PostDetailLoading"
import { usePostPageState } from "src/hooks/usePostPageState"
import PageDetail from "src/routes/Detail/PageDetail"
import PostDetail from "src/routes/Detail/PostDetail"
import FeedSidePanel from "src/routes/Feed/FeedSidePanel"

const FeedPostPanel = () => {
  const {
    detail,
    isPreparing,
    isMissingMeta,
    isLoadingContent,
    isRecordMapError,
  } = usePostPageState()

  let body: ReactNode = <PostDetailLoading />

  if (!isPreparing && !isLoadingContent) {
    if (isMissingMeta || isRecordMapError || !detail) {
      body = <PanelMessage>Could not load this post.</PanelMessage>
    } else {
      const isPage = detail.type[0] === "Page"
      body = isPage ? <PageDetail /> : <PostDetail variant="side" />
    }
  }

  return (
    <FeedSidePanel closeAriaLabel="Close post">
      <PanelBody>{body}</PanelBody>
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

const PanelMessage = styled.p`
  margin: 1rem 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.brand.textMuted};
`
