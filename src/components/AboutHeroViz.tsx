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
const tickerRoll = keyframes`
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
`

const KEYWORDS = [
  "reverse-engineering", "cloud-security", "penetration-testing",
  "kubernetes", "malware-analysis", "network-forensics", "ctf",
  "zero-trust", "terraform", "incident-response", "devsecops",
]

const AboutHeroViz: React.FC = () => {
  const { profile } = CONFIG
  const [firstName, ...rest] = profile.name.split(" ")
  const lastName = rest.join(" ")
  const tickerItems = [...KEYWORDS, ...KEYWORDS]

  return (
    <Root>
      <NebA /><NebB /><NebC />
      <Stars />

      <Inner>
        <NameBlock>
          <GradLine $delay="0s">{firstName}</GradLine>
          <GradLine $delay="1.5s">
            {lastName}<Cursor aria-hidden="true" />
          </GradLine>
        </NameBlock>

        <RoleLine>
          <Slash aria-hidden="true">/</Slash>
          {profile.role}&nbsp;·&nbsp;M.Eng UMD&nbsp;·&nbsp;2026
        </RoleLine>

        <Statement>
          <Stmt $c="#ff7da0" $g="#ff4d6b">Built it.</Stmt>
          <StmtSep aria-hidden="true">·</StmtSep>
          <Stmt $c="#c97aff" $g="#b14cff">Broke it.</Stmt>
          <StmtSep aria-hidden="true">·</StmtSep>
          <Stmt $c="#ffadd0" $g="#ff8acc">Knows why.</Stmt>
        </Statement>

        <MetaStrip>
          <MCell><MVal>4</MVal><MLbl>yrs exp</MLbl></MCell>
          <MDivider />
          <MCell><MVal>200+</MVal><MLbl>HPC/GPU nodes</MLbl></MCell>
          <MDivider />
          <MCell><MVal>4×</MVal><MLbl>audits, 0 failures</MLbl></MCell>
        </MetaStrip>
      </Inner>

      <Ticker>
        <TickerTrack>
          {tickerItems.map((w, i) => (
            <TWord
              key={i}
              $c={i % 11 === 0 ? "brand" : i % 11 === 3 ? "violet" : i % 11 === 6 ? "pink" : "dim"}
            >
              {w}
            </TWord>
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
  min-height: 300px;
  isolation: isolate;
  overflow: hidden;
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.10);
  margin-bottom: 1.25rem;
  background: linear-gradient(160deg, #0a0612 0%, #170a26 100%);
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
  background: oklch(0.55 0.24 320 / 0.16);
  filter: blur(90px);
  animation: ${nebulaA} 18s ease-in-out infinite;
`
const NebB = styled.div`
  position: absolute; border-radius: 50%; pointer-events: none; will-change: transform;
  width: 560px; height: 380px; bottom: 40px; right: -100px;
  background: oklch(0.62 0.26 340 / 0.13);
  filter: blur(85px);
  animation: ${nebulaB} 22s ease-in-out infinite;
`
const NebC = styled.div`
  position: absolute; border-radius: 50%; pointer-events: none; will-change: transform;
  width: 420px; height: 320px; top: 38%; left: 52%;
  background: oklch(0.42 0.18 265 / 0.13);
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
  padding: 44px max(32px, 4vw) 36px;
`

const NameBlock = styled.div`
  display: flex; flex-direction: column; align-items: flex-start;
  line-height: 0.88; margin-bottom: 1rem;
`
const GradLine = styled.span<{ $delay: string }>`
  display: block;
  font-family: var(--font-display);
  font-size: clamp(56px, 9vw, 96px);
  font-weight: 600;
  letter-spacing: -0.05em;
  line-height: 0.96;
  padding-block: 0.06em 0.02em;
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
  animation-delay: ${({ $delay }) => $delay};
`
const Cursor = styled.span`
  display: inline-block;
  width: 3px; height: 0.78em; border-radius: 2px;
  background: oklch(0.80 0.22 320);
  box-shadow: 0 0 10px oklch(0.80 0.22 320 / 0.9);
  margin-left: 0.06em; vertical-align: middle;
  animation: ${cursorBlink} 1s steps(1) infinite;
`

const RoleLine = styled.div`
  display: inline-flex; align-items: center; gap: 0.4rem;
  font-family: var(--font-mono);
  font-size: clamp(0.6875rem, 1.1vw, 0.875rem);
  font-weight: 500; letter-spacing: 0.04em;
  color: #c9b9e8;
  margin-bottom: 1.25rem;
`
const Slash = styled.span`
  color: oklch(0.80 0.22 320); font-weight: 700;
`

const Statement = styled.div`
  display: flex; flex-direction: row; align-items: center;
  flex-wrap: wrap; gap: 14px; margin-bottom: 1.75rem;
`
const Stmt = styled.span<{ $c: string; $g: string }>`
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: ${({ $c }) => $c};
  text-shadow: 0 0 14px ${({ $g }) => $g}66;
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
  color: #7c6c95;
`
/* ── Ticker ───────────────────────────────────────────────────────────── */

const Ticker = styled.div`
  position: relative; z-index: 2;
  width: 100%; overflow: hidden;
  border-top: 1px solid oklch(1 0 0 / 0.08);
  padding: 0.5rem 0;
`
const TickerTrack = styled.div`
  display: flex; align-items: center; gap: 2.5rem;
  width: max-content;
  animation: ${tickerRoll} 42s linear infinite;
  will-change: transform;
`
const TWord = styled.span<{ $c: "brand" | "violet" | "pink" | "dim" }>`
  font-family: var(--font-mono);
  font-size: 0.6875rem; font-weight: 600;
  letter-spacing: 0.12em; text-transform: uppercase; white-space: nowrap;
  color: ${({ $c }) =>
    $c === "brand"  ? "oklch(0.80 0.22 320)"
    : $c === "violet" ? "#b14cff"
    : $c === "pink"   ? "#ff8acc"
    : "#7c6c95"};
`
