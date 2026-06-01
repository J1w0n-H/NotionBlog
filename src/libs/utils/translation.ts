import type { LanguageType } from "src/hooks/useLanguage"

export function normalizePostLangField(lang?: string): LanguageType | null {
  if (!lang) return null
  const n = lang.toLowerCase().trim()
  if (n === "ko" || n === "korean" || n === "한국어") return "ko"
  if (n === "en" || n === "english" || n === "영어") return "en"
  return null
}

export function removeLanguageTag(text: string): string {
  return text.replace(/^\[(KOR|ENG|EN|KO|한국어|영어)\]\s*/i, "").trim()
}
