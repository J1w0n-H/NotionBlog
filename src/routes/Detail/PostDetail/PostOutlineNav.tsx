import React, { useCallback, useEffect, useState, type RefObject } from "react"
import type { NotionOutlineItem } from "src/libs/notion/extractOutlineFromRecordMap"
import {
  Aside,
  AsideHead,
  AsideInner,
  AsideScroll,
  AsideTitle,
  List,
  OutlineButton,
  OutlineIndex,
  OutlineText,
} from "src/routes/Detail/PostDetail/PostOutlineNav.styles"
import type { PostOutlineLayout } from "src/routes/Detail/PostDetail/postOutlineTypes"

export type { PostOutlineLayout } from "src/routes/Detail/PostDetail/postOutlineTypes"

type Props = {
  items: NotionOutlineItem[]
  scrollRef: RefObject<HTMLDivElement | null>
  /** Where the outline mounts: post modal, feed side panel, or About drawer (`embedded`). */
  outlineLayout?: PostOutlineLayout
}

function findBlockElement(
  root: HTMLElement,
  blockId: string
): HTMLElement | null {
  const target = blockId.replace(/-/g, "").toLowerCase()
  const nodes = root.querySelectorAll<HTMLElement>("[data-block-id]")
  for (const el of nodes) {
    const raw = el.dataset.blockId
    if (!raw) continue
    if (raw.replace(/-/g, "").toLowerCase() === target) return el
  }
  return null
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

  const scrollTo = useCallback(
    (id: string) => {
      const root = scrollRef.current
      if (!root) return
      const el = findBlockElement(root, id)
      el?.scrollIntoView({ behavior: "smooth", block: "start" })
    },
    [scrollRef]
  )

  useEffect(() => {
    const root = scrollRef.current
    if (!root || items.length === 0) return

    const resolved = items
      .map((item) => {
        const el = findBlockElement(root, item.id)
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

  return (
    <Aside aria-label="On this page" $layout={outlineLayout}>
      <AsideInner>
        <AsideHead>
          <AsideTitle>On this page</AsideTitle>
        </AsideHead>
        <AsideScroll>
          <List>
            {rows.map((item) => (
              <li key={item.id}>
                <OutlineButton
                  type="button"
                  $depth={item.depth}
                  $active={activeId === item.id}
                  onClick={() => scrollTo(item.id)}
                >
                  {item.h2Index != null ? (
                    <OutlineIndex aria-hidden="true">
                      {String(item.h2Index).padStart(2, "0")}
                    </OutlineIndex>
                  ) : null}
                  <OutlineText>{item.text}</OutlineText>
                </OutlineButton>
              </li>
            ))}
          </List>
        </AsideScroll>
      </AsideInner>
    </Aside>
  )
}

export default PostOutlineNav
