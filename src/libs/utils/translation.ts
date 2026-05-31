import { LanguageType } from "src/hooks/useLanguage"

export const removeLanguageTag = (text: string): string => {
  if (!text) return ""
  return text.replace(/^\[(KOR|ENG|EN|KO|한국어|영어)\]\s*/i, "").trim()
}

export function normalizePostLangField(langField?: string): LanguageType | null {
  if (!langField || typeof langField !== "string") return null
  const n = langField.toLowerCase().trim()
  if (n === "ko" || n === "korean" || n === "한국어") return "ko"
  if (n === "en" || n === "english" || n === "영어") return "en"
  return null
}
