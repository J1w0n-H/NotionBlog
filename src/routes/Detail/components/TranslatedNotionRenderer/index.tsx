import React, { useState, useEffect } from "react"
import { ExtendedRecordMap } from "notion-types"
import NotionRenderer from "../NotionRenderer"
import useLanguage from "src/hooks/useLanguage"
import styled from "@emotion/styled"

type Props = {
  recordMap: ExtendedRecordMap
}

const TranslatedNotionRenderer: React.FC<Props> = ({ recordMap }) => {
  const [currentLanguage] = useLanguage()
  const [showTranslated, setShowTranslated] = useState<boolean>(false)
  const [isTranslating, setIsTranslating] = useState<boolean>(false)

  // 현재 언어가 한국어인 경우 원본 표시
  if (currentLanguage === "ko") {
    return (
      <StyledContainer>
        <NotionRenderer recordMap={recordMap} />
      </StyledContainer>
    )
  }

  // 영어인 경우 번역 옵션 제공
  return (
    <StyledContainer>
      <StyledToggleButton onClick={() => setShowTranslated(!showTranslated)}>
        {showTranslated ? "원문 보기" : "번역 보기"}
      </StyledToggleButton>
      
      {isTranslating && (
        <StyledLoadingOverlay>
          <div>번역 중...</div>
        </StyledLoadingOverlay>
      )}
      
      <div style={{ position: 'relative' }}>
        {showTranslated ? (
          <>
            <StyledTranslatedContent>
              <TranslatedTextContent recordMap={recordMap} />
            </StyledTranslatedContent>
            <StyledTranslationNote>
              * Google 번역을 통해 자동 번역되었습니다. 원본 구조는 유지되지 않을 수 있습니다.
            </StyledTranslationNote>
          </>
        ) : (
          <NotionRenderer recordMap={recordMap} />
        )}
      </div>
    </StyledContainer>
  )
}

// 번역된 텍스트 콘텐츠 컴포넌트
const TranslatedTextContent: React.FC<{ recordMap: ExtendedRecordMap }> = ({ recordMap }) => {
  const [translatedText, setTranslatedText] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const extractAndTranslate = async () => {
      setIsLoading(true)
      try {
        const textContent = extractTextFromRecordMap(recordMap)
        const translated = await translateText(textContent, "en")
        setTranslatedText(translated)
      } catch (error) {
        console.error("Translation failed:", error)
        setTranslatedText("번역에 실패했습니다.")
      } finally {
        setIsLoading(false)
      }
    }

    extractAndTranslate()
  }, [recordMap])

  if (isLoading) {
    return <div>번역 중...</div>
  }

  return (
    <div style={{ 
      lineHeight: '1.6', 
      fontSize: '1rem',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word'
    }}>
      {translatedText}
    </div>
  )
}

export default TranslatedNotionRenderer

// Notion RecordMap에서 텍스트 추출하는 함수
const extractTextFromRecordMap = (recordMap: ExtendedRecordMap): string => {
  try {
    const blocks = Object.values(recordMap.block)
    let textContent = ""

    blocks.forEach((block: any) => {
      if (block.value && block.value.properties) {
        const properties = block.value.properties
        Object.values(properties).forEach((prop: any) => {
          if (Array.isArray(prop)) {
            prop.forEach((item: any) => {
              if (Array.isArray(item)) {
                item.forEach((text: any) => {
                  if (typeof text === "string") {
                    textContent += text + " "
                  } else if (text && typeof text === "object" && text[0]) {
                    textContent += text[0] + " "
                  }
                })
              }
            })
          }
        })
      }
    })

    return textContent.trim()
  } catch (error) {
    console.error("Error extracting text:", error)
    return ""
  }
}

// Google Translate API를 사용한 번역 함수
const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`
    )
    
    if (!response.ok) {
      throw new Error("Translation failed")
    }
    
    const data = await response.json()
    return data[0][0][0] || text
  } catch (error) {
    console.error("Translation error:", error)
    return text
  }
}

const StyledContainer = styled.div`
  position: relative;
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
  margin-bottom: 1rem;
  
  &:hover {
    background: ${({ theme }) => theme.colors.blue10};
  }
  
  @media (max-width: 768px) {
    position: relative;
    top: 0;
    margin-bottom: 1rem;
  }
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
  z-index: 5;
`

const StyledTranslatedContent = styled.div`
  background: ${({ theme }) => theme.colors.gray1};
  padding: 2rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.gray6};
  margin-bottom: 1rem;
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
