import React, { useCallback, useEffect, useState, type RefObject } from "react"
import styled from "@emotion/styled"
import type { NotionOutlineItem } from "src/libs/notion/extractOutlineFromRecordMap"
import {
  POST_OUTLINE_ASIDE_MAX_HEIGHT,
  POST_OUTLINE_STICKY_TOP_REM,
} from "src/libs/utils/postOutlineAsideLayout"

export type PostOutlineLayout = "modal" | "embedded" | "side"

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

const Aside = styled.aside<{ $layout: PostOutlineLayout }>`
  display: none;

  ${({ $layout, theme }) =>
    $layout === "embedded"
      ? `
    @container about-drawer (min-width: 380px) {
      display: block;
      position: sticky;
      top: 0.65rem;
      align-self: start;
      width: min(11rem, 100%);
      max-width: 100%;
      max-height: min(70vh, 18rem);
      min-height: 0;
      padding-left: 0.5rem;
      border-left: 1px solid ${theme.brand.borderSoft};
    }
  `
      : `
    @media (min-width: 1024px) {
      display: block;
      position: sticky;
      top: ${
        $layout === "side"
          ? POST_OUTLINE_STICKY_TOP_REM.side
          : POST_OUTLINE_STICKY_TOP_REM.modal
      };
      align-self: start;
      width: 280px;
      max-width: 100%;
      max-height: ${POST_OUTLINE_ASIDE_MAX_HEIGHT};
      min-height: 0;
      padding-left: 0.5rem;
      border-left: 1px solid ${theme.brand.borderSoft};
    }
  `}
`

const AsideInner = styled.div`
  display: flex;
  flex-direction: column;
  max-height: inherit;
  min-height: 0;
`

const AsideHead = styled.div`
  flex: 0 0 auto;
  padding-bottom: 0.5rem;
  margin-bottom: 0.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.brand.borderSoft};
  background: ${({ theme }) => theme.brand.surface};
`

const AsideScroll = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) =>
    `${theme.brand.border} transparent`};

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.brand.border};
    border-radius: 999px;
  }
`

const AsideTitle = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.textFaint};
`

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`

const OutlineButton = styled.button<{ $depth: 2 | 3; $active: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 0.45rem;
  width: 100%;
  margin: 0;
  padding: 0.4rem 0.35rem 0.4rem ${({ $depth }) => ($depth === 3 ? "0.75rem" : "0.2rem")};
  border: 0;
  background: ${({ $active, theme }) =>
    $active
      ? `color-mix(in oklch, ${theme.brand.accent} 34%, ${theme.brand.surface2})`
      : "transparent"};
  text-align: left;
  font-size: 0.8125rem;
  line-height: 1.35;
  color: ${({ $active, theme }) =>
    $active ? theme.brand.accent : theme.brand.textMuted};
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition:
    color ${({ theme }) => theme.brand.durationFast} ${({ theme }) =>
      theme.brand.ease},
    background ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  &:hover {
    color: ${({ theme, $active }) =>
      $active ? theme.brand.accent : theme.brand.text};
    background: ${({ theme, $active }) =>
      $active
        ? `color-mix(in oklch, ${theme.brand.accent} 42%, ${theme.brand.surface2})`
        : theme.brand.surface2};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.brand.accentRing};
    outline-offset: 2px;
  }
`

const OutlineIndex = styled.span`
  flex: 0 0 auto;
  min-width: 1.35rem;
  margin-top: 0.05rem;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: inherit;
  opacity: 0.85;
`

const OutlineText = styled.span`
  flex: 1 1 auto;
  min-width: 0;
`
