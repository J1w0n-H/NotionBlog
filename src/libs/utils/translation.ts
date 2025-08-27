import { LanguageType } from "src/hooks/useLanguage"

// 번역 결과 캐싱
const translationCache = new Map<string, string>()

// Google Translate API를 사용한 번역 함수
export const translateText = async (
  text: string,
  targetLanguage: LanguageType
): Promise<string> => {
  try {
    // 캐시 키 생성
    const cacheKey = `${text}_${targetLanguage}`
    
    // 캐시된 결과가 있으면 반환
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey)!
    }
    
    // Google Translate API 사용 (무료 버전)
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`
    )
    
    if (!response.ok) {
      throw new Error("Translation failed")
    }
    
    const data = await response.json()
    const translatedText = data[0][0][0] || text
    
    // 결과를 캐시에 저장
    translationCache.set(cacheKey, translatedText)
    
    return translatedText
  } catch (error) {
    console.error("Translation error:", error)
    return text // 번역 실패 시 원본 텍스트 반환
  }
}

// HTML 콘텐츠 번역 함수
export const translateHtmlContent = async (
  htmlContent: string,
  targetLanguage: LanguageType
): Promise<string> => {
  try {
    // 캐시 키 생성
    const cacheKey = `${htmlContent}_${targetLanguage}`
    
    // 캐시된 결과가 있으면 반환
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey)!
    }
    
    // HTML 태그를 임시로 보호
    const protectedContent = htmlContent.replace(
      /<[^>]*>/g,
      (match) => `__TAG__${btoa(match)}__TAG__`
    )
    
    // 텍스트만 번역
    const translatedText = await translateText(protectedContent, targetLanguage)
    
    // HTML 태그 복원
    const restoredContent = translatedText.replace(
      /__TAG__([^_]+)__TAG__/g,
      (match, encoded) => atob(encoded)
    )
    
    // 결과를 캐시에 저장
    translationCache.set(cacheKey, restoredContent)
    
    return restoredContent
  } catch (error) {
    console.error("HTML translation error:", error)
    return htmlContent
  }
}

// 캐시 클리어 함수
export const clearTranslationCache = () => {
  translationCache.clear()
}

// 언어별 표시 텍스트
export const getLanguageText = (language: LanguageType): string => {
  return language === "ko" ? "한국어" : "English"
}

// 언어별 이모지
export const getLanguageEmoji = (language: LanguageType): string => {
  return language === "ko" ? "🇰🇷" : "🇺🇸"
}
