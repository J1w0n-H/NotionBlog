import React, { useState, useEffect, useMemo } from "react"
import { ExtendedRecordMap } from "notion-types"
import NotionRenderer from "../NotionRenderer"
import useLanguage from "src/hooks/useLanguage"
import styled from "@emotion/styled"
import { translateHtmlContent, detectLanguage, removeLanguageTag } from "src/libs/utils/translation"

type LanguageType = "ko" | "en"

// 번역 캐시 (메모리 기반)
const translationCache = new Map<string, string>()

type Props = {
  recordMap: ExtendedRecordMap
}

const TranslatedNotionRenderer: React.FC<Props> = ({ recordMap }) => {
  const [currentLanguage] = useLanguage()
  const [htmlContent, setHtmlContent] = useState<string>("")
  const [translatedBlocks, setTranslatedBlocks] = useState<Array<{ original: string; translated: string; type: string }>>([])
  const [isTranslating, setIsTranslating] = useState<boolean>(false)
  const [contentLanguage, setContentLanguage] = useState<LanguageType>("ko")
  const [translationProgress, setTranslationProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 })

  // 블록 추출 (recordMap이 변경될 때만) - useMemo로 최적화
  const extractedBlocks = useMemo(() => {
    return extractBlocksFromRecordMap(recordMap)
  }, [recordMap])

  const textContent = useMemo(() => {
    return extractedBlocks.map(block => block.content).join('\n')
  }, [extractedBlocks])

  const detectedLang = useMemo(() => {
    return detectLanguage(textContent)
  }, [textContent])

  // 상태 업데이트
  useEffect(() => {
    setContentLanguage(detectedLang)
    setHtmlContent(textContent)
  }, [detectedLang, textContent])

  // 번역 (언어가 변경될 때만)
  useEffect(() => {
    if (extractedBlocks.length === 0) return

    const translateBlocks = async () => {
      setIsTranslating(true)
      setTranslatedBlocks([])

      try {
        // 번역이 필요한 경우에만 번역 수행
        if (contentLanguage !== currentLanguage) {
          const validBlocks = extractedBlocks.filter(block => block.content.trim())
          setTranslationProgress({ current: 0, total: validBlocks.length })
          
          const translatedBlockPairs = await translateBlocksInBatches(
            extractedBlocks,
            currentLanguage,
            contentLanguage,
            setTranslationProgress
          )
          setTranslatedBlocks(translatedBlockPairs)
        } else {
          setTranslatedBlocks([])
        }
      } catch (error) {
        console.error("Failed to translate content:", error)
        setTranslatedBlocks([])
      } finally {
        setIsTranslating(false)
      }
    }

    translateBlocks()
  }, [extractedBlocks, contentLanguage, currentLanguage])

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
            <StyledLoadingMessage>
              번역 중... ({translationProgress.current}/{translationProgress.total})
              <StyledProgressBar>
                <StyledProgressFill 
                  progress={(translationProgress.current / translationProgress.total) * 100}
                />
              </StyledProgressBar>
            </StyledLoadingMessage>
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

// 배치 단위로 블록을 번역하는 함수 (성능 최적화)
const translateBlocksInBatches = async (
  blocks: Array<{ id: string; content: string; type: string; order: number }>,
  targetLanguage: LanguageType,
  sourceLanguage: LanguageType,
  setProgress: (progress: { current: number; total: number }) => void
): Promise<Array<{ original: string; translated: string; type: string }>> => {
  const translatedBlockPairs: Array<{ original: string; translated: string; type: string }> = []
  const batchSize = 8 // 한 번에 8개씩 병렬 처리 (3 -> 8로 증가)
  const delayBetweenBatches = 100 // 배치 간 지연 시간 (200ms -> 100ms로 단축)
  
  // 빈 블록 및 번역 불필요한 블록 제거
  const validBlocks = blocks.filter(block => {
    const content = block.content.trim()
    if (!content) return false
    
    // 파일명만 있는 블록은 번역 제외 (속도 최적화)
    const isOnlyFileName = /^[a-zA-Z0-9_-]+\.(png|jpg|jpeg|gif|svg|webp|pdf|doc|docx|xls|xlsx|zip|rar|mp4|mp3|txt|csv|json|xml)$/i.test(content)
    if (isOnlyFileName) return false
    
    return true
  })
  
  for (let i = 0; i < validBlocks.length; i += batchSize) {
    const batch = validBlocks.slice(i, i + batchSize)
    
    // 배치 내 블록들을 병렬로 번역 (캐시 활용)
    const batchPromises = batch.map(async (block) => {
      try {
        // 캐시 키 생성
        const cacheKey = `${block.content}-${sourceLanguage}-${targetLanguage}`
        
        // 캐시에서 확인
        let translated = translationCache.get(cacheKey)
        
        if (!translated) {
          // 캐시에 없으면 번역 수행 (언어 태그 제거 후 번역)
          const contentWithoutTag = removeLanguageTag(block.content)
          translated = await translateHtmlContent(
            contentWithoutTag,
            targetLanguage,
            sourceLanguage
          )
          
          // 캐시에 저장 (캐시 크기 제한: 100 -> 500으로 증가)
          if (translationCache.size > 500) {
            const firstKey = translationCache.keys().next().value
            translationCache.delete(firstKey)
          }
          translationCache.set(cacheKey, translated)
        }
        
        // 파일명 강조 처리
        const styledTranslated = styleFileNames(translated)
        
        return {
          original: removeLanguageTag(block.content),
          translated: styledTranslated,
          type: block.type
        }
      } catch (error) {
        console.error(`Failed to translate block:`, error)
        return {
          original: removeLanguageTag(block.content),
          translated: removeLanguageTag(block.content),
          type: block.type
        }
      }
    })
    
    // 배치 완료 대기
    const batchResults = await Promise.all(batchPromises)
    translatedBlockPairs.push(...batchResults)
    
    // 진행 상황 업데이트
    setProgress({ current: translatedBlockPairs.length, total: validBlocks.length })
    
    // 다음 배치 전 지연 (마지막 배치가 아닌 경우)
    if (i + batchSize < validBlocks.length) {
      await new Promise(resolve => setTimeout(resolve, delayBetweenBatches))
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

          // 유효한 콘텐츠가 있는 블록만 저장 (추가 필터링)
          const trimmedContent = blockContent.trim()
          if (trimmedContent && 
              !isTranslationInstruction(trimmedContent) && 
              !isMetadata(trimmedContent)) {
            const order = orderedBlockIds.indexOf(blockId)
            extractedBlocks.push({
              id: blockId,
              content: trimmedContent,
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
    // 번역 지시사항 패턴들
    /이\s*영어\s*텍스트를\s*한국어로\s*번역하세요/i, // "이 영어 텍스트를 한국어로 번역하세요"
    /translate\s*this\s*english\s*text\s*to\s*korean/i, // "translate this english text to korean"
    /translate\s*this\s*korean\s*text\s*to\s*english/i, // "translate this korean text to english"
    /번역하세요/i, // "번역하세요"로 끝나는 패턴
    /translate\s*this/i, // "translate this"로 시작하는 패턴
    /^translate\s*this\s*.+text\s*to\s*.+:/i, // "Translate this Korean text to English: ..." 패턴
  ]
  
  return metadataPatterns.some(pattern => pattern.test(text.trim()))
}

// 번역 지시사항을 감지하는 함수
const isTranslationInstruction = (text: string): boolean => {
  const instructionPatterns = [
    /^이\s*영어\s*텍스트를\s*한국어로\s*번역하세요/i,
    /^이\s*한국어\s*텍스트를\s*영어로\s*번역하세요/i,
    /^translate\s*this\s*english\s*text\s*to\s*korean/i,
    /^translate\s*this\s*korean\s*text\s*to\s*english/i,
    /^번역하세요/i,
    /^translate\s*this/i,
    /^translate\s*this\s*.+text\s*to\s*.+:/i,
    // 더 구체적인 패턴들
    /^이\s*영어\s*텍스트를\s*한국어로\s*번역하세요\.\s*[가-힣a-zA-Z\s]+\?$/i, // "이 영어 텍스트를 한국어로 번역하세요. Is it similar to what I'm already doing?"
    /^이\s*영어\s*텍스트를\s*한국어로\s*번역하세요\.\s*[가-힣a-zA-Z\s]+\?$/i, // "이 영어 텍스트를 한국어로 번역하세요. Does it align with my long-term direction?"
  ]
  
  return instructionPatterns.some(pattern => pattern.test(text.trim()))
}

// 파일명을 회색으로 스타일링하는 함수
const styleFileNames = (text: string | undefined): string => {
  if (!text) return ""
  
  // 파일명 패턴: word.ext 형식 (이미지, 문서 등)
  const fileNamePattern = /\b([a-zA-Z0-9_-]+\.(png|jpg|jpeg|gif|svg|webp|pdf|doc|docx|xls|xlsx|zip|rar|mp4|mp3|txt|csv|json|xml))\b/gi
  
  return text.replace(fileNamePattern, (match) => {
    return `<span style="color: #9ca3af; opacity: 0.6; font-size: 0.875em;">${match}</span>`
  })
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.gray11};
  opacity: 0.8;
  gap: 1rem;
`

const StyledProgressBar = styled.div`
  width: 200px;
  height: 8px;
  background: ${({ theme }) => theme.colors.gray6};
  border-radius: 4px;
  overflow: hidden;
`

const StyledProgressFill = styled.div<{ progress: number }>`
  width: ${({ progress }) => progress}%;
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 4px;
  transition: width 0.3s ease;
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
