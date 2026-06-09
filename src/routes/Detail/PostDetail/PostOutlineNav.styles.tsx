import styled from "@emotion/styled"
import {
  outlineAsideAboutFeedCss,
  outlineAsideDockedLgCss,
  outlineAsideEmbeddedCss,
} from "src/routes/Detail/PostDetail/postOutlineNavAsideCss"
import type { PostOutlineLayout } from "src/routes/Detail/PostDetail/postOutlineTypes"

/** Matches `OutlineIndex` width; h3 rows omit the index so we pad to this column + subtree indent. */
const OUTLINE_INDEX_COL = "1.45rem"
const OUTLINE_ROW_GAP = "0.45rem"
const OUTLINE_PAD_X = "0.35rem"
/** Additional left inset so h3 lines read clearly under their parent h2. */
const OUTLINE_DEPTH3_EXTRA = "0.35rem"

export const Aside = styled.aside<{ $layout: PostOutlineLayout }>`
  display: none;
  align-self: flex-start;
  width: 100%;

  ${({ $layout, theme }) =>
    $layout === "embedded"
      ? outlineAsideEmbeddedCss(theme)
      : $layout === "about"
        ? outlineAsideAboutFeedCss(theme)
        : outlineAsideDockedLgCss(theme, $layout === "side" ? "side" : "modal")}
`

export const AsideInner = styled.div`
  display: flex;
  flex-direction: column;
  max-height: inherit;
  min-height: 0;
  overflow: hidden;
  border-radius: var(--radius-md);

  &[data-collapsed="true"] {
    min-height: 5.5rem;
  }
`

export const AsideHead = styled.div`
  flex: 0 0 auto;
  padding: 0.4rem 0.5rem 0.5rem;
  margin-bottom: 0.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.brand.borderSoft};
  background: ${({ theme }) => theme.brand.surface};
`

/** Full-width reading progress under the title row (modal / side docked). */
export const AsideHeadProgressTrack = styled.div`
  height: 3px;
  margin: 0.35rem 0 0;
  border-radius: 999px;
  background: ${({ theme }) => theme.brand.borderSoft};
  overflow: hidden;
  box-shadow: inset 0 0 0 1px ${({ theme }) => theme.brand.borderSoft};
`

export const AsideHeadProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  width: 100%;
  transform: scaleX(${({ $progress }) => Math.max(0, Math.min(1, $progress))});
  transform-origin: left center;
  border-radius: inherit;
  background: ${({ theme }) => theme.brand.signal};
`

export const AsideHeadRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  min-width: 0;
`

export const AsideHeadTitleSlot = styled.div`
  flex: 1 1 auto;
  min-width: 0;

  & > * {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

export const AsideIconBtn = styled.button`
  display: inline-grid;
  place-items: center;
  flex: 0 0 auto;
  width: 1.65rem;
  height: 1.65rem;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: var(--radius-sm);
  background: transparent;
  color: ${({ theme }) => theme.brand.textMuted};
  cursor: pointer;

  svg {
    width: 1.05rem;
    height: 1.05rem;
  }

  &:hover {
    color: ${({ theme }) => theme.brand.text};
    background: ${({ theme }) => theme.brand.surface2};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.brand.accentRing};
    outline-offset: 2px;
  }
`

export const AsidePeek = styled.button`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 0;
  width: 100%;
  flex: 1 1 auto;
  min-height: 5.25rem;
  max-height: min(42vh, 14rem);
  margin: 0;
  padding: 0.3rem 0.1rem 0.35rem 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  color: inherit;
  text-align: left;
  border-radius: inherit;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.brand.accentRing};
    outline-offset: -2px;
  }
`

export const AsidePeekStack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  flex: 1 1 auto;
  min-width: 0;
  padding: 0 0.05rem 0 0.1rem;
`

export const AsidePeekChevron = styled.span`
  display: flex;
  color: ${({ theme }) => theme.brand.textMuted};

  svg {
    width: 1.05rem;
    height: 1.05rem;
  }
`

export const AsideProgressPct = styled.span`
  flex: 0 0 auto;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.6875rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.02em;
  color: ${({ theme }) => theme.brand.signal};
`

export const AsidePeekPct = styled(AsideProgressPct)`
  font-size: 0.625rem;
  line-height: 1.2;
  text-align: center;
`

export const ProgressRail = styled.div<{ $progress: number; $peek?: boolean }>`
  position: relative;
  flex: 0 0 3px;
  width: 3px;
  align-self: stretch;
  pointer-events: none;
  margin: ${({ $peek }) =>
    $peek ? "0.2rem 0 0.2rem 0.15rem" : "0.2rem 0 0.35rem 0.35rem"};
  border-radius: 999px;
  background: linear-gradient(
    to bottom,
    ${({ theme }) => theme.brand.signal} 0%,
    ${({ theme }) => theme.brand.signal} ${({ $progress }) => $progress * 100}%,
    ${({ theme }) => theme.brand.borderSoft} ${({ $progress }) => $progress * 100}%,
    ${({ theme }) => theme.brand.borderSoft} 100%
  );
  box-shadow: 0 0 0 1px ${({ theme }) => theme.brand.borderSoft};
`

export const AsideScroll = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-gutter: stable;
  padding-right: 1px;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) =>
    `${theme.brand.border} ${theme.brand.surface2}`};

  &::-webkit-scrollbar {
    width: 7px;
  }

  &::-webkit-scrollbar-track {
    margin: 6px 0;
    background: ${({ theme }) => theme.brand.surface2};
    border-radius: 999px;
    border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.brand.border};
    border-radius: 999px;
    border: 2px solid transparent;
    background-clip: padding-box;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.brand.borderStrong};
    background-clip: padding-box;
  }
`

export const AsideTitle = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.textFaint};
`

export const List = styled.ul`
  margin: 0;
  padding: 0 0.15rem 0.25rem 0.35rem;
  list-style: none;
`

export const ListDocked = styled.ul`
  margin: 0;
  padding: 0 0.25rem 0.35rem 0.4rem;
  list-style: none;
`

export const OutlineButton = styled.button<{
  $depth: 2 | 3
  $active: boolean
  $readingChrome?: boolean
}>`
  display: flex;
  align-items: flex-start;
  gap: ${OUTLINE_ROW_GAP};
  width: 100%;
  margin: 0;
  padding: 0.4rem 0.35rem 0.4rem
    ${({ $depth }) =>
      $depth === 3
        ? `calc(${OUTLINE_PAD_X} + ${OUTLINE_INDEX_COL} + ${OUTLINE_ROW_GAP} + ${OUTLINE_DEPTH3_EXTRA})`
        : OUTLINE_PAD_X};
  border: 0;
  background: ${({ $active, theme }) =>
    !$active
      ? "transparent"
      : `color-mix(in oklch, ${theme.brand.accentSoft} 55%, ${theme.brand.surfaceSunk})`};
  box-shadow: ${({ $active, $readingChrome, theme }) =>
    $active && $readingChrome
      ? `inset 2px 0 0 0 ${theme.brand.accent}`
      : "none"};
  text-align: left;
  font-size: 0.8125rem;
  line-height: 1.35;
  color: ${({ $active, theme }) =>
    $active
      ? theme.brand.accent
      : theme.brand.textMuted};
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
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
        ? `color-mix(in oklch, ${theme.brand.accentSoft} 72%, ${theme.brand.surfaceSunk})`
        : theme.brand.surface2};
    box-shadow: ${({ $active, $readingChrome, theme }) =>
      $active && $readingChrome
        ? `inset 2px 0 0 0 ${theme.brand.accent}`
        : "none"};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.brand.accentRing};
    outline-offset: 2px;
  }
`

export const OutlineIndex = styled.span`
  flex: 0 0 auto;
  min-width: ${OUTLINE_INDEX_COL};
  margin-top: 0.12rem;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: inherit;
  opacity: 0.85;
`

export const OutlineText = styled.span`
  flex: 1 1 auto;
  min-width: 0;
`
