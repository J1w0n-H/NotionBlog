import React, { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import styled from "@emotion/styled"
import AboutProfileTrigger from "src/components/AboutProfileTrigger"
import { FEED_ABOUT_TAB_WIDTH_VAR } from "src/libs/utils/feedLayoutVars"
import { FEED_HEADER_HEIGHT_VAR } from "src/libs/utils/feedScrollOffset"
import { feedHeaderProfileMinMedia } from "src/styles/feedBreakpoints"

const AboutBookmarkDrawer: React.FC = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return createPortal(
    <BookmarkShell>
      <AboutProfileTrigger variant="bookmark" />
    </BookmarkShell>,
    document.body
  )
}

export default AboutBookmarkDrawer

const BookmarkShell = styled.div`
  position: fixed;
  left: 0;
  top: calc(var(${FEED_HEADER_HEIGHT_VAR}, 4.5rem) + 1rem);
  z-index: 45;
  width: var(${FEED_ABOUT_TAB_WIDTH_VAR}, 88px);

  ${feedHeaderProfileMinMedia} {
    display: none;
  }
`
