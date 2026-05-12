import React from "react"
import styled from "@emotion/styled"
import OrderButtons from "src/routes/Feed/FeedHeader/OrderButtons"
import { feedDesktopMinMedia } from "src/styles/feedBreakpoints"

const FeedSortPanel: React.FC = () => {
  return (
    <Shell aria-label="Sort posts">
      <Box>
        <Title>Sort</Title>
        <OrderButtons />
      </Box>
    </Shell>
  )
}

export default FeedSortPanel

const Shell = styled.div`
  display: none;

  ${feedDesktopMinMedia} {
    display: block;
    margin-top: 0.75rem;
  }
`

const Box = styled.div`
  border-radius: var(--radius-lg);
  background: ${({ theme }) => theme.brand.surface};
  border: 1px solid ${({ theme }) => theme.brand.border};
  padding: 0.75rem;
  box-shadow: ${({ theme }) => theme.brand.shadowSm};
`

const Title = styled.div`
  margin-bottom: 0.625rem;
  font-size: 0.6875rem;
  font-weight: 750;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.textMuted};
`
