import React, { useEffect, useRef } from "react"
import styled from "@emotion/styled"
import { keyframes } from "@emotion/react"

/* ── Keyframes ────────────────────────────────────────────────────────────── */

const shieldFloat = keyframes`
  0%, 100% { transform: translateY(0px) rotate(-1.5deg); }
  50%       { transform: translateY(-14px) rotate(1.5deg); }
`

const layerFloat = keyframes`
  0%, 100% {
    transform: translateX(-50%) rotateX(62deg) rotateZ(-14deg) translateY(0px);
  }
  50% {
    transform: translateX(-50%) rotateX(62deg) rotateZ(-14deg) translateY(-9px);
  }
`

const orbitCW = keyframes`
  from { transform: rotate(0deg) translateX(40px) rotate(0deg); }
  to   { transform: rotate(360deg) translateX(40px) rotate(-360deg); }
`

const orbitCCW = keyframes`
  from { transform: rotate(190deg) translateX(30px) rotate(-190deg); }
  to   { transform: rotate(550deg) translateX(30px) rotate(-550deg); }
`

const innerPulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.85; }
  50%       { transform: scale(1.06); opacity: 1; }
`

const gridDrift = keyframes`
  0%   { transform: translate(0px, 0px); }
  25%  { transform: translate(3px, 1px); }
  50%  { transform: translate(0px, 3px); }
  75%  { transform: translate(-3px, 1px); }
  100% { transform: translate(0px, 0px); }
`

/* ── SVG topology ─────────────────────────────────────────────────────────── */

const TopoSVG: React.FC = () => (
  <TopoSvgEl
    viewBox="0 0 400 280"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    <defs>
      <path id="av-p1" d="M 35 55 L 155 115 L 275 72" />
      <path id="av-p2" d="M 275 72 L 365 155 L 205 215 L 155 115" />
      <path id="av-p3" d="M 35 55 L 205 215" />
    </defs>

    {/* Edges */}
    <line x1="35" y1="55" x2="155" y2="115" className="tl" />
    <line x1="155" y1="115" x2="275" y2="72" className="tl" />
    <line x1="155" y1="115" x2="205" y2="215" className="tl" />
    <line x1="275" y1="72" x2="365" y2="155" className="tl" />
    <line x1="205" y1="215" x2="365" y2="155" className="tl" />
    <line x1="35" y1="55" x2="205" y2="215" className="tl tl--faint" />

    {/* Nodes */}
    <circle cx="35" cy="55" r="3.5" className="tn" />
    <circle cx="155" cy="115" r="5" className="tn tn--primary" />
    <circle cx="275" cy="72" r="3.5" className="tn" />
    <circle cx="205" cy="215" r="3.5" className="tn" />
    <circle cx="365" cy="155" r="3.5" className="tn" />

    {/* Packet 1 */}
    <circle r="3" className="tp tp--accent">
      <animateMotion dur="4.2s" repeatCount="indefinite" begin="0s">
        <mpath href="#av-p1" />
      </animateMotion>
      <animate
        attributeName="opacity"
        values="0;1;1;0"
        keyTimes="0;0.1;0.88;1"
        dur="4.2s"
        repeatCount="indefinite"
        begin="0s"
      />
    </circle>

    {/* Packet 2 */}
    <circle r="2.5" className="tp tp--link">
      <animateMotion dur="6s" repeatCount="indefinite" begin="1.8s">
        <mpath href="#av-p2" />
      </animateMotion>
      <animate
        attributeName="opacity"
        values="0;1;1;0"
        keyTimes="0;0.08;0.9;1"
        dur="6s"
        repeatCount="indefinite"
        begin="1.8s"
      />
    </circle>

    {/* Packet 3 */}
    <circle r="2" className="tp tp--signal">
      <animateMotion dur="7.5s" repeatCount="indefinite" begin="3.5s">
        <mpath href="#av-p3" />
      </animateMotion>
      <animate
        attributeName="opacity"
        values="0;1;1;0"
        keyTimes="0;0.06;0.92;1"
        dur="7.5s"
        repeatCount="indefinite"
        begin="3.5s"
      />
    </circle>
  </TopoSvgEl>
)

/* ── Component ────────────────────────────────────────────────────────────── */

const AboutHeroViz: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.matchMedia("(hover: none)").matches) return

    let tX = 0, tY = 0
    let cX = 0, cY = 0
    let raf: number

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const tick = () => {
      cX = lerp(cX, tX, 0.055)
      cY = lerp(cY, tY, 0.055)

      if (sceneRef.current) {
        sceneRef.current.style.transform =
          `rotateY(${cX * 9}deg) rotateX(${cY * -9}deg)`
      }
      if (gridRef.current) {
        gridRef.current.style.transform =
          `translate(${cX * 5}px, ${cY * 5}px)`
      }

      raf = requestAnimationFrame(tick)
    }

    const onMove = (e: MouseEvent) => {
      const r = rootRef.current?.getBoundingClientRect()
      if (!r) return
      tX = (e.clientX - r.left - r.width / 2) / (r.width / 2)
      tY = (e.clientY - r.top - r.height / 2) / (r.height / 2)
    }
    const onLeave = () => { tX = 0; tY = 0 }

    const el = rootRef.current
    el?.addEventListener("mousemove", onMove)
    el?.addEventListener("mouseleave", onLeave)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      el?.removeEventListener("mousemove", onMove)
      el?.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  return (
    <Root ref={rootRef}>
      <BgGrid ref={gridRef} />
      <TopoSVG />

      <Inner>
        {/* Left: system domain labels */}
        <LeftPane>
          <DomainList>
            <DomainRow>
              <DomainDot $hue="accent" />
              <DomainLabel>Security Engineering</DomainLabel>
            </DomainRow>
            <DomainRow>
              <DomainDot $hue="link" />
              <DomainLabel>Cloud Infrastructure</DomainLabel>
            </DomainRow>
            <DomainRow>
              <DomainDot $hue="signal" />
              <DomainLabel>Systems Operations</DomainLabel>
            </DomainRow>
          </DomainList>
          <CornerBadge>UMD · 2026</CornerBadge>
        </LeftPane>

        {/* Right: shield visualization */}
        <RightPane>
          <Perspective>
            <Scene ref={sceneRef}>

              <Layer $index={3}>
                <LayerLabel>INFRASTRUCTURE</LayerLabel>
              </Layer>
              <Layer $index={2}>
                <LayerLabel>NETWORK</LayerLabel>
              </Layer>
              <Layer $index={1}>
                <LayerLabel>APPLICATION</LayerLabel>
              </Layer>

              <ShieldWrap>
                <ShieldClip aria-hidden="true">
                  <ShieldInner>⬡</ShieldInner>
                </ShieldClip>
              </ShieldWrap>

              <OrbDot $which="cw" />
              <OrbDot $which="ccw" />

            </Scene>
          </Perspective>
        </RightPane>
      </Inner>
    </Root>
  )
}

export default AboutHeroViz

/* ── Styled components ────────────────────────────────────────────────────── */

const Root = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  margin-bottom: 1.25rem;

  background:
    radial-gradient(circle at 75% 40%, oklch(0.52 0.19 22 / 0.06), transparent 38%),
    radial-gradient(circle at 25% 70%, oklch(0.42 0.14 252 / 0.06), transparent 32%),
    ${({ theme }) => theme.brand.bg};

  @media (max-width: 600px) {
    height: 240px;
  }
`

const BgGrid = styled.div`
  position: absolute;
  inset: -8px;
  background-image:
    linear-gradient(${({ theme }) => theme.brand.border} 1px, transparent 1px),
    linear-gradient(90deg, ${({ theme }) => theme.brand.border} 1px, transparent 1px);
  background-size: 48px 48px;
  opacity: 0.35;
  mask-image: radial-gradient(ellipse at center, black 30%, transparent 80%);
  animation: ${gridDrift} 28s ease-in-out infinite;
  will-change: transform;
`

const TopoSvgEl = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;

  .tl {
    stroke: ${({ theme }) => theme.brand.border};
    stroke-width: 1;
    opacity: 0.5;
  }
  .tl--faint {
    opacity: 0.22;
    stroke-dasharray: 4 6;
  }
  .tn {
    fill: ${({ theme }) => theme.brand.border};
    opacity: 0.65;
  }
  .tn--primary {
    fill: ${({ theme }) => theme.brand.accent};
    opacity: 0.5;
    r: 5;
  }
  .tp {
    opacity: 0;
  }
  .tp--accent { fill: ${({ theme }) => theme.brand.accent}; }
  .tp--link   { fill: ${({ theme }) => theme.brand.link}; }
  .tp--signal { fill: ${({ theme }) => theme.brand.signal}; }
`

const Inner = styled.div`
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100%;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`

/* ── Left pane ── */

const LeftPane = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1.75rem 1rem 1.75rem 1.5rem;
  gap: 1rem;

  @media (max-width: 520px) {
    display: none;
  }
`

const DomainList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
`

const DomainRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.55rem;
`

const DomainDot = styled.span<{ $hue: "accent" | "link" | "signal" }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${({ theme, $hue }) =>
    $hue === "accent" ? theme.brand.accent
    : $hue === "link" ? theme.brand.link
    : theme.brand.signal};
`

const DomainLabel = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.brand.textMuted};
`

const CornerBadge = styled.span`
  align-self: flex-start;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.textFaint};
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  border-radius: var(--radius-pill);
  padding: 0.2rem 0.6rem;
`

/* ── Right pane (visualization) ── */

const RightPane = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 520px) {
    grid-column: 1;
  }
`

const Perspective = styled.div`
  width: min(44vw, 340px);
  aspect-ratio: 1;
  perspective: 700px;
  perspective-origin: center center;

  @media (max-width: 520px) {
    width: min(70vw, 260px);
  }
`

const Scene = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  will-change: transform;
`

/* ── Glass layers ── */

const Layer = styled.div<{ $index: 1 | 2 | 3 }>`
  position: absolute;
  width: 90%;
  height: 20%;
  left: 50%;
  top: ${({ $index }) =>
    $index === 1 ? "22%" : $index === 2 ? "42%" : "62%"};

  transform: translateX(-50%) rotateX(62deg) rotateZ(-14deg);
  transform-style: preserve-3d;

  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.18),
    rgba(255, 255, 255, 0.04)
  );
  backdrop-filter: blur(8px);

  animation: ${layerFloat} ${({ $index }) =>
    $index === 1 ? "6s" : $index === 2 ? "7s" : "8s"} ease-in-out infinite;
  animation-delay: ${({ $index }) =>
    $index === 1 ? "0s" : $index === 2 ? "0.9s" : "1.8s"};

  display: flex;
  align-items: center;
  padding-left: 1rem;
`

const LayerLabel = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.5rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.textFaint};
  opacity: 0.7;
`

/* ── Shield ── */

const ShieldWrap = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${shieldFloat} 5s ease-in-out infinite;
`

const ShieldClip = styled.div`
  width: 50%;
  aspect-ratio: 0.87;

  /* clip-path clips borders; use drop-shadow on the parent for the glow */
  clip-path: polygon(50% 0%, 90% 18%, 82% 76%, 50% 100%, 18% 76%, 10% 18%);

  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.35),
    rgba(255, 255, 255, 0.08)
  );
  /* Thin inner stroke via outline won't survive clip-path either;
     use a subtle inset gradient to simulate the edge. */
  background-image: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.35) 0%,
    rgba(255, 255, 255, 0.08) 100%
  );

  display: flex;
  align-items: center;
  justify-content: center;

  backdrop-filter: blur(16px);

  /* drop-shadow survives clip-path */
  filter:
    drop-shadow(0 8px 28px oklch(0.42 0.14 252 / 0.18))
    drop-shadow(0 0 1px oklch(0.42 0.14 252 / 0.45));
`

const ShieldInner = styled.span`
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  line-height: 1;
  animation: ${innerPulse} 3.5s ease-in-out infinite;
  user-select: none;
`

/* ── Orbs ── */

const OrbDot = styled.div<{ $which: "cw" | "ccw" }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${({ $which }) => ($which === "cw" ? "8px" : "6px")};
  height: ${({ $which }) => ($which === "cw" ? "8px" : "6px")};
  border-radius: 50%;
  margin-top: ${({ $which }) => ($which === "cw" ? "-4px" : "-3px")};
  margin-left: ${({ $which }) => ($which === "cw" ? "-4px" : "-3px")};
  background: ${({ theme, $which }) =>
    $which === "cw" ? theme.brand.link : theme.brand.accent};
  opacity: 0.65;
  filter: blur(0.5px);

  animation: ${({ $which }) => ($which === "cw" ? orbitCW : orbitCCW)}
    ${({ $which }) => ($which === "cw" ? "13s" : "17s")} linear infinite;

  will-change: transform;
`
