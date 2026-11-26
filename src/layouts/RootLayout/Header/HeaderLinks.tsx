import React from "react"
import styled from "@emotion/styled"
import { CONFIG } from "site.config"
import { FaGithub, FaLinkedin } from "react-icons/fa"

const { email, github, linkedin } = CONFIG.profile

const HeaderLinks: React.FC = () => (
  <LinkRow>
    <PlainLink
      href={`https://github.com/${github}`}
      target="_blank"
      rel="noopener noreferrer"
      title="GitHub"
      aria-label="GitHub"
    >
      <FaGithub className="icon" aria-hidden="true" />
      <span className="text">github ↗</span>
    </PlainLink>
    <PlainLink
      href={`https://linkedin.com/in/${linkedin}`}
      target="_blank"
      rel="noopener noreferrer"
      title="LinkedIn"
      aria-label="LinkedIn"
    >
      <FaLinkedin className="icon" aria-hidden="true" />
      <span className="text">linkedin ↗</span>
    </PlainLink>
    <EmailPill href={`mailto:${email}`} title={email}>
      <span aria-hidden="true">✉</span>
      <span className="email-text">{email}</span>
    </EmailPill>
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
    font-size: 0.75rem;
    white-space: nowrap;
  }

  @media (min-width: 900px) {
    gap: 14px;
  }
`

/* github / linkedin — icon on narrow screens, "github ↗" text from 1100px */
const PlainLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  min-height: 32px;
  text-decoration: none;
  color: var(--text-faint, #9a93b8);
  transition: color 0.15s;

  .icon {
    width: 18px;
    height: 18px;
  }
  .text {
    display: none;
  }

  &:hover {
    color: var(--link);
  }

  @media (min-width: 1100px) {
    min-width: 0;
    .icon {
      display: none;
    }
    .text {
      display: inline;
    }
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
    color: var(--link);
    border: 1px solid color-mix(in srgb, var(--link) 34%, transparent);
    border-radius: var(--radius-md);
    padding: 5px 11px;
  }

  @media (min-width: 1200px) {
    .email-text {
      display: inline;
    }
  }

  &:hover {
    background: color-mix(in srgb, var(--link) 12%, transparent);
    border-color: var(--link);
    box-shadow: 0 0 14px color-mix(in srgb, var(--link) 32%, transparent);
    color: var(--link);
  }
`

