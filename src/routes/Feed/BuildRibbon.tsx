import React from "react"
import styled from "@emotion/styled"
import { keyframes } from "@emotion/react"
import { FEED_HEADER_HEIGHT_VAR } from "src/libs/utils/feedScrollOffset"

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
        <SourceLink
          href="https://github.com/jiwon-lieb/notion-blog"
          target="_blank"
          rel="noreferrer"
        >
          view source ↗
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
  top: var(${FEED_HEADER_HEIGHT_VAR}, 4.5rem);
  z-index: 39;
  border-bottom: 1px solid rgba(155, 108, 255, 0.22);
  background: linear-gradient(
    90deg,
    rgba(155, 108, 255, 0.16),
    rgba(8, 6, 17, 0.66) 42%,
    rgba(47, 230, 255, 0.08)
  );
  backdrop-filter: var(--glass-blur, blur(16px) saturate(140%));
  -webkit-backdrop-filter: var(--glass-blur, blur(16px) saturate(140%));
  box-shadow:
    0 1px 0 rgba(155, 108, 255, 0.18),
    0 6px 18px -10px rgba(155, 108, 255, 0.4);

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
  text-shadow: 0 0 10px rgba(155, 108, 255, 0.4);
`

const Sep = styled.span`
  color: rgba(255, 255, 255, 0.2);
`

const Tech = styled.span`
  color: var(--link, #2fe6ff);
`

const SourceLink = styled.a`
  color: var(--link, #2fe6ff);
  border-bottom: 1px solid rgba(47, 230, 255, 0.34);
  text-decoration: none;
  transition: text-shadow 0.15s;

  &:hover {
    text-shadow: var(--glow-cy, 0 0 10px rgba(47, 230, 255, 0.4));
  }
`
