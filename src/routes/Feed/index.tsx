import { useEffect, useLayoutEffect, useRef, useState, type MouseEventHandler, type ReactNode } from "react"
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
import { feedAboutColFadeIn } from "src/styles/animations"

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
  const aboutResizeStartRef = useRef(0)
  const ltRef = useRef<HTMLElement | null>(null)
  const prevDockNavRef = useRef(dockNav)

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

  useLayoutEffect(() => {
    if (typeof document === "undefined") return
    if (!isDesktopFeed) return

    const navPx =
      layoutMode === "index"
        ? resolveFeedLayoutWidths(widths).navWidthPx
        : FEED_NAV_DOCK_WIDTH_PX
    document.documentElement.style.setProperty(FEED_NAV_WIDTH_VAR, `${navPx}px`)
    syncFeedScrollOffsetVar()
  }, [isDesktopFeed, layoutMode, widths])

  // Suppress transitions inside the nav column for exactly one rAF frame when
  // dockNav flips — prevents the box-shadow / item layout from animating.
  useLayoutEffect(() => {
    if (prevDockNavRef.current === dockNav) return
    prevDockNavRef.current = dockNav
    const el = ltRef.current
    if (!el) return
    el.setAttribute("data-dock-snap", "true")
    const id = window.requestAnimationFrame(() => {
      el.removeAttribute("data-dock-snap")
    })
    return () => {
      window.cancelAnimationFrame(id)
      el.removeAttribute("data-dock-snap")
    }
  }, [dockNav])

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
            <SideLeft data-about-closing={aboutMotion?.closing ? "true" : "false"}>
              {leftPanel}
            </SideLeft>
          ) : null}
          <NavBand data-feed-section-nav-band ref={ltRef}>
            <NavScroll>
              <SectionNav
                q={draft}
                onChangeQuery={onChangeQuery}
                dockNav={dockNav}
              />
              <TagChipPanel dockNav={dockNav} />
            </NavScroll>
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
          </NavBand>
          <MidCol onClick={handleMidClick}>
            <MidContent>
              <FeedWell>
                <PinnedPosts q={draft} />
                <TagChips />
                <FeedHeader hideCategorySelect />
                <ResumeSections />
                <GroupedPostList q={draft} />
                <FeedFooter>
                  <Footer />
                </FeedFooter>
              </FeedWell>
            </MidContent>
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
          </MidCol>
          {rightPanel ? <DetailCol>{rightPanel}</DetailCol> : null}
          {isDesktopFeed && layoutMode === "about" ? (
            <AboutHandleSlot>
              <FeedColumnResizeHandle
                ariaLabel="Resize about panel"
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
                onKeyboardAdjust={(delta) => nudgeWidth("aboutPanelWidthPx", delta)}
                onDraggingChange={setIsResizing}
              />
            </AboutHandleSlot>
          ) : null}
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

/* ── Per-column styled components ─────────────────────────────────────────── */

const SideLeft = styled.aside`
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
    padding: 0.5rem 0.5rem 0 0.25rem;
    border-radius: var(--radius-lg);
    transition:
      opacity ${FEED_ABOUT_PANEL_EXIT_MS}ms ${FEED_ABOUT_EXIT_EASE},
      transform ${FEED_ABOUT_PANEL_EXIT_MS}ms ${FEED_ABOUT_EXIT_EASE};

    &[data-about-closing="true"] {
      opacity: 0;
      transform: translateY(-12px);
      pointer-events: none;
    }

    @media (prefers-reduced-motion: no-preference) {
      animation: ${feedAboutColFadeIn} 60ms ease-out;
    }

    @media (prefers-reduced-motion: reduce) {
      transition: opacity 120ms ease;
      animation: none;

      &[data-about-closing="true"] {
        opacity: 0;
      }
    }
  }
`

const NavScroll = styled.div`
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
`

const NavBand = styled.aside`
  display: block;
  width: 100%;
  min-width: 0;
  margin-bottom: 0.5rem;

  ${feedMobileOnlyMedia} {
    position: sticky;
    top: var(${FEED_HEADER_HEIGHT_VAR}, 4.5rem);
    z-index: 15;
    background: ${({ theme }) => theme.brand.surface};
    border-bottom: 1px solid ${({ theme }) => theme.brand.borderSoft};
    padding: 0.375rem 1rem;
    margin-left: -1rem;
    margin-right: -1rem;
    margin-bottom: 0;
  }

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
`

const MidContent = styled.div`
  position: relative;
  z-index: 1;
  min-width: 0;
`

const FeedWell = styled.div`
  width: 100%;
  container-name: feed-main;
  container-type: inline-size;
`

const FeedFooter = styled.div`
  padding-bottom: 2rem;

  ${feedDesktopMinMedia} {
    display: none;
  }
`

const MidCol = styled.div`
  min-width: 0;

  ${feedDesktopMinMedia} {
    position: relative;
    padding-left: 1.25rem;
    padding-right: 2rem;
  }
`

const DetailCol = styled.aside`
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
    padding: 0.5rem 0 0 1.5rem;
  }
`

/* ── Grid shell ───────────────────────────────────────────────────────────── */

const StyledWrapper = styled.div`
  position: relative;
  padding: 2rem 0;
  display: grid;
  gap: 1.25rem;
  width: 100%;

  ${feedMobileOnlyMedia} {
    display: block;
    padding: 0;
  }

  ${feedDesktopMinMedia} {
    column-gap: 0;
    row-gap: 1.25rem;

    > ${NavBand}[data-dock-snap="true"] * {
      transition: none !important;
    }

    &[data-feed-nav-dock="true"] > ${NavBand} > ${NavScroll} {
      display: flex;
      flex-direction: column;
      min-height: 0;
      padding-left: 0.3rem;
      padding-right: 0.3rem;
      overflow: hidden;
    }

    &[data-feed-layout="index"] {
      grid-template-columns: var(${FEED_NAV_WIDTH_VAR}, ${variables.feedNavWidth}px)
        minmax(0, 1fr);
    }

    &[data-feed-layout="post"] {
      grid-template-columns:
        var(${FEED_NAV_WIDTH_VAR}, ${variables.feedNavWidth}px)
        minmax(0, var(${FEED_LIST_WIDTH_VAR}, ${variables.feedListWidth}px))
        minmax(var(${FEED_POST_PANEL_MIN_WIDTH_VAR}, 24rem), 1fr);
    }

    /* About: panel | dock nav (56px) | feed — display:none on NavBand broke after
     * 334b76b split it into its own styled component (display:flex wins). */
    &[data-feed-layout="about"] {
      grid-template-columns:
        minmax(0, var(${FEED_ABOUT_PANEL_WIDTH_VAR}, ${variables.feedAboutWidth}px))
        var(${FEED_NAV_WIDTH_VAR}, ${FEED_NAV_DOCK_WIDTH_PX}px)
        minmax(280px, 1fr);
    }

    &[data-feed-layout="about"] > ${SideLeft} {
      grid-column: 1;
      min-width: 0;
    }
    &[data-feed-layout="about"] > ${NavBand} {
      grid-column: 2;
      min-width: 0;
    }
    &[data-feed-layout="about"] > ${MidCol} {
      grid-column: 3;
      min-width: 0;
    }
  }

  ${feedDesktopMinMedia} {
    &[data-feed-layout="post"] > ${MidCol} > ${MidContent} {
      opacity: 0.38;
      transition: opacity 220ms ease;
    }
    &[data-feed-layout="post"] > ${MidCol}:hover > ${MidContent} {
      opacity: 0.72;
      transition-duration: 100ms;
    }
  }
`

/* Zero-width slot anchored at the about panel's right edge. */
const AboutHandleSlot = styled.div`
  display: none;

  ${feedDesktopMinMedia} {
    display: block;
    position: absolute;
    top: 0;
    left: var(${FEED_ABOUT_PANEL_WIDTH_VAR}, ${variables.feedAboutWidth}px);
    width: 0;
    height: 100%;
    z-index: 20;
    pointer-events: none;

    > * {
      pointer-events: all;
    }
  }
`
