import { useCallback } from "react"
import useLanguage from "src/hooks/useLanguage"

/** Maps an English UI string to the current language; unknown strings pass through. */
export type Translate = (text: string) => string

/**
 * Returns a stable `tr` for the given KO dictionary (e.g. KO_NAV, KO_RESUME).
 * English is the source language, so in EN mode text is returned unchanged.
 */
export function useTranslate(koDictionary: Readonly<Record<string, string>>): Translate {
  const [language] = useLanguage()
  return useCallback(
    (text: string) => (language === "ko" ? koDictionary[text] ?? text : text),
    [language, koDictionary]
  )
}
