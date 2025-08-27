import React, { useRef } from "react"
import PostHeader from "./PostHeader"
import Footer from "./PostFooter"
import CommentBox from "./CommentBox"
import Category from "src/components/Category"
import styled from "@emotion/styled"
import TranslatedNotionRenderer from "../components/TranslatedNotionRenderer"
import usePostQuery from "src/hooks/usePostQuery"
import { useRouter } from "next/router"

type Props = {}

const PostDetail: React.FC<Props> = () => {
  const data = usePostQuery()
  const router = useRouter()
  const wrapperRef = useRef<HTMLDivElement>(null)

  if (!data) return null

  const category = (data.category && data.category?.[0]) || undefined
  const isPost = data.type[0] === "Post"

  const handleBackgroundClick = () => {
    router.push("/")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleBackgroundClick()
    }
  }

  return (
    <StyledBackground 
      onClick={handleBackgroundClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
    >
      <StyledWrapper ref={wrapperRef} onClick={(e) => e.stopPropagation()}>
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
            <TranslatedNotionRenderer recordMap={data.recordMap} />
          </div>
          {isPost && (
            <>
              <Footer onBackgroundClick={handleBackgroundClick} wrapperRef={wrapperRef} />
              <CommentBox data={data} />
            </>
          )}
        </article>
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
  padding: 3rem 1.5rem;
  border-radius: 1.5rem;
  max-width: 90%;
  width: 1200px;
  max-height: 90vh;
  overflow-y: auto;
  background-color: ${({ theme }) =>
    theme.scheme === "light" ? "white" : theme.colors.gray4};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin: 0 auto;
  z-index: 1001;
  
  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
  }
  
  > article {
    margin: 0 auto;
    max-width: 100%;
    width: 100%;
  }
  
  /* 반응형 디자인 */
  @media (max-width: 768px) {
    max-width: 95%;
    width: 100%;
    padding: 2rem 1rem;
    border-radius: 1rem;
  }
  
  @media (max-width: 480px) {
    max-width: 98%;
    padding: 1.5rem 0.75rem;
  }
`
