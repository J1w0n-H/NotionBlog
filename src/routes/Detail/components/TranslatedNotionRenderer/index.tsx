import React, { useState, useEffect, lazy, Suspense } from "react"
import { ExtendedRecordMap } from "notion-types"
import NotionRenderer from "../NotionRenderer"
import useLanguage from "src/hooks/useLanguage"
import styled from "@emotion/styled"

// 번역 기능을 lazy loading으로 분리
const TranslatedContent = lazy(() => import("src/components/TranslatedContent"))

type Props = {
  recordMap: ExtendedRecordMap
}

const TranslatedNotionRenderer: React.FC<Props> = ({ recordMap }) => {
  const [currentLanguage] = useLanguage()
  const [htmlContent, setHtmlContent] = useState<string>("")
  const [isExtracting, setIsExtracting] = useState<boolean>(true)
  const [showTranslation, setShowTranslation] = useState<boolean>(false)

  useEffect(() => {
    // 번역이 필요한 경우에만 콘텐츠 추출
    if (currentLanguage !== "ko") {
      const extractHtmlContent = async () => {
        setIsExtracting(true)
        try {
          const textContent = extractTextFromRecordMap(recordMap)
          setHtmlContent(textContent)
        } catch (error) {
          console.error("Failed to extract content:", error)
          setHtmlContent("")
        } finally {
          setIsExtracting(false)
        }
      }

      extractHtmlContent()
    } else {
      setIsExtracting(false)
    }
  }, [recordMap, currentLanguage])

  // 한국어인 경우 원본 표시
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
        {showTranslation ? "원문 보기" : "번역 보기"}
      </StyledToggleButton>
      
      {showTranslation ? (
        <Suspense fallback={<StyledLoading>번역 로딩 중...</StyledLoading>}>
          <TranslatedContent
            originalContent={htmlContent}
            currentLanguage="ko"
            targetLanguage="en"
          />
        </Suspense>
      ) : (
        <NotionRenderer recordMap={recordMap} />
      )}
      
      {showTranslation && (
        <StyledOriginalSection>
          <h3>원문</h3>
          <NotionRenderer recordMap={recordMap} />
        </StyledOriginalSection>
      )}
    </StyledContainer>
  )
}

export default TranslatedNotionRenderer

// 개선된 Notion RecordMap에서 텍스트 추출하는 함수
const extractTextFromRecordMap = (recordMap: ExtendedRecordMap): string => {
  try {
    const blocks = Object.values(recordMap.block)
    let textContent = ""

    blocks.forEach((block) => {
      if (block.value && block.value.properties) {
        const properties = block.value.properties
        const blockType = block.value.type

        // 블록 타입에 따른 줄바꿈 처리
        if (blockType === "header" || blockType === "sub_header" || blockType === "sub_sub_header") {
          textContent += "\n\n"
        } else if (blockType === "text" || blockType === "bulleted_list" || blockType === "numbered_list") {
          textContent += "\n"
        }

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

        // 블록 끝에 줄바꿈 추가
        if (blockType === "header" || blockType === "sub_header" || blockType === "sub_sub_header") {
          textContent += "\n"
        }
      }
    })

    // 연속된 줄바꿈 정리 및 공백 정리
    return textContent
      .replace(/\n\s*\n\s*\n/g, "\n\n") // 3개 이상 연속된 줄바꿈을 2개로
      .replace(/\s+/g, " ") // 연속된 공백을 하나로
      .trim()
  } catch (error) {
    console.error("Error extracting text:", error)
    return ""
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
  
  &:hover {
    background: ${({ theme }) => theme.colors.blue10};
  }
  
  @media (max-width: 768px) {
    position: relative;
    top: 0;
    margin-bottom: 1rem;
  }
`

const StyledLoading = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.gray11};
`

const StyledOriginalSection = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid ${({ theme }) => theme.colors.gray6};
  
  h3 {
    margin-bottom: 1rem;
    font-size: 1.25rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.gray11};
  }
`
