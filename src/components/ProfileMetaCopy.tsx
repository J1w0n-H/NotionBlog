import Link from "next/link"
import React from "react"
import styled from "@emotion/styled"

type Props = {
  compact?: boolean
}

const ProfileMetaCopy: React.FC<Props> = ({ compact }) => {
  return (
    <Wrap data-compact={compact ? "true" : "false"}>
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
  min-width: 0;

  &[data-compact="true"] .cta {
    margin-top: 0.5rem;
  }

  .cta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.375rem;
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
