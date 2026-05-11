import { useState, type ReactNode } from "react"

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

const HEADER_HEIGHT = 73

type Props = {
  rightPanel?: ReactNode
}

const Feed: React.FC<Props> = ({ rightPanel }) => {
  const [q, setQ] = useState("")
  useFeedScrollOffsetSync()

  return (
    <StyledWrapper>
      <div className="mid">
        <MobileProfileCard />
        <PinnedPosts q={q} />
        {/* Mobile-only search (desktop uses right nav) */}
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
      <div
        className="rt"
        css={{
          maxHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
        }}
      >
        {rightPanel ?? <SectionNav q={q} onChangeQuery={setQ} />}
      </div>
    </StyledWrapper>
  )
}

export default Feed

const StyledWrapper = styled.div`
  grid-template-columns: repeat(12, minmax(0, 1fr));
  padding: 2rem 0;
  display: grid;
  gap: 1.5rem;

  @media (max-width: 768px) {
    display: block;
    padding: 0.5rem 0;
  }

  > .mid {
    grid-column: span 12 / span 12;
    min-width: 0;
    @media (min-width: 1024px) {
      grid-column: 1 / span 10;
    }
    > .mobileSearch {
      display: block;
      @media (min-width: 1024px) { display: none; }
    }
    > .footer {
      padding-bottom: 2rem;
      @media (min-width: 1024px) { display: none; }
    }
  }

  > .rt {
    display: none;
    align-self: start;
    width: 100%;
    min-width: 0;
    overflow-x: hidden;
    overflow-y: auto;
    position: sticky;
    top: ${HEADER_HEIGHT - 10}px;
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
    @media (min-width: 1024px) {
      display: block;
      grid-column: 11 / span 2;
    }
  }
`
