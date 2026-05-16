import React from "react"
import styled from "@emotion/styled"
import PageDetail from "./PageDetail"
import PostDetail from "./PostDetail"

type Props = {
  isPage: boolean
}

/** Mobile / tablet: keep the existing modal detail for About. */
const AboutMobileDetail: React.FC<Props> = ({ isPage }) => {
  return (
    <MobileOnly>
      {isPage ? <PageDetail /> : <PostDetail />}
    </MobileOnly>
  )
}

export default AboutMobileDetail

const MobileOnly = styled.div`
  @media (min-width: 1024px) {
    display: none;
  }
`
