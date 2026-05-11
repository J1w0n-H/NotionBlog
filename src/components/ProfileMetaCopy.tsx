import Link from "next/link"
import React from "react"
import styled from "@emotion/styled"
import { CONFIG } from "site.config"

type ProfileExt = typeof CONFIG.profile & {
  intro?: string
  currentFocus?: string
  exploring?: string
  availability?: string
}

type Props = {
  /** 모바일 카드처럼 좁을 때 약간 줄인 간격 */
  compact?: boolean
}

const ProfileMetaCopy: React.FC<Props> = ({ compact }) => {
  const p = CONFIG.profile as ProfileExt
  const intro = p.intro?.trim()
  const lead = intro && intro.length > 0 ? intro : p.bio
  const tagline = intro && intro.length > 0 ? p.bio : null

  return (
    <Wrap data-compact={compact ? "true" : "false"}>
      <p className="lead">{lead}</p>
      {tagline ? <p className="tagline">{tagline}</p> : null}
      {p.currentFocus?.trim() ? (
        <p className="status">{p.currentFocus.trim()}</p>
      ) : null}
      {p.exploring?.trim() ? (
        <p className="status">{p.exploring.trim()}</p>
      ) : null}
      {p.availability?.trim() ? (
        <p className="status accent">{p.availability.trim()}</p>
      ) : null}
      <div className="cta" role="navigation" aria-label="Primary actions">
        <Link href="/" className="btn primary">
          Read posts
        </Link>
        <Link href="/about" className="btn ghost">
          About
        </Link>
      </div>
    </Wrap>
  )
}

export default ProfileMetaCopy

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
  margin-top: 0.125rem;

  &[data-compact="true"] {
    gap: 0.2rem;
    margin-top: 0;
    .cta {
      margin-top: 0.5rem;
    }
  }

  .lead {
    margin: 0;
    font-size: 0.8125rem;
    line-height: 1.45;
    font-weight: 600;
    color: ${({ theme }) => theme.brand.text};
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;

    @media (min-width: 900px) {
      font-size: 0.875rem;
      -webkit-line-clamp: 2;
    }
  }

  &[data-compact="true"] .lead {
    font-size: 0.875rem;
    line-height: 1.5;
    -webkit-line-clamp: 4;
    font-weight: 600;
  }

  .tagline {
    margin: 0.125rem 0 0;
    font-size: 0.75rem;
    line-height: 1.35;
    font-weight: 500;
    letter-spacing: 0.02em;
    color: ${({ theme }) => theme.brand.textMuted};
  }

  .status {
    margin: 0.15rem 0 0;
    font-size: 0.6875rem;
    line-height: 1.35;
    color: ${({ theme }) => theme.brand.textFaint};
    &.accent {
      color: ${({ theme }) => theme.brand.textMuted};
      font-weight: 600;
    }
  }

  .cta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.35rem 0.75rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 600;
    text-decoration: none;
    transition: background 0.12s ease, border-color 0.12s ease, color 0.12s ease,
      box-shadow 0.12s ease;
    border: 1px solid transparent;
    &.primary {
      background: ${({ theme }) => theme.brand.accent};
      color: ${({ theme }) => theme.brand.textOnAccent};
      border-color: ${({ theme }) => theme.brand.accent};
      box-shadow: 0 1px 2px oklch(0 0 0 / 0.08);
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
        border-color: ${({ theme }) => theme.brand.borderStrong};
      }
    }
  }
`
