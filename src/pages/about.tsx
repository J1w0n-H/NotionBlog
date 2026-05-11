import Link from "next/link"
import React from "react"
import styled from "@emotion/styled"
import { CONFIG } from "../../site.config"
import MetaConfig from "src/components/MetaConfig"
import { NextPageWithLayout } from "../types"

type ProfileExt = typeof CONFIG.profile & {
  intro?: string
  currentFocus?: string
  exploring?: string
  availability?: string
}

const AboutPage: NextPageWithLayout = () => {
  const p = CONFIG.profile as ProfileExt
  const lead = p.intro?.trim() || p.bio
  const url = `${String(CONFIG.link).replace(/\/$/, "")}/about`

  return (
    <>
      <MetaConfig
        title={`About — ${CONFIG.blog.title}`}
        description={lead}
        type="website"
        url={url}
      />
      <Shell>
        <h1>About</h1>
        <p className="lead">{lead}</p>
        {p.intro?.trim() ? <p className="tagline">{p.bio}</p> : null}
        {p.currentFocus?.trim() ? <p className="meta">{p.currentFocus}</p> : null}
        {p.exploring?.trim() ? <p className="meta">{p.exploring}</p> : null}
        {p.availability?.trim() ? (
          <p className="meta strong">{p.availability}</p>
        ) : null}
        <nav className="actions" aria-label="About page actions">
          <Link href="/" className="btn primary">
            Read posts
          </Link>
          {p.github ? (
            <a
              className="btn ghost"
              href={`https://github.com/${p.github}`}
              rel="noreferrer"
              target="_blank"
            >
              GitHub
            </a>
          ) : null}
        </nav>
      </Shell>
    </>
  )
}

export default AboutPage

const Shell = styled.main`
  max-width: 42rem;
  margin: 0 auto;
  padding: 2rem 1rem 4rem;

  h1 {
    margin: 0 0 1rem;
    font-size: 1.75rem;
    font-weight: 800;
    color: ${({ theme }) => theme.brand.text};
  }

  .lead {
    margin: 0 0 0.75rem;
    font-size: 1.0625rem;
    line-height: 1.55;
    color: ${({ theme }) => theme.brand.text};
  }

  .tagline {
    margin: 0 0 1rem;
    font-size: 0.875rem;
    line-height: 1.45;
    color: ${({ theme }) => theme.brand.textMuted};
  }

  .meta {
    margin: 0.35rem 0 0;
    font-size: 0.8125rem;
    line-height: 1.45;
    color: ${({ theme }) => theme.brand.textFaint};
    &.strong {
      color: ${({ theme }) => theme.brand.textMuted};
      font-weight: 600;
    }
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1.75rem;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.45rem 0.9rem;
    border-radius: 999px;
    font-size: 0.8125rem;
    font-weight: 600;
    text-decoration: none;
    border: 1px solid transparent;
    transition: background 0.12s ease, border-color 0.12s ease, color 0.12s ease;
    &.primary {
      background: ${({ theme }) => theme.brand.accent};
      color: ${({ theme }) => theme.brand.textOnAccent};
      border-color: ${({ theme }) => theme.brand.accent};
      &:hover {
        background: ${({ theme }) => theme.brand.accentHover};
        border-color: ${({ theme }) => theme.brand.accentHover};
      }
    }
    &.ghost {
      background: ${({ theme }) => theme.brand.surface};
      color: ${({ theme }) => theme.brand.link};
      border-color: ${({ theme }) => theme.brand.border};
      &:hover {
        background: ${({ theme }) => theme.brand.surface2};
      }
    }
  }
`
