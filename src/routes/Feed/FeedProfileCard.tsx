import React from "react"
import styled from "@emotion/styled"
import { keyframes } from "@emotion/react"
import Link from "next/link"
import { CONFIG } from "site.config"
import { ABOUT_SLUG } from "src/constants"

function renderBoldMarkdown(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/).map((chunk, i) => {
    if (chunk.startsWith("**") && chunk.endsWith("**")) {
      return <strong key={i}>{chunk.slice(2, -2)}</strong>
    }
    return chunk
  })
}

const FeedProfileCard: React.FC = () => {
  const { profile, hero } = CONFIG

  return (
    <IdentityBand>
      <IdMain>
        <Kicker>
          <KickerPrompt aria-hidden="true">$</KickerPrompt>
          {" whoami"}
          <Cursor aria-hidden="true" />
        </Kicker>
        <IdName>{profile.name}</IdName>
        <Tagline>
          {hero.tagline.map((phrase, i) => (
            <React.Fragment key={phrase}>
              {i > 0 && <TaglineSep aria-hidden="true">/</TaglineSep>}
              <strong>{phrase}</strong>
            </React.Fragment>
          ))}
        </Tagline>
        <Description>{renderBoldMarkdown(hero.description)}</Description>
      </IdMain>

      <IdSide>
        <KStats>
          {hero.stats.map((s) => (
            <KStat key={s.lbl}>
              <KStatVal>{s.val}</KStatVal>
              <KStatLbl>{s.lbl}</KStatLbl>
            </KStat>
          ))}
        </KStats>
        <AboutThru
          href={`/${ABOUT_SLUG}`}
          scroll={false}
          aria-label="Read the full story in About"
        >
          <AboutEye>the full story</AboutEye>
          <AboutText>
            About{" "}
            <AboutArrow aria-hidden="true">→</AboutArrow>
          </AboutText>
        </AboutThru>
      </IdSide>
    </IdentityBand>
  )
}

export default FeedProfileCard

/* ── Animations ──────────────────────────────────────────────────────────── */

const blink = keyframes`
  0%, 49% { opacity: 1 }
  50%, 100% { opacity: 0 }
`

const nameSlide = keyframes`
  0% { background-position: 0% 50% }
  100% { background-position: 100% 50% }
`

const awPulse = keyframes`
  0%, 100% { opacity: 0.46; transform: scale(1) }
  50% { opacity: 0.72; transform: scale(1.06) }
`

/* ── Root band ───────────────────────────────────────────────────────────── */

const IdentityBand = styled.section`
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border-soft, rgba(255, 255, 255, 0.08));
  border-radius: 18px;
  background:
    radial-gradient(620px 320px at 6% -20%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 60%),
    radial-gradient(520px 300px at 100% 120%, color-mix(in srgb, var(--link) 10%, transparent), transparent 58%),
    var(--glass-1);
  backdrop-filter: var(--glass-blur, blur(16px) saturate(140%));
  -webkit-backdrop-filter: var(--glass-blur, blur(16px) saturate(140%));
  box-shadow: var(--glass-edge, inset 0 1px 0 rgba(255, 255, 255, 0.08));
  padding: 1.625rem 1.75rem;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 2.25rem;
  align-items: stretch;

  &::before {
    content: "";
    position: absolute;
    inset: 0 0 auto 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.22), transparent);
    opacity: 0.7;
    pointer-events: none;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1.375rem;
  }

  @media (prefers-reduced-motion: reduce) {
    &::before { display: none; }
  }
`

/* ── Left column ─────────────────────────────────────────────────────────── */

const IdMain = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

/* ── Kicker: $ whoami▌ ───────────────────────────────────────────────────── */

const Kicker = styled.p`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.brand.textFaint};
  margin-bottom: 1.125rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const KickerPrompt = styled.span`
  color: var(--signal, ${({ theme }) => theme.brand.signal});
`

const Cursor = styled.span`
  display: inline-block;
  width: 7px;
  height: 14px;
  background: var(--link, ${({ theme }) => theme.brand.link});
  box-shadow: var(--glow-cy);
  border-radius: 1px;
  animation: ${blink} 1.05s steps(1) infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

/* ── Name ────────────────────────────────────────────────────────────────── */

const IdName = styled.h1`
  font-weight: 800;
  font-size: clamp(2.375rem, 5.4vw, 3.75rem);
  line-height: 1.04;
  letter-spacing: -0.035em;
  margin-bottom: 1rem;
  background: linear-gradient(104deg, var(--link, #2fe6ff) 0%, var(--accent, #9b6cff) 50%, var(--signal, #ff5cd0) 100%);
  background-size: 220% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: ${nameSlide} 9s ease-in-out alternate infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    background-position: 0% 50%;
  }
`

/* ── Tagline ─────────────────────────────────────────────────────────────── */

const Tagline = styled.p`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.84375rem;
  color: ${({ theme }) => theme.brand.textFaint};
  margin-bottom: 1.375rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex-wrap: wrap;

  strong {
    color: ${({ theme }) => theme.brand.text};
    font-weight: 500;
  }
`

const TaglineSep = styled.span`
  color: var(--accent, ${({ theme }) => theme.brand.accent});
`

/* ── Description ─────────────────────────────────────────────────────────── */

const Description = styled.p`
  font-size: 0.9375rem;
  line-height: 1.78;
  color: ${({ theme }) => theme.brand.textMuted};
  max-width: 62ch;
  margin-bottom: 0;

  strong {
    color: ${({ theme }) => theme.brand.text};
    font-weight: 600;
  }
`

/* ── Right column ────────────────────────────────────────────────────────── */

const IdSide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  text-align: right;
  border-left: 1px solid ${({ theme }) => theme.brand.borderSoft};
  padding-left: 1.875rem;
  min-width: 172px;

  @media (max-width: 640px) {
    border-left: 0;
    border-top: 1px solid ${({ theme }) => theme.brand.borderSoft};
    padding-left: 0;
    padding-top: 1.25rem;
    align-items: flex-start;
    text-align: left;
  }
`

const KStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.0625rem;
  margin-bottom: 0.5rem;

  @media (max-width: 640px) {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1.25rem;
  }
`

const KStat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;

  @media (max-width: 640px) {
    align-items: flex-start;
  }
`

const KStatVal = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-weight: 600;
  font-size: 1.3125rem;
  color: ${({ theme }) => theme.brand.text};
  text-shadow: var(--glow-sm);
  line-height: 1;
`

const KStatLbl = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.625rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.textFaint};
  line-height: 1;
`

/* ── About thru-link ─────────────────────────────────────────────────────── */

const AboutThru = styled(Link)`
  position: relative;
  margin-top: 1.25rem;
  padding-top: 1.125rem;
  border-top: 1px solid ${({ theme }) => theme.brand.borderSoft};
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
  text-decoration: none;
  transition: filter 0.3s;
  width: 100%;

  &::before {
    content: "";
    position: absolute;
    right: -34px;
    bottom: -20px;
    width: 260px;
    height: 170px;
    z-index: -1;
    pointer-events: none;
    background: radial-gradient(
      closest-side,
      color-mix(in srgb, var(--accent) 55%, transparent),
      color-mix(in srgb, var(--signal) 28%, transparent) 50%,
      transparent 76%
    );
    filter: blur(34px);
    opacity: 0.5;
    animation: ${awPulse} 4.2s ease-in-out infinite;

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }
  }

  &:hover {
    filter: brightness(1.18);
  }

  &:hover ${() => AboutArrow} {
    transform: translateX(5px);
  }

  @media (max-width: 640px) {
    align-items: flex-start;
    margin-top: 1.125rem;
    padding-top: 1rem;
  }
`

const AboutEye = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.625rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.textFaint};
  text-shadow: var(--glow-sm);
`

const AboutText = styled.span`
  font-size: 1.0625rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: #fff;
  text-shadow: 0 0 18px color-mix(in srgb, var(--signal) 60%, transparent);
`

const AboutArrow = styled.span`
  display: inline-block;
  margin-left: 4px;
  transition: transform 0.2s;
`
