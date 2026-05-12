import React from "react"
import styled from "@emotion/styled"
import { Emoji } from "src/components/Emoji"

type LanguageType = "ko" | "en"

type Props = {
  currentLanguage: LanguageType
  onLanguageChange: (language: LanguageType) => void
}

const LanguageToggle: React.FC<Props> = ({ currentLanguage, onLanguageChange }) => {
  const handleClick = () => {
    const newLanguage = currentLanguage === "ko" ? "en" : "ko"
    onLanguageChange(newLanguage)
  }

  return (
    <StyledButton
      type="button"
      onClick={handleClick}
      aria-label={
        currentLanguage === "ko"
          ? "Switch language to English"
          : "Switch language to Korean"
      }
    >
      <Emoji>{currentLanguage === "ko" ? "🇰🇷" : "🇺🇸"}</Emoji>
      <span className="language-text">
        {currentLanguage === "ko" ? "한국어" : "English"}
      </span>
    </StyledButton>
  )
}

export default LanguageToggle

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  background-color: ${({ theme }) => theme.brand.surface2};
  color: ${({ theme }) => theme.brand.textMuted};
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
  user-select: none;

  &:hover {
    background-color: ${({ theme }) => theme.brand.surface};
    color: ${({ theme }) => theme.brand.text};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.brand.accentRing};
    outline-offset: 2px;
  }

  .language-text {
    font-size: 0.875rem;
    font-weight: 500;
    color: inherit;
  }

  @media (max-width: 768px) {
    .language-text {
      display: none;
    }
  }
`
