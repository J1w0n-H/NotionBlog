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
  const [showTranslation, setShowTranslation] = useState<boolean>(false)
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
      <StyledToggleButton onClick={() => setShowTranslation(!showTranslation)}>
        {showTranslation ? "번역 숨기기" : "번역 보기"}
      </StyledToggleButton>
      
      <StyledContentWrapper>
        <StyledMainContent>
          <NotionRenderer recordMap={recordMap} />
        </StyledMainContent>
        
        {showTranslation && (
          <StyledTranslationSidebar>
            <StyledSidebarHeader>
              <h3>번역</h3>
              <StyledCloseButton onClick={() => setShowTranslation(false)}>
                ✕
              </StyledCloseButton>
            </StyledSidebarHeader>
            <TranslatedTextContent recordMap={recordMap} />
            <StyledTranslationNote>
              * Google 번역을 통해 자동 번역되었습니다.
            </StyledTranslationNote>
          </StyledTranslationSidebar>
        )}
      </StyledContentWrapper>
      
      {isTranslating && (
        <StyledLoadingOverlay>
          <div>번역 중...</div>
        </StyledLoadingOverlay>
      )}
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
    return (
      <StyledLoadingContainer>
        <div>번역 중...</div>
      </StyledLoadingContainer>
    )
  }

  return (
    <StyledTranslatedText>
      {translatedText}
    </StyledTranslatedText>
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

const StyledContentWrapper = styled.div`
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  
  @media (max-width: 1200px) {
    flex-direction: column;
    gap: 1rem;
  }
`

const StyledMainContent = styled.div`
  flex: 1;
  min-width: 0; // flexbox에서 오버플로우 방지
`

const StyledTranslationSidebar = styled.div`
  width: 400px;
  background: ${({ theme }) => theme.colors.gray1};
  border: 1px solid ${({ theme }) => theme.colors.gray6};
  border-radius: 0.5rem;
  position: sticky;
  top: 5rem;
  max-height: calc(100vh - 8rem);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 1200px) {
    width: 100%;
    position: relative;
    top: 0;
    max-height: none;
  }
`

const StyledSidebarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray6};
  background: ${({ theme }) => theme.colors.gray2};
  
  h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.gray12};
  }
`

const StyledCloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.gray11};
  padding: 0.25rem;
  border-radius: 0.25rem;
  
  &:hover {
    background: ${({ theme }) => theme.colors.gray3};
  }
`

const StyledTranslatedText = styled.div`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  line-height: 1.6;
  font-size: 0.875rem;
  white-space: pre-wrap;
  word-break: break-word;
  color: ${({ theme }) => theme.colors.gray12};
`

const StyledLoadingContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.gray11};
`

const StyledTranslationNote = styled.div`
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => theme.colors.gray2};
  border-top: 1px solid ${({ theme }) => theme.colors.gray6};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.gray11};
  text-align: center;
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
