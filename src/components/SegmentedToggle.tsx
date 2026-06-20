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
  const pickSide = (clientX: number, track: HTMLElement) => {
    const rect = track.getBoundingClientRect()
    const mid = rect.left + rect.width / 2
    if (clientX < mid) left.onSelect()
    else right.onSelect()
  }

  const handleTrackClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    pickSide(e.clientX, e.currentTarget)
  }

  const handleTrackKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (
    e
  ) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault()
      left.onSelect()
    } else if (e.key === "ArrowRight") {
      e.preventDefault()
      right.onSelect()
    } else if (e.key === "Enter" || e.code === "Space") {
      e.preventDefault()
      ;(left.selected ? right : left).onSelect()
    }
  }

  return (
    <Track
      role="group"
      aria-label={`${ariaLabel} (${left.selected ? left.label : right.label})`}
      tabIndex={0}
      onClick={handleTrackClick}
      onKeyDown={handleTrackKeyDown}
    >
      <Segment aria-hidden="true" data-active={left.selected ? "true" : "false"}>
        {left.label}
      </Segment>
      <Segment aria-hidden="true" data-active={right.selected ? "true" : "false"}>
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

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.brand.accentRing};
    outline-offset: 2px;
  }
`

const Segment = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  background: transparent;
  height: 28px;
  flex: 1 1 0;
  min-width: 0;
  padding: 0 0.55rem;
  border-radius: 999px;
  font-family: ${({ theme }) => theme.brand.fontSans};
  font-size: 0.75rem;
  font-weight: 650;
  letter-spacing: 0.03em;
  color: ${({ theme }) => theme.brand.textMuted};
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

  @media (prefers-reduced-motion: reduce) {
    transition: none;
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
`
