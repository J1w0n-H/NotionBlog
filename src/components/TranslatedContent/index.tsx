import React, { useState, useEffect } from "react"
import styled from "@emotion/styled"
import { LanguageType } from "src/hooks/useLanguage"
import { translateHtmlContent } from "src/libs/utils/translation"

type Props = {
  originalContent: string
  currentLanguage: LanguageType
  targetLanguage: LanguageType
}

const TranslatedContent: React.FC<Props> = ({
  originalContent,
  currentLanguage,
  targetLanguage,
}) => {
  const [translatedContent, setTranslatedContent] = useState<string>("")
  const [isTranslating, setIsTranslating] = useState<boolean>(false)
  const [showTranslated, setShowTranslated] = useState<boolean>(false)

  useEffect(() => {
    if (currentLanguage !== targetLanguage && originalContent) {
      setIsTranslating(true)
      
      translateHtmlContent(originalContent, targetLanguage)
        .then((translated) => {
          setTranslatedContent(translated)
          setIsTranslating(false)
        })
        .catch((error) => {
          console.error("Translation failed:", error)
          setIsTranslating(false)
        })
    }
  }, [originalContent, currentLanguage, targetLanguage])

  const handleToggleTranslation = () => {
    setShowTranslated(!showTranslated)
  }

  // 텍스트를 HTML로 변환하는 함수
  const formatTextAsHtml = (text: string): string => {
    return text
      .split('\n')
      .map((line, index) => {
        const trimmedLine = line.trim()
        if (!trimmedLine) return '<br>'
        
        // 헤더 스타일 감지 (대문자로 시작하는 짧은 라인)
        if (trimmedLine.length < 100 && /^[A-Z]/.test(trimmedLine)) {
          return `<h3 style="margin: 1.5rem 0 0.5rem 0; font-size: 1.25rem; font-weight: 600; color: #374151;">${trimmedLine}</h3>`
        }
        
        // 일반 텍스트
        return `<p style="margin: 0.5rem 0; line-height: 1.6; color: #374151;">${trimmedLine}</p>`
      })
      .join('')
  }

  if (currentLanguage === targetLanguage) {
    return <div dangerouslySetInnerHTML={{ __html: formatTextAsHtml(originalContent) }} />
  }

  if (isTranslating) {
    return (
      <StyledContainer>
        <div dangerouslySetInnerHTML={{ __html: formatTextAsHtml(originalContent) }} />
        <StyledLoadingOverlay>
          <div>번역 중...</div>
        </StyledLoadingOverlay>
      </StyledContainer>
    )
  }

  return (
    <StyledContainer>
      <StyledToggleButton onClick={handleToggleTranslation}>
        {showTranslated ? "원문 보기" : "번역 보기"}
      </StyledToggleButton>
      
      <StyledContentWrapper>
        <div
          dangerouslySetInnerHTML={{
            __html: formatTextAsHtml(showTranslated ? translatedContent : originalContent),
          }}
        />
      </StyledContentWrapper>
      
      {showTranslated && (
        <StyledTranslationNote>
          * Google 번역을 통해 자동 번역되었습니다.
        </StyledTranslationNote>
      )}
    </StyledContainer>
  )
}

export default TranslatedContent

const StyledContainer = styled.div`
  position: relative;
`

const StyledContentWrapper = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: ${({ theme }) => theme.scheme === "light" ? "#f9fafb" : "#374151"};
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.gray6};
`

const StyledLoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.gray11};
`

const StyledToggleButton = styled.button`
  position: sticky;
  top: 1rem;
  z-index: 10;
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.colors.blue9};
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.blue10};
  }
  
  @media (max-width: 768px) {
    position: relative;
    top: 0;
    margin-bottom: 1rem;
  }
`

const StyledTranslationNote = styled.div`
  margin-top: 1rem;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.gray3};
  border-radius: 0.5rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.gray11};
  text-align: center;
`
