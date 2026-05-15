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
  const handleTrackClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target !== e.currentTarget) return
    const rect = e.currentTarget.getBoundingClientRect()
    const mid = rect.left + rect.width / 2
    if (e.clientX < mid) left.onSelect()
    else right.onSelect()
  }

  return (
    <Track role="group" aria-label={ariaLabel} onClick={handleTrackClick}>
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
  padding: 4px;
  gap: 3px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.brand.border};
  background: ${({ theme }) => theme.brand.surface2};
  box-shadow:
    inset 0 1px 2px oklch(0 0 0 / 0.06),
    inset 0 -1px 1px oklch(0 0 0 / 0.04),
    0 1px 3px oklch(0 0 0 / 0.06);
  user-select: none;
  cursor: pointer;
`

const Segment = styled.button`
  appearance: none;
  background: transparent;
  height: 28px;
  min-width: 2.25rem;
  padding: 0 0.55rem;
  border-radius: 999px;
  font-family: ${({ theme }) => theme.brand.fontSans};
  font-size: 0.75rem;
  font-weight: 650;
  letter-spacing: 0.03em;
  color: ${({ theme }) => theme.brand.textMuted};
  cursor: pointer;
  border: 1px solid transparent;
  transition:
    background ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease},
    color ${({ theme }) => theme.brand.durationFast} ${({ theme }) =>
      theme.brand.ease},
    box-shadow ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease},
    border-color ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease};

  &:hover {
    color: ${({ theme }) => theme.brand.text};
    background: ${({ theme }) => theme.brand.surface};
    border-color: ${({ theme }) => theme.brand.borderSoft};
    box-shadow: 0 1px 2px oklch(0 0 0 / 0.05);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.brand.accentRing};
    outline-offset: 2px;
  }

  &[data-active="true"] {
    color: ${({ theme }) => theme.brand.text};
    background: ${({ theme }) => theme.brand.surface};
    border-color: ${({ theme }) => theme.brand.borderStrong};
    box-shadow:
      0 2px 6px oklch(0 0 0 / 0.1),
      0 1px 2px oklch(0 0 0 / 0.06),
      0 0 0 1px ${({ theme }) => theme.brand.borderSoft};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`
