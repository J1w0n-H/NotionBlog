import React from "react"
import styled from "@emotion/styled"
import Emoji from "src/components/Emoji"

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
    <StyledWrapper onClick={handleClick}>
      <Emoji>{currentLanguage === "ko" ? "🇰🇷" : "🇺🇸"}</Emoji>
      <span className="language-text">
        {currentLanguage === "ko" ? "한국어" : "English"}
      </span>
    </StyledWrapper>
  )
}

export default LanguageToggle

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.colors.gray3};
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray4};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  .language-text {
    font-size: 0.875rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.gray11};
  }
  
  @media (max-width: 768px) {
    .language-text {
      display: none;
    }
  }
`
