import ThemeToggle from "./ThemeToggle"
import MotionToggle from "src/components/MotionToggle"
import LanguageToggle from "src/components/LanguageToggle"
import styled from "@emotion/styled"
import { zIndexes } from "src/styles/zIndexes"
import { variables } from "src/styles/variables"
import { feedHeaderProfileMinMedia } from "src/styles/feedBreakpoints"
import useLanguage from "src/hooks/useLanguage"
import React from "react"
import { CONFIG } from "site.config"
import AboutProfileTrigger from "src/components/AboutProfileTrigger"
import Logo from "./Logo"
import {
  AiFillLinkedin,
  AiOutlineMail,
  AiFillEdit,
  AiOutlineExport,
} from "react-icons/ai"

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
          <div className="contact">
            {CONFIG.profile.email ? (
              <a
                className="contactEmail"
                href={`mailto:${CONFIG.profile.email}`}
                rel="noreferrer"
              >
                <AiOutlineMail aria-hidden="true" />
                {CONFIG.profile.email}
              </a>
            ) : null}
            {CONFIG.profile.github ? (
              <a
                className="contactLink"
                href={`https://github.com/${CONFIG.profile.github}`}
                rel="noreferrer"
                target="_blank"
              >
                <AiOutlineExport aria-hidden="true" />
                github
              </a>
            ) : null}
            {CONFIG.profile.linkedin ? (
              <a
                className="contactLink"
                href={`https://www.linkedin.com/in/${CONFIG.profile.linkedin}`}
                rel="noreferrer"
                target="_blank"
              >
                <AiFillLinkedin aria-hidden="true" />
                linkedin
              </a>
            ) : null}
            {CONFIG.profile.blog ? (
              <a
                className="contactLink"
                href={`https://blog.naver.com/${CONFIG.profile.blog}`}
                rel="noreferrer"
                target="_blank"
              >
                <AiFillEdit aria-hidden="true" />
                blog
              </a>
            ) : null}
          </div>
          <LanguageToggle
            currentLanguage={currentLanguage}
            onLanguageChange={setLanguage}
          />
          <MotionToggle />
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
      gap: 0.35rem;
      align-items: center;
      flex: 0 1 auto;
      min-width: 0;
      justify-content: flex-end;
      overflow-x: auto;
      overflow-y: visible;
      scrollbar-width: thin;
      -webkit-overflow-scrolling: touch;

      & > * {
        flex-shrink: 0;
      }
      .contact {
        display: none;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        flex-wrap: nowrap;
        gap: 0.35rem 0.55rem;
        @media (min-width: 768px) {
          display: flex;
        }
      }
      .contactEmail {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.35rem;
        padding: 0.32rem 0.55rem 0.34rem;
        min-height: 1.75rem;
        line-height: 1.2;
        border-radius: 0.5rem;
        border: 1px solid ${({ theme }) => theme.brand.borderSoft};
        background: ${({ theme }) => theme.brand.surface2};
        font-size: 0.7rem;
        font-weight: 600;
        letter-spacing: 0.01em;
        text-transform: none;
        text-decoration: none;
        color: ${({ theme }) => theme.brand.text};
        flex: 0 1 auto;
        min-width: 0;
        max-width: min(20rem, 60vw);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
        transition:
          background ${({ theme }) => theme.brand.durationFast}
            ${({ theme }) => theme.brand.ease},
          border-color ${({ theme }) => theme.brand.durationFast}
            ${({ theme }) => theme.brand.ease};
        &:hover {
          background: ${({ theme }) => theme.brand.surface};
          border-color: ${({ theme }) => theme.brand.border};
        }
        &:focus-visible {
          outline: 2px solid ${({ theme }) => theme.brand.accentRing};
          outline-offset: 2px;
        }
        svg {
          flex-shrink: 0;
          width: 1rem;
          height: 1rem;
          display: block;
          overflow: visible;
        }
      }
      .contactLink {
        display: inline-flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: center;
        gap: 0.3rem;
        min-height: 1.65rem;
        line-height: 1;
        font-size: 0.75rem;
        font-weight: 500;
        letter-spacing: 0.02em;
        text-transform: lowercase;
        text-decoration: none;
        color: ${({ theme }) => theme.brand.textMuted};
        overflow: visible;
        transition: color ${({ theme }) => theme.brand.durationFast}
          ${({ theme }) => theme.brand.ease};
        &:hover {
          color: ${({ theme }) => theme.brand.text};
        }
        &:focus-visible {
          outline: 2px solid ${({ theme }) => theme.brand.accentRing};
          outline-offset: 2px;
        }
        svg {
          flex-shrink: 0;
          width: 1rem;
          height: 1rem;
          display: block;
          overflow: visible;
        }
      }
    }
  }
`
