import React from "react"
import styled from "@emotion/styled"
import { keyframes } from "@emotion/react"
import Link from "next/link"
import { CONFIG } from "site.config"
import { ABOUT_SLUG } from "src/constants"

const PROOF_STATS = [
  { val: "4 yrs", lbl: "Infra / ops" },
  { val: "200+", lbl: "HPC nodes" },
  { val: "ISMS-P", lbl: "Certified" },
]

const FeedProfileCard: React.FC = () => {
  const { profile } = CONFIG

  return (
    <IdentityBand>
      <Kicker>
        <KickerPrompt aria-hidden="true">$</KickerPrompt>
        {" whoami"}
        <Cursor aria-hidden="true" />
      </Kicker>
      <IdName>{profile.name}</IdName>
      <Tagline>
        <strong>Built it.</strong>
        <TaglineSep aria-hidden="true">/</TaglineSep>
        <strong>Broke it.</strong>
        <TaglineSep aria-hidden="true">/</TaglineSep>
        <strong>Mastered why.</strong>
      </Tagline>
      <Description>
        Ran a <strong>200-node cluster</strong> for four years, then came to
        Maryland to learn the attacker&apos;s side — now researching{" "}
        <strong>cloud, LLM &amp; GitOps security</strong>.
      </Description>
      <ProofRow>
        <ProofBar>
          {PROOF_STATS.map((s) => (
            <ProofCell key={s.lbl}>
              <ProofVal>{s.val}</ProofVal>
              <ProofLbl>{s.lbl}</ProofLbl>
            </ProofCell>
          ))}
        </ProofBar>
      </ProofRow>
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
    radial-gradient(620px 320px at 6% -20%, rgba(155, 108, 255, 0.22), transparent 60%),
    radial-gradient(520px 300px at 100% 120%, rgba(47, 230, 255, 0.10), transparent 58%),
    var(--glass-1, rgba(20, 16, 38, 0.44));
  backdrop-filter: var(--glass-blur, blur(16px) saturate(140%));
  -webkit-backdrop-filter: var(--glass-blur, blur(16px) saturate(140%));
  box-shadow: var(--glass-edge, inset 0 1px 0 rgba(255, 255, 255, 0.08));
  padding: 1.625rem 1.75rem;
  margin-bottom: 0;

  /* top scan line */
  &::before {
    content: "";
    position: absolute;
    inset: 0 0 auto 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.22), transparent);
    opacity: 0.7;
    pointer-events: none;
  }

  @media (prefers-reduced-motion: reduce) {
    &::before {
      display: none;
    }
  }
`

/* ── Kicker: $ whoami▌ ───────────────────────────────────────────────────── */

const Kicker = styled.p`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.brand.textFaint};
  margin-bottom: 0.625rem;
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
  box-shadow: var(--glow-cy, 0 0 10px rgba(47, 230, 255, 0.4));
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
  line-height: 0.98;
  letter-spacing: -0.035em;
  margin-bottom: 0.625rem;
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
  margin-bottom: 1rem;
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
  line-height: 1.6;
  color: ${({ theme }) => theme.brand.textMuted};
  max-width: 62ch;
  margin-bottom: 1.125rem;

  strong {
    color: ${({ theme }) => theme.brand.text};
    font-weight: 600;
  }
`

/* ── Proof metrics ───────────────────────────────────────────────────────── */

const ProofRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem 1.125rem;
  flex-wrap: wrap;
`

const ProofBar = styled.div`
  display: flex;
  border: 1px solid var(--border-soft, rgba(255, 255, 255, 0.08));
  border-radius: 11px;
  overflow: hidden;
  background: rgba(8, 6, 17, 0.3);
`

const ProofCell = styled.div`
  padding: 0.5625rem 1rem;
  border-right: 1px solid var(--border-soft, rgba(255, 255, 255, 0.08));
  display: flex;
  flex-direction: column;
  gap: 2px;

  &:last-child {
    border-right: 0;
  }
`

const ProofVal = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-weight: 600;
  font-size: 1rem;
  color: ${({ theme }) => theme.brand.text};
  line-height: 1;
`

const ProofLbl = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.5625rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.textFaint};
  line-height: 1;
`

/* ── About thru-link ─────────────────────────────────────────────────────── */

const AboutThru = styled(Link)`
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 4;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
  padding: 3.375rem 1.75rem 1.375rem 5.25rem;
  text-decoration: none;
  transition: filter 0.3s;

  &::before {
    content: "";
    position: absolute;
    right: -30px;
    bottom: -34px;
    width: 300px;
    height: 210px;
    z-index: -1;
    pointer-events: none;
    background: radial-gradient(
      closest-side,
      rgba(155, 108, 255, 0.6),
      rgba(255, 92, 208, 0.3) 50%,
      transparent 76%
    );
    filter: blur(34px);
    opacity: 0.55;
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
`

const AboutEye = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.625rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.textFaint};
  text-shadow: 0 0 10px rgba(155, 108, 255, 0.4);
`

const AboutText = styled.span`
  font-size: 1.0625rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: #fff;
  text-shadow: 0 0 18px rgba(255, 92, 208, 0.6);
`

const AboutArrow = styled.span`
  display: inline-block;
  margin-left: 4px;
  transition: transform 0.2s;
`
