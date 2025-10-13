import React, { useState, useEffect } from "react"
import styled from "@emotion/styled"
import { LanguageType } from "src/hooks/useLanguage"
import { translateHtmlContent, detectLanguage } from "src/libs/utils/translation"

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
  const [contentLanguage, setContentLanguage] = useState<LanguageType>("ko")

  useEffect(() => {
    if (!originalContent || !originalContent.trim()) {
      setTranslatedContent("")
      return
    }

    // 콘텐츠의 언어 감지
    const detectedLang = detectLanguage(originalContent)
    setContentLanguage(detectedLang)

    // 콘텐츠 언어와 현재 UI 언어가 다른 경우 번역 수행
    const needsTranslation = detectedLang !== currentLanguage
    
    if (needsTranslation) {
      setIsTranslating(true)
      
      const translateContent = async () => {
        try {
          const translated = await translateHtmlContent(originalContent, currentLanguage, detectedLang)
          setTranslatedContent(translated)
        } catch (error) {
          console.error("Translation failed:", error)
        } finally {
          setIsTranslating(false)
        }
      }
      
      translateContent()
    } else {
      setTranslatedContent("")
    }
  }, [currentLanguage, originalContent])

  // 현재 언어에 따른 라벨 텍스트
  const getOriginalLabel = () => {
    return contentLanguage === "ko" ? "원문 (한국어)" : "Original (English)"
  }

  const getTranslatedLabel = () => {
    return currentLanguage === "ko" ? "번역 (한국어)" : "Translation (English)"
  }

  const getTranslationNoteText = () => {
    if (currentLanguage === "ko") {
      return "Google 번역을 통해 자동 번역되었습니다."
    } else {
      return "Automatically translated via Google Translate."
    }
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
        
        // 긴 문장을 자연스럽게 분할
        if (trimmedLine.length > 200) {
          // 문장 단위로 분할 (마침표, 느낌표, 물음표 기준)
          const sentences = trimmedLine.split(/(?<=[.!?])\s+/)
          return sentences
            .map(sentence => {
              const trimmedSentence = sentence.trim()
              if (!trimmedSentence) return ''
              
              // 짧은 문장은 그대로, 긴 문장은 더 세밀하게 분할
              if (trimmedSentence.length > 150) {
                // 쉼표나 연결어 기준으로 추가 분할
                const parts = trimmedSentence.split(/(?<=[,;])\s+/)
                return parts
                  .map(part => {
                    const trimmedPart = part.trim()
                    if (!trimmedPart) return ''
                    return `<p style="margin: 0.3rem 0; line-height: 1.6; color: #374151;">${trimmedPart}</p>`
                  })
                  .join('')
              } else {
                return `<p style="margin: 0.5rem 0; line-height: 1.6; color: #374151;">${trimmedSentence}</p>`
              }
            })
            .join('')
        }
        
        // 일반 텍스트
        return `<p style="margin: 0.5rem 0; line-height: 1.6; color: #374151;">${trimmedLine}</p>`
      })
      .join('')
  }

  // 콘텐츠 언어와 UI 언어가 같으면 원본만 표시
  if (contentLanguage === currentLanguage) {
    return <div dangerouslySetInnerHTML={{ __html: formatTextAsHtml(originalContent) }} />
  }

  if (isTranslating) {
    return (
      <StyledContainer>
        <StyledSideBySideWrapper>
          <StyledContentColumn>
            <StyledColumnHeader>{getOriginalLabel()}</StyledColumnHeader>
            <StyledContentBox>
              <div dangerouslySetInnerHTML={{ __html: formatTextAsHtml(originalContent) }} />
            </StyledContentBox>
          </StyledContentColumn>
          
          <StyledContentColumn>
            <StyledColumnHeader>{getTranslatedLabel()}</StyledColumnHeader>
            <StyledContentBox>
              <StyledLoadingMessage>번역 중...</StyledLoadingMessage>
            </StyledContentBox>
          </StyledContentColumn>
        </StyledSideBySideWrapper>
      </StyledContainer>
    )
  }

  return (
    <StyledContainer>
      <StyledSideBySideWrapper>
        <StyledContentColumn>
          <StyledColumnHeader>{getOriginalLabel()}</StyledColumnHeader>
          <StyledContentBox>
            <div dangerouslySetInnerHTML={{ __html: formatTextAsHtml(originalContent) }} />
          </StyledContentBox>
        </StyledContentColumn>
        
        <StyledContentColumn>
          <StyledColumnHeader>{getTranslatedLabel()}</StyledColumnHeader>
          <StyledContentBox>
            <div dangerouslySetInnerHTML={{ __html: formatTextAsHtml(translatedContent) }} />
          </StyledContentBox>
        </StyledContentColumn>
      </StyledSideBySideWrapper>
      
      <StyledTranslationNote>
        {getTranslationNoteText()}
      </StyledTranslationNote>
    </StyledContainer>
  )
}

export default TranslatedContent

const StyledContainer = styled.div`
  position: relative;
  width: 100%;
`

const StyledSideBySideWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 1rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`

const StyledContentColumn = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`

const StyledColumnHeader = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray11};
  margin-bottom: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: ${({ theme }) => theme.scheme === "light" ? "#e5e7eb" : "#4b5563"};
  border-radius: 0.375rem;
`

const StyledContentBox = styled.div`
  flex: 1;
  padding: 1.25rem;
  background: ${({ theme }) => theme.scheme === "light" ? "#f9fafb" : "#374151"};
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.gray6};
  overflow-x: auto;
  
  /* 텍스트가 너무 길 때 자연스럽게 줄바꿈 */
  word-wrap: break-word;
  overflow-wrap: break-word;
`

const StyledLoadingMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.gray11};
  opacity: 0.6;
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
