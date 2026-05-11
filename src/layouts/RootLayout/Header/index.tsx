import ThemeToggle from "./ThemeToggle"
import MoodToggle from "src/components/ThemeToggle"
import LanguageToggle from "src/components/LanguageToggle"
import styled from "@emotion/styled"
import { zIndexes } from "src/styles/zIndexes"
import { variables } from "src/styles/variables"
import useLanguage from "src/hooks/useLanguage"
import Image from "next/image"
import React from "react"
import { CONFIG } from "site.config"
import Link from "next/link"
import {
  AiFillLinkedin,
  AiOutlineGithub,
  AiOutlineMail,
  AiFillEdit,
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
          <Link href="/" className="profile" aria-label="Home">
            <div className="avatar">
              <Image
                src={CONFIG.profile.image}
                alt={CONFIG.profile.name}
                fill
                sizes="56px"
                priority
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="meta">
              <div className="line1">
                <span className="name">{CONFIG.blog.title}</span>
                <span className="dot">·</span>
                <span className="role">{CONFIG.profile.role}</span>
              </div>
              <div className="bio">{CONFIG.profile.bio}</div>
            </div>
          </Link>
        </div>
        <div className="nav">
          <div className="quick">
            {CONFIG.profile.blog && (
              <a
                className="btn"
                href={`https://blog.naver.com/${CONFIG.profile.blog}`}
                rel="noreferrer"
                target="_blank"
                aria-label="Blog"
                title="Blog"
              >
                <AiFillEdit />
              </a>
            )}
            {CONFIG.profile.github && (
              <a
                className="btn"
                href={`https://github.com/${CONFIG.profile.github}`}
                rel="noreferrer"
                target="_blank"
                aria-label="GitHub"
                title="GitHub"
              >
                <AiOutlineGithub />
              </a>
            )}
            {CONFIG.profile.email && (
              <a
                className="btn"
                href={`mailto:${CONFIG.profile.email}`}
                rel="noreferrer"
                target="_blank"
                aria-label="Email"
                title="Email"
              >
                <AiOutlineMail />
              </a>
            )}
            {CONFIG.profile.linkedin && (
              <a
                className="btn"
                href={`https://www.linkedin.com/in/${CONFIG.profile.linkedin}`}
                rel="noreferrer"
                target="_blank"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <AiFillLinkedin />
              </a>
            )}
          </div>
          <LanguageToggle
            currentLanguage={currentLanguage}
            onLanguageChange={setLanguage}
          />
          <MoodToggle />
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
  background-color: ${({ theme }) => theme.brand.surface};
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid ${({ theme }) => theme.brand.borderSoft};

  .container {
    display: flex;
    padding-left: 1rem;
    padding-right: 1rem;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: ${variables.widthFeed}px;
    min-height: 5.25rem;
    margin: 0 auto;
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
      flex-direction: column;
      align-items: flex-start;
      gap: 0.375rem;
      min-width: 0;
    }
    .profile {
      display: none;
      align-items: center;
      gap: 0.75rem;
      min-width: 0;
      text-decoration: none;
      border-radius: 999px;
      @media (min-width: 768px) {
        display: flex;
      }
      &:hover .name {
        text-decoration: underline;
        text-decoration-thickness: 2px;
        text-underline-offset: 3px;
      }
      .avatar {
        position: relative;
        width: 56px;
        height: 56px;
        border-radius: 999px;
        overflow: hidden;
        border: 1px solid ${({ theme }) => theme.brand.borderSoft};
        background: ${({ theme }) => theme.brand.surface2};
        flex: 0 0 auto;
      }
      .meta {
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
        min-width: 0;
      }
      .line1 {
        display: flex;
        align-items: baseline;
        gap: 0.5rem;
        min-width: 0;
      }
      .name {
        font-weight: 800;
        color: ${({ theme }) => theme.brand.text};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 240px;
      }
      .dot {
        color: ${({ theme }) => theme.brand.textFaint};
      }
      .role {
        font-size: 0.875rem;
        color: ${({ theme }) => theme.brand.textMuted};
        white-space: nowrap;
      }
      .bio {
        font-size: 0.8125rem;
        color: ${({ theme }) => theme.brand.textFaint};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 420px;
      }
    }
    .nav {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      .quick {
        display: none;
        gap: 0.375rem;
        @media (min-width: 768px) {
          display: flex;
        }
      }
      .btn {
        width: 34px;
        height: 34px;
        border-radius: 10px;
        display: grid;
        place-items: center;
        border: 1px solid ${({ theme }) => theme.brand.borderSoft};
        background: ${({ theme }) => theme.brand.surface};
        color: ${({ theme }) => theme.brand.textMuted};
        transition: all 0.15s ease;
        &:hover {
          background: ${({ theme }) => theme.brand.surface2};
          color: ${({ theme }) => theme.brand.text};
        }
        svg {
          width: 18px;
          height: 18px;
        }
      }
    }
  }
`
