import React from "react"
import styled from "@emotion/styled"
import { keyframes } from "@emotion/react"
const BuildRibbon: React.FC = () => {
  return (
    <Ribbon>
      <Inner>
        <GreenDot aria-hidden="true" />
        <Prompt aria-hidden="true">$</Prompt>
        <Bold>I designed &amp; built this site</Bold>
        <Sep aria-hidden="true">—</Sep>
        <Tech>Next.js</Tech>
        <Sep aria-hidden="true">·</Sep>
        <Tech>Notion API</Tech>
        <Sep aria-hidden="true">·</Sep>
        <Tech>self-hosted</Tech>
        <Sep aria-hidden="true">·</Sep>
        <SourceLink href="https://j1w0n.vercel.app/JW-285" target="_blank" rel="noreferrer">
          view post ↗
        </SourceLink>
      </Inner>
    </Ribbon>
  )
}

export default BuildRibbon

/* ── Animations ──────────────────────────────────────────────────────────── */

const bbPulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1) }
  50% { opacity: 0.5; transform: scale(0.82) }
`

/* ── Styled components ───────────────────────────────────────────────────── */

const Ribbon = styled.div`
  position: sticky;
  top: var(--feed-header-height, 4.5rem);
  z-index: 39;
  width: 100%;
  border-bottom: 1px solid color-mix(in srgb, var(--accent) 22%, transparent);
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--accent) 16%, transparent),
    color-mix(in srgb, var(--bg) 66%, transparent) 42%,
    color-mix(in srgb, var(--link) 8%, transparent)
  );
  backdrop-filter: var(--glass-blur, blur(16px) saturate(140%));
  -webkit-backdrop-filter: var(--glass-blur, blur(16px) saturate(140%));
  box-shadow:
    0 1px 0 color-mix(in srgb, var(--accent) 18%, transparent),
    0 6px 18px -10px color-mix(in srgb, var(--accent) 40%, transparent);

  @media (prefers-reduced-motion: reduce) {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
`

const Inner = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  padding: 9px 22px;
  display: flex;
  align-items: center;
  gap: 9px;
  flex-wrap: wrap;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 12px;
  letter-spacing: 0.02em;
  color: ${({ theme }) => theme.brand.textFaint};
`

const GreenDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #46e08a;
  box-shadow: 0 0 9px rgba(70, 224, 138, 0.8);
  flex: none;
  animation: ${bbPulse} 2.4s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

const Prompt = styled.span`
  color: var(--signal, #ff5cd0);
`

const Bold = styled.b`
  color: ${({ theme }) => theme.brand.text};
  font-weight: 700;
  text-shadow: var(--glow-sm, 0 0 10px color-mix(in srgb, var(--accent) 40%, transparent));
`

const Sep = styled.span`
  color: rgba(255, 255, 255, 0.2);
`

const Tech = styled.span`
  color: var(--link, #2fe6ff);
`

const SourceLink = styled.a`
  color: var(--link, #2fe6ff);
  border-bottom: 1px solid color-mix(in srgb, var(--link) 34%, transparent);
  text-decoration: none;
  transition: text-shadow 0.15s;

  &:hover {
    text-shadow: var(--glow-cy);
  }
`
