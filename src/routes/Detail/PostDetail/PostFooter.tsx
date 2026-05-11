import styled from "@emotion/styled"
import React from "react"
import { useReturnToFeed } from "src/hooks/useReturnToFeed"

type Props = {
  onBackgroundClick: () => void
  wrapperRef: React.RefObject<HTMLDivElement>
}

const Footer: React.FC<Props> = ({ onBackgroundClick, wrapperRef }) => {
  const returnToFeed = useReturnToFeed()

  const handleScrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation() // Prevent background click from interfering
    if (wrapperRef.current) {
      wrapperRef.current.scrollTo({ top: 0, behavior: "smooth" }) // Scroll inside StyledWrapper
    }
  }

  return (
    <StyledWrapper onClick={(e) => e.stopPropagation()}>
      <a onClick={() => returnToFeed({ scroll: false })}>
        ← Back
      </a>
      <a onClick={handleScrollToTop}>
        ↑ Top
      </a>
    </StyledWrapper>
  )
}

export default Footer

const StyledWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray10};
  a {
    margin-top: 0.5rem;
    cursor: pointer;

    :hover {
      color: ${({ theme }) => theme.colors.gray12};
    }
  }
`
