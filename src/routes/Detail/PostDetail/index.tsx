import React, { useRef } from "react"
import PostHeader from "./PostHeader"
import Footer from "./PostFooter"
import CommentBox from "./CommentBox"
import Category from "src/components/Category"
import styled from "@emotion/styled"
import TranslatedNotionRenderer from "../components/TranslatedNotionRenderer"
import usePostQuery from "src/hooks/usePostQuery"
import ErrorBoundary from "src/components/ErrorBoundary"
import { useReturnToFeed } from "src/hooks/useReturnToFeed"
import FeedPanelScroll from "src/routes/Feed/FeedPanelScroll"

type Props = {
  variant?: "modal" | "side"
}

const PostDetail: React.FC<Props> = ({ variant = "modal" }) => {
  const data = usePostQuery()
  const returnToFeed = useReturnToFeed()
  const wrapperRef = useRef<HTMLDivElement>(null)

  if (!data) return null

  const category = (data.category && data.category?.[0]) || undefined
  const isPost = data.type[0] === "Post"

  const handleBackgroundClick = () => {
    returnToFeed({ scroll: false })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleBackgroundClick()
    }
  }

  const article = (
    <article>
      {category && (
        <div css={{ marginBottom: "0.5rem" }}>
          <Category readOnly={data.status?.[0] === "PublicOnDetail"}>
            {category}
          </Category>
        </div>
      )}
      {isPost && <PostHeader data={data} />}
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
    </article>
  )

  if (variant === "side") {
    return <FeedPanelScroll ref={wrapperRef}>{article}</FeedPanelScroll>
  }

  return (
    <StyledBackground
      onClick={handleBackgroundClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
    >
      <StyledWrapper onClick={(e) => e.stopPropagation()}>
        <StyledBody ref={wrapperRef}>{article}</StyledBody>
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
  background: rgba(0, 0, 0, 0.5);
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
  max-width: 90%;
  width: 1200px;
  max-height: 90vh;
  margin: 0 auto;
  z-index: 1001;
  border-radius: 1.5rem;
  overflow: hidden;
  background-color: ${({ theme }) =>
    theme.scheme === "light" ? "white" : theme.colors.gray4};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);

  @media (max-width: 768px) {
    max-width: 95%;
    width: 100%;
    border-radius: 1rem;
  }

  @media (max-width: 480px) {
    max-width: 98%;
  }
`

const StyledBody = styled.div`
  max-height: 90vh;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 3rem 1.5rem;
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

  > article {
    margin: 0 auto;
    max-width: 100%;
    width: 100%;
  }

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }

  @media (max-width: 480px) {
    padding: 1.5rem 0.75rem;
  }
`

