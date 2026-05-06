import React from "react"
import styled from "@emotion/styled"
import useTheme, { Mood } from "src/hooks/useTheme"

const LABELS: Record<Mood, string> = {
  default: "Default",
  hanji:   "Hanji",
  signal:  "Signal",
  ops:     "Ops",
}

const MoodToggle: React.FC = () => {
  const [mood, setMood] = useTheme()

  return (
    <Select
      value={mood}
      onChange={(e) => setMood(e.target.value as Mood)}
      aria-label="Color mood"
    >
      {(Object.keys(LABELS) as Mood[]).map((m) => (
        <option key={m} value={m}>{LABELS[m]}</option>
      ))}
    </Select>
  )
}

export default MoodToggle

const Select = styled.select`
  font-size: 0.8125rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid ${({ theme }) => theme.brand.border};
  background: ${({ theme }) => theme.brand.surface};
  color: ${({ theme }) => theme.brand.textMuted};
  cursor: pointer;
  font-family: ${({ theme }) => theme.brand.fontSans};
  transition: border-color 0.15s ease;
  &:focus-visible { outline: 2px solid ${({ theme }) => theme.brand.accentRing}; }
`
