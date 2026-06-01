import React from "react"
import Image from "next/image"
import styled from "@emotion/styled"
import { CONFIG } from "site.config"
import { HiChevronDown, HiChevronUp } from "react-icons/hi"
import { useAboutPanelToggle } from "src/hooks/useAboutPanelToggle"

type Variant = "header" | "bookmark"

type Props = {
  variant: Variant
}

const AboutProfileTrigger: React.FC<Props> = ({ variant }) => {
  const { isOpen, toggle } = useAboutPanelToggle()

  if (variant === "header") {
    return (
      <HeaderTrigger
        type="button"
        data-active={isOpen ? "true" : "false"}
        onClick={toggle}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close About" : "Open About"}
        title={isOpen ? "Close About" : "Open About"}
      >
        <Avatar $size="lg" aria-hidden="true">
          <Image
            src={CONFIG.profile.image}
            alt=""
            fill
            sizes="48px"
            priority
            style={{ objectFit: "cover" }}
          />
        </Avatar>
        <Meta>
          <Line1>
            <Name>{CONFIG.blog.title}</Name>
            <Dot>·</Dot>
            <Role>{CONFIG.profile.role}</Role>
          </Line1>
          <Bio>{CONFIG.profile.bio}</Bio>
        </Meta>
        <Chevron aria-hidden="true">
          {isOpen ? <HiChevronUp /> : <HiChevronDown />}
        </Chevron>
      </HeaderTrigger>
    )
  }

  return (
    <BookmarkTrigger
      type="button"
      data-active={isOpen ? "true" : "false"}
      onClick={toggle}
      aria-expanded={isOpen}
      aria-label={isOpen ? "Close About" : "Open About"}
      title={isOpen ? "Close About" : "Open About"}
    >
      <Avatar $size="sm" aria-hidden="true">
        <Image
          src={CONFIG.profile.image}
          alt=""
          fill
          sizes="40px"
          style={{ objectFit: "cover" }}
        />
      </Avatar>
      <BookmarkStack>
        <BookmarkLabel>About</BookmarkLabel>
        <BookmarkChevron aria-hidden="true">
          {isOpen ? <HiChevronUp /> : <HiChevronDown />}
        </BookmarkChevron>
      </BookmarkStack>
    </BookmarkTrigger>
  )
}

export default AboutProfileTrigger

const Avatar = styled.span<{ $size: "lg" | "sm" }>`
  position: relative;
  flex: 0 0 auto;
  width: ${({ $size }) => ($size === "lg" ? "48px" : "2rem")};
  height: ${({ $size }) => ($size === "lg" ? "48px" : "2rem")};
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  background: ${({ theme }) => theme.brand.surface2};

  @media (max-width: 767px) {
    display: none;
  }
`

const Chevron = styled.span`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  color: ${({ theme }) => theme.brand.accent};
  opacity: 0.7;

  svg {
    width: 1rem;
    height: 1rem;
  }
`

const HeaderTrigger = styled.button`
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
  max-width: min(480px, calc(50vw - 2rem));
  margin: 0;
  padding: 0.25rem 0.65rem 0.25rem 0.25rem;
  border: 1px solid ${({ theme }) => theme.brand.border};
  border-radius: 999px;
  background: ${({ theme }) => theme.brand.surface2};
  box-shadow: 0 1px 3px oklch(0 0 0 / 0.18), 0 0 0 1px oklch(0 0 0 / 0.06);
  color: ${({ theme }) => theme.brand.text};
  text-align: left;
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease},
    border-color ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease},
    box-shadow ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease},
    transform ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease};

  /* glass shimmer sweep */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(
      110deg,
      transparent 20%,
      oklch(1 0 0 / 0.12) 38%,
      oklch(1 0 0 / 0.42) 50%,
      oklch(1 0 0 / 0.12) 62%,
      transparent 80%
    );
    transform: translateX(-160%);
    pointer-events: none;
  }

  @media (prefers-reduced-motion: no-preference) {
    &:not([data-active="true"]) {
      animation: headerBounce 1.4s ease-in-out infinite;
    }
    &:not([data-active="true"])::after {
      animation: headerGlassShimmer 1.6s linear infinite;
    }
  }

  @keyframes headerGlassShimmer {
    0% { transform: translateX(-160%); }
    100% { transform: translateX(160%); }
  }

  @keyframes headerBounce {
    0%, 100% { transform: translateY(0)    scaleX(1)    scaleY(1); animation-timing-function: ease-in; }
    30%       { transform: translateY(-10px) scaleX(0.95) scaleY(1.06); animation-timing-function: ease-out; }
    45%       { transform: translateY(0)    scaleX(1.1)  scaleY(0.92); animation-timing-function: ease-in; }
    60%       { transform: translateY(-5px) scaleX(0.97) scaleY(1.03); animation-timing-function: ease-out; }
    72%       { transform: translateY(0)    scaleX(1.05) scaleY(0.96); animation-timing-function: ease-in; }
    83%       { transform: translateY(-2px) scaleX(0.99) scaleY(1.01); animation-timing-function: ease-out; }
    91%       { transform: translateY(0)    scaleX(1)    scaleY(1); }
  }

  @media (max-width: 767px) {
    gap: 0.4rem;
    padding: 0.25rem 0.5rem 0.25rem 0.5rem;
  }

  &:hover {
    animation: none;
    background: ${({ theme }) => theme.brand.surface};
    border-color: ${({ theme }) => theme.brand.borderStrong};
    box-shadow: 0 2px 8px oklch(0 0 0 / 0.22), 0 0 0 1px ${({ theme }) => theme.brand.accentSoft};

    ${Chevron} {
      opacity: 1;
    }
  }

  &:active {
    animation: none;
    transform: scale(0.97);
    box-shadow: 0 1px 2px oklch(0 0 0 / 0.12);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.brand.accentRing};
    outline-offset: 2px;
  }

  &[data-active="true"] {
    color: ${({ theme }) => theme.brand.accent};
    background: ${({ theme }) => theme.brand.accentSoft};
    border-color: ${({ theme }) => theme.brand.accent};
    box-shadow: 0 2px 8px oklch(0 0 0 / 0.15), 0 0 0 1px ${({ theme }) => theme.brand.accent};
    animation: none;

    ${Avatar} {
      border-color: ${({ theme }) => theme.brand.accent};
    }

    ${Chevron} {
      opacity: 1;
      color: ${({ theme }) => theme.brand.accent};
    }
  }
`

const BookmarkTrigger = styled.button`
  position: relative;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem;
  width: 100%;
  min-height: 2.65rem;
  margin: 0;
  padding: 0.2rem 0.55rem 0.2rem 0.5rem;
  border: 1px solid ${({ theme }) => theme.brand.border};
  border-left: none;
  border-radius: 0 0.85rem 0.85rem 0;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.brand.surface} 0%,
    ${({ theme }) => theme.brand.surface2} 100%
  );
  color: ${({ theme }) => theme.brand.textMuted};
  box-shadow:
    4px 0 18px oklch(0 0 0 / 0.08),
    0 0 0 1px oklch(0 0 0 / 0.04);
  cursor: pointer;
  overflow: hidden;
  isolation: isolate;
  transition:
    background ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease},
    border-color ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease},
    color ${({ theme }) => theme.brand.durationFast} ${({ theme }) => theme.brand.ease},
    box-shadow ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease},
    transform ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease};

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 12%;
    bottom: 12%;
    width: 3px;
    border-radius: 0 3px 3px 0;
    background: linear-gradient(
      180deg,
      ${({ theme }) => theme.brand.accent} 0%,
      ${({ theme }) => theme.brand.accent} 55%,
      ${({ theme }) => theme.brand.borderStrong} 100%
    );
    opacity: 0.95;
    pointer-events: none;
  }

  @media (prefers-reduced-motion: no-preference) {
    &[data-active="false"] {
      animation: aboutTabPeek 3.5s ease-in-out infinite;
    }
  }

  &:hover {
    animation: none;
    color: ${({ theme }) => theme.brand.text};
    background: ${({ theme }) => theme.brand.surface};
    border-color: ${({ theme }) => theme.brand.borderStrong};
    box-shadow:
      6px 0 22px oklch(0 0 0 / 0.1),
      0 0 0 1px ${({ theme }) => theme.brand.accentSoft};
    transform: translateX(2px);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.brand.accentRing};
    outline-offset: 3px;
  }

  &[data-active="true"] {
    animation: none;
    color: ${({ theme }) => theme.brand.accent};
    background: linear-gradient(
      135deg,
      ${({ theme }) => theme.brand.accentSoft} 0%,
      ${({ theme }) => theme.brand.surface} 100%
    );
    border-color: ${({ theme }) => theme.brand.accent};
    box-shadow:
      6px 0 20px oklch(0 0 0 / 0.12),
      0 0 18px ${({ theme }) => theme.brand.accentSoft},
      0 0 0 1px ${({ theme }) => theme.brand.borderSoft};
    transform: translateX(3px);

    ${Avatar} {
      border-color: ${({ theme }) => theme.brand.accent};
    }
  }

  @keyframes aboutTabPeek {
    0%,
    86%,
    100% {
      transform: translateX(0);
    }
    88% {
      transform: translateX(4px) rotate(0.4deg);
    }
    91% {
      transform: translateX(-2px) rotate(-0.35deg);
    }
    94% {
      transform: translateX(3px) rotate(0.25deg);
    }
    97% {
      transform: translateX(0);
    }
  }
`

const Meta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
  overflow: hidden;
  flex: 1 1 auto;
`

const Line1 = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  min-width: 0;
`

const Name = styled.span`
  font-weight: 800;
  color: inherit;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 240px;
`

const Dot = styled.span`
  color: ${({ theme }) => theme.brand.textFaint};

  @media (max-width: 767px) {
    display: none;
  }
`

const Role = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.brand.textMuted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 767px) {
    display: none;
  }
`

const Bio = styled.span`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.brand.textFaint};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 480px;

  @media (max-width: 767px) {
    display: none;
  }
`

const BookmarkStack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0.15rem;
  flex: 1 1 auto;
  min-width: 0;
`

const BookmarkLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  line-height: 1;
`

const BookmarkChevron = styled.span`
  display: grid;
  place-items: center;
  color: ${({ theme }) => theme.brand.textFaint};

  svg {
    width: 0.85rem;
    height: 0.85rem;
  }

  ${BookmarkTrigger}[data-active="true"] & {
    color: ${({ theme }) => theme.brand.accent};
  }
`
