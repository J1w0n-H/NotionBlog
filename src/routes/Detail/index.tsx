import { useRouter } from "next/router"
import useMermaidEffect from "./hooks/useMermaidEffect"
import PostDetail from "./PostDetail"
import PageDetail from "./PageDetail"
import AboutDesktopSplit from "./AboutDesktopSplit"
import AboutMobileDetail from "./AboutMobileDetail"
import styled from "@emotion/styled"
import usePostQuery from "src/hooks/usePostQuery"
import { ABOUT_SLUG } from "src/constants"

type Props = {}

const Detail: React.FC<Props> = () => {
  const data = usePostQuery()
  const router = useRouter()
  useMermaidEffect()

  if (!data) return null

  const slug = `${router.query.slug || ""}`
  const isAbout = slug === ABOUT_SLUG
  const isPage = data.type[0] === "Page"

  if (isAbout) {
    return (
      <>
        <AboutMobileDetail isPage={isPage} />
        <AboutDesktopSplit isPage={isPage} />
      </>
    )
  }

  return (
    <StyledWrapper data-type={data.type}>
      {isPage && <PageDetail />}
      {!isPage && <PostDetail />}
    </StyledWrapper>
  )
}

export default Detail

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
