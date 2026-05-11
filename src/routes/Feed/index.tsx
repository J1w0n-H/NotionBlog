import { useState } from "react"

import { FeedHeader } from "./FeedHeader"
import Footer from "./Footer"
import styled from "@emotion/styled"
import MobileProfileCard from "./MobileProfileCard"
import GroupedPostList from "./PostList/GroupedPostList"
import PinnedPosts from "./PostList/PinnedPosts"
import TagChips from "./TagChips"
import SectionNav from "./SectionNav"
import SearchInput from "./SearchInput"

const HEADER_HEIGHT = 73

type Props = {}

const Feed: React.FC<Props> = () => {
  const [q, setQ] = useState("")

  return (
    <StyledWrapper>
      <div
        className="lt"
        css={{ height: `calc(100vh - ${HEADER_HEIGHT}px)` }}
      >
        <SectionNav q={q} onChangeQuery={setQ} />
      </div>
      <div className="mid">
        <MobileProfileCard />
        <PinnedPosts q={q} />
        {/* Mobile-only search (desktop uses left nav) */}
        <div className="mobileSearch">
          <SearchInput value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <TagChips />
        <FeedHeader hideCategorySelect />
        <GroupedPostList q={q} />
        <div className="footer">
          <Footer />
        </div>
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

  > .lt {
    display: none;
    overflow: scroll;
    position: sticky;
    grid-column: span 2 / span 2;
    top: ${HEADER_HEIGHT - 10}px;
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
    @media (min-width: 1024px) { display: block; }
  }

  > .mid {
    grid-column: span 12 / span 12;
    @media (min-width: 1024px) { grid-column: span 10 / span 10; }
    > .mobileSearch {
      display: block;
      @media (min-width: 1024px) { display: none; }
    }
    > .footer {
      padding-bottom: 2rem;
      @media (min-width: 1024px) { display: none; }
    }
  }

  /* Right column removed for resume-style layout */
`
