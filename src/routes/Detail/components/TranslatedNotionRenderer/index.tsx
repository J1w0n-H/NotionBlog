import React, { useState, useEffect } from "react"
import { ExtendedRecordMap } from "notion-types"
import NotionRenderer from "../NotionRenderer"
import TranslatedContent from "src/components/TranslatedContent"
import useLanguage from "src/hooks/useLanguage"
import styled from "@emotion/styled"

type Props = {
  recordMap: ExtendedRecordMap
}

const TranslatedNotionRenderer: React.FC<Props> = ({ recordMap }) => {
  const [currentLanguage] = useLanguage()
  const [htmlContent, setHtmlContent] = useState<string>("")
  const [isExtracting, setIsExtracting] = useState<boolean>(true)

  useEffect(() => {
    // Notion 콘텐츠를 HTML로 추출
    const extractHtmlContent = async () => {
      setIsExtracting(true)
      try {
        // 개선된 텍스트 추출
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
  }, [recordMap])

  if (isExtracting) {
    return (
      <StyledContainer>
        <NotionRenderer recordMap={recordMap} />
      </StyledContainer>
    )
  }

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
      <TranslatedContent
        originalContent={htmlContent}
        currentLanguage={currentLanguage}
        targetLanguage="en"
      />
      <StyledOriginalSection>
        <h3>원문</h3>
        <NotionRenderer recordMap={recordMap} />
      </StyledOriginalSection>
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
