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
    // 페이지의 루트 블록 ID 찾기
    const pageId = Object.keys(recordMap.block)[0]
    if (!pageId) {
      console.error("No page ID found")
      return ""
    }

    const extractedBlocks: Array<{ id: string; content: string; type: string; order: number }> = []
    
    // 모든 블록을 순회하면서 유효한 텍스트 블록 찾기
    Object.entries(recordMap.block).forEach(([blockId, block]) => {
      if (block.value && block.value.properties) {
        const properties = block.value.properties
        const blockType = block.value.type
        let blockContent = ""

        // 실제 텍스트 콘텐츠만 추출
        if (properties.title || properties.rich_text) {
          const textBlocks = properties.title || properties.rich_text || []
          
          textBlocks.forEach((textBlock: any) => {
            if (Array.isArray(textBlock)) {
              textBlock.forEach((text: any) => {
                if (typeof text === "string" && text.trim()) {
                  // 메타데이터 필터링
                  if (!isMetadata(text)) {
                    blockContent += text + " "
                  }
                } else if (text && typeof text === "object" && text[0] && typeof text[0] === "string") {
                  if (!isMetadata(text[0])) {
                    blockContent += text[0] + " "
                  }
                }
              })
            }
          })

          // 유효한 콘텐츠가 있는 블록만 저장
          if (blockContent.trim()) {
            extractedBlocks.push({
              id: blockId,
              content: blockContent.trim(),
              type: blockType,
              order: block.value.content?.index || 0
            })
          }
        }
      }
    })

    // 블록을 순서대로 정렬
    extractedBlocks.sort((a, b) => a.order - b.order)
    
    console.log("Extracted blocks in order:", extractedBlocks.map(b => ({ content: b.content.substring(0, 50), type: b.type, order: b.order })))

    // 정렬된 블록들을 텍스트로 변환
    let textContent = ""
    extractedBlocks.forEach((block, index) => {
      textContent += block.content
      
      // 블록 타입에 따른 줄바꿈 처리
      if (block.type === "header" || block.type === "sub_header" || block.type === "sub_sub_header") {
        textContent += "\n\n"
      } else if (block.type === "text" || block.type === "bulleted_list" || block.type === "numbered_list") {
        textContent += "\n"
      } else {
        textContent += "\n"
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

// 메타데이터 필터링 함수
const isMetadata = (text: string): boolean => {
  const metadataPatterns = [
    /^\d+\s*[d,]/i, // "133 d," 같은 패턴
    /\[object Object\]/i, // [object Object]
    /attachment:/i, // attachment:로 시작
    /Public\s*\d+\.?\d*\s*MB/i, // "Public 3.5 MB" 같은 패턴
    /^\d+\.?\d*\s*MB/i, // "2.1 MB" 같은 패턴
    /^[a-f0-9-]+$/i, // UUID 패턴
    /^[a-f0-9-]+:[a-f0-9-]+$/i, // attachment:uuid 패턴
    /^Post\s+JW-\d+/i, // "Post JW-133" 같은 패턴
    /^[a-z]+\s*,\s*[a-f0-9-]+$/i, // "u, 5cba3530-6cb4-4235-807b-f098d646735a" 같은 패턴
    /^IMG_\d+\.(jpeg|jpg|png|gif)$/i, // 이미지 파일명
    /^\d+\.?\d*\s*KB$/i, // "473.4KB" 같은 패턴
  ]
  
  return metadataPatterns.some(pattern => pattern.test(text.trim()))
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
