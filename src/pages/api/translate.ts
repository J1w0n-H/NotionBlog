import type { NextApiRequest, NextApiResponse } from "next"

type SupportedLanguage = "ko" | "en"

type TranslateResponse =
  | { translated: string; provider: string }
  | { error: string; details?: string[] }

const SUPPORTED_LANGUAGES: SupportedLanguage[] = ["ko", "en"]

function isSupportedLanguage(value: unknown): value is SupportedLanguage {
  return (
    typeof value === "string" &&
    SUPPORTED_LANGUAGES.includes(value as SupportedLanguage)
  )
}

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"

async function callGoogleTranslate(
  text: string,
  source: SupportedLanguage,
  target: SupportedLanguage
): Promise<string> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`

  const response = await fetch(url, {
    method: "GET",
    headers: { "User-Agent": USER_AGENT, Accept: "*/*" },
  })

  if (!response.ok) {
    throw new Error(`Google ${response.status}`)
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

  const trimmed = translated.trim()
  if (!trimmed || trimmed === text.trim()) {
    throw new Error("Google empty result")
  }

  return trimmed
}

async function callMyMemory(
  text: string,
  source: SupportedLanguage,
  target: SupportedLanguage
): Promise<string> {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
    text
  )}&langpair=${source}|${target}`

  const response = await fetch(url, {
    method: "GET",
    headers: { "User-Agent": USER_AGENT },
  })

  if (!response.ok) {
    throw new Error(`MyMemory ${response.status}`)
  }

  const data = (await response.json()) as {
    responseStatus?: number
    responseData?: { translatedText?: string }
  }

  if (
    data.responseStatus !== 200 ||
    typeof data.responseData?.translatedText !== "string"
  ) {
    throw new Error("MyMemory bad payload")
  }

  const translated = data.responseData.translatedText.trim()
  if (!translated) {
    throw new Error("MyMemory empty result")
  }
  return translated
}

async function callLingva(
  text: string,
  source: SupportedLanguage,
  target: SupportedLanguage
): Promise<string> {
  const hosts = ["lingva.ml", "lingva.pussthecat.org"]

  let lastError: unknown
  for (const host of hosts) {
    try {
      const url = `https://${host}/api/v1/${source}/${target}/${encodeURIComponent(
        text
      )}`
      const response = await fetch(url, {
        method: "GET",
        headers: { "User-Agent": USER_AGENT },
      })

      if (!response.ok) {
        throw new Error(`Lingva ${host} ${response.status}`)
      }

      const data = (await response.json()) as { translation?: string }
      if (typeof data.translation !== "string" || !data.translation.trim()) {
        throw new Error("Lingva empty result")
      }
      return data.translation.trim()
    } catch (error) {
      lastError = error
    }
  }

  throw lastError ?? new Error("Lingva failed")
}

type Provider = {
  name: string
  call: (
    text: string,
    source: SupportedLanguage,
    target: SupportedLanguage
  ) => Promise<string>
}

const PROVIDERS: Provider[] = [
  { name: "google", call: callGoogleTranslate },
  { name: "mymemory", call: callMyMemory },
  { name: "lingva", call: callLingva },
]

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
    return res.status(200).json({ translated: text, provider: "noop" })
  }

  const errors: string[] = []

  for (const provider of PROVIDERS) {
    try {
      const translated = await provider.call(text, source, target)
      res.setHeader(
        "Cache-Control",
        "public, s-maxage=3600, stale-while-revalidate=86400"
      )
      return res.status(200).json({ translated, provider: provider.name })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error)
      errors.push(`${provider.name}: ${message}`)
    }
  }

  console.error("Translate proxy: all providers failed", errors)
  return res.status(502).json({ error: "translation failed", details: errors })
}
