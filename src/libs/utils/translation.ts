import { LanguageType } from "src/hooks/useLanguage"

// Google Translate API를 사용한 번역 함수
export const translateText = async (
  text: string,
  targetLanguage: LanguageType
): Promise<string> => {
  try {
    console.log("=== Translation Debug ===")
    console.log("Input text:", text)
    console.log("Target language:", targetLanguage)
    console.log("Text length:", text.length)
    
    // 텍스트가 너무 짧으면 더 긴 컨텍스트로 확장
    let textToTranslate = text
    if (text.length < 50) {
      textToTranslate = `Translate this Korean text to English: ${text}`
      console.log("Expanded text for translation:", textToTranslate)
    }
    
    // Google Translate API 사용 (무료 버전)
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ko&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(textToTranslate)}`
    console.log("Translation URL:", url)
    
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Translation failed: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log("Raw translation response:", data)
    
    // 번역 결과 추출
    let translatedText = ""
    if (data && data[0]) {
      data[0].forEach((item: any, index: number) => {
        if (item && item[0]) {
          translatedText += item[0]
          console.log(`Translation part ${index}:`, item[0])
        }
      })
    }
    
    // 확장된 텍스트를 사용한 경우 원본 텍스트 부분만 추출
    if (text.length < 50 && translatedText.includes(":")) {
      const colonIndex = translatedText.indexOf(":")
      if (colonIndex !== -1) {
        translatedText = translatedText.substring(colonIndex + 1).trim()
        console.log("Extracted original part:", translatedText)
      }
    }
    
    // 번역이 실패한 경우 (원본과 동일한 경우) 다른 방법 시도
    if (translatedText === text || translatedText === textToTranslate) {
      console.log("Translation failed, trying alternative method...")
      
      // 개별 단어로 분리하여 번역 시도
      const words = text.split(/\s+/)
      const translatedWords = []
      
      for (const word of words) {
        if (word.trim()) {
          try {
            const wordUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ko&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(word)}`
            const wordResponse = await fetch(wordUrl)
            const wordData = await wordResponse.json()
            
            if (wordData && wordData[0] && wordData[0][0] && wordData[0][0][0]) {
              translatedWords.push(wordData[0][0][0])
            } else {
              translatedWords.push(word)
            }
          } catch (error) {
            console.error(`Failed to translate word "${word}":`, error)
            translatedWords.push(word)
          }
        }
      }
      
      translatedText = translatedWords.join(" ")
      console.log("Alternative translation result:", translatedText)
    }
    
    console.log("Final translated text:", translatedText)
    console.log("=== End Translation Debug ===")
    
    return translatedText || text
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
    console.log("Translating HTML content, length:", htmlContent.length)
    
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
      (match, encoded) => {
        try {
          return atob(encoded)
        } catch {
          return match
        }
      }
    )
    
    console.log("HTML translation completed, result length:", restoredContent.length)
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
