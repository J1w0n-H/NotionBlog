import React from "react"
import styled from "@emotion/styled"
import { useMotionPreference, type MotionLevel } from "src/hooks/useMotionPreference"

const LABELS: Record<MotionLevel, string> = {
  full:       "⚡",
  restrained: "✦",
  zero:       "○",
}

const TITLES: Record<MotionLevel, string> = {
  full:       "Motion: Full — animated gradient, cursor",
  restrained: "Motion: Restrained — static gradient, no cursor",
  zero:       "Motion: Zero — plain text, no animation",
}

const MotionToggle: React.FC = () => {
  const [level, cycle] = useMotionPreference()

  return (
    <StyledButton
      type="button"
      onClick={cycle}
      aria-label={TITLES[level]}
      title={TITLES[level]}
      data-level={level}
    >
      {LABELS[level]}
    </StyledButton>
  )
}

export default MotionToggle

const StyledButton = styled.button`
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  padding: 0;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  background: ${({ theme }) => theme.brand.surface};
  color: ${({ theme }) => theme.brand.textMuted};
  font-size: 0.875rem;
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.brand.durationFast} ${({ theme }) => theme.brand.ease},
    color ${({ theme }) => theme.brand.durationFast} ${({ theme }) => theme.brand.ease},
    border-color ${({ theme }) => theme.brand.durationFast} ${({ theme }) => theme.brand.ease};

  &:hover {
    background: ${({ theme }) => theme.brand.surface2};
    color: ${({ theme }) => theme.brand.text};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.brand.accentRing};
    outline-offset: 2px;
  }

  &[data-level="full"] {
    color: ${({ theme }) => theme.brand.link};
    border-color: ${({ theme }) => theme.brand.link};
  }

  &[data-level="zero"] {
    color: ${({ theme }) => theme.brand.textFaint};
  }
`
