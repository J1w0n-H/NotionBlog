import { LanguageType } from "src/hooks/useLanguage"

// Google Translate API를 사용한 번역 함수
export const translateText = async (
  text: string,
  targetLanguage: LanguageType
): Promise<string> => {
  try {
    // Google Translate API 사용 (무료 버전)
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
    return text // 번역 실패 시 원본 텍스트 반환
  }
}

// HTML 콘텐츠 번역 함수
export const translateHtmlContent = async (
  htmlContent: string,
  targetLanguage: LanguageType
): Promise<string> => {
  try {
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
    
    return restoredContent
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
