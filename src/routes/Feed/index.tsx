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
  FEED_NAV_DOCK_WIDTH_PX,
  FEED_NAV_WIDTH_VAR,
  FEED_POST_PANEL_MIN_WIDTH_VAR,
  resolveFeedLayoutWidths,
  type FeedLayoutMode,
} from "src/libs/utils/feedLayoutVars"
import FeedColumnResizeHandle from "src/routes/Feed/FeedColumnResizeHandle"
import {
  FEED_ABOUT_EXIT_EASE,
  FEED_ABOUT_MOTION_EASE,
  FEED_ABOUT_PANEL_EXIT_MS,
  FEED_ABOUT_PANEL_UNFOLD_MS,
} from "src/routes/Feed/FeedSidePanel"
import { useAboutPanelMotion } from "src/contexts/AboutPanelMotionContext"
import {
  FEED_HEADER_HEIGHT_VAR,
  syncFeedScrollOffsetVar,
} from "src/libs/utils/feedScrollOffset"
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
  const dockNav = isDesktopFeed && sideOpen
  const manageScrollChrome = isDesktopFeed || !sideOpen
  const [isResizing, setIsResizing] = useState(false)
  const navResizeStartRef = useRef(0)
  const listResizeStartRef = useRef(0)

  const returnToFeed = useReturnToFeed()
  const aboutMotion = useAboutPanelMotion()

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
    if (layoutMode === "about" && aboutMotion) {
      aboutMotion.requestClose()
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

  useEffect(() => {
    if (typeof document === "undefined") return
    if (!isDesktopFeed) return
    const navPx =
      layoutMode === "index"
        ? resolveFeedLayoutWidths(widths).navWidthPx
        : FEED_NAV_DOCK_WIDTH_PX
    document.documentElement.style.setProperty(
      FEED_NAV_WIDTH_VAR,
      `${navPx}px`
    )
    syncFeedScrollOffsetVar()
  }, [isDesktopFeed, layoutMode, widths])

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
          data-feed-layout={layoutMode}
          data-feed-nav-dock={dockNav ? "true" : undefined}
          data-feed-about-closing={
            layoutMode === "about" && aboutMotion?.closing ? "true" : undefined
          }
        >
          {leftPanel ? (
            <aside
              className="side-l"
              data-about-closing={aboutMotion?.closing ? "true" : "false"}
            >
              {leftPanel}
            </aside>
          ) : null}
          <aside className="lt" data-feed-section-nav-band>
            <div className="ltScroll">
              <SectionNav
                q={draft}
                onChangeQuery={onChangeQuery}
                dockNav={dockNav}
              />
              <TagChipPanel dockNav={dockNav} />
            </div>
            {isDesktopFeed && layoutMode === "index" ? (
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
            <div className="midContent">
              <div className="midFeedWell">
                <PinnedPosts q={draft} />
                <TagChips />
                <FeedHeader hideCategorySelect />
                <ResumeSections />
                <GroupedPostList q={draft} />
                <div className="footer">
                  <Footer />
                </div>
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

const FeedShell = styled.div`
  width: 100%;

  &[data-feed-resizing="true"] {
    user-select: none;
    cursor: col-resize;
  }
`

const StyledWrapper = styled.div`
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
    /* grid-template-columns transition removed: CSS grid layout changes
     * are not GPU-composited and cause per-frame reflow, making the panel
     * open/close feel janky. The panel itself animates via transform+opacity. */

    &[data-feed-nav-dock="true"] > .lt > .ltScroll {
      display: flex;
      flex-direction: column;
      min-height: 0;
      padding-left: 0.3rem;
      padding-right: 0.3rem;
    }

    &[data-feed-layout="index"] {
      grid-template-columns: var(${FEED_NAV_WIDTH_VAR}, ${variables.feedNavWidth}px)
        minmax(0, 1fr);
    }

    &[data-feed-layout="post"] {
      /* Feed list is flexible (shrinks first); post detail holds its minimum. */
      grid-template-columns:
        var(${FEED_NAV_WIDTH_VAR}, ${variables.feedNavWidth}px)
        minmax(0, var(${FEED_LIST_WIDTH_VAR}, ${variables.feedListWidth}px))
        minmax(var(${FEED_POST_PANEL_MIN_WIDTH_VAR}, 24rem), 1fr);
    }

    &[data-feed-layout="about"] {
      /* 3-column: nav dock | feed list | about (fills). */
      grid-template-columns:
        var(${FEED_NAV_WIDTH_VAR}, ${FEED_NAV_DOCK_WIDTH_PX}px)
        minmax(0, 420px)
        minmax(0, 1fr);
    }

    /* DOM order is side-l → lt → mid; remap to visual: nav | feed | about. */
    &[data-feed-layout="about"] > .side-l { grid-column: 3; }
    &[data-feed-layout="about"] > .lt     { grid-column: 1; }
    &[data-feed-layout="about"] > .mid    { grid-column: 2; }

  }

  @keyframes feedAboutColEnter {
    from {
      transform: translateY(-22px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
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
      padding: 0.5rem 0.75rem 0 1.25rem;
      overflow: hidden;
      border-radius: var(--radius-lg);
      /* Closing: opacity-only fade so it doesn't compound with the inner panel's
       * translateY. Transform causes double-movement (column + content). */
      transition: opacity ${FEED_ABOUT_PANEL_EXIT_MS}ms ${FEED_ABOUT_EXIT_EASE};

      &[data-about-closing="true"] {
        opacity: 0;
        pointer-events: none;
      }

      @media (prefers-reduced-motion: no-preference) {
        &:not([data-about-closing="true"]) {
          animation: feedAboutColEnter ${FEED_ABOUT_PANEL_UNFOLD_MS}ms ${FEED_ABOUT_MOTION_EASE} both;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        transition: opacity 120ms ease;
        animation: none;

        &[data-about-closing="true"] {
          opacity: 0;
        }
      }
    }
  }

  > .lt {
    display: block;
    width: 100%;
    min-width: 0;
    margin-bottom: 0.75rem;

    ${feedHeaderProfileMinMedia} {
      position: sticky;
      top: ${FEED_STICKY_TOP};
      z-index: 15;
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
      margin: 2px 4px 4px 2px;
      padding: 0.5rem 0.45rem 0.6rem;
      border-radius: var(--radius-lg);
      border: 1px solid ${({ theme }) => theme.brand.borderSoft};
      background: linear-gradient(
        180deg,
        ${({ theme }) => theme.brand.surface} 0%,
        ${({ theme }) => theme.brand.surfaceSunk} min(50%, 9rem)
      );
      box-shadow: ${({ theme }) => theme.brand.shadowSm};

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
    ${feedDesktopMinMedia} {
      position: relative;
      padding-left: 1.25rem;
      padding-right: 2rem;
    }

    > .midContent {
      position: relative;
      z-index: 1;
      min-width: 0;
    }

    > .midContent > .midFeedWell {
      width: 100%;
      container-name: feed-main;
      container-type: inline-size;

      > .footer {
        padding-bottom: 2rem;
        ${feedDesktopMinMedia} {
          display: none;
        }
      }
    }
  }

  > .detail {
    ${feedDesktopMinMedia} {
      padding: 0.5rem 0 0 1.5rem;
    }
  }

`
