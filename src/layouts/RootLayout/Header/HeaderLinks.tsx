import React from "react"
import styled from "@emotion/styled"
import { CONFIG } from "site.config"

const { email, github, linkedin } = CONFIG.profile

const HeaderLinks: React.FC = () => (
  <LinkRow>
    <PlainLink
      href={`https://github.com/${github}`}
      target="_blank"
      rel="noopener noreferrer"
      title="GitHub"
    >
      github ↗
    </PlainLink>
    <PlainLink
      href={`https://linkedin.com/in/${linkedin}`}
      target="_blank"
      rel="noopener noreferrer"
      title="LinkedIn"
    >
      linkedin ↗
    </PlainLink>
    <EmailPill href={`mailto:${email}`} title={email}>
      <span aria-hidden="true">✉</span>
      <span className="email-text">{email}</span>
    </EmailPill>
    <ResumePill href="/resume.pdf" download title="Download résumé">
      Résumé ↓
    </ResumePill>
  </LinkRow>
)

export default HeaderLinks

/* Whole row: visible from 400px up */
const LinkRow = styled.nav`
  display: none;

  @media (min-width: 400px) {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-mono, "JetBrains Mono", monospace);
    font-size: 12px;
    white-space: nowrap;
  }

  @media (min-width: 900px) {
    gap: 14px;
  }
`

/* github ↗ / linkedin ↗ — only at wide screens */
const PlainLink = styled.a`
  display: none;
  text-decoration: none;
  color: var(--text-faint, #9a93b8);
  transition: color 0.15s;

  &:hover {
    color: var(--link, #2fe6ff);
  }

  @media (min-width: 1100px) {
    display: inline;
  }
`

/* ✉ email pill — shows icon from 560px, full text from 1200px */
const EmailPill = styled.a`
  display: none;
  text-decoration: none;
  transition: background 0.15s, border-color 0.15s, box-shadow 0.15s, color 0.15s;

  .email-text {
    display: none;
  }

  @media (min-width: 560px) {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--link, #2fe6ff);
    border: 1px solid rgba(47, 230, 255, 0.34);
    border-radius: 9px;
    padding: 5px 11px;
  }

  @media (min-width: 1200px) {
    .email-text {
      display: inline;
    }
  }

  &:hover {
    background: rgba(47, 230, 255, 0.12);
    border-color: var(--link, #2fe6ff);
    box-shadow: 0 0 14px rgba(47, 230, 255, 0.32);
    color: var(--link, #2fe6ff);
  }
`

/* Résumé pill — always visible when LinkRow is visible (400px+) */
const ResumePill = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #dcccff;
  font-weight: 600;
  background: rgba(155, 108, 255, 0.16);
  border: 1px solid rgba(155, 108, 255, 0.5);
  border-radius: 9px;
  padding: 5px 12px;
  text-decoration: none;
  transition: background 0.15s, border-color 0.15s, box-shadow 0.15s, color 0.15s;

  &:hover {
    background: rgba(155, 108, 255, 0.28);
    border-color: var(--accent, #9b6cff);
    box-shadow: 0 0 18px rgba(155, 108, 255, 0.5);
    color: #fff;
  }
`
