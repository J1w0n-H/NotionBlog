import styled from "@emotion/styled"

import { POST_OUTLINE_FLOAT_WIDTH } from "src/libs/utils/postOutlineAsideLayout"

/** Feed side panel: outer column for post reading chrome. */
export const SideScrollLayout = styled.div`
  --post-scroll-pad-x: 1.25rem;
  display: flex;
  flex-direction: column;
  min-height: 0;
`

/** Main + optional TOC: at `lg`, TOC floats in the right gutter (`--post-outline-gutter`); text stays clear. */
export const BodyGrid = styled.div<{ $hasAside: boolean }>`
  display: grid;
  gap: 1.5rem;
  min-width: 0;
  grid-template-columns: minmax(0, 1fr);

  @media (min-width: 1024px) {
    ${({ $hasAside }) =>
      $hasAside
        ? `
      display: flex;
      flex-direction: row;
      align-items: stretch;
      gap: 0;
      --post-outline-gutter: calc(${POST_OUTLINE_FLOAT_WIDTH} + 1rem);
    `
        : `
      align-items: start;
    `}
  }
`

export const MainCol = styled.div`
  min-width: 0;

  @media (min-width: 1024px) {
    flex: 1 1 auto;
    padding-inline-end: var(--post-outline-gutter, 0);
  }
`

export const AsideCol = styled.div<{ $floatOnLg?: boolean }>`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: stretch;
  min-height: 0;

  ${({ $floatOnLg }) =>
    $floatOnLg &&
    `
    @media (min-width: 1024px) {
      flex: 0 0 0;
      width: 0;
      min-width: 0;
      overflow: visible;
      position: relative;
      z-index: 2;
    }
  `}
`

/** Fills the aside column height so `position: sticky` on the outline spans the article. */
export const AsideOutlineMount = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: visible;
  position: relative;
  z-index: 1;
  pointer-events: auto;
`

/**
 * About drawer: main + optional TOC under `@container about-drawer`
 * (ancestor sets `container-name: about-drawer`).
 */
export const AboutDrawerBodyGrid = styled.div<{ $hasAside: boolean }>`
  display: grid;
  gap: 1.25rem;
  min-width: 0;
  align-items: start;

  @container about-drawer (min-width: 380px) {
    grid-template-columns: ${({ $hasAside }) =>
      $hasAside ? "minmax(0, 1fr) minmax(0, 11rem)" : "minmax(0, 1fr)"};
  }
`
