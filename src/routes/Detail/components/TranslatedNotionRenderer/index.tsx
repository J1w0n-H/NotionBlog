import React, { useState, useEffect } from "react"
import { ExtendedRecordMap } from "notion-types"
import NotionRenderer from "../NotionRenderer"
import useLanguage from "src/hooks/useLanguage"
import styled from "@emotion/styled"
import { translateHtmlContent, detectLanguage, LanguageType } from "src/libs/utils/translation"

type Props = {
  recordMap: ExtendedRecordMap
}

const TranslatedNotionRenderer: React.FC<Props> = ({ recordMap }) => {
  const [currentLanguage] = useLanguage()
  const [htmlContent, setHtmlContent] = useState<string>("")
  const [translatedContent, setTranslatedContent] = useState<string>("")
  const [isTranslating, setIsTranslating] = useState<boolean>(false)
  const [contentLanguage, setContentLanguage] = useState<LanguageType>("ko")

  useEffect(() => {
    const extractAndTranslate = async () => {
      setIsTranslating(true)
      setTranslatedContent("")

      try {
        // 1. Notion 콘텐츠를 HTML로 추출
        const textContent = extractTextFromRecordMap(recordMap)
        setHtmlContent(textContent)

        // 2. 콘텐츠 언어 감지
        const detectedLang = detectLanguage(textContent)
        setContentLanguage(detectedLang)

        // 3. 번역이 필요한 경우 번역 수행
        if (detectedLang !== currentLanguage) {
          const translated = await translateHtmlContent(
            textContent,
            currentLanguage,
            detectedLang
          )
          setTranslatedContent(translated)
        } else {
          setTranslatedContent("")
        }
      } catch (error) {
        console.error("Failed to extract or translate content:", error)
        setHtmlContent("")
        setTranslatedContent("")
      } finally {
        setIsTranslating(false)
      }
    }

    extractAndTranslate()
  }, [recordMap, currentLanguage])

  // 콘텐츠 언어와 UI 언어가 같으면 원본만 표시
  if (contentLanguage === currentLanguage && !isTranslating) {
    return (
      <StyledContainer>
        <NotionRenderer recordMap={recordMap} />
      </StyledContainer>
    )
  }

  // 번역이 필요한 경우 사이드 바이 사이드 표시
  return (
    <StyledSideBySideWrapper>
      {/* 원본 본문 컬럼 */}
      <StyledContentColumn>
        <StyledColumnHeader>
          {contentLanguage === "ko" ? "원문 (한국어)" : "Original (English)"}
        </StyledColumnHeader>
        <StyledNotionRendererWrapper>
          <NotionRenderer recordMap={recordMap} />
        </StyledNotionRendererWrapper>
      </StyledContentColumn>

      {/* 번역 컬럼 */}
      <StyledContentColumn>
        <StyledColumnHeader>
          {currentLanguage === "ko" ? "번역 (한국어)" : "Translation (English)"}
        </StyledColumnHeader>
        <StyledContentBox>
          {isTranslating ? (
            <StyledLoadingMessage>번역 중...</StyledLoadingMessage>
          ) : (
            <StyledTranslatedContent
              dangerouslySetInnerHTML={{ __html: translatedContent }}
            />
          )}
        </StyledContentBox>
        <StyledTranslationNote>
          {currentLanguage === "ko" 
            ? "* Google 번역을 통해 자동 번역되었습니다." 
            : "* Automatically translated via Google Translate."
          }
        </StyledTranslationNote>
      </StyledContentColumn>
    </StyledSideBySideWrapper>
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

    // 페이지의 content 배열을 사용하여 블록 순서 결정
    const pageBlock = recordMap.block[pageId]
    let orderedBlockIds: string[] = []
    
    if (pageBlock?.value?.content) {
      orderedBlockIds = pageBlock.value.content
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
            const order = orderedBlockIds.indexOf(blockId)
            extractedBlocks.push({
              id: blockId,
              content: blockContent.trim(),
              type: blockType,
              order: order >= 0 ? order : 999 // 순서가 없으면 맨 뒤로
            })
          }
        }
      }
    })

    // 블록을 순서대로 정렬
    extractedBlocks.sort((a, b) => a.order - b.order)

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

const StyledNotionRendererWrapper = styled.div`
  flex: 1;
  padding: 1.25rem;
  background: ${({ theme }) => theme.scheme === "light" ? "#f9fafb" : "#374151"};
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.gray6};
  overflow-x: auto;
  
  /* NotionRenderer 내부 스타일 조정 */
  .notion-page {
    padding: 0 !important;
  }
`

const StyledContentBox = styled.div`
  flex: 1;
  padding: 1.25rem;
  background: ${({ theme }) => theme.scheme === "light" ? "#f9fafb" : "#374151"};
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.gray6};
  overflow-x: auto;
  word-wrap: break-word;
  overflow-wrap: break-word;
`

const StyledTranslatedContent = styled.div`
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.gray12};
  
  p {
    margin: 0.75rem 0;
  }
  
  h1, h2, h3, h4, h5, h6 {
    margin: 1.5rem 0 0.75rem 0;
    font-weight: 600;
  }
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
  margin-top: 0.75rem;
  padding: 0.5rem;
  background: ${({ theme }) => theme.colors.gray3};
  border-radius: 0.375rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.gray11};
  text-align: center;
`
