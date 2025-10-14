import { LanguageType } from "src/hooks/useLanguage"

// 번역 결과에서 메타데이터를 제거하는 함수
const removeMetadataFromTranslation = (text: string): string => {
  if (!text) return text
  
  // 번역 지시사항 패턴들
  const metadataPatterns = [
    /이\s*영어\s*텍스트를\s*한국어로\s*번역하세요\s*/gi,
    /이\s*한국어\s*텍스트를\s*영어로\s*번역하세요\s*/gi,
    /translate\s*this\s*english\s*text\s*to\s*korean\s*/gi,
    /translate\s*this\s*korean\s*text\s*to\s*english\s*/gi,
    /번역하세요\s*/gi,
    /translate\s*this\s*/gi,
    /translate\s*this\s*.+text\s*to\s*.+:\s*/gi,
    /^translate\s*this\s*.+text\s*to\s*.+:\s*/gmi,
  ]
  
  let cleanedText = text
  
  // 각 패턴을 제거
  metadataPatterns.forEach(pattern => {
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
    
    // 번역 결과 추출
    let translatedText = ""
    if (data && data[0]) {
      data[0].forEach((item: any) => {
        if (item && item[0]) {
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

// 텍스트의 언어를 감지하는 함수 (데이터베이스 lang 필드만 사용)
export const detectLanguage = (text: string, langField?: string): LanguageType => {
  // 데이터베이스 lang 필드가 있으면 사용
  if (langField) {
    const normalizedLang = langField.toLowerCase().trim()
    if (normalizedLang === "ko" || normalizedLang === "korean" || normalizedLang === "한국어") {
      return "ko"
    }
    if (normalizedLang === "en" || normalizedLang === "english" || normalizedLang === "영어") {
      return "en"
    }
  }
  
  // lang 필드가 없거나 인식할 수 없으면 기본값은 영어
  return "en"
}

// 언어 태그를 제거하는 함수
export const removeLanguageTag = (text: string): string => {
  if (!text) return text
  
  // <KOR> 태그 제거
  return text.replace(/^<KOR>\s*/, '').trim()
}
