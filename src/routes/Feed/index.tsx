import { useEffect, useRef, useState, type MouseEventHandler, type ReactNode } from "react"
import { useRouter } from "next/router"

import { FeedHeader } from "./FeedHeader"
import Footer from "./Footer"
import styled from "@emotion/styled"
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
import { useReturnToFeed } from "src/hooks/useReturnToFeed"
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

const FEED_STICKY_TOP = `calc(var(${FEED_HEADER_HEIGHT_VAR}, 4.5rem) + 0.5rem)`
const FEED_STICKY_HEIGHT = `calc(100vh - var(${FEED_HEADER_HEIGHT_VAR}, 4.5rem) - 0.5rem)`

type Props = {
  rightPanel?: ReactNode
  leftPanel?: ReactNode
}

const Feed: React.FC<Props> = ({ rightPanel, leftPanel }) => {
  const router = useRouter()
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
  const returnToFeed = useReturnToFeed()

  /** Click on empty main-column space (not a card / link / button) closes any open side panel. */
  const handleMidClick: MouseEventHandler<HTMLDivElement> = (event) => {
    if (!sideOpen) return
    if (!isDesktopFeed) return
    const target = event.target as HTMLElement | null
    if (!target) return
    if (
      target.closest(
        'a, button, input, textarea, select, label, [role="button"], [role="link"], [data-feed-resize-handle]'
      )
    ) {
      return
    }
    returnToFeed({ scroll: false })
  }

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

  const feedSlug = router.isReady
    ? typeof router.query.slug === "string"
      ? router.query.slug
      : ""
    : undefined

  useEffect(() => {
    if (!isDesktopFeed) return
    restoreFeedScrollPosition()
  }, [feedSlug, isDesktopFeed])

  useEffect(() => {
    if (!isDesktopFeed) return

    const onRouteChangeComplete = () => {
      restoreFeedScrollPosition()
    }

    router.events.on("routeChangeComplete", onRouteChangeComplete)
    return () => {
      router.events.off("routeChangeComplete", onRouteChangeComplete)
    }
  }, [isDesktopFeed, router.events])

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
            <div className="ltScroll">
              <SectionNav q={draft} onChangeQuery={onChangeQuery} />
              <TagChipPanel />
            </div>
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
          <div className="mid" onClick={handleMidClick}>
            {isDesktopFeed && layoutMode === "about" ? (
              <AboutFeedDim aria-hidden="true" />
            ) : null}
            <div className="midContent">
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
          </div>
          {rightPanel ? <aside className="detail">{rightPanel}</aside> : null}
        </StyledWrapper>
      </FeedShell>
    </FeedShellProvider>
  )
}

export default Feed

const AboutFeedDim = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  border-radius: 0.35rem;
  background: ${({ theme }) =>
    theme.scheme === "dark"
      ? "oklch(0 0 0 / 0.38)"
      : "oklch(0 0 0 / 0.14)"};
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
`

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
    /* Collapse the horizontal grid gap so the resize handles sit exactly on
     * the column boundary and act as the visible divider. Each column then
     * provides its own internal breathing padding (see below). */
    column-gap: 0;
    row-gap: 1.25rem;

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
      /* Right padding reserves breathing room before the resize handle line
       * that sits flush against the next column. The border-right was removed
       * to avoid stacking a static line on top of the handle's divider line. */
      padding: 0.5rem 0.75rem 0
        var(${FEED_ABOUT_TAB_WIDTH_VAR}, ${variables.feedAboutTabWidth}px);
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
      position: sticky;
      top: ${FEED_STICKY_TOP};
      z-index: 15;
      align-self: start;
      display: flex;
      flex-direction: column;
      min-height: 0;
      overflow: hidden;
      max-height: ${FEED_STICKY_HEIGHT};
      margin-bottom: 0;
    }
  }

  > .lt > .ltScroll {
    ${feedDesktopMinMedia} {
      flex: 1 1 auto;
      min-height: 0;
      overflow-x: hidden;
      overflow-y: auto;
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
      /* Symmetric breathing room — v2 spec calls for 1.25rem on both sides
       * since the resize handle is now a hairline that doesn't demand
       * tight content positioning against it. */
      padding-left: 1.25rem;
      padding-right: 1.25rem;
    }

    > .midContent {
      position: relative;
      z-index: 1;
      min-width: 0;
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
      /* Reduced left padding from 1.25rem; border-left removed because the
       * resize handle line on .mid's right edge now serves as the divider. */
      padding: 0.5rem 0 0 0.75rem;
    }
  }

`
