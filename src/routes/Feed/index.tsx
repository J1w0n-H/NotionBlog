import { useEffect, useRef, useState, type ReactNode } from "react"

import { FeedHeader } from "./FeedHeader"
import Footer from "./Footer"
import styled from "@emotion/styled"
import MobileProfileCard from "./MobileProfileCard"
import GroupedPostList from "./PostList/GroupedPostList"
import ResumeSections from "./ResumeSections"
import PinnedPosts from "./PostList/PinnedPosts"
import TagChips from "./TagChips"
import TagChipPanel from "./TagChipPanel"
import SectionNav from "./SectionNav"
import SearchInput from "./SearchInput"
import { useFeedDesktopLayoutActive } from "src/hooks/useFeedDesktopLayoutActive"
import { useFeedScrollOffsetSync } from "src/hooks/useFeedScrollOffsetSync"
import { useFeedLayoutPreferences } from "src/hooks/useFeedLayoutPreferences"
import { useFeedSearchQuery } from "src/hooks/useFeedSearchQuery"
import { restoreFeedScrollPosition } from "src/libs/utils/feedScrollMemory"
import {
  FEED_ABOUT_PANEL_WIDTH_VAR,
  FEED_ABOUT_TAB_WIDTH_VAR,
  FEED_LIST_WIDTH_VAR,
  FEED_NAV_WIDTH_VAR,
  FEED_POST_PANEL_MIN_WIDTH_VAR,
  type FeedLayoutMode,
} from "src/libs/utils/feedLayoutVars"
import FeedColumnResizeHandle from "src/routes/Feed/FeedColumnResizeHandle"
import { FEED_HEADER_HEIGHT_VAR } from "src/libs/utils/feedScrollOffset"
import { FeedShellProvider } from "src/routes/Feed/FeedShellContext"
import {
  feedDesktopMinMedia,
  feedHeaderProfileMinMedia,
  feedMobileOnlyMedia,
} from "src/styles/feedBreakpoints"
import { variables } from "src/styles/variables"

const FEED_STICKY_TOP = `calc(var(${FEED_HEADER_HEIGHT_VAR}, 5.25rem) + 0.5rem)`
const FEED_STICKY_HEIGHT = `calc(100vh - var(${FEED_HEADER_HEIGHT_VAR}, 5.25rem) - 0.5rem)`

type Props = {
  rightPanel?: ReactNode
  leftPanel?: ReactNode
}

const Feed: React.FC<Props> = ({ rightPanel, leftPanel }) => {
  const { draft, onChangeQuery } = useFeedSearchQuery()
  const sideOpen = Boolean(rightPanel || leftPanel)
  const sideEdge = leftPanel ? "left" : rightPanel ? "right" : null
  const layoutMode: FeedLayoutMode = sideOpen
    ? sideEdge === "left"
      ? "about"
      : "post"
    : "index"
  const isDesktopFeed = useFeedDesktopLayoutActive()
  const manageScrollChrome = isDesktopFeed || !sideOpen
  const [isResizing, setIsResizing] = useState(false)
  const navResizeStartRef = useRef(0)
  const listResizeStartRef = useRef(0)
  const aboutResizeStartRef = useRef(0)

  const {
    widths,
    previewWidths,
    beginResize,
    cancelResize,
    commitResize,
    resetWidths,
    nudgeWidth,
  } = useFeedLayoutPreferences(layoutMode, isDesktopFeed)

  useFeedScrollOffsetSync(manageScrollChrome)

  useEffect(() => {
    if (!sideOpen || !isDesktopFeed) return
    restoreFeedScrollPosition()
  }, [isDesktopFeed, sideOpen])

  return (
    <FeedShellProvider>
      <FeedShell data-feed-resizing={isResizing ? "true" : "false"}>
        <StyledWrapper
          $sideOpen={sideOpen}
          $sideEdge={sideEdge}
          data-feed-layout={layoutMode}
        >
          {leftPanel ? (
            <aside className="side-l">
              {leftPanel}
              {isDesktopFeed && layoutMode === "about" ? (
                <FeedColumnResizeHandle
                  ariaLabel="Resize About panel"
                  onBegin={() => {
                    beginResize()
                    aboutResizeStartRef.current = widths.aboutPanelWidthPx
                  }}
                  onPreview={(delta) =>
                    previewWidths({
                      aboutPanelWidthPx: aboutResizeStartRef.current + delta,
                    })
                  }
                  onCommit={commitResize}
                  onCancel={cancelResize}
                  onReset={resetWidths}
                  onKeyboardAdjust={(delta) =>
                    nudgeWidth("aboutPanelWidthPx", delta)
                  }
                  onDraggingChange={setIsResizing}
                />
              ) : null}
            </aside>
          ) : null}
          <aside className="lt" data-feed-section-nav-band>
            <SectionNav q={draft} onChangeQuery={onChangeQuery} />
            <TagChipPanel />
            {isDesktopFeed ? (
              <FeedColumnResizeHandle
                ariaLabel="Resize section navigation"
                onBegin={() => {
                  beginResize()
                  navResizeStartRef.current = widths.navWidthPx
                }}
                onPreview={(delta) =>
                  previewWidths({
                    navWidthPx: navResizeStartRef.current + delta,
                  })
                }
                onCommit={commitResize}
                onCancel={cancelResize}
                onReset={resetWidths}
                onKeyboardAdjust={(delta) => nudgeWidth("navWidthPx", delta)}
                onDraggingChange={setIsResizing}
              />
            ) : null}
          </aside>
          <div className="mid">
            <MobileProfileCard />
            <PinnedPosts q={draft} />
            <div className="mobileSearch">
              <SearchInput
              value={draft}
              onChange={(e) => onChangeQuery(e.target.value)}
            />
            </div>
            <TagChips />
            <FeedHeader hideCategorySelect />
            <ResumeSections />
            <GroupedPostList q={draft} />
            <div className="footer">
              <Footer />
            </div>
            {isDesktopFeed && layoutMode === "post" ? (
              <FeedColumnResizeHandle
                ariaLabel="Resize post list"
                onBegin={() => {
                  beginResize()
                  listResizeStartRef.current = widths.listWidthPx
                }}
                onPreview={(delta) =>
                  previewWidths({
                    listWidthPx: listResizeStartRef.current + delta,
                  })
                }
                onCommit={commitResize}
                onCancel={cancelResize}
                onReset={resetWidths}
                onKeyboardAdjust={(delta) => nudgeWidth("listWidthPx", delta)}
                onDraggingChange={setIsResizing}
              />
            ) : null}
          </div>
          {rightPanel ? <aside className="detail">{rightPanel}</aside> : null}
        </StyledWrapper>
      </FeedShell>
    </FeedShellProvider>
  )
}

export default Feed

const FeedShell = styled.div`
  width: 100%;

  &[data-feed-resizing="true"] {
    user-select: none;
    cursor: col-resize;
  }
`

const StyledWrapper = styled.div<{
  $sideOpen: boolean
  $sideEdge: "left" | "right" | null
}>`
  padding: 2rem 0;
  display: grid;
  gap: 1.25rem;
  width: 100%;

  ${feedMobileOnlyMedia} {
    display: block;
    padding: 0.5rem 0;
  }

  ${feedDesktopMinMedia} {
    &[data-feed-layout="index"] {
      grid-template-columns: var(${FEED_NAV_WIDTH_VAR}, ${variables.feedNavWidth}px)
        minmax(0, 1fr);
    }

    &[data-feed-layout="post"] {
      grid-template-columns:
        var(${FEED_NAV_WIDTH_VAR}, ${variables.feedNavWidth}px)
        var(${FEED_LIST_WIDTH_VAR}, ${variables.feedListWidth}px)
        minmax(var(${FEED_POST_PANEL_MIN_WIDTH_VAR}, 24rem), 1fr);
    }

    &[data-feed-layout="about"] {
      grid-template-columns:
        calc(
          var(${FEED_ABOUT_TAB_WIDTH_VAR}, ${variables.feedAboutTabWidth}px) +
            var(${FEED_ABOUT_PANEL_WIDTH_VAR}, ${variables.feedAboutWidth}px)
        )
        var(${FEED_NAV_WIDTH_VAR}, ${variables.feedNavWidth}px)
        minmax(0, 1fr);
    }
  }

  > .side-l,
  > .detail {
    display: none;
    ${feedDesktopMinMedia} {
      display: flex;
      flex-direction: column;
      align-self: start;
      width: 100%;
      min-width: 0;
      overflow: hidden;
      position: sticky;
      top: ${FEED_STICKY_TOP};
      max-height: ${FEED_STICKY_HEIGHT};
      z-index: 16;
    }
  }

  > .side-l {
    ${feedDesktopMinMedia} {
      padding: 0.5rem 0 0
        var(${FEED_ABOUT_TAB_WIDTH_VAR}, ${variables.feedAboutTabWidth}px);
      border-right: 1px solid ${({ theme }) => theme.brand.border};
    }
  }

  > .lt {
    display: none;

    ${feedHeaderProfileMinMedia} {
      display: block;
      width: 100%;
      min-width: 0;
      position: sticky;
      top: ${FEED_STICKY_TOP};
      z-index: 15;
      margin-bottom: 0.75rem;
    }

    ${feedDesktopMinMedia} {
      align-self: start;
      overflow-x: hidden;
      overflow-y: auto;
      max-height: ${FEED_STICKY_HEIGHT};
      margin-bottom: 0;
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
    ${feedDesktopMinMedia} {
      position: relative;
    }
    > .mobileSearch {
      display: block;
      ${feedHeaderProfileMinMedia} {
        display: none;
      }
    }
    > .footer {
      padding-bottom: 2rem;
      ${feedDesktopMinMedia} {
        display: none;
      }
    }
  }

  > .detail {
    ${feedDesktopMinMedia} {
      padding: 0.5rem 0 0 1.25rem;
      border-left: 1px solid ${({ theme }) => theme.brand.border};
    }
  }

`
