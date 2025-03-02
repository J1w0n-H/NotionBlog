import React, { useRef } from "react"
import PostHeader from "./PostHeader"
import Footer from "./PostFooter"
import CommentBox from "./CommentBox"
import Category from "src/components/Category"
import styled from "@emotion/styled"
import NotionRenderer from "../components/NotionRenderer"
import usePostQuery from "src/hooks/usePostQuery"
import { useRouter } from "next/router"

type Props = {}

const PostDetail: React.FC<Props> = () => {
  const data = usePostQuery()
  const router = useRouter()
  const wrapperRef = useRef<HTMLDivElement>(null)

  if (!data) return null

  const category = (data.category && data.category?.[0]) || undefined

  const handleBackgroundClick = () => {
    router.push("/")
  }

  return (
    <StyledBackground onClick={handleBackgroundClick}>
      <StyledWrapper ref={wrapperRef} onClick={(e) => e.stopPropagation()}>
        <article>
          {category && (
            <div css={{ marginBottom: "0.5rem" }}>
              <Category readOnly={data.status?.[0] === "PublicOnDetail"}>
                {category}
              </Category>
            </div>
          )}
          {data.type[0] === "Post" && <PostHeader data={data} />}
          <div>
            <NotionRenderer recordMap={data.recordMap} />
          </div>
          {data.type[0] === "Post" && (
            <>
s              <Footer onBackgroundClick={handleBackgroundClick} wrapperRef={wrapperRef} />
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
  overflow: auto; /* Ensure the background can scroll */
  z-index: 1; /* Ensure the background is below the wrapper */
`

const StyledWrapper = styled.div`
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 3rem;
  padding-bottom: 3rem;
  border-radius: 1.5rem;
  max-width: 1200rem; /* Increase the max-width */
  max-height: 90%; /* Ensure the wrapper does not exceed the viewport height */
  overflow-y: auto; /* Enable vertical scrolling */
  background-color: ${({ theme }) =>
    theme.scheme === "light" ? "white" : theme.colors.gray4};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin: 0 auto;
  z-index: 2; /* Ensure the wrapper is above the background */
  > article {
    margin: 0 auto;
    max-width: 1200rem; /* Increase the max-width for article */
    width: 100%; /* Ensure the article takes the full width */
  }
`
