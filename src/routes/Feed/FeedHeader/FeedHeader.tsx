import React from "react"
import CategorySelect from "./CategorySelect"
import OrderButtons from "./OrderButtons"
import styled from "@emotion/styled"
import { feedDesktopMinMedia } from "src/styles/feedBreakpoints"

type Props = { hideCategorySelect?: boolean }

const FeedHeader: React.FC<Props> = ({ hideCategorySelect }) => {
  return (
    <StyledWrapper>
      {!hideCategorySelect && <CategorySelect />}
      <OrderButtons />
    </StyledWrapper>
  )
}

export default FeedHeader

const StyledWrapper = styled.div`
  display: flex;
  margin-bottom: 1rem;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.brand.borderSoft};

  ${feedDesktopMinMedia} {
    display: none;
  }
`
