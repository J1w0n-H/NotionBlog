import styled from "@emotion/styled"

/** Feed side panel: outer column for post reading chrome. */
export const SideScrollLayout = styled.div`
  --post-scroll-pad-x: 1.25rem;
  display: flex;
  flex-direction: column;
  min-height: 0;
`

/** Main + optional TOC column; `lg` becomes two-column when aside exists. */
export const BodyGrid = styled.div<{ $hasAside: boolean }>`
  display: grid;
  gap: 1.5rem;
  min-width: 0;

  @media (min-width: 1024px) {
    grid-template-columns: ${({ $hasAside }) =>
      $hasAside ? "minmax(0, 1fr) minmax(0, 280px)" : "minmax(0, 1fr)"};
    align-items: ${({ $hasAside }) => ($hasAside ? "stretch" : "start")};
  }
`

export const MainCol = styled.div`
  min-width: 0;
`

export const AsideCol = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: stretch;

  @media (min-width: 1024px) {
    align-self: start;
    min-height: 0;
  }
`

/** Flex shell for sticky outline; avoid overflow clipping that breaks sticky. */
export const AsideOutlineMount = styled.div`
  flex: 0 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
`
