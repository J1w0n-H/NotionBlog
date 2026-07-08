import React, { useCallback, useEffect, useId, useMemo, useRef } from "react"
import PostHeader from "./PostHeader"
import Footer from "./PostFooter"
import CommentBox from "./CommentBox"
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
import {
  AsideCol,
  AsideOutlineMount,
  BodyGrid,
  MainCol,
  SideScrollLayout,
} from "src/routes/Detail/PostDetail/PostDetailLayout"
import { extractOutlineFromRecordMap } from "src/libs/notion/extractOutlineFromRecordMap"
import { HiChevronDoubleRight } from "react-icons/hi"

type Props = {
  variant?: "modal" | "side"
  onScrollProgress?: (pct: number) => void
}

const PostDetail: React.FC<Props> = ({ variant = "modal", onScrollProgress }) => {
  const data = usePostQuery()
  const returnToFeed = useReturnToFeed()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  useEffect(() => {
    if (!onScrollProgress) return
    const el = wrapperRef.current
    if (!el) return
    const sync = () => {
      const max = el.scrollHeight - el.clientHeight
      onScrollProgress(max > 0 ? Math.round((el.scrollTop / max) * 100) : 0)
    }
    el.addEventListener("scroll", sync, { passive: true })
    return () => el.removeEventListener("scroll", sync)
  }, [onScrollProgress])

  const handleClose = useCallback(() => {
    returnToFeed({ scroll: false })
  }, [returnToFeed])

  useModalDialogAccessibility(variant === "modal", dialogRef, handleClose)

  const outline = useMemo(
    () => (data?.recordMap ? extractOutlineFromRecordMap(data.recordMap) : []),
    [data?.recordMap]
  )

  if (!data) return null

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

  const postBodyGrid = (
    <BodyGrid $hasAside={outline.length > 0}>
      <MainCol className="post-detail-main">
        <article>{article}</article>
      </MainCol>
      {outline.length > 0 ? (
        <AsideCol $floatOnLg>
          <AsideOutlineMount>
            <PostOutlineNav
              items={outline}
              scrollRef={wrapperRef}
              outlineLayout={variant === "side" ? "side" : "modal"}
            />
          </AsideOutlineMount>
        </AsideCol>
      ) : null}
    </BodyGrid>
  )

  if (variant === "side") {
    return (
      <FeedPanelScroll ref={wrapperRef}>
        <SideScrollLayout>
          {outline.length === 0 && !onScrollProgress ? (
            <PostReadingProgress scrollRef={wrapperRef} />
          ) : null}
          {postBodyGrid}
        </SideScrollLayout>
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
              <ModalCloseLabel>Close</ModalCloseLabel>
              <ModalCloseChevrons aria-hidden="true">
                <HiChevronDoubleRight />
              </ModalCloseChevrons>
            </ModalClose>
          </ModalChromeEnd>
        </ModalChrome>
        {outline.length === 0 ? (
          <PostReadingProgress scrollRef={wrapperRef} />
        ) : null}
        <StyledBody>
          <StyledBodyContent ref={wrapperRef}>
            {postBodyGrid}
          </StyledBodyContent>
        </StyledBody>
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
  overflow: hidden;
  z-index: 1000;

  &:focus {
    outline: none;
  }
`

const StyledWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: min(1100px, 92vw);
  width: 100%;
  max-height: 90vh;
  margin: 0 auto;
  z-index: 1001;
  border-radius: 1rem;
  overflow: hidden;
  min-height: 0;
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
  flex: 0 0 auto;
  padding: 0.5rem 0.75rem 0.35rem;
  border-bottom: 1px solid ${({ theme }) => theme.brand.borderSoft};
  background: transparent;
`

const ModalChromeSpacer = styled.span`
  width: min(5.75rem, 32vw);

  @media (max-width: 768px) {
    order: 1;
  }
`

const ModalChromeEnd = styled.div`
  display: flex;
  justify-content: flex-end;

  @media (max-width: 768px) {
    order: -1;
    justify-content: flex-start;
  }
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
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.55rem 0.3rem 0.65rem;
  border: 1px solid transparent;
  border-radius: 0.4rem;
  background: transparent;
  color: ${({ theme }) => theme.brand.textMuted};
  font-size: 0.875rem;
  line-height: 1;
  cursor: pointer;
  transition:
    border-color ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease},
    color ${({ theme }) => theme.brand.durationFast} ${({ theme }) =>
      theme.brand.ease},
    background ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease},
    box-shadow ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease};

  &:hover {
    background: ${({ theme }) => theme.brand.surface2};
    border-color: ${({ theme }) => theme.brand.borderStrong};
    color: ${({ theme }) => theme.brand.text};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.brand.accentSoft};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.brand.accentRing};
    outline-offset: 2px;
  }
`

const ModalCloseLabel = styled.span`
  font-weight: 600;
  letter-spacing: 0.02em;
`

const ModalCloseChevrons = styled.span`
  display: inline-flex;
  align-items: center;
  color: ${({ theme }) => theme.brand.textMuted};

  svg {
    width: 1.05rem;
    height: 1.05rem;
  }

  @media (max-width: 768px) {
    transform: scaleX(-1);
  }
`

const StyledBody = styled.div`
  --post-scroll-pad-x: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
  padding: 0;

  @media (max-width: 768px) {
    --post-scroll-pad-x: 1rem;
  }

  @media (max-width: 480px) {
    --post-scroll-pad-x: 0.75rem;
  }
`

const StyledBodyContent = styled.div`
  flex: 1 1 auto;
  min-height: 0;
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
    padding: 1.25rem var(--post-scroll-pad-x) 2rem;
  }

  @media (max-width: 480px) {
    padding: 1rem var(--post-scroll-pad-x) 1.5rem;
  }
`
