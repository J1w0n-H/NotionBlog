import React from "react"
import styled from "@emotion/styled"
import PostDetailQueryView from "src/components/PostDetailQueryView"
import useAboutPostQuery from "src/hooks/useAboutPostQuery"
import NotionRenderer from "src/routes/Detail/components/NotionRenderer"
import TranslatedNotionRenderer from "src/routes/Detail/components/TranslatedNotionRenderer"
import ErrorBoundary from "src/components/ErrorBoundary"

const AboutDrawerContent: React.FC = () => {
  const state = useAboutPostQuery()

  return (
    <PostDetailQueryView
      state={state}
      statusScope="panel"
      statusSubject="about"
    >
      {(detail) => {
        const isPost = detail.type[0] === "Post"

        return (
          <StyledWrapper>
            {isPost ? (
              <ErrorBoundary>
                <TranslatedNotionRenderer
                  recordMap={detail.recordMap}
                  lang={detail.lang}
                />
              </ErrorBoundary>
            ) : (
              <NotionRenderer recordMap={detail.recordMap} />
            )}
          </StyledWrapper>
        )
      }}
    </PostDetailQueryView>
  )
}

export default AboutDrawerContent

const StyledWrapper = styled.div`
  min-width: 0;
`
