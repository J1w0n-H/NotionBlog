import React, { useCallback, type RefObject } from "react"
import { css } from "@emotion/react"
import styled from "@emotion/styled"
import type { NotionOutlineItem } from "src/libs/notion/extractOutlineFromRecordMap"

export type PostOutlineLayout = "modal" | "embedded"

type Props = {
  items: NotionOutlineItem[]
  scrollRef: RefObject<HTMLDivElement | null>
  /** `embedded` = About side panel: container query + narrow column (ancestor needs `container-name: about-drawer`). */
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

/** Sticky outline from recordMap h2/h3; `modal` hides below `lg`; `embedded` uses @container about-drawer. */
const PostOutlineNav: React.FC<Props> = ({
  items,
  scrollRef,
  outlineLayout = "modal",
}) => {
  const scrollTo = useCallback(
    (id: string) => {
      const root = scrollRef.current
      if (!root) return
      const el = findBlockElement(root, id)
      el?.scrollIntoView({ behavior: "smooth", block: "start" })
    },
    [scrollRef]
  )

  if (items.length === 0) return null

  return (
    <Aside aria-label="On this page" $layout={outlineLayout}>
      <AsideTitle>On this page</AsideTitle>
      <List>
        {items.map((item) => (
          <li key={item.id}>
            <OutlineButton
              type="button"
              $depth={item.depth}
              onClick={() => scrollTo(item.id)}
            >
              {item.text}
            </OutlineButton>
          </li>
        ))}
      </List>
    </Aside>
  )
}

export default PostOutlineNav

const asideVisible = css`
  display: block;
  position: sticky;
  top: 1.25rem;
  align-self: start;
  max-width: 100%;
  overflow: auto;
  padding-left: 0.5rem;
  border-left: 1px solid ${({ theme }) => theme.brand.borderSoft};
`

const Aside = styled.aside<{ $layout: PostOutlineLayout }>`
  display: none;

  ${({ $layout }) =>
    $layout === "modal"
      ? css`
          @media (min-width: 1024px) {
            ${asideVisible};
            width: 280px;
            max-height: calc(90vh - 4rem);
          }
        `
      : css`
          @container about-drawer (min-width: 380px) {
            ${asideVisible};
            width: min(11rem, 100%);
            max-height: min(70vh, 18rem);
            top: 0.65rem;
          }
        `}
`

const AsideTitle = styled.p`
  margin: 0 0 0.5rem;
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

const OutlineButton = styled.button<{ $depth: 2 | 3 }>`
  display: block;
  width: 100%;
  margin: 0;
  padding: 0.35rem 0 0.35rem ${({ $depth }) => ($depth === 3 ? "0.75rem" : "0")};
  border: 0;
  background: transparent;
  text-align: left;
  font-size: 0.8125rem;
  line-height: 1.35;
  color: ${({ theme }) => theme.brand.textMuted};
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition:
    color ${({ theme }) => theme.brand.durationFast} ${({ theme }) =>
      theme.brand.ease},
    background ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease};

  &:hover {
    color: ${({ theme }) => theme.brand.text};
    background: ${({ theme }) => theme.brand.surface2};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.brand.accentRing};
    outline-offset: 2px;
  }
`
