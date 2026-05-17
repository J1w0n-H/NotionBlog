import React, { useEffect, useRef } from "react"
import styled from "@emotion/styled"
import { keyframes } from "@emotion/react"
import { CONFIG } from "site.config"

/* ── Architecture layer data ─────────────────────────────────────────────── */

interface ArchLayerDef {
  label: string
  tags: readonly string[]
  annotation: string
  status: "signal" | "link" | "accent"
  pulseDur: string
  pulseDelay: string
}

const LAYERS: ArchLayerDef[] = [
  {
    label: "SYSTEMS",
    tags: ["linux", "vmware", "slurm"],
    annotation: "600+ nodes",
    status: "signal",
    pulseDur: "3.8s",
    pulseDelay: "0s",
  },
  {
    label: "NETWORK",
    tags: ["vlan", "vpn", "100g-ib"],
    annotation: "encrypted",
    status: "link",
    pulseDur: "4.4s",
    pulseDelay: "0.6s",
  },
  {
    label: "CLOUD",
    tags: ["aws", "azure", "m365"],
    annotation: "multi-cloud",
    status: "accent",
    pulseDur: "3.2s",
    pulseDelay: "1.2s",
  },
  {
    label: "CONTAINERS",
    tags: ["k8s", "docker", "argocd"],
    annotation: "GitOps",
    status: "signal",
    pulseDur: "4.8s",
    pulseDelay: "1.8s",
  },
  {
    label: "MONITORING",
    tags: ["prometheus", "grafana", "nessus"],
    annotation: "4yr · 85%↑",
    status: "link",
    pulseDur: "5.1s",
    pulseDelay: "2.4s",
  },
  {
    label: "SCRIPTING",
    tags: ["python", "bash", "pwsh"],
    annotation: "automation",
    status: "signal",
    pulseDur: "3.6s",
    pulseDelay: "3.0s",
  },
  {
    label: "COMPLIANCE",
    tags: ["isms-p", "iso27k", "gclp"],
    annotation: "audited",
    status: "accent",
    pulseDur: "4.2s",
    pulseDelay: "3.6s",
  },
]

/* ── Keyframes ───────────────────────────────────────────────────────────── */

const gridDrift = keyframes`
  0%   { transform: translate(0px, 0px); }
  33%  { transform: translate(4px, 2px); }
  66%  { transform: translate(1px, 5px); }
  100% { transform: translate(0px, 0px); }
`

const pulseTravel = keyframes`
  0%         { left: 0%;              opacity: 0; }
  4%         { opacity: 1; }
  94%        { opacity: 0.9; }
  100%       { left: calc(100% - 5px); opacity: 0; }
`

const statusBeat = keyframes`
  0%, 75%, 100% { opacity: 1; }
  82%           { opacity: 0.2; }
`

const nodeGlow = keyframes`
  0%, 100% { opacity: 0.45; r: 3.5; }
  50%      { opacity: 0.85; r: 4.5; }
`

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`

/* ── Topology SVG ────────────────────────────────────────────────────────── */

const TopoSVG: React.FC = () => (
  <TopoSvgEl viewBox="0 0 300 360" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <defs>
      {/* Named paths for animateMotion */}
      <path id="ahv-p1" d="M 55 30 C 110 30, 160 70, 210 55" />
      <path id="ahv-p2" d="M 210 55 C 240 80, 250 130, 270 170" />
      <path id="ahv-p3" d="M 30 120 C 80 120, 120 145, 165 145" />
      <path id="ahv-p4" d="M 165 145 C 210 145, 240 120, 270 170" />
      <path id="ahv-p5" d="M 55 30 L 30 120" />
      <path id="ahv-p6" d="M 165 145 L 140 240" />
      <path id="ahv-p7" d="M 270 170 L 240 270" />
    </defs>

    {/* Edges — horizontal / diagonal spans */}
    <use href="#ahv-p1" className="te" />
    <use href="#ahv-p2" className="te" />
    <use href="#ahv-p3" className="te" />
    <use href="#ahv-p4" className="te" />
    {/* Vertical connectors — fainter */}
    <use href="#ahv-p5" className="te te--faint" />
    <use href="#ahv-p6" className="te te--faint" />
    <use href="#ahv-p7" className="te te--faint" />

    {/* Nodes */}
    <circle cx="55" cy="30" r="3.5" className="tn" />
    <circle cx="210" cy="55" r="5" className="tn tn--hub" />
    <circle cx="30" cy="120" r="3" className="tn" />
    <circle cx="165" cy="145" r="5" className="tn tn--hub" />
    <circle cx="270" cy="170" r="3.5" className="tn" />
    <circle cx="140" cy="240" r="3" className="tn" />
    <circle cx="240" cy="270" r="3" className="tn" />

    {/* Packets */}
    <circle r="2.5" className="tp tp--accent">
      <animateMotion dur="4.2s" repeatCount="indefinite" begin="0s">
        <mpath href="#ahv-p1" />
      </animateMotion>
      <animate attributeName="opacity" values="0;1;1;0"
        keyTimes="0;0.08;0.9;1" dur="4.2s" repeatCount="indefinite" begin="0s" />
    </circle>

    <circle r="2" className="tp tp--link">
      <animateMotion dur="5.8s" repeatCount="indefinite" begin="1.6s">
        <mpath href="#ahv-p3" />
      </animateMotion>
      <animate attributeName="opacity" values="0;1;1;0"
        keyTimes="0;0.07;0.91;1" dur="5.8s" repeatCount="indefinite" begin="1.6s" />
    </circle>

    <circle r="1.8" className="tp tp--signal">
      <animateMotion dur="3.6s" repeatCount="indefinite" begin="3.1s">
        <mpath href="#ahv-p6" />
      </animateMotion>
      <animate attributeName="opacity" values="0;1;1;0"
        keyTimes="0;0.1;0.88;1" dur="3.6s" repeatCount="indefinite" begin="3.1s" />
    </circle>

    <circle r="2" className="tp tp--link">
      <animateMotion dur="6.5s" repeatCount="indefinite" begin="0.4s">
        <mpath href="#ahv-p2" />
      </animateMotion>
      <animate attributeName="opacity" values="0;1;1;0"
        keyTimes="0;0.06;0.93;1" dur="6.5s" repeatCount="indefinite" begin="0.4s" />
    </circle>
  </TopoSvgEl>
)

/* ── Component ───────────────────────────────────────────────────────────── */

const AboutHeroViz: React.FC = () => {
  const rootRef  = useRef<HTMLDivElement>(null)
  const topoRef  = useRef<HTMLDivElement>(null)   // moves most  (behind)
  const bgRef    = useRef<HTMLDivElement>(null)   // moves least (ground)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.matchMedia("(hover: none)").matches) return

    let tX = 0, tY = 0, cX = 0, cY = 0
    let raf: number
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const tick = () => {
      cX = lerp(cX, tX, 0.052)
      cY = lerp(cY, tY, 0.052)
      if (topoRef.current) {
        topoRef.current.style.transform =
          `translate(${cX * 11}px, ${cY * 9}px)`
      }
      if (bgRef.current) {
        bgRef.current.style.transform =
          `translate(${cX * 4}px, ${cY * 3}px)`
      }
      raf = requestAnimationFrame(tick)
    }

    const onMove = (e: MouseEvent) => {
      const r = rootRef.current?.getBoundingClientRect()
      if (!r) return
      tX = (e.clientX - r.left - r.width  / 2) / (r.width  / 2)
      tY = (e.clientY - r.top  - r.height / 2) / (r.height / 2)
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

  const { profile } = CONFIG
  const [firstName, ...rest] = profile.name.split(" ")
  const lastName = rest.join(" ")

  return (
    <Root ref={rootRef}>
      <BgGrid ref={bgRef} />

      <Inner>
        {/* ── Left: editorial typography ── */}
        <LeftPane>
          <SysId>JH · {new Date().getFullYear()}</SysId>

          <NameBlock>
            <NameFirst>{firstName}</NameFirst>
            <NameLast>{lastName}</NameLast>
          </NameBlock>

          <RoleRow>
            <RoleDot />
            <RoleText>{profile.role}</RoleText>
          </RoleRow>

          <AccentRule />

          <Tagline>
            Infrastructure&#8209;grounded.{" "}
            <Em $c="accent">Cloud&#8209;native.</Em>{" "}
            <Em $c="link">Security&#8209;focused.</Em>
          </Tagline>

          <Chips>
            <Chip $c="signal">200+ nodes</Chip>
            <Chip $c="link">k8s · tf</Chip>
            <Chip $c="accent">UMD M.Eng</Chip>
          </Chips>
        </LeftPane>

        {/* ── Right: system architecture ── */}
        <RightPane>
          {/* Topology floats behind the layers */}
          <TopoWrap ref={topoRef}>
            <TopoSVG />
          </TopoWrap>

          <LayerStack>
            {LAYERS.map((layer) => (
              <ArchRow key={layer.label}>
                <StatusDot $color={layer.status} />
                <RowLabel>{layer.label}</RowLabel>
                <TagList>
                  {layer.tags.map((t) => (
                    <LayerTag key={t}>{t}</LayerTag>
                  ))}
                </TagList>
                <PulseTrack>
                  <PulseDot $dur={layer.pulseDur} $delay={layer.pulseDelay} $color={layer.status} />
                </PulseTrack>
                <Annotation>{layer.annotation}</Annotation>
              </ArchRow>
            ))}
          </LayerStack>
        </RightPane>
      </Inner>
    </Root>
  )
}

export default AboutHeroViz

/* ── Styled components ───────────────────────────────────────────────────── */

const Root = styled.div`
  position: relative;
  width: 100%;
  height: clamp(380px, 44vw, 460px);
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  margin-bottom: 1.25rem;

  background:
    radial-gradient(ellipse at 68% 42%, oklch(0.42 0.14 252 / 0.055), transparent 40%),
    radial-gradient(ellipse at 28% 72%, oklch(0.52 0.19 22  / 0.045), transparent 35%),
    ${({ theme }) => theme.brand.bg};

  @media (max-width: 520px) {
    height: auto;
    min-height: 560px;
  }
`

/* ── Background grid ── */

const BgGrid = styled.div`
  position: absolute;
  inset: -8px;
  background-image:
    linear-gradient(${({ theme }) => theme.brand.border} 1px, transparent 1px),
    linear-gradient(90deg, ${({ theme }) => theme.brand.border} 1px, transparent 1px);
  background-size: 44px 44px;
  opacity: 0.28;
  mask-image: radial-gradient(ellipse 80% 90% at 60% 50%, black 20%, transparent 75%);
  animation: ${gridDrift} 32s ease-in-out infinite;
  will-change: transform;
  pointer-events: none;
`

/* ── Layout ── */

const Inner = styled.div`
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 42% 58%;
  height: 100%;
  align-items: stretch;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    height: auto;
  }
`

/* ── Left pane ── */

const LeftPane = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1.75rem 1rem 1.75rem 1.5rem;
  gap: 0;
  border-right: 1px solid ${({ theme }) => theme.brand.borderSoft};

  @media (max-width: 520px) {
    border-right: none;
    border-bottom: 1px solid ${({ theme }) => theme.brand.borderSoft};
    padding: 1.5rem 1.25rem 1.25rem;
    justify-content: flex-start;
  }
`

const SysId = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.textFaint};
  margin-bottom: 0.75rem;
`

const NameBlock = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 0.9;
  margin-bottom: 0.85rem;
  animation: ${fadeUp} 0.6s ease both;
`

const NameFirst = styled.span`
  font-family: ${({ theme }) => theme.brand.fontDisplay};
  font-size: clamp(2.2rem, 4vw, 3.4rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  color: ${({ theme }) => theme.brand.text};
`

const NameLast = styled.span`
  font-family: ${({ theme }) => theme.brand.fontDisplay};
  font-size: clamp(2.2rem, 4vw, 3.4rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  background: linear-gradient(
    92deg,
    ${({ theme }) => theme.brand.link} 0%,
    ${({ theme }) => theme.brand.accent} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const RoleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.85rem;
`

const RoleDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${({ theme }) => theme.brand.signal};
  animation: ${statusBeat} 3.5s ease-in-out infinite;
`

const RoleText = styled.span`
  font-family: ${({ theme }) => theme.brand.fontSans};
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.brand.textMuted};
  letter-spacing: 0.01em;
`

const AccentRule = styled.div`
  width: 60px;
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.brand.link},
    ${({ theme }) => theme.brand.accent}
  );
  margin-bottom: 0.85rem;
`

const Tagline = styled.p`
  margin: 0 0 1rem;
  font-size: clamp(0.8rem, 1.2vw, 0.9375rem);
  line-height: 1.65;
  color: ${({ theme }) => theme.brand.textMuted};
`

const Em = styled.span<{ $c: "accent" | "link" }>`
  color: ${({ theme, $c }) =>
    $c === "accent" ? theme.brand.accent : theme.brand.link};
  font-weight: 600;
`

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
`

const Chip = styled.span<{ $c: "signal" | "link" | "accent" }>`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-pill);
  border: 1px solid ${({ theme, $c }) =>
    $c === "signal" ? theme.brand.signal
    : $c === "link"   ? theme.brand.link
    : theme.brand.accent}44;
  color: ${({ theme, $c }) =>
    $c === "signal" ? theme.brand.signal
    : $c === "link"   ? theme.brand.link
    : theme.brand.accent};
  background: transparent;
`

/* ── Right pane ── */

const RightPane = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 1.5rem 1.25rem 1.5rem 1.5rem;

  @media (max-width: 520px) {
    padding: 1.25rem;
    align-items: flex-start;
  }
`

/* ── Topology (behind layers) ── */

const TopoWrap = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  will-change: transform;
`

const TopoSvgEl = styled.svg`
  width: 100%;
  height: 100%;
  overflow: visible;

  .te {
    fill: none;
    stroke: ${({ theme }) => theme.brand.border};
    stroke-width: 0.75;
    opacity: 0.55;
  }
  .te--faint {
    opacity: 0.22;
    stroke-dasharray: 3 5;
  }
  .tn {
    fill: ${({ theme }) => theme.brand.borderStrong};
    opacity: 0.45;
    animation: ${nodeGlow} 4s ease-in-out infinite;
  }
  .tn--hub {
    opacity: 0.6;
    animation-duration: 5.5s;
    fill: ${({ theme }) => theme.brand.textFaint};
  }
  .tp { opacity: 0; }
  .tp--accent { fill: ${({ theme }) => theme.brand.accent}; }
  .tp--link   { fill: ${({ theme }) => theme.brand.link}; }
  .tp--signal { fill: ${({ theme }) => theme.brand.signal}; }
`

/* ── Architecture layer stack ── */

const LayerStack = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const ArchRow = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 10px auto 1fr auto auto;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.65rem 0.45rem 0.35rem;
  border-radius: var(--radius-sm);
  background: ${({ theme }) => theme.brand.surface2};
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  transition:
    background 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.brand.surface};
    border-color: ${({ theme }) => theme.brand.border};
  }
`

const StatusDot = styled.span<{ $color: "signal" | "link" | "accent" }>`
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${({ theme, $color }) =>
    $color === "signal" ? theme.brand.signal
    : $color === "link"   ? theme.brand.link
    : theme.brand.accent};
  box-shadow: 0 0 0 2px ${({ theme }) => theme.brand.bg};
  animation: ${statusBeat}
    ${({ $color }) =>
      $color === "accent" ? "2.5s" : "4.5s"} ease-in-out infinite;
  position: relative;
  z-index: 1;
`

const RowLabel = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.5625rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.text};
  white-space: nowrap;
`

const TagList = styled.div`
  display: flex;
  gap: 0.25rem;
  flex-wrap: nowrap;
  overflow: hidden;
`

const LayerTag = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.5625rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  padding: 0.15rem 0.4rem;
  border-radius: 3px;
  background: ${({ theme }) => theme.brand.bg};
  border: 1px solid ${({ theme }) => theme.brand.border};
  color: ${({ theme }) => theme.brand.textMuted};
  white-space: nowrap;
`

/* ── Telemetry pulse line ── */

const PulseTrack = styled.div`
  position: relative;
  height: 2px;
  min-width: 36px;
  background: ${({ theme }) => theme.brand.border};
  border-radius: 2px;
  overflow: visible;
`

const PulseDot = styled.span<{
  $dur: string
  $delay: string
  $color: "signal" | "link" | "accent"
}>`
  position: absolute;
  top: -2px;
  left: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ theme, $color }) =>
    $color === "signal" ? theme.brand.signal
    : $color === "link"   ? theme.brand.link
    : theme.brand.accent};
  opacity: 0;
  animation: ${pulseTravel} ${({ $dur }) => $dur} linear infinite;
  animation-delay: ${({ $delay }) => $delay};
  will-change: left, opacity;
`

const Annotation = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.5625rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.brand.textMuted};
  white-space: nowrap;
`
