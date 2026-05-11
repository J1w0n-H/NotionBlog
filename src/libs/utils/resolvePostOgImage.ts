import { CONFIG } from "site.config"

export function resolvePostOgImage(
  thumbnail: string | null | undefined,
  title: string
): string | undefined {
  if (thumbnail) return thumbnail

  const base = CONFIG.ogImageGenerateURL
  if (!base) return undefined

  try {
    const url = new URL(base)
    url.searchParams.set("title", title)
    return url.toString()
  } catch {
    return base
  }
}
