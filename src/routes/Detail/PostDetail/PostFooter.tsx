import styled from "@emotion/styled"
import { useRouter } from "next/router"
import React, { useRef } from "react"

type Props = {
  onBackgroundClick: () => void
  wrapperRef: React.RefObject<HTMLDivElement>
}

const Footer: React.FC<Props> = ({ onBackgroundClick, wrapperRef }) => {
  const router = useRouter()

  return (
    <StyledWrapper onClick={(e) => e.stopPropagation()}>
      <a onClick={() => router.push("/")}>← Back</a>
      <a
        onClick={(e) => {
          e.stopPropagation()
          if (wrapperRef.current) {
            wrapperRef.current.scrollTo({ top: 0, behavior: "smooth" })
          }
        }}
      >
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
