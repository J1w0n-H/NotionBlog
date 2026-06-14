import React, {
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
  type RefObject,
} from "react"
import type { NotionOutlineItem } from "src/libs/notion/extractOutlineFromRecordMap"
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi"
import { usePostScrollProgress } from "src/hooks/usePostScrollProgress"
import { POST_OUTLINE_PEEK_WIDTH } from "src/libs/utils/postOutlineAsideLayout"
import {
  Aside,
  AsideHead,
  AsideHeadProgressFill,
  AsideHeadProgressTrack,
  AsideHeadRow,
  AsideHeadTitleSlot,
  AsideIconBtn,
  AsideInner,
  AsidePeek,
  AsidePeekChevron,
  AsidePeekPct,
  AsidePeekStack,
  AsideProgressPct,
  AsideScroll,
  AsideTitle,
  List,
  ListDocked,
  OutlineButton,
  OutlineIndex,
  OutlineText,
  ProgressRail,
} from "src/routes/Detail/PostDetail/PostOutlineNav.styles"
import type { PostOutlineLayout } from "src/routes/Detail/PostDetail/postOutlineTypes"

export type { PostOutlineLayout } from "src/routes/Detail/PostDetail/postOutlineTypes"

type Props = {
  items: NotionOutlineItem[]
  scrollRef: RefObject<HTMLDivElement | null>
  /** Where the outline mounts: post modal, feed side panel, or About feed panel (`about`). */
  outlineLayout?: PostOutlineLayout
}

/** react-notion-x v6 sets data-id to the block UUID (no dashes). */
function findHeadingEl(root: HTMLElement, blockId: string): HTMLElement | null {
  const rawId = blockId.replace(/-/g, "")
  return (
    root.querySelector<HTMLElement>(`[data-id="${rawId}"]`) ??
    root.querySelector<HTMLElement>(`#${rawId}`)
  )
}

/** Breathing room below sticky chrome when jumping from the outline. */
const OUTLINE_SCROLL_TOP_PAD = 20

/**
 * Distance from the top of `root`'s scrollable content to the top of `el`.
 * Uses viewport rects so it stays correct when `root` is `position: static`
 * (offsetParent chains often skip the scroll container).
 */
function scrollTopForElement(root: HTMLElement, el: HTMLElement): number {
  const er = el.getBoundingClientRect()
  const rr = root.getBoundingClientRect()
  return er.top - rr.top + root.scrollTop
}

function scrollBlockIntoRoot(root: HTMLElement, el: HTMLElement) {
  const nextTop = scrollTopForElement(root, el) - OUTLINE_SCROLL_TOP_PAD
  root.scrollTo({ top: Math.max(0, nextTop), behavior: "smooth" })
}

/**
 * Sticky outline from recordMap h2/h3.
 * - `modal`: lg+ only; used in the post dialog scroll body.
 * - `side`: lg+ only; feed right-hand post panel (slightly tighter sticky top).
 * - `about`: About feed panel; TOC floats in the right gutter (`@container about-drawer`).
 * - `embedded`: legacy narrow column layout for About.
 */
const PostOutlineNav: React.FC<Props> = ({
  items,
  scrollRef,
  outlineLayout = "modal",
}) => {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [outlineExpanded, setOutlineExpanded] = useState(true)
  const showReadingChrome = outlineLayout !== "embedded"
  const canCollapse = outlineLayout === "modal"
  const progress = usePostScrollProgress(scrollRef, showReadingChrome)
  const pct = Math.round(progress * 100)

  const dockedPeekStyle: CSSProperties | undefined =
    canCollapse && !outlineExpanded
      ? ({ "--outline-aside-ui-w": POST_OUTLINE_PEEK_WIDTH } as CSSProperties)
      : undefined

  const scrollTo = useCallback(
    (id: string) => {
      const root = scrollRef.current
      if (!root) return
      const el = findHeadingEl(root, id)
      if (!el) return
      scrollBlockIntoRoot(root, el)
    },
    [scrollRef]
  )

  useEffect(() => {
    const root = scrollRef.current
    if (!root || items.length === 0) return

    const measure = () => {
      const headings = items
        .map((item) => {
          const el = findHeadingEl(root, item.id)
          return el ? { id: item.id, el } : null
        })
        .filter((x): x is { id: string; el: HTMLElement } => x !== null)

      if (!headings.length) return false

      const rootTop = root.getBoundingClientRect().top
      const marker = rootTop + Math.min(100, root.clientHeight * 0.11)
      let cur: string | null = null
      for (const { id, el } of headings) {
        if (el.getBoundingClientRect().top <= marker) cur = id
      }
      const next = cur ?? headings[0].id
      setActiveId((prev) => (prev === next ? prev : next))
      return true
    }

    // Fast path: module already loaded (Post→Post after first visit)
    if (measure()) {
      root.addEventListener("scroll", measure, { passive: true })
      return () => root.removeEventListener("scroll", measure)
    }

    // Slow path: next/dynamic ssr:false still loading (About→Post, first cold visit)
    // Retry at increasing intervals until headings appear in DOM.
    let found = false
    const retry = () => {
      if (!found && measure()) {
        found = true
        root.addEventListener("scroll", measure, { passive: true })
      }
    }
    const timers = [100, 300, 700, 1500, 3000].map((d) => setTimeout(retry, d))

    return () => {
      timers.forEach(clearTimeout)
      if (found) root.removeEventListener("scroll", measure)
    }
  }, [items, scrollRef])

  if (items.length === 0) return null

  let h2 = 0
  let lastH2Id: string | null = null
  const rows = items.map((item) => {
    if (item.depth === 2) {
      h2 += 1
      lastH2Id = item.id
    }
    return {
      ...item,
      h2Index: item.depth === 2 ? h2 : null,
      parentH2Id: item.depth === 3 ? lastH2Id : null,
    }
  })

  // Active h2: the section currently being read
  const activeRow = activeId ? rows.find((r) => r.id === activeId) : null
  const activeH2Id = activeRow
    ? activeRow.depth === 2
      ? activeRow.id
      : activeRow.parentH2Id
    : null

  // Show h2 items always; h3 items only when their parent h2 is active
  const listContent = rows
    .filter((item) => item.depth === 2 || item.parentH2Id === activeH2Id)
    .map((item) => (
      <li key={item.id}>
        <OutlineButton
          type="button"
          $depth={item.depth}
          $active={activeId === item.id}
          onClick={(e) => {
            e.stopPropagation()
            scrollTo(item.id)
          }}
        >
          {item.h2Index != null ? (
            <OutlineIndex $active={activeId === item.id} aria-hidden="true">
              {String(item.h2Index).padStart(2, "0")}
            </OutlineIndex>
          ) : null}
          <OutlineText>{item.text}</OutlineText>
        </OutlineButton>
      </li>
    ))

  return (
    <Aside
      aria-label="On this page"
      $layout={outlineLayout}
      style={dockedPeekStyle}
      aria-expanded={showReadingChrome ? outlineExpanded : undefined}
    >
      <AsideInner
        data-collapsed={canCollapse && !outlineExpanded ? "true" : "false"}
      >
        {canCollapse && !outlineExpanded ? (
          <AsidePeek
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setOutlineExpanded(true)
            }}
            aria-label="Open table of contents"
          >
            <ProgressRail $progress={progress} $peek aria-hidden="true" />
            <AsidePeekStack>
              <AsidePeekPct title={`Reading progress: ${pct}%`}>
                {pct}%
              </AsidePeekPct>
              <AsidePeekChevron aria-hidden="true">
                <HiChevronDoubleLeft />
              </AsidePeekChevron>
            </AsidePeekStack>
          </AsidePeek>
        ) : (
          <>
            <AsideHead>
              <AsideHeadRow>
                <AsideHeadTitleSlot>
                  <AsideTitle>On this page</AsideTitle>
                </AsideHeadTitleSlot>
                {showReadingChrome ? (
                  <AsideProgressPct title={`Reading progress: ${pct}%`}>
                    {pct}%
                  </AsideProgressPct>
                ) : null}
                {canCollapse ? (
                  <AsideIconBtn
                    type="button"
                    aria-label="Collapse table of contents"
                    onClick={(e) => {
                      e.stopPropagation()
                      setOutlineExpanded(false)
                    }}
                  >
                    <HiChevronDoubleRight aria-hidden="true" />
                  </AsideIconBtn>
                ) : null}
              </AsideHeadRow>
              {canCollapse ? (
                <AsideHeadProgressTrack
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={pct}
                  aria-label="Reading progress"
                >
                  <AsideHeadProgressFill $progress={progress} />
                </AsideHeadProgressTrack>
              ) : null}
            </AsideHead>
            <AsideScroll>
              {showReadingChrome ? (
                <ListDocked>{listContent}</ListDocked>
              ) : (
                <List>{listContent}</List>
              )}
            </AsideScroll>
          </>
        )}
      </AsideInner>
    </Aside>
  )
}

export default PostOutlineNav
