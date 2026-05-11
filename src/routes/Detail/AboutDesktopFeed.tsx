import React from "react"
import styled from "@emotion/styled"
import Feed from "src/routes/Feed"

const AboutDesktopFeed: React.FC = () => {
  return (
    <DesktopOnly>
      <Feed />
    </DesktopOnly>
  )
}

export default AboutDesktopFeed

const DesktopOnly = styled.div`
  display: none;

  @media (min-width: 1024px) {
    display: block;
  }
`
