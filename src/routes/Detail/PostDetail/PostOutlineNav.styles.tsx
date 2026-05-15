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
  overflow: hidden;
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
`

export const AsideHead = styled.div`
  flex: 0 0 auto;
  padding: 0 0.35rem 0.5rem 0.5rem;
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

export const OutlineButton = styled.button<{ $depth: 2 | 3; $active: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 0.45rem;
  width: 100%;
  margin: 0;
  padding: 0.4rem 0.35rem 0.4rem ${({ $depth }) => ($depth === 3 ? "0.75rem" : "0.35rem")};
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
  min-width: 1.45rem;
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
