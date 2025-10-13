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

  // 텍스트를 문장 단위로 분할하는 함수
  const splitIntoSentences = (text: string): string[] => {
    if (!text || !text.trim()) return []
    
    const sentences: string[] = []
    const lines = text.split('\n')
    
    lines.forEach(line => {
      const trimmedLine = line.trim()
      if (!trimmedLine) return
      
      // 문장 단위로 분할 (한국어: 마침표, 느낌표, 물음표 / 영어: . ! ?)
      const sentenceParts = trimmedLine.split(/(?<=[.!?。！？])\s+/)
      
      sentenceParts.forEach(sentence => {
        const trimmed = sentence.trim()
        if (trimmed) {
          sentences.push(trimmed)
        }
      })
    })
    
    return sentences
  }

  // 문장 쌍을 생성하는 함수 (원문-번역 매칭)
  const createSentencePairs = () => {
    const originalSentences = splitIntoSentences(originalContent)
    const translatedSentences = splitIntoSentences(translatedContent)
    
    // 두 배열의 길이를 맞춤 (더 긴 쪽에 맞춤)
    const maxLength = Math.max(originalSentences.length, translatedSentences.length)
    
    const pairs: Array<{ original: string; translated: string }> = []
    
    for (let i = 0; i < maxLength; i++) {
      pairs.push({
        original: originalSentences[i] || '',
        translated: translatedSentences[i] || ''
      })
    }
    
    return pairs
  }

  // 콘텐츠 언어와 UI 언어가 같으면 원본만 표시
  if (contentLanguage === currentLanguage) {
    return (
      <StyledSimpleContent>
        {splitIntoSentences(originalContent).map((sentence, index) => (
          <p key={index} style={{ margin: '0.75rem 0', lineHeight: 1.7 }}>
            {sentence}
          </p>
        ))}
      </StyledSimpleContent>
    )
  }

  if (isTranslating) {
    return (
      <StyledContainer>
        <StyledHeader>
          <StyledHeaderLabel>{getOriginalLabel()}</StyledHeaderLabel>
          <StyledHeaderDivider />
          <StyledHeaderLabel>{getTranslatedLabel()}</StyledHeaderLabel>
        </StyledHeader>
        
        {splitIntoSentences(originalContent).map((sentence, index) => (
          <StyledSentenceRow key={index}>
            <StyledSentenceCell>{sentence}</StyledSentenceCell>
            <StyledDivider />
            <StyledSentenceCell>
              <StyledLoadingText>번역 중...</StyledLoadingText>
            </StyledSentenceCell>
          </StyledSentenceRow>
        ))}
        
        <StyledTranslationNote>
          {getTranslationNoteText()}
        </StyledTranslationNote>
      </StyledContainer>
    )
  }

  const sentencePairs = createSentencePairs()

  return (
    <StyledContainer>
      <StyledHeader>
        <StyledHeaderLabel>{getOriginalLabel()}</StyledHeaderLabel>
        <StyledHeaderDivider />
        <StyledHeaderLabel>{getTranslatedLabel()}</StyledHeaderLabel>
      </StyledHeader>
      
      {sentencePairs.map((pair, index) => (
        <StyledSentenceRow key={index}>
          <StyledSentenceCell>{pair.original}</StyledSentenceCell>
          <StyledDivider />
          <StyledSentenceCell>{pair.translated}</StyledSentenceCell>
        </StyledSentenceRow>
      ))}
      
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
  margin-top: 1rem;
`

const StyledSimpleContent = styled.div`
  padding: 1rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.gray12};
`

const StyledHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.scheme === "light" ? "#e5e7eb" : "#4b5563"};
  border-radius: 0.5rem 0.5rem 0 0;
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.6rem 0.75rem;
  }
`

const StyledHeaderLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray12};
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`

const StyledHeaderDivider = styled.div`
  width: 2px;
  height: 1.5rem;
  background: ${({ theme }) => theme.colors.gray7};
`

const StyledSentenceRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray5};
  
  &:last-of-type {
    border-bottom: none;
  }
  
  &:hover {
    background: ${({ theme }) => theme.scheme === "light" ? "#f9fafb" : "#2d3748"};
  }
  
  @media (max-width: 768px) {
    gap: 0.5rem;
    padding: 0.5rem 0;
  }
`

const StyledSentenceCell = styled.div`
  padding: 0.5rem 1rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.gray12};
  word-wrap: break-word;
  overflow-wrap: break-word;
  
  @media (max-width: 768px) {
    padding: 0.4rem 0.75rem;
    font-size: 0.9rem;
  }
`

const StyledDivider = styled.div`
  width: 2px;
  background: ${({ theme }) => theme.colors.gray6};
  align-self: stretch;
`

const StyledLoadingText = styled.span`
  color: ${({ theme }) => theme.colors.gray9};
  font-style: italic;
  font-size: 0.875rem;
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
