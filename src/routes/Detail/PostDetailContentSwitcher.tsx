import styled from "@emotion/styled"
import { ABOUT_SLUG } from "src/constants"
import { usePostDetail } from "src/hooks/usePostPageState"
import AboutDesktopFeed from "src/routes/Detail/AboutDesktopFeed"
import PageDetail from "src/routes/Detail/PageDetail"
import PostDetail from "src/routes/Detail/PostDetail"
import FeedPanelScroll from "src/routes/Feed/FeedPanelScroll"
import { useRouter } from "next/router"

type Props = {
  variant?: "modal" | "side"
}

const PostDetailContentSwitcher = ({ variant = "modal" }: Props) => {
  const detail = usePostDetail()
  const router = useRouter()
  const slug = `${router.query.slug ?? ""}`

  if (!detail) return null

  if (slug === ABOUT_SLUG) {
    return <AboutDesktopFeed />
  }

  const isPage = detail.type[0] === "Page"

  return (
    <StyledWrapper data-type={detail.type}>
      {isPage ? (
        variant === "side" ? (
          <FeedPanelScroll>
            <PageDetail />
          </FeedPanelScroll>
        ) : (
          <PageDetail />
        )
      ) : (
        <PostDetail variant={variant} />
      )}
    </StyledWrapper>
  )
}

export default PostDetailContentSwitcher

const StyledWrapper = styled.div`
  padding: 2rem 0;

  &[data-type="Paper"] {
    padding: 40px 0;
  }
  /** Reference: https://github.com/chriskempson/tomorrow-theme **/
  code[class*="language-mermaid"],
  pre[class*="language-mermaid"] {
    background-color: ${({ theme }) => theme.colors.gray5};
  }
`
