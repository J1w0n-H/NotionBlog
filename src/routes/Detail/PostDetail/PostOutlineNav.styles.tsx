import styled from "@emotion/styled"
import {
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
      : outlineAsideDockedLgCss(theme, $layout === "side" ? "side" : "modal")}
`

export const AsideInner = styled.div`
  display: flex;
  flex-direction: column;
  max-height: inherit;
  min-height: 0;
`

export const AsideHead = styled.div`
  flex: 0 0 auto;
  padding-bottom: 0.5rem;
  margin-bottom: 0.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.brand.borderSoft};
  background: ${({ theme }) => theme.brand.surface};
`

export const AsideScroll = styled.div`
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
  padding: 0;
  list-style: none;
`

export const OutlineButton = styled.button<{ $depth: 2 | 3; $active: boolean }>`
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

export const OutlineIndex = styled.span`
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

export const OutlineText = styled.span`
  flex: 1 1 auto;
  min-width: 0;
`
