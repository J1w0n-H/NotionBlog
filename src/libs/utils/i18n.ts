import type { LanguageType } from "src/hooks/useLanguage"

export type TranslateFn = (text: string) => string

export function createTranslator(
  language: LanguageType,
  dictionary: Record<string, string>
): TranslateFn {
  if (language !== "ko") return (text) => text
  return (text) => dictionary[text] ?? text
}
