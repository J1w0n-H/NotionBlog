import { useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/router"

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

const HEADER_HEIGHT = 73

type Props = {
  rightPanel?: ReactNode
}

const Feed: React.FC<Props> = ({ rightPanel }) => {
  const router = useRouter()
  const [q, setQ] = useState("")
  const detailOpen = Boolean(rightPanel)
  useFeedScrollOffsetSync()

  useEffect(() => {
    if (!detailOpen) return
    restoreFeedScrollPosition()
  }, [detailOpen])

  const closeDetail = () => {
    void router.push("/", undefined, { scroll: false })
  }

  return (
    <FeedShell>
      {detailOpen ? (
        <SplitToolbar>
          <BackButton type="button" onClick={closeDetail}>
            ← Back to list
          </BackButton>
        </SplitToolbar>
      ) : null}
      <StyledWrapper $detailOpen={detailOpen}>
        <aside
          className="lt"
          css={{
            maxHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
          }}
        >
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
        {detailOpen ? (
          <aside
            className="detail"
            css={{
              maxHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
            }}
          >
            {rightPanel}
          </aside>
        ) : null}
      </StyledWrapper>
    </FeedShell>
  )
}

export default Feed

const FeedShell = styled.div`
  width: 100%;
`

const SplitToolbar = styled.div`
  display: none;

  @media (min-width: 1024px) {
    display: flex;
    align-items: center;
    position: sticky;
    top: ${HEADER_HEIGHT - 10}px;
    z-index: 25;
    margin: 0 0 0.75rem;
    padding: 0.35rem 0 0.85rem;
    background: ${({ theme }) => theme.brand.bg};
    border-bottom: 1px solid ${({ theme }) => theme.brand.border};
  }
`

const BackButton = styled.button`
  border: 1px solid ${({ theme }) => theme.brand.borderStrong};
  background: ${({ theme }) => theme.brand.surface};
  color: ${({ theme }) => theme.brand.text};
  border-radius: 999px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 1px 2px oklch(0 0 0 / 0.08);

  &:hover {
    background: ${({ theme }) => theme.brand.surface2};
  }
`

const StyledWrapper = styled.div<{ $detailOpen: boolean }>`
  padding: ${({ $detailOpen }) => ($detailOpen ? "0 0 2rem" : "2rem 0")};
  display: grid;
  gap: 1.25rem;
  width: 100%;

  @media (max-width: 768px) {
    display: block;
    padding: 0.5rem 0;
  }

  @media (min-width: 1024px) {
    grid-template-columns: ${({ $detailOpen }) =>
      $detailOpen
        ? `${variables.feedNavWidth}px clamp(32rem, 46vw, ${variables.feedListWidth}px) minmax(24rem, 1fr)`
        : `${variables.feedNavWidth}px minmax(0, 1fr)`};
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
    display: none;
    @media (min-width: 1024px) {
      display: flex;
      flex-direction: column;
      align-self: start;
      width: 100%;
      min-width: 0;
      overflow: hidden;
      position: sticky;
      top: ${HEADER_HEIGHT - 10}px;
      z-index: 16;
      padding-left: 1.25rem;
      border-left: 1px solid ${({ theme }) => theme.brand.border};
    }
  }
`
