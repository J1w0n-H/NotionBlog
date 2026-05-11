import { useRouter } from "next/router"
import styled from "@emotion/styled"
import PostDetailLoading from "src/components/PostDetailLoading"
import { usePostPageState } from "src/hooks/usePostPageState"
import PageDetail from "src/routes/Detail/PageDetail"
import PostDetail from "src/routes/Detail/PostDetail"

const FeedPostPanel = () => {
  const router = useRouter()
  const {
    detail,
    isPreparing,
    isMissingMeta,
    isLoadingContent,
    isRecordMapError,
  } = usePostPageState()

  if (isPreparing || isLoadingContent) {
    return <PostDetailLoading />
  }

  if (isMissingMeta || isRecordMapError || !detail) {
    return <PanelMessage>Could not load this post.</PanelMessage>
  }

  const isPage = detail.type[0] === "Page"

  return (
    <Panel>
      <PanelTop>
        <CloseButton
          type="button"
          onClick={() => router.push("/", undefined, { scroll: false })}
        >
          Close
        </CloseButton>
      </PanelTop>
      <PanelBody>
        {isPage ? <PageDetail /> : <PostDetail variant="side" />}
      </PanelBody>
    </Panel>
  )
}

export default FeedPostPanel

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
`

const PanelTop = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0 0.25rem 0.5rem;
`

const CloseButton = styled.button`
  border: 1px solid ${({ theme }) => theme.brand.border};
  background: ${({ theme }) => theme.brand.surface};
  color: ${({ theme }) => theme.brand.textMuted};
  border-radius: 999px;
  padding: 0.35rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.brand.text};
    border-color: ${({ theme }) => theme.brand.borderStrong};
  }
`

const PanelBody = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
`

const PanelMessage = styled.p`
  margin: 1rem 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.brand.textMuted};
`
