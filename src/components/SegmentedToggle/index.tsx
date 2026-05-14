import React from "react"
import styled from "@emotion/styled"

export type SegmentedSide = {
  label: string
  selected: boolean
  onSelect: () => void
}

type Props = {
  "aria-label": string
  left: SegmentedSide
  right: SegmentedSide
}

/**
 * Two-option pill (e.g. EN | KO, 번역 | 원문). Track uses surface2; active
 * segment gets a raised surface chip + subtle shadow.
 */
const SegmentedToggle: React.FC<Props> = ({
  "aria-label": ariaLabel,
  left,
  right,
}) => {
  return (
    <Track role="group" aria-label={ariaLabel}>
      <Segment
        type="button"
        data-active={left.selected ? "true" : "false"}
        aria-pressed={left.selected}
        onClick={left.onSelect}
      >
        {left.label}
      </Segment>
      <Segment
        type="button"
        data-active={right.selected ? "true" : "false"}
        aria-pressed={right.selected}
        onClick={right.onSelect}
      >
        {right.label}
      </Segment>
    </Track>
  )
}

export default SegmentedToggle

const Track = styled.div`
  display: inline-flex;
  align-items: stretch;
  padding: 3px;
  gap: 2px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  background: ${({ theme }) => theme.brand.surface2};
  user-select: none;
`

const Segment = styled.button`
  appearance: none;
  border: 0;
  background: transparent;
  height: 28px;
  min-width: 2.25rem;
  padding: 0 0.55rem;
  border-radius: 999px;
  font-family: ${({ theme }) => theme.brand.fontSans};
  font-size: 0.75rem;
  font-weight: 650;
  letter-spacing: 0.03em;
  color: ${({ theme }) => theme.brand.textFaint};
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease},
    color ${({ theme }) => theme.brand.durationFast} ${({ theme }) =>
      theme.brand.ease},
    box-shadow ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease};

  &:hover {
    color: ${({ theme }) => theme.brand.text};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.brand.accentRing};
    outline-offset: 2px;
  }

  &[data-active="true"] {
    color: ${({ theme }) => theme.brand.text};
    background: ${({ theme }) => theme.brand.surface};
    box-shadow:
      0 1px 2px oklch(0 0 0 / 0.12),
      0 0 0 1px ${({ theme }) => theme.brand.borderSoft};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`
