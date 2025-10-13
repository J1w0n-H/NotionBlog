import React, { useState, useEffect } from "react"
import { ExtendedRecordMap } from "notion-types"
import NotionRenderer from "../NotionRenderer"
import useLanguage from "src/hooks/useLanguage"
import styled from "@emotion/styled"
import { translateHtmlContent, detectLanguage } from "src/libs/utils/translation"

type LanguageType = "ko" | "en"

type Props = {
  recordMap: ExtendedRecordMap
}

const TranslatedNotionRenderer: React.FC<Props> = ({ recordMap }) => {
  const [currentLanguage] = useLanguage()
  const [htmlContent, setHtmlContent] = useState<string>("")
  const [translatedBlocks, setTranslatedBlocks] = useState<Array<{ original: string; translated: string; type: string }>>([])
  const [isTranslating, setIsTranslating] = useState<boolean>(false)
  const [contentLanguage, setContentLanguage] = useState<LanguageType>("ko")

  useEffect(() => {
    const extractAndTranslate = async () => {
      setIsTranslating(true)
      setTranslatedBlocks([])

      try {
        // 1. Notion 콘텐츠를 블록별로 추출
        const blocks = extractBlocksFromRecordMap(recordMap)
        const textContent = blocks.map(block => block.content).join('\n')
        setHtmlContent(textContent)

        // 2. 콘텐츠 언어 감지
        const detectedLang = detectLanguage(textContent)
        setContentLanguage(detectedLang)

        // 3. 번역이 필요한 경우 블록별로 번역 수행
        if (detectedLang !== currentLanguage) {
          const translatedBlockPairs = await translateBlocksSequentially(
            blocks,
            currentLanguage,
            detectedLang
          )
          setTranslatedBlocks(translatedBlockPairs)
        } else {
          setTranslatedBlocks([])
        }
      } catch (error) {
        console.error("Failed to extract or translate content:", error)
        setHtmlContent("")
        setTranslatedBlocks([])
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
        <NotionRenderer recordMap={recordMap} />
      </StyledContentColumn>

      {/* 번역 컬럼 */}
      <StyledContentColumn>
        <StyledTranslationHeader>
          {currentLanguage === "ko" ? "번역 (한국어)" : "Translation (English)"}
        </StyledTranslationHeader>
        <StyledTranslationContent>
          {isTranslating ? (
            <StyledLoadingMessage>번역 중...</StyledLoadingMessage>
          ) : (
            <StyledBlockList>
              {translatedBlocks.map((block, index) => (
                <StyledBlockItem key={index} type={block.type}>
                  <div dangerouslySetInnerHTML={{ __html: block.translated }} />
                </StyledBlockItem>
              ))}
            </StyledBlockList>
          )}
        </StyledTranslationContent>
        <StyledTranslationNote>
          {currentLanguage === "ko" 
            ? "Google 번역을 통해 자동 번역되었습니다." 
            : "Automatically translated via Google Translate."
          }
        </StyledTranslationNote>
      </StyledContentColumn>
    </StyledSideBySideWrapper>
  )
}

export default TranslatedNotionRenderer

// 블록별로 번역하는 함수
const translateBlocksSequentially = async (
  blocks: Array<{ id: string; content: string; type: string; order: number }>,
  targetLanguage: LanguageType,
  sourceLanguage: LanguageType
): Promise<Array<{ original: string; translated: string; type: string }>> => {
  const translatedBlockPairs: Array<{ original: string; translated: string; type: string }> = []
  
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]
    
    try {
      // 빈 블록은 건너뛰기
      if (!block.content.trim()) {
        continue
      }
      
      // 블록별로 번역 수행
      const translated = await translateHtmlContent(
        block.content,
        targetLanguage,
        sourceLanguage
      )
      
      translatedBlockPairs.push({
        original: block.content,
        translated: translated,
        type: block.type
      })
      
      // API 호출 간격 조절 (rate limiting 방지)
      if (i < blocks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300))
      }
    } catch (error) {
      console.error(`Failed to translate block ${i + 1}:`, error)
      // 번역 실패 시 원본 블록 사용
      translatedBlockPairs.push({
        original: block.content,
        translated: block.content,
        type: block.type
      })
    }
  }
  
  return translatedBlockPairs
}

// Notion RecordMap에서 블록별로 추출하는 함수
const extractBlocksFromRecordMap = (recordMap: ExtendedRecordMap): Array<{ id: string; content: string; type: string; order: number }> => {
  try {
    // 페이지의 루트 블록 ID 찾기
    const pageId = Object.keys(recordMap.block)[0]
    if (!pageId) {
      console.error("No page ID found")
      return []
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

    return extractedBlocks
  } catch (error) {
    console.error("Error extracting blocks:", error)
    return []
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
  gap: 2rem;
  margin-top: 1rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`

const StyledContentColumn = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`

const StyledTranslationHeader = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray11};
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.scheme === "light" ? "#e5e7eb" : "#4b5563"};
  border-radius: 0.5rem;
  border-left: 4px solid ${({ theme }) => theme.colors.blue9};
`

const StyledTranslationContent = styled.div`
  flex: 1;
  padding: 1.5rem;
  background: ${({ theme }) => theme.scheme === "light" ? "#f9fafb" : "#374151"};
  border-radius: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.gray6};
  overflow-x: auto;
  word-wrap: break-word;
  overflow-wrap: break-word;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.gray12};
  
  p {
    margin: 0.75rem 0;
  }
  
  h1, h2, h3, h4, h5, h6 {
    margin: 1.5rem 0 0.75rem 0;
    font-weight: 600;
  }
  
  ul, ol {
    margin: 0.75rem 0;
    padding-left: 1.5rem;
  }
  
  li {
    margin: 0.25rem 0;
  }
  
  blockquote {
    margin: 1rem 0;
    padding: 0.75rem 1rem;
    border-left: 4px solid ${({ theme }) => theme.colors.gray7};
    background: ${({ theme }) => theme.scheme === "light" ? "#f3f4f6" : "#2d3748"};
    border-radius: 0 0.375rem 0.375rem 0;
  }
  
  code {
    background: ${({ theme }) => theme.scheme === "light" ? "#f1f5f9" : "#1e293b"};
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-size: 0.875em;
  }
  
  pre {
    background: ${({ theme }) => theme.scheme === "light" ? "#f1f5f9" : "#1e293b"};
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 1rem 0;
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
  font-style: italic;
`

const StyledBlockList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const StyledBlockItem = styled.div<{ type: string }>`
  padding: ${({ type }) => 
    type === "header" || type === "sub_header" || type === "sub_sub_header" 
      ? "0.75rem 1rem" 
      : "0.5rem 0.75rem"
  };
  background: ${({ theme, type }) => 
    type === "header" || type === "sub_header" || type === "sub_sub_header"
      ? theme.scheme === "light" ? "#f1f5f9" : "#1e293b"
      : theme.scheme === "light" ? "#ffffff" : "#374151"
  };
  border-radius: 0.5rem;
  border-left: ${({ type }) => 
    type === "header" ? "4px solid #3b82f6" :
    type === "sub_header" ? "4px solid #6366f1" :
    type === "sub_sub_header" ? "4px solid #8b5cf6" :
    "2px solid #e5e7eb"
  };
  
  font-size: ${({ type }) => 
    type === "header" ? "1.125rem" :
    type === "sub_header" ? "1rem" :
    type === "sub_sub_header" ? "0.875rem" :
    "0.875rem"
  };
  
  font-weight: ${({ type }) => 
    type === "header" || type === "sub_header" || type === "sub_sub_header" 
      ? "600" 
      : "400"
  };
  
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.gray12};
  
  p {
    margin: 0.25rem 0;
  }
  
  ul, ol {
    margin: 0.5rem 0;
    padding-left: 1.25rem;
  }
  
  li {
    margin: 0.125rem 0;
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
  border: 1px solid ${({ theme }) => theme.colors.gray6};
`
