import ThemeToggle from "./ThemeToggle"
import LanguageToggle from "src/components/LanguageToggle"
import styled from "@emotion/styled"
import { zIndexes } from "src/styles/zIndexes"
import { variables } from "src/styles/variables"
import useLanguage from "src/hooks/useLanguage"
import React from "react"
import AboutProfileTrigger from "src/components/AboutProfileTrigger"

type Props = {
  fullWidth: boolean
  wide?: boolean
}

const Header: React.FC<Props> = ({ fullWidth, wide = false }) => {
  const [currentLanguage, setLanguage] = useLanguage()

  return (
    <StyledWrapper data-header>
      <div data-full-width={fullWidth} data-wide={wide} className="container">
        <div className="left">
          <AboutProfileTrigger />
        </div>
        <div className="nav">
          <LanguageToggle
            currentLanguage={currentLanguage}
            onLanguageChange={setLanguage}
          />
          <ThemeToggle />
        </div>
      </div>
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

  .container {
    display: flex;
    padding-left: 1rem;
    padding-right: 1rem;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: ${variables.widthFeed}px;
    min-height: 4.5rem; /* 72px — v2 slim */
    margin: 0 auto;
    min-width: 0;
    &[data-wide="true"] {
      max-width: none;
      padding-left: 0.75rem;
      padding-right: 0.75rem;
    }
    &[data-full-width="true"] {
      @media (min-width: 768px) {
        padding-left: 6rem;
        padding-right: 6rem;
      }
    }
    .left {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.5rem;
      min-width: 0;
    }
    .nav {
      display: flex;
      flex-wrap: nowrap;
      gap: 0.5rem;
      align-items: center;
      flex: 0 1 auto;
      min-width: 0;
      justify-content: flex-end;

      & > * {
        flex-shrink: 0;
      }
    }
  }
`
