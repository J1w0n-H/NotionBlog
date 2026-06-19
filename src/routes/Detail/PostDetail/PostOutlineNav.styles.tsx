import styled from "@emotion/styled"
import {
  outlineAsideAboutFeedCss,
  outlineAsideDockedLgCss,
  outlineAsideEmbeddedCss,
} from "src/routes/Detail/PostDetail/postOutlineNavAsideCss"
import type { PostOutlineLayout } from "src/routes/Detail/PostDetail/postOutlineTypes"


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
  padding: 0.4rem 0.5rem 0.35rem;
  margin-bottom: 0.1rem;
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
  color: ${({ theme }) => theme.brand.link};
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
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.textFaint};
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-left: 1px solid ${({ theme }) => theme.brand.borderSoft};
`

export const ListDocked = styled(List)``

export const OutlineButton = styled.button<{
  $depth: 2 | 3
  $active: boolean
}>`
  display: flex;
  align-items: baseline;
  gap: 9px;
  width: 100%;
  margin: 0;
  margin-left: -1px;
  padding: 7px 12px;
  ${({ $depth }) => $depth === 3 && `padding-left: 2.25rem;`}
  border: none;
  border-left: 2px solid ${({ $active, theme }) =>
    $active ? theme.brand.link : "transparent"};
  border-radius: 0 8px 8px 0;
  background: ${({ $active }) =>
    $active
      ? "linear-gradient(90deg, color-mix(in srgb, var(--link) 14%, transparent), color-mix(in srgb, var(--accent) 6%, transparent) 70%, transparent)"
      : "transparent"};
  box-shadow: ${({ $active }) =>
    $active
      ? "inset 2px 0 0 var(--link, var(--link)), 0 0 12px color-mix(in srgb, var(--link) 12%, transparent)"
      : "none"};
  text-align: left;
  font-size: 12.5px;
  line-height: 1.4;
  color: ${({ $active, theme }) =>
    $active ? theme.brand.text : theme.brand.textMuted};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  cursor: pointer;
  transition:
    color ${({ theme }) => theme.brand.durationFast} ${({ theme }) =>
      theme.brand.ease},
    background ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease},
    border-color ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  &:hover {
    color: ${({ theme }) => theme.brand.text};
    background: ${({ theme, $active }) =>
      $active
        ? "linear-gradient(90deg, color-mix(in srgb, var(--link) 18%, transparent), color-mix(in srgb, var(--accent) 9%, transparent) 70%, transparent)"
        : theme.brand.surface2};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.brand.accentRing};
    outline-offset: 2px;
  }
`

export const OutlineIndex = styled.span<{ $active?: boolean }>`
  flex: 0 0 auto;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: ${({ $active, theme }) =>
    $active ? theme.brand.link : theme.brand.textFaint};
  text-shadow: ${({ $active }) =>
    $active ? "var(--glow-cy, 0 0 10px color-mix(in srgb, var(--link) 40%, transparent))" : "none"};
  transition: color 150ms ease, text-shadow 150ms ease;
`

export const OutlineText = styled.span`
  flex: 1 1 auto;
  min-width: 0;
`
