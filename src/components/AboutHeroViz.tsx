import React from "react"
import styled from "@emotion/styled"
import { keyframes } from "@emotion/react"
import { CONFIG } from "site.config"

const nameSlide = keyframes`
  0%   { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`
const cursorBlink = keyframes`
  0%, 49.9% { opacity: 1; }
  50%, 100%  { opacity: 0; }
`

const nebulaA = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%  { transform: translate(40px, -25px) scale(1.06); }
  66%  { transform: translate(-20px, 30px) scale(0.96); }
`
const nebulaB = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  40%  { transform: translate(-30px, 35px) scale(1.05); }
  70%  { transform: translate(25px, -20px) scale(0.97); }
`
const nebulaC = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  30%  { transform: translate(25px, 18px) scale(1.04); }
  60%  { transform: translate(-35px, -25px) scale(1.07); }
`
const starTwinkle = keyframes`
  0%, 100% { opacity: 0.65; }
  50%       { opacity: 0.15; }
`
const KEYWORDS = [
  "large-scale HPC",
  "offensive cloud security",
  "binary exploitation",
  "supply chain security",
  "detection engineering",
]

const AboutHeroViz: React.FC = () => {
  const { profile } = CONFIG

  return (
    <Root>
      <NebA /><NebB /><NebC />
      <Stars />

      <Inner>
        <RoleLine>
          <Slash aria-hidden="true">/</Slash>
          {profile.role}&nbsp;·&nbsp;M.Eng UMD&nbsp;·&nbsp;2026
        </RoleLine>

        <NameBlock>
          <GradLine>
            {profile.name.split(" ").map((word, i, arr) =>
              i < arr.length - 1 ? (
                <span key={i} className="name-word">{word}</span>
              ) : (
                <span key={i} className="name-word">{word}<Cursor aria-hidden="true" /></span>
              )
            )}
          </GradLine>
          <NameAccent />
        </NameBlock>

        <Statement>
          <Stmt>Built it.</Stmt>
          <StmtSep aria-hidden="true">·</StmtSep>
          <Stmt>Broke it.</Stmt>
          <StmtSep aria-hidden="true">·</StmtSep>
          <Stmt>Mastered why.</Stmt>
        </Statement>

        <MetaStrip>
          <MCell><MVal>200+</MVal><MLbl>HPC/Cloud nodes</MLbl></MCell>
          <MDivider />
          <MCell><MVal>0 Major</MVal><MLbl>Compliance NCs</MLbl></MCell>
          <MDivider />
          <MCell><MVal>517</MVal><MLbl>OSS Bug cases</MLbl></MCell>
        </MetaStrip>
      </Inner>

      <Ticker>
        <TickerTrack>
          {KEYWORDS.map((w, i) => (
            <TWord key={i}>{w}</TWord>
          ))}
        </TickerTrack>
      </Ticker>
    </Root>
  )
}

export default AboutHeroViz

/* ── Root ─────────────────────────────────────────────────────────────── */

const Root = styled.div`
  position: relative;
  width: 100%;
  min-height: 220px;
  isolation: isolate;
  overflow: hidden;
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.10);
  margin-bottom: 1.25rem;
  background:
    radial-gradient(760px 420px at 8% -10%,  rgba(155,108,255,.18), transparent 60%),
    radial-gradient(620px 420px at 98% 120%, rgba(255, 92,208,.12), transparent 55%),
    radial-gradient(520px 360px at 60%  50%, rgba( 47,230,255,.07), transparent 60%),
    linear-gradient(160deg, #080611 0%, #130b22 100%);
  box-shadow: var(--glass-edge, none), var(--glass-shadow, 0 10px 34px rgba(5, 3, 15, 0.5));
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  /* top shimmer line */
  &::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.22), transparent);
    opacity: 0.75;
    z-index: 3;
    pointer-events: none;
  }

  /* diagonal gloss sweep */
  &::after {
    content: '';
    position: absolute;
    top: -40%; left: -10%;
    width: 55%; height: 180%;
    background: linear-gradient(75deg, transparent, rgba(255,255,255,.05) 45%, transparent 60%);
    transform: rotate(8deg);
    pointer-events: none;
    z-index: 1;
  }
`

/* ── Nebulae ──────────────────────────────────────────────────────────── */

const NebA = styled.div`
  position: absolute; border-radius: 50%; pointer-events: none; will-change: transform;
  width: 700px; height: 450px; top: -120px; left: -120px;
  background: rgba(155,108,255,.11);
  filter: blur(90px);
  animation: ${nebulaA} 18s ease-in-out infinite;
`
const NebB = styled.div`
  position: absolute; border-radius: 50%; pointer-events: none; will-change: transform;
  width: 560px; height: 380px; bottom: 40px; right: -100px;
  background: rgba(255,92,208,.08);
  filter: blur(85px);
  animation: ${nebulaB} 22s ease-in-out infinite;
`
const NebC = styled.div`
  position: absolute; border-radius: 50%; pointer-events: none; will-change: transform;
  width: 420px; height: 320px; top: 38%; left: 52%;
  background: rgba(47,230,255,.06);
  filter: blur(80px);
  animation: ${nebulaC} 26s ease-in-out infinite;
`

/* ── Starfield ────────────────────────────────────────────────────────── */

const Stars = styled.div`
  position: absolute; inset: 0; pointer-events: none;
  animation: ${starTwinkle} 6s ease-in-out infinite;
  background-image:
    radial-gradient(circle 1.5px at 12% 18%, #fff, transparent),
    radial-gradient(circle 1px  at 28% 42%, #fff, transparent),
    radial-gradient(circle 2px  at 47% 8%,  #fff, transparent),
    radial-gradient(circle 1px  at 63% 31%, #fff, transparent),
    radial-gradient(circle 1.5px at 78% 55%, #fff, transparent),
    radial-gradient(circle 1px  at 91% 14%, #fff, transparent),
    radial-gradient(circle 1.5px at 5%  68%, #fff, transparent),
    radial-gradient(circle 1px  at 35% 77%, #fff, transparent),
    radial-gradient(circle 2px  at 55% 60%, #fff, transparent),
    radial-gradient(circle 1px  at 82% 82%, #fff, transparent),
    radial-gradient(circle 1.5px at 20% 92%, #fff, transparent),
    radial-gradient(circle 1px  at 70% 5%,  #fff, transparent);
  opacity: 0.65;
`

/* ── Content ──────────────────────────────────────────────────────────── */

const Inner = styled.div`
  position: relative; z-index: 2;
  flex: 1;
  display: flex; flex-direction: column; align-items: flex-start; text-align: left;
  width: 100%;
  padding: 22px max(28px, 3.5vw) 18px;
`

const NameBlock = styled.div`
  display: flex; flex-direction: column; align-items: flex-start;
  line-height: 1; margin-bottom: 0.75rem;
`
const GradLine = styled.span`
  display: block;
  font-family: var(--font-display);
  font-size: clamp(54px, 7vw, 88px);
  font-weight: 700;
  letter-spacing: -0.05em;
  line-height: 1;
  padding-block: 0.03em 0.02em;

  .name-word {
    display: block;
  }

  /* restrained (default): solid */
  color: #f1eefb;

  /* full: animated rainbow */
  html[data-motion="full"] & {
    background: linear-gradient(
      100deg,
      #fff 0%, #ffd6e2 18%, #ff6a8a 36%, #b14cff 56%, #4be0ff 78%, #fff 100%
    );
    background-size: 220% 100%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
    animation: ${nameSlide} 9s ease-in-out alternate infinite;
  }

  /* zero: same as restrained */
  html[data-motion="zero"] & {
    color: #f1eefb;
  }
`
const NameAccent = styled.div`
  width: 3.5rem;
  height: 4px;
  background: oklch(0.68 0.22 300);
  border-radius: 2px;
  margin-top: 0.625rem;
  margin-bottom: 0.125rem;
`

const Cursor = styled.span`
  /* always blink (restrained + full) */
  display: inline-block;
  width: 3px; height: 0.72em; border-radius: 2px;
  background: oklch(0.80 0.22 320);
  margin-left: 0.08em; vertical-align: middle;
  animation: ${cursorBlink} 1s steps(1) infinite;

  /* zero: hidden */
  html[data-motion="zero"] & {
    display: none;
  }
`

const RoleLine = styled.div`
  display: inline-flex; align-items: center; gap: 0.4rem;
  font-family: var(--font-mono);
  font-size: clamp(0.6875rem, 1.1vw, 0.875rem);
  font-weight: 500; letter-spacing: 0.04em;
  color: #42e8ff;
  margin-bottom: 0.75rem;
`
const Slash = styled.span`
  color: oklch(0.80 0.22 320); font-weight: 700;
`

const Statement = styled.div`
  display: flex; flex-direction: row; align-items: center;
  flex-wrap: wrap; gap: 14px; margin-bottom: 1.125rem;
`
const Stmt = styled.span`
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: #cdcae0;
`
const StmtSep = styled.span`
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: #9b6cff;
  flex-shrink: 0;
  opacity: 0.7;
`

/* ── Meta strip ───────────────────────────────────────────────────────── */

const MetaStrip = styled.div`
  display: inline-flex; align-items: stretch;
  background: oklch(1 0 0 / 0.04);
  border: 1px solid oklch(1 0 0 / 0.12);
  border-radius: 16px;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  overflow: hidden;
`
const MCell = styled.div`
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 0.2rem; padding: 0.875rem 1.5rem;
`
const MDivider = styled.div`
  width: 1px; background: oklch(1 0 0 / 0.10);
  align-self: stretch; margin: 0.5rem 0;
`
const MVal = styled.span`
  font-family: var(--font-display);
  font-size: 22px; font-weight: 600;
  color: #f4f0ff; line-height: 1;
`
const MLbl = styled.span`
  font-family: var(--font-mono);
  font-size: 10px; font-weight: 500;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: #a8a1c6;
`
/* ── Ticker ───────────────────────────────────────────────────────────── */

const Ticker = styled.div`
  position: relative; z-index: 2;
  width: 100%;
  border-top: 1px solid oklch(1 0 0 / 0.08);
  padding: 0.5rem 0.75rem;

  html[data-motion="zero"] & {
    display: none;
  }
`
const TickerTrack = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
`
const TWord = styled.span`
  font-family: var(--font-mono);
  font-size: 0.6875rem; font-weight: 500;
  letter-spacing: 0.1em; text-transform: uppercase; white-space: nowrap;
  color: ${({ theme }: any) => theme.brand.textFaint};
  border: 1px solid oklch(1 0 0 / 0.14);
  border-radius: 6px;
  padding: 0.2rem 0.5rem;
  background: oklch(1 0 0 / 0.04);
`
