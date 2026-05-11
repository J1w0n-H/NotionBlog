import React from "react"
import styled from "@emotion/styled"
import useAboutPostQuery from "src/hooks/useAboutPostQuery"
import NotionRenderer from "src/routes/Detail/components/NotionRenderer"
import TranslatedNotionRenderer from "src/routes/Detail/components/TranslatedNotionRenderer"
import ErrorBoundary from "src/components/ErrorBoundary"

const AboutDrawerContent: React.FC = () => {
  const data = useAboutPostQuery()

  if (!data) {
    return <Loading>Loading…</Loading>
  }

  const isPost = data.type[0] === "Post"

  return (
    <StyledWrapper>
      {isPost ? (
        <ErrorBoundary>
          <TranslatedNotionRenderer recordMap={data.recordMap} lang={data.lang} />
        </ErrorBoundary>
      ) : (
        <NotionRenderer recordMap={data.recordMap} />
      )}
    </StyledWrapper>
  )
}

export default AboutDrawerContent

const StyledWrapper = styled.div`
  min-width: 0;
`

const Loading = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.brand.textMuted};
`
