import { useState, useEffect, useLayoutEffect, useRef, type MouseEventHandler, type ReactNode } from "react"
import { useRouter } from "next/router"

import FeedColumnResizeHandle from "./FeedColumnResizeHandle"
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
  FEED_LIST_WIDTH_VAR,
  FEED_NAV_DOCK_WIDTH_PX,
  FEED_NAV_WIDTH_VAR,
  FEED_POST_PANEL_MIN_WIDTH_VAR,
  resolveFeedLayoutWidths,
} from "src/libs/utils/feedLayoutVars"
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
import FeedProfileCard from "src/routes/Feed/FeedProfileCard"

const FEED_STICKY_TOP = `calc(var(${FEED_HEADER_HEIGHT_VAR}, 4.5rem) + 0.5rem)`
const FEED_STICKY_HEIGHT = `calc(100vh - var(${FEED_HEADER_HEIGHT_VAR}, 4.5rem) - 0.5rem)`

type Props = {
  rightPanel?: ReactNode
}

const Feed: React.FC<Props> = ({ rightPanel }) => {
  const router = useRouter()
  const { draft, onChangeQuery } = useFeedSearchQuery()
  const sideOpen = Boolean(rightPanel)
  const layoutMode = sideOpen ? "post" : "index"
  const isDesktopFeed = useFeedDesktopLayoutActive()
  const dockNav = isDesktopFeed && sideOpen
  const manageScrollChrome = isDesktopFeed || !sideOpen
  const [isResizing, setIsResizing] = useState(false)
  const dragStartWidthRef = useRef<number>(0)
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
    if (aboutMotion?.isOpen) {
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
    nudgeWidth,
    resetWidths,
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

  useEffect(() => {
    const html = document.documentElement
    if (sideOpen && isDesktopFeed) {
      html.setAttribute("data-feed-side-open", "true")
      html.style.setProperty("--header-cx-max", "none")
      html.style.setProperty("--header-cx-mx", "0")
      html.style.setProperty("--header-cx-pl", "0.75rem")
    } else {
      html.removeAttribute("data-feed-side-open")
      html.style.removeProperty("--header-cx-max")
      html.style.removeProperty("--header-cx-mx")
      html.style.removeProperty("--header-cx-pl")
    }
    return () => {
      html.removeAttribute("data-feed-side-open")
      html.style.removeProperty("--header-cx-max")
      html.style.removeProperty("--header-cx-mx")
      html.style.removeProperty("--header-cx-pl")
    }
  }, [sideOpen, isDesktopFeed])

  const feedSlug = router.isReady
    ? typeof router.query.slug === "string"
      ? router.query.slug
      : ""
    : undefined

  const prevFeedSlugRef = useRef<string | undefined>(undefined)

  useEffect(() => {
    const prev = prevFeedSlugRef.current
    prevFeedSlugRef.current = feedSlug
    if (!isDesktopFeed) return
    // Only restore when returning FROM a post (prev was a slug, now empty)
    if (typeof prev !== "string" || prev === "") return
    if (feedSlug !== "") return
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
      <FeedShell $sideOpen={sideOpen}>
        <StyledWrapper
          data-feed-layout={layoutMode}
          data-feed-nav-dock={dockNav ? "true" : undefined}
          data-resizing={isResizing ? "true" : undefined}
        >
          <NavBand data-feed-section-nav-band ref={ltRef}>
            <NavScroll>
              <SectionNav
                q={draft}
                onChangeQuery={onChangeQuery}
                dockNav={dockNav}
              />
              <TagChipPanel dockNav={dockNav} />
            </NavScroll>
          </NavBand>
          <MidCol onClick={handleMidClick}>
            <MidContent data-dimmed={isDesktopFeed && sideOpen ? "true" : undefined}>
              <FeedWell>
                <FeedProfileCard />
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
            {sideOpen && isDesktopFeed && (
              <FeedColumnResizeHandle
                ariaLabel="Resize post panel"
                onBegin={() => {
                  dragStartWidthRef.current = widths.listWidthPx
                  beginResize()
                }}
                onPreview={(delta) =>
                  previewWidths({ listWidthPx: dragStartWidthRef.current + delta })
                }
                onCommit={commitResize}
                onCancel={cancelResize}
                onReset={resetWidths}
                onKeyboardAdjust={(delta) => nudgeWidth("listWidthPx", delta)}
                onDraggingChange={setIsResizing}
              />
            )}
          </MidCol>
          {rightPanel ? <DetailCol>{rightPanel}</DetailCol> : null}
        </StyledWrapper>
      </FeedShell>
    </FeedShellProvider>
  )
}

export default Feed

const FeedShell = styled.div<{ $sideOpen?: boolean }>`
  width: 100%;
  max-width: ${({ $sideOpen }) => ($sideOpen ? "none" : "1240px")};
  margin: 0 auto;
`

/* ── Per-column styled components ─────────────────────────────────────────── */

const NavScroll = styled.div`
  ${feedDesktopMinMedia} {
    flex: 1 1 auto;
    min-height: 0;
    overflow-x: hidden;
    overflow-y: auto;
    scrollbar-width: none;
    padding: 0.5rem 0.25rem 0.6rem;

    &::-webkit-scrollbar {
      display: none;
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
    padding: 0.375rem 0.75rem;
    margin-left: -0.75rem;
    margin-right: -0.75rem;
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

  ${feedDesktopMinMedia} {
    transition: filter 200ms ease;

    &[data-dimmed="true"] {
      filter: brightness(0.45);
    }
    &[data-dimmed="true"]:hover {
      filter: brightness(0.62);
      transition-duration: 100ms;
    }
  }
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
    background: rgba(14, 11, 26, 0.62);
    backdrop-filter: var(--glass-blur, blur(16px) saturate(140%));
    -webkit-backdrop-filter: var(--glass-blur, blur(16px) saturate(140%));
    box-shadow: -12px 0 36px rgba(5, 3, 15, 0.38);

    @keyframes panelSlideIn {
      from { opacity: 0; transform: translateX(40px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    animation: panelSlideIn 300ms cubic-bezier(0.2, 0, 0, 1) both;
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
    transition: grid-template-columns 300ms cubic-bezier(0.2, 0, 0, 1);

    &[data-resizing="true"] {
      transition: none;
    }

    > ${NavBand}[data-dock-snap="true"] * {
      transition: none !important;
    }

    &[data-feed-nav-dock="true"] > ${NavBand} {
      background: rgba(8, 6, 17, 0.4);
      border-right: 1px solid rgba(255, 255, 255, 0.06);
    }

    &[data-feed-nav-dock="true"] > ${NavBand} > ${NavScroll} {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 0;
      padding: 0;
      overflow-y: auto;
      overflow-x: hidden;
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

  }

`
