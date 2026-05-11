import { useEffect, useState, type ReactNode } from "react"

import { FeedHeader } from "./FeedHeader"
import Footer from "./Footer"
import styled from "@emotion/styled"
import MobileProfileCard from "./MobileProfileCard"
import GroupedPostList from "./PostList/GroupedPostList"
import ResumeSections from "./ResumeSections"
import PinnedPosts from "./PostList/PinnedPosts"
import TagChips from "./TagChips"
import SectionNav from "./SectionNav"
import SearchInput from "./SearchInput"
import { useFeedScrollOffsetSync } from "src/hooks/useFeedScrollOffsetSync"
import { restoreFeedScrollPosition } from "src/libs/utils/feedScrollMemory"
import { variables } from "src/styles/variables"
import { FEED_HEADER_HEIGHT_VAR } from "src/libs/utils/feedScrollOffset"

const FEED_STICKY_TOP = `calc(var(${FEED_HEADER_HEIGHT_VAR}, 5.25rem) + 0.5rem)`
const FEED_STICKY_HEIGHT = `calc(100vh - var(${FEED_HEADER_HEIGHT_VAR}, 5.25rem) - 0.5rem)`

type Props = {
  rightPanel?: ReactNode
  leftPanel?: ReactNode
}

const Feed: React.FC<Props> = ({ rightPanel, leftPanel }) => {
  const [q, setQ] = useState("")
  const sideOpen = Boolean(rightPanel || leftPanel)
  const sideEdge = leftPanel ? "left" : rightPanel ? "right" : null
  useFeedScrollOffsetSync()

  useEffect(() => {
    if (!sideOpen) return
    restoreFeedScrollPosition()
  }, [sideOpen])

  return (
    <FeedShell>
      <StyledWrapper $sideOpen={sideOpen} $sideEdge={sideEdge}>
        {leftPanel ? <aside className="side-l">{leftPanel}</aside> : null}
        <aside className="lt">
          <SectionNav q={q} onChangeQuery={setQ} />
        </aside>
        <div className="mid">
          <MobileProfileCard />
          <PinnedPosts q={q} />
          <div className="mobileSearch">
            <SearchInput value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <TagChips />
          <FeedHeader hideCategorySelect />
          <ResumeSections />
          <GroupedPostList q={q} />
          <div className="footer">
            <Footer />
          </div>
        </div>
        {rightPanel ? <aside className="detail">{rightPanel}</aside> : null}
      </StyledWrapper>
    </FeedShell>
  )
}

export default Feed

const FeedShell = styled.div`
  width: 100%;
`

const StyledWrapper = styled.div<{
  $sideOpen: boolean
  $sideEdge: "left" | "right" | null
}>`
  padding: 2rem 0;
  display: grid;
  gap: 1.25rem;
  width: 100%;

  @media (max-width: 768px) {
    display: block;
    padding: 0.5rem 0;
  }

  @media (min-width: 1024px) {
    grid-template-columns: ${({ $sideOpen, $sideEdge }) => {
      if (!$sideOpen) {
        return `${variables.feedNavWidth}px minmax(0, 1fr)`
      }
      if ($sideEdge === "left") {
        return `calc(${variables.feedAboutTabWidth}px + clamp(30rem, 36vw, ${variables.feedAboutWidth}px)) ${variables.feedNavWidth}px minmax(0, 1fr)`
      }
      return `${variables.feedNavWidth}px clamp(32rem, 46vw, ${variables.feedListWidth}px) minmax(24rem, 1fr)`
    }};
  }

  > .side-l,
  > .detail {
    display: none;
    @media (min-width: 1024px) {
      display: flex;
      flex-direction: column;
      align-self: start;
      width: 100%;
      min-width: 0;
      overflow-x: hidden;
      overflow-y: auto;
      position: sticky;
      top: ${FEED_STICKY_TOP};
      max-height: ${FEED_STICKY_HEIGHT};
      z-index: 16;
    }
  }

  > .side-l {
    @media (min-width: 1024px) {
      padding: 0.5rem 0 0 ${variables.feedAboutTabWidth}px;
      border-right: 1px solid ${({ theme }) => theme.brand.border};
    }
  }

  > .lt {
    display: none;
    @media (min-width: 1024px) {
      display: block;
      align-self: start;
      width: 100%;
      min-width: 0;
      overflow-x: hidden;
      overflow-y: auto;
      position: sticky;
      top: ${FEED_STICKY_TOP};
      max-height: ${FEED_STICKY_HEIGHT};
      z-index: 15;
      scrollbar-width: thin;
      scrollbar-color: ${({ theme }) =>
        `${theme.brand.border} ${theme.brand.bg}`};
      -ms-overflow-style: auto;
      &::-webkit-scrollbar {
        display: block;
        width: 6px;
      }
      &::-webkit-scrollbar-track {
        background: transparent;
      }
      &::-webkit-scrollbar-thumb {
        background: ${({ theme }) => theme.brand.border};
        border-radius: 999px;
      }
      &::-webkit-scrollbar-thumb:hover {
        background: ${({ theme }) => theme.brand.borderStrong};
      }
    }
  }

  > .mid {
    min-width: 0;
    container-name: feed-main;
    container-type: inline-size;
    > .mobileSearch {
      display: block;
      @media (min-width: 1024px) {
        display: none;
      }
    }
    > .footer {
      padding-bottom: 2rem;
      @media (min-width: 1024px) {
        display: none;
      }
    }
  }

  > .detail {
    @media (min-width: 1024px) {
      padding: 0.5rem 0 0 1.25rem;
      border-left: 1px solid ${({ theme }) => theme.brand.border};
    }
  }
`
