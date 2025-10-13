import { LanguageType } from "src/hooks/useLanguage"

// Google Translate API를 사용한 번역 함수
export const translateText = async (
  text: string,
  targetLanguage: LanguageType,
  sourceLanguage: LanguageType = "ko"
): Promise<string> => {
  try {
    // 텍스트가 너무 짧으면 더 긴 컨텍스트로 확장
    let textToTranslate = text
    if (text.length < 50) {
      const langName = sourceLanguage === "ko" ? "Korean" : "English"
      const targetLangName = targetLanguage === "ko" ? "Korean" : "English"
      textToTranslate = `Translate this ${langName} text to ${targetLangName}: ${text}`
    }
    
    // Google Translate API 사용 (무료 버전)
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLanguage}&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(textToTranslate)}`
    
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
    
    // 확장된 텍스트를 사용한 경우 원본 텍스트 부분만 추출
    if (text.length < 50 && translatedText.includes(":")) {
      const colonIndex = translatedText.indexOf(":")
      if (colonIndex !== -1) {
        translatedText = translatedText.substring(colonIndex + 1).trim()
      }
    }
    
    // 번역이 실패한 경우 원본 텍스트 반환
    return translatedText || text
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
    // HTML 태그 보호
    const protectedContent = htmlContent.replace(
      /<[^>]*>/g,
      (match) => `__TAG__${btoa(match)}__TAG__`
    )
    
    const translatedText = await translateText(protectedContent, targetLanguage, sourceLanguage)
    
    const restoredContent = translatedText.replace(
      /__TAG__([^_]+)__TAG__/g,
      (match, encoded) => {
        try {
          return atob(encoded)
        } catch {
          return match
        }
      }
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

// 텍스트의 언어를 감지하는 함수
export const detectLanguage = (text: string): LanguageType => {
  if (!text || text.trim().length === 0) {
    return "ko"
  }
  
  // 한글 문자 개수 세기
  const koreanChars = text.match(/[가-힣]/g) || []
  // 영어 문자 개수 세기
  const englishChars = text.match(/[a-zA-Z]/g) || []
  
  // 한글이 더 많으면 한국어, 영어가 더 많으면 영어
  return koreanChars.length > englishChars.length ? "ko" : "en"
}
