import React, {
  useCallback,
  useLayoutEffect,
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
  OutlineBodyRow,
  OutlineButton,
  OutlineIndex,
  OutlineListCol,
  OutlineText,
  ProgressRail,
} from "src/routes/Detail/PostDetail/PostOutlineNav.styles"
import type { PostOutlineLayout } from "src/routes/Detail/PostDetail/postOutlineTypes"

export type { PostOutlineLayout } from "src/routes/Detail/PostDetail/postOutlineTypes"

type Props = {
  items: NotionOutlineItem[]
  scrollRef: RefObject<HTMLDivElement | null>
  /** Where the outline mounts: post modal, feed side panel, or About drawer (`embedded`). */
  outlineLayout?: PostOutlineLayout
}

function queryBlockById(root: HTMLElement, id: string): HTMLElement | null {
  try {
    if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
      return root.querySelector<HTMLElement>(
        `[data-block-id="${CSS.escape(id)}"]`
      )
    }
  } catch {
    /* ignore */
  }
  return root.querySelector<HTMLElement>(`[data-block-id="${id}"]`)
}

function findBlockElement(
  root: HTMLElement,
  blockId: string
): HTMLElement | null {
  const normalized = blockId.replace(/-/g, "").toLowerCase()

  for (const id of [blockId, blockId.replace(/-/g, "")]) {
    try {
      if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
        const byDomId = root.querySelector<HTMLElement>(`#${CSS.escape(id)}`)
        if (byDomId) return byDomId
      }
    } catch {
      /* ignore */
    }
  }

  for (const id of [blockId, blockId.replace(/-/g, "")]) {
    const hit = queryBlockById(root, id)
    if (hit) return hit
  }

  const nodes = root.querySelectorAll<HTMLElement>("[data-block-id]")
  for (const el of nodes) {
    const raw = el.dataset.blockId
    if (!raw) continue
    if (raw.replace(/-/g, "").toLowerCase() === normalized) return el
  }

  for (const el of root.querySelectorAll<HTMLElement>(
    "h1.notion-h1, h2.notion-h2, h3.notion-h3, .notion-h1, .notion-h2, .notion-h3"
  )) {
    const wrap = el.closest<HTMLElement>("[data-block-id]")
    if (!wrap?.dataset.blockId) continue
    if (wrap.dataset.blockId.replace(/-/g, "").toLowerCase() === normalized) {
      return wrap
    }
  }

  return null
}

/** Prefer the visible heading node so scroll position matches reader expectation. */
function findScrollTarget(root: HTMLElement, blockId: string): HTMLElement | null {
  const wrap = findBlockElement(root, blockId)
  if (!wrap) return null
  const inner = wrap.querySelector<HTMLElement>(
    "h2.notion-h2, h3.notion-h3, h1.notion-h1, h2, h3, h1"
  )
  if (inner && wrap.contains(inner)) return inner
  return wrap
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
 * - `embedded`: About drawer; uses `@container about-drawer` (ancestor sets `container-name`).
 */
const PostOutlineNav: React.FC<Props> = ({
  items,
  scrollRef,
  outlineLayout = "modal",
}) => {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [outlineExpanded, setOutlineExpanded] = useState(true)
  const showReadingChrome = outlineLayout !== "embedded"
  const progress = usePostScrollProgress(scrollRef, showReadingChrome)
  const pct = Math.round(progress * 100)

  const dockedPeekStyle: CSSProperties | undefined =
    showReadingChrome && !outlineExpanded
      ? ({ "--outline-aside-ui-w": POST_OUTLINE_PEEK_WIDTH } as CSSProperties)
      : undefined

  const scrollTo = useCallback(
    (id: string) => {
      const root = scrollRef.current
      if (!root) return
      const el = findScrollTarget(root, id)
      if (!el) return
      scrollBlockIntoRoot(root, el)
    },
    [scrollRef]
  )

  useLayoutEffect(() => {
    const root = scrollRef.current
    if (!root || items.length === 0) return

    const resolved = items
      .map((item) => {
        const el = findScrollTarget(root, item.id)
        return el ? { id: item.id, el } : null
      })
      .filter((x): x is { id: string; el: HTMLElement } => x !== null)

    if (resolved.length === 0) return

    let scheduled = false
    const measure = () => {
      scheduled = false
      const rootRect = root.getBoundingClientRect()
      const marker = rootRect.top + Math.min(100, rootRect.height * 0.11)
      let current: string | null = null
      for (const { id, el } of resolved) {
        const r = el.getBoundingClientRect()
        if (r.top <= marker) current = id
      }
      const next = current ?? resolved[0]?.id ?? null
      setActiveId((prev) => (prev === next ? prev : next))
    }

    const onScroll = () => {
      if (scheduled) return
      scheduled = true
      requestAnimationFrame(measure)
    }

    root.addEventListener("scroll", onScroll, { passive: true })
    const ro = new ResizeObserver(onScroll)
    ro.observe(root)
    measure()

    return () => {
      root.removeEventListener("scroll", onScroll)
      ro.disconnect()
    }
  }, [items, scrollRef])

  if (items.length === 0) return null

  let h2 = 0
  const rows = items.map((item) => {
    if (item.depth === 2) h2 += 1
    return { ...item, h2Index: item.depth === 2 ? h2 : null }
  })

  const listContent = rows.map((item) => (
    <li key={item.id}>
      <OutlineButton
        type="button"
        $depth={item.depth}
        $active={activeId === item.id}
        $readingChrome={showReadingChrome}
        onClick={(e) => {
          e.stopPropagation()
          scrollTo(item.id)
        }}
      >
        {item.h2Index != null ? (
          <OutlineIndex aria-hidden="true">
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
        data-collapsed={showReadingChrome && !outlineExpanded ? "true" : "false"}
      >
        {showReadingChrome && !outlineExpanded ? (
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
                  <>
                    <AsideProgressPct title={`Reading progress: ${pct}%`}>
                      {pct}%
                    </AsideProgressPct>
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
                  </>
                ) : null}
              </AsideHeadRow>
            </AsideHead>
            <AsideScroll>
              {showReadingChrome ? (
                <OutlineBodyRow>
                  <ProgressRail $progress={progress} aria-hidden="true" />
                  <OutlineListCol>
                    <ListDocked>{listContent}</ListDocked>
                  </OutlineListCol>
                </OutlineBodyRow>
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
