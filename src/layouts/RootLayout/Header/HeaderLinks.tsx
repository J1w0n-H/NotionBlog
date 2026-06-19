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
    color: var(--link, var(--link));
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
    color: var(--link, var(--link));
    border: 1px solid color-mix(in srgb, var(--link) 34%, transparent);
    border-radius: 9px;
    padding: 5px 11px;
  }

  @media (min-width: 1200px) {
    .email-text {
      display: inline;
    }
  }

  &:hover {
    background: color-mix(in srgb, var(--link) 12%, transparent);
    border-color: var(--link, var(--link));
    box-shadow: 0 0 14px color-mix(in srgb, var(--link) 32%, transparent);
    color: var(--link, var(--link));
  }
`

/* Résumé pill — always visible when LinkRow is visible (400px+) */
const ResumePill = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #dcccff;
  font-weight: 600;
  background: color-mix(in srgb, var(--accent) 16%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent) 50%, transparent);
  border-radius: 9px;
  padding: 5px 12px;
  text-decoration: none;
  transition: background 0.15s, border-color 0.15s, box-shadow 0.15s, color 0.15s;

  &:hover {
    background: color-mix(in srgb, var(--accent) 28%, transparent);
    border-color: var(--accent, var(--accent));
    box-shadow: 0 0 18px color-mix(in srgb, var(--accent) 50%, transparent);
    color: #fff;
  }
`
