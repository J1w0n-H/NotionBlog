import styled from "@emotion/styled"

export const DesktopSlugLayout = styled.div`
  display: none;

  @media (min-width: 1024px) {
    display: block;
  }
`

export const MobileSlugLayout = styled.div`
  @media (min-width: 1024px) {
    display: none;
  }
`
