import React from "react"
import styled from "@emotion/styled"

type LanguageType = "ko" | "en"

type Props = {
  currentLanguage: LanguageType
  onLanguageChange: (language: LanguageType) => void
}

/**
 * v2: pure text segmented control (EN | KO).
 * Replaces the older flag-emoji + native-name button.
 */
const LanguageToggle: React.FC<Props> = ({
  currentLanguage,
  onLanguageChange,
}) => {
  return (
    <StyledGroup role="group" aria-label="Language">
      <StyledSegment
        type="button"
        data-active={currentLanguage === "en" ? "true" : "false"}
        aria-pressed={currentLanguage === "en"}
        onClick={() => onLanguageChange("en")}
      >
        EN
      </StyledSegment>
      <StyledSegment
        type="button"
        data-active={currentLanguage === "ko" ? "true" : "false"}
        aria-pressed={currentLanguage === "ko"}
        onClick={() => onLanguageChange("ko")}
      >
        KO
      </StyledSegment>
    </StyledGroup>
  )
}

export default LanguageToggle

const StyledGroup = styled.div`
  display: inline-flex;
  align-items: stretch;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  background: ${({ theme }) => theme.brand.surface};
  overflow: hidden;
  user-select: none;
`

const StyledSegment = styled.button`
  appearance: none;
  border: 0;
  background: transparent;
  height: 34px;
  min-width: 36px;
  padding: 0 0.6rem;
  font-family: ${({ theme }) => theme.brand.fontSans};
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: ${({ theme }) => theme.brand.textFaint};
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease},
    color ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease};

  & + & {
    border-left: 1px solid ${({ theme }) => theme.brand.borderSoft};
  }

  &:hover {
    color: ${({ theme }) => theme.brand.text};
    background: ${({ theme }) => theme.brand.surface2};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.brand.accentRing};
    outline-offset: -2px;
  }

  &[data-active="true"] {
    color: ${({ theme }) => theme.brand.text};
    background: ${({ theme }) => theme.brand.surface2};
  }
`
