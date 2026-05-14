import React, { useCallback, useId, useMemo, useRef } from "react"
import { CONFIG } from "site.config"
import PostHeader from "./PostHeader"
import Footer from "./PostFooter"
import CommentBox from "./CommentBox"
import PostAsideMeta from "./PostAsideMeta"
import Category from "src/components/Category"
import styled from "@emotion/styled"
import TranslatedNotionRenderer from "../components/TranslatedNotionRenderer"
import usePostQuery from "src/hooks/usePostQuery"
import ErrorBoundary from "src/components/ErrorBoundary"
import { useReturnToFeed } from "src/hooks/useReturnToFeed"
import { useModalDialogAccessibility } from "src/hooks/useModalDialogAccessibility"
import FeedPanelScroll from "src/routes/Feed/FeedPanelScroll"
import PostReadingProgress from "src/routes/Detail/PostDetail/PostReadingProgress"
import PostOutlineNav from "src/routes/Detail/PostDetail/PostOutlineNav"
import { extractOutlineFromRecordMap } from "src/libs/notion/extractOutlineFromRecordMap"
import { AiOutlineClose } from "react-icons/ai"

type Props = {
  variant?: "modal" | "side"
}

const PostDetail: React.FC<Props> = ({ variant = "modal" }) => {
  const data = usePostQuery()
  const returnToFeed = useReturnToFeed()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  const handleClose = useCallback(() => {
    returnToFeed({ scroll: false })
  }, [returnToFeed])

  useModalDialogAccessibility(variant === "modal", dialogRef, handleClose)

  const outline = useMemo(
    () => (data?.recordMap ? extractOutlineFromRecordMap(data.recordMap) : []),
    [data?.recordMap]
  )

  if (!data) return null

  const fullPageUrl = `${String(CONFIG.link).replace(/\/+$/, "")}/${data.slug}`

  const category = (data.category && data.category?.[0]) || undefined
  const isPost = data.type[0] === "Post"

  const handleBackgroundClick = () => {
    handleClose()
  }

  const article = (
    <>
      {!isPost && category && (
        <div css={{ marginBottom: "0.5rem" }}>
          <Category readOnly={data.status?.[0] === "PublicOnDetail"}>
            {category}
          </Category>
        </div>
      )}
      {isPost && <PostHeader data={data} titleId={titleId} />}
      <div>
        <ErrorBoundary>
          <TranslatedNotionRenderer recordMap={data.recordMap} lang={data.lang} />
        </ErrorBoundary>
      </div>
      {isPost && (
        <>
          <Footer
            onBackgroundClick={handleBackgroundClick}
            wrapperRef={wrapperRef}
          />
          <CommentBox data={data} />
        </>
      )}
    </>
  )

  const scrollableInner = (
    <>
      <PostReadingProgress scrollRef={wrapperRef} />
      <BodyGrid $hasAside={outline.length > 0}>
        <MainCol className="post-detail-main">
          <article>{article}</article>
        </MainCol>
        {outline.length > 0 ? (
          <AsideCol>
            <PostOutlineNav items={outline} scrollRef={wrapperRef} />
            {isPost ? (
              <PostAsideMeta data={data} postUrl={fullPageUrl} />
            ) : null}
          </AsideCol>
        ) : null}
      </BodyGrid>
    </>
  )

  if (variant === "side") {
    return (
      <FeedPanelScroll ref={wrapperRef}>
        <SideScrollLayout>{scrollableInner}</SideScrollLayout>
      </FeedPanelScroll>
    )
  }

  return (
    <StyledBackground
      ref={dialogRef}
      onClick={handleBackgroundClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={isPost ? titleId : undefined}
      aria-label={isPost ? undefined : data.title}
      tabIndex={-1}
    >
      <StyledWrapper onClick={(e) => e.stopPropagation()}>
        <ModalChrome>
          <ModalChromeSpacer aria-hidden="true" />
          <ModalGrabber aria-hidden="true" />
          <ModalChromeEnd>
            <ModalClose
              type="button"
              data-panel-close
              aria-label="Close"
              onClick={(e) => {
                e.stopPropagation()
                handleClose()
              }}
            >
              <AiOutlineClose aria-hidden="true" />
            </ModalClose>
          </ModalChromeEnd>
        </ModalChrome>
        <StyledBody ref={wrapperRef}>{scrollableInner}</StyledBody>
      </StyledWrapper>
    </StyledBackground>
  )
}

export default PostDetail

const StyledBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: oklch(0 0 0 / 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
  z-index: 1000;

  &:focus {
    outline: none;
  }
`

const StyledWrapper = styled.div`
  position: relative;
  max-width: min(1100px, 92vw);
  width: 100%;
  max-height: 90vh;
  margin: 0 auto;
  z-index: 1001;
  border-radius: 1rem;
  overflow: hidden;
  background-color: ${({ theme }) => theme.brand.surface};
  box-shadow: 0 24px 64px -16px oklch(0 0 0 / 0.32);

  @media (max-width: 768px) {
    max-width: 95%;
    border-radius: 1rem;
  }

  @media (max-width: 480px) {
    max-width: 98%;
  }
`

const ModalChrome = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0.5rem 0.75rem 0.35rem;
  border-bottom: 1px solid ${({ theme }) => theme.brand.borderSoft};
  background: ${({ theme }) => theme.brand.surface};
`

const ModalChromeSpacer = styled.span`
  width: 2.25rem;
`

const ModalChromeEnd = styled.div`
  display: flex;
  justify-content: flex-end;
`

const ModalGrabber = styled.span`
  display: flex;
  justify-content: center;
  pointer-events: none;

  &::after {
    content: "";
    width: 2.5rem;
    height: 4px;
    border-radius: 999px;
    background: ${({ theme }) => theme.brand.border};
    opacity: 0.55;
  }
`

const ModalClose = styled.button`
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
  border: 0;
  border-radius: var(--radius-md);
  background: transparent;
  color: ${({ theme }) => theme.brand.textMuted};
  cursor: pointer;
  transition:
    color ${({ theme }) => theme.brand.durationFast} ${({ theme }) =>
      theme.brand.ease},
    background ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease};

  &:hover {
    color: ${({ theme }) => theme.brand.text};
    background: ${({ theme }) => theme.brand.surface2};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.brand.accentRing};
    outline-offset: 2px;
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`

const StyledBody = styled.div`
  --post-scroll-pad-x: 1.5rem;
  max-height: calc(90vh - 3rem);
  overflow-x: hidden;
  overflow-y: auto;
  padding: 1.5rem var(--post-scroll-pad-x) 2.5rem;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) =>
    `${theme.brand.border} transparent`};

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.brand.border};
    border-radius: 999px;
    border: 2px solid transparent;
    background-clip: padding-box;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.brand.borderStrong};
    background-clip: padding-box;
  }

  .post-detail-main article {
    max-width: 680px;
    margin: 0 auto;
    width: 100%;
  }

  @media (max-width: 768px) {
    --post-scroll-pad-x: 1rem;
    max-height: calc(90vh - 2.5rem);
    padding: 1.25rem var(--post-scroll-pad-x) 2rem;
  }

  @media (max-width: 480px) {
    --post-scroll-pad-x: 0.75rem;
    padding: 1rem var(--post-scroll-pad-x) 1.5rem;
  }
`

const SideScrollLayout = styled.div`
  --post-scroll-pad-x: 1.25rem;
  display: flex;
  flex-direction: column;
  min-height: 0;
`

const BodyGrid = styled.div<{ $hasAside: boolean }>`
  display: grid;
  gap: 1.5rem;
  min-width: 0;

  @media (min-width: 1024px) {
    grid-template-columns: ${({ $hasAside }) =>
      $hasAside ? "minmax(0, 1fr) minmax(0, 280px)" : "minmax(0, 1fr)"};
    align-items: start;
  }
`

const MainCol = styled.div`
  min-width: 0;
`

const AsideCol = styled.div`
  min-width: 0;
`
