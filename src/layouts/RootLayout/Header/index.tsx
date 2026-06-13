import ThemeToggle from "./ThemeToggle"
import LanguageToggle from "src/components/LanguageToggle"
import HeaderLinks from "./HeaderLinks"
import styled from "@emotion/styled"
import { zIndexes } from "src/styles/zIndexes"
import useLanguage from "src/hooks/useLanguage"
import React from "react"
import AboutProfileTrigger from "src/components/AboutProfileTrigger"

const Header: React.FC = () => {
  const [currentLanguage, setLanguage] = useLanguage()

  return (
    <StyledWrapper data-header>
      <Container>
        <Left>
          <AboutProfileTrigger />
        </Left>
        <Nav>
          <HeaderLinks />
          {/* Language toggle disappears first when width shrinks */}
          <HideLg>
            <LanguageToggle
              currentLanguage={currentLanguage}
              onLanguageChange={setLanguage}
            />
          </HideLg>
          {/* Theme toggle disappears last */}
          <HideSm>
            <ThemeToggle />
          </HideSm>
        </Nav>
      </Container>
    </StyledWrapper>
  )
}

export default Header

const StyledWrapper = styled.div`
  z-index: ${zIndexes.header};
  position: sticky;
  top: 0;
  isolation: isolate;
  background: var(--glass-1, ${({ theme }) => theme.brand.surface});
  backdrop-filter: var(--glass-blur, none);
  -webkit-backdrop-filter: var(--glass-blur, none);
  box-shadow: var(--glass-edge, ${({ theme }) => theme.brand.shadowSm}),
    0 1px 0 ${({ theme }) => theme.brand.borderSoft};
  border-bottom: 1px solid ${({ theme }) => theme.brand.borderSoft};
`

const Container = styled.div`
  display: flex;
  padding: 0 1rem;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1240px;
  min-height: 56px;
  margin: 0 auto;
  min-width: 0;
  gap: 0.5rem;
`

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  flex-shrink: 1;
`

const Nav = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 0.5rem;
  align-items: center;
  flex-shrink: 0;
  min-width: 0;
  justify-content: flex-end;

  & > * {
    flex-shrink: 0;
  }
`

/* Language toggle hidden below 720px */
const HideLg = styled.div`
  display: contents;

  @media (max-width: 719px) {
    display: none;
  }
`

/* Theme toggle hidden below 480px */
const HideSm = styled.div`
  display: contents;

  @media (max-width: 479px) {
    display: none;
  }
`
