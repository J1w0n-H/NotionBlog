import React from "react"
import styled from "@emotion/styled"
import NotionRenderer from "../components/NotionRenderer"
import { usePostDetail } from "src/hooks/usePostPageState"
type Props = {}

const PageDetail: React.FC<Props> = () => {
  const data = usePostDetail()

  if (!data) return null
  return (
    <StyledWrapper>
      <NotionRenderer recordMap={data.recordMap} />
    </StyledWrapper>
  )
}

export default PageDetail

const StyledWrapper = styled.div`
  margin: 0 auto;
  max-width: 680px;
  width: 100%;
  padding: 0 1rem;
`
