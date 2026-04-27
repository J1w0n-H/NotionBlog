import { LanguageType } from "src/hooks/useLanguage"
import { METADATA_PATTERNS, TRANSLATION_CONFIG } from "src/constants/translation"

// 번역 결과에서 메타데이터를 제거하는 함수
const removeMetadataFromTranslation = (text: string): string => {
  if (!text) return text

  let cleanedText = text

  // 각 패턴을 제거
  METADATA_PATTERNS.forEach(pattern => {
    cleanedText = cleanedText.replace(pattern, '')
  })

  // 앞뒤 공백 제거
  cleanedText = cleanedText.trim()

  return cleanedText
}

// Google Translate API를 사용한 번역 함수
export const translateText = async (
  text: string,
  targetLanguage: LanguageType,
  sourceLanguage: LanguageType = "ko"
): Promise<string> => {
  try {
    // Google Translate API 사용 (무료 버전)
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLanguage}&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`
    
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Translation failed: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    
    // 번역 결과 추출 (안전한 접근)
    let translatedText = ""
    if (Array.isArray(data) && data[0] && Array.isArray(data[0])) {
      data[0].forEach((item: any) => {
        if (Array.isArray(item) && item[0]) {
          translatedText += item[0]
        }
      })
    }
    
    // 번역 결과에서 메타데이터 제거
    const cleanedText = removeMetadataFromTranslation(translatedText || text)
    
    return cleanedText
  } catch (error) {
    console.error("Translation error:", error)
    return text // 번역 실패 시 원본 텍스트 반환
  }
}

// HTML 콘텐츠 번역 함수
export const translateHtmlContent = async (
  htmlContent: string,
  targetLanguage: LanguageType,
  sourceLanguage: LanguageType = "ko"
): Promise<string> => {
  try {
    // HTML 태그가 없으면 바로 번역 (빠른 경로)
    if (!/<[^>]*>/.test(htmlContent)) {
      return await translateText(htmlContent, targetLanguage, sourceLanguage)
    }
    
    // HTML 태그 보호 (간단한 플레이스홀더 사용)
    const tagMap = new Map<string, string>()
    let tagCounter = 0
    
    const protectedContent = htmlContent.replace(
      /<[^>]*>/g,
      (match) => {
        const placeholder = `__TAG${tagCounter}__`
        tagMap.set(placeholder, match)
        tagCounter++
        return placeholder
      }
    )
    
    const translatedText = await translateText(protectedContent, targetLanguage, sourceLanguage)
    
    // 태그 복원
    let restoredContent = translatedText
    tagMap.forEach((tag, placeholder) => {
      restoredContent = restoredContent.replace(placeholder, tag)
    })
    
    // HTML 콘텐츠에서도 메타데이터 제거
    const cleanedContent = removeMetadataFromTranslation(restoredContent)
    
    return cleanedContent
  } catch (error) {
    console.error("HTML translation error:", error)
    return htmlContent
  }
}

// 언어별 표시 텍스트
export const getLanguageText = (language: LanguageType): string => {
  return language === "ko" ? "한국어" : "English"
}

// 언어별 이모지
export const getLanguageEmoji = (language: LanguageType): string => {
  return language === "ko" ? "🇰🇷" : "🇺🇸"
}

// 텍스트의 언어를 감지하는 함수 (데이터베이스 lang 필드 우선, 없으면 텍스트 분석)
export const detectLanguage = (text: string, langField?: string): LanguageType => {
  // 데이터베이스 lang 필드가 있고 문자열이면 사용
  if (langField && typeof langField === 'string') {
    const normalizedLang = langField.toLowerCase().trim()
    if (normalizedLang === "ko" || normalizedLang === "korean" || normalizedLang === "한국어") {
      return "ko"
    }
    if (normalizedLang === "en" || normalizedLang === "english" || normalizedLang === "영어") {
      return "en"
    }
  }

  // lang 필드가 없거나 인식할 수 없으면 텍스트 기반 감지
  return detectLanguageFromText(text)
}

// 텍스트 기반 언어 감지 (lang 필드 없을 때 사용)
export const detectLanguageFromText = (text: string): LanguageType => {
  if (!text) return "en"

  // 한국어 패턴: 한글 음절, 조사 등
  const koreanPatterns = [
    /[가-힣]/,  // 한글
    /\b(이|가|을|를|에|에서|으로|와|과|부터|까지|처럼|만큼|보다|밖에|처럼)\b/,  // 한국어 조사
  ]

  const koreanScore = koreanPatterns.reduce((score, pattern) => {
    return score + (pattern.test(text) ? 1 : 0)
  }, 0)

  // 영어 패턴: 영어 단어, 관사 등
  const englishPatterns = [
    /\b(the|a|an|this|that|these|those|is|are|was|were|will|would|can|could|should|may|might|must|do|does|did|have|has|had)\b/i,
    /\b(and|or|but|so|because|although|however|therefore|moreover|furthermore|additionally|consequently)\b/i,
  ]

  const englishScore = englishPatterns.reduce((score, pattern) => {
    return score + (pattern.test(text) ? 1 : 0)
  }, 0)

  return koreanScore > englishScore ? "ko" : "en"
}

// 긴 텍스트를 청킹하여 번역하는 함수 (Google Translate API 제한 고려)
export const translateLongText = async (
  text: string,
  targetLanguage: LanguageType,
  sourceLanguage: LanguageType = "ko",
  chunkSize: number = 1000
): Promise<string> => {
  if (text.length <= chunkSize) {
    return await translateText(text, targetLanguage, sourceLanguage)
  }

  const chunks = splitTextIntoChunks(text, chunkSize)
  const translatedChunks: string[] = []

  for (const chunk of chunks) {
    try {
      const translated = await translateText(chunk, targetLanguage, sourceLanguage)
      translatedChunks.push(translated)
      // API 호출 간 짧은 지연
      await new Promise(resolve => setTimeout(resolve, 100))
    } catch (error) {
      console.error("Chunk translation failed:", error)
      translatedChunks.push(chunk) // 실패 시 원본 유지
    }
  }

  return translatedChunks.join(' ')
}

// 텍스트를 의미 있는 단위로 청킹하는 함수
const splitTextIntoChunks = (text: string, maxChunkSize: number): string[] => {
  const chunks: string[] = []
  let currentChunk = ""

  // 문장 단위로 분리 시도
  const sentences = text.split(/(?<=[.!?])\s+/)

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length <= maxChunkSize) {
      currentChunk += (currentChunk ? " " : "") + sentence
    } else {
      if (currentChunk) {
        chunks.push(currentChunk.trim())
        currentChunk = sentence
      } else {
        // 문장이 너무 길면 강제 분리
        chunks.push(sentence.slice(0, maxChunkSize))
        currentChunk = sentence.slice(maxChunkSize)
      }
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim())
  }

  return chunks.filter(chunk => chunk.length > 0)
}
