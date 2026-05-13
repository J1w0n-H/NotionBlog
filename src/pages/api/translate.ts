import type { NextApiRequest, NextApiResponse } from "next"

type SupportedLanguage = "ko" | "en"

type TranslateResponse = { translated: string } | { error: string }

const SUPPORTED_LANGUAGES: SupportedLanguage[] = ["ko", "en"]

function isSupportedLanguage(value: unknown): value is SupportedLanguage {
  return (
    typeof value === "string" &&
    SUPPORTED_LANGUAGES.includes(value as SupportedLanguage)
  )
}

async function callGoogleTranslate(
  text: string,
  sourceLanguage: SupportedLanguage,
  targetLanguage: SupportedLanguage
): Promise<string> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLanguage}&tl=${targetLanguage}&dt=t`

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    },
    body: new URLSearchParams({ q: text }),
  })

  if (!response.ok) {
    throw new Error(`Translation failed: ${response.status}`)
  }

  const data = (await response.json()) as unknown
  let translated = ""

  if (Array.isArray(data) && Array.isArray(data[0])) {
    for (const segment of data[0]) {
      if (Array.isArray(segment) && typeof segment[0] === "string") {
        translated += segment[0]
      }
    }
  }

  return translated.trim() || text
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TranslateResponse>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { text, source, target } = (req.body ?? {}) as {
    text?: unknown
    source?: unknown
    target?: unknown
  }

  if (typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ error: "text is required" })
  }

  if (!isSupportedLanguage(source) || !isSupportedLanguage(target)) {
    return res.status(400).json({ error: "unsupported language" })
  }

  if (source === target) {
    return res.status(200).json({ translated: text })
  }

  try {
    const translated = await callGoogleTranslate(text, source, target)
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400")
    return res.status(200).json({ translated })
  } catch (error) {
    console.error("Translate proxy error:", error)
    return res.status(502).json({ error: "translation failed" })
  }
}
