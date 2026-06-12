import ThemeToggle from "./ThemeToggle"
import LanguageToggle from "src/components/LanguageToggle"
import styled from "@emotion/styled"
import { zIndexes } from "src/styles/zIndexes"
import { variables } from "src/styles/variables"
import useLanguage from "src/hooks/useLanguage"
import React from "react"
import { CONFIG } from "site.config"
import AboutProfileTrigger from "src/components/AboutProfileTrigger"
import Logo from "./Logo"
import { AiOutlineMail } from "react-icons/ai"

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
          <div className="mobileLogo">
            <Logo />
          </div>
          <AboutProfileTrigger variant="header" />
        </div>
        <div className="nav">
          {CONFIG.profile.email ? (
            <a
              className="emailCyan"
              href={`mailto:${CONFIG.profile.email}`}
              rel="noreferrer"
            >
              <AiOutlineMail aria-hidden="true" />
              {CONFIG.profile.email}
            </a>
          ) : null}
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
    .mobileLogo {
      display: none;
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

      .emailCyan {
        display: none;
        @media (min-width: 640px) {
          display: inline-flex;
        }
        align-items: center;
        gap: 6px;
        padding: 0.4375rem 0.8125rem;
        border-radius: 9px;
        border: 1px solid rgba(47, 230, 255, 0.34);
        background: transparent;
        color: var(--link, #2fe6ff);
        font-family: ${({ theme }) => theme.brand.fontMono};
        font-size: 0.75rem;
        font-weight: 500;
        letter-spacing: 0.02em;
        text-decoration: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: min(18rem, 40vw);
        transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;

        svg {
          flex-shrink: 0;
          width: 0.9375rem;
          height: 0.9375rem;
        }

        &:hover {
          background: rgba(47, 230, 255, 0.10);
          border-color: var(--link, #2fe6ff);
          box-shadow: 0 0 14px rgba(47, 230, 255, 0.28);
        }

        &:focus-visible {
          outline: 2px solid rgba(47, 230, 255, 0.55);
          outline-offset: 2px;
        }
      }
    }
  }
`
