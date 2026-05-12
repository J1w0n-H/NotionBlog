import { ExtendedRecordMap } from "notion-types"
import { TRANSLATION_CONFIG } from "src/constants/translation"
import type { LanguageType } from "src/hooks/useLanguage"
import { removeLanguageTag, translateText } from "src/libs/utils/translation"

export type TranslatableBlock = {
  id: string
  content: string
  type: string
  order: number
}

const NON_TRANSLATABLE_BLOCK_TYPES = new Set([
  "code",
  "image",
  "video",
  "file",
  "pdf",
  "divider",
  "embed",
  "bookmark",
  "table",
  "column_list",
  "column",
  "collection_view",
  "collection_view_page",
])

function findPageBlockId(recordMap: ExtendedRecordMap): string | null {
  const pageEntry = Object.entries(recordMap.block).find(
    ([, block]) => block.value?.type === "page"
  )
  if (pageEntry) return pageEntry[0]
  return Object.keys(recordMap.block)[0] ?? null
}

function extractPlainTextFromNotionProperty(value: unknown): string {
  if (!Array.isArray(value)) return ""

  return value
    .map((segment) => {
      if (!Array.isArray(segment) || typeof segment[0] !== "string") return ""
      const text = segment[0].trim()
      if (!text || isMetadata(text)) return ""
      return text
    })
    .filter(Boolean)
    .join(" ")
    .trim()
}

function extractBlockText(properties: Record<string, unknown>): string {
  const title = extractPlainTextFromNotionProperty(properties.title)
  if (title) return title

  const richText = extractPlainTextFromNotionProperty(properties.rich_text)
  if (richText) return richText

  return Object.entries(properties)
    .filter(([key]) => /^col\d+$/.test(key))
    .map(([, value]) => extractPlainTextFromNotionProperty(value))
    .filter(Boolean)
    .join(" ")
    .trim()
}

const translationCache = new Map<string, string>()

export function cloneRecordMap(recordMap: ExtendedRecordMap): ExtendedRecordMap {
  if (typeof structuredClone === "function") {
    return structuredClone(recordMap)
  }
  return JSON.parse(JSON.stringify(recordMap)) as ExtendedRecordMap
}

export function extractTranslatableBlocks(
  recordMap: ExtendedRecordMap
): TranslatableBlock[] {
  try {
    const pageId = findPageBlockId(recordMap)
    if (!pageId) return []

    const pageBlock = recordMap.block[pageId]
    const orderedBlockIds = pageBlock?.value?.content ?? []
    const extractedBlocks: TranslatableBlock[] = []

    Object.entries(recordMap.block).forEach(([blockId, block]) => {
      if (!block.value?.properties) return

      const blockType = block.value.type
      if (NON_TRANSLATABLE_BLOCK_TYPES.has(blockType)) return

      const properties = block.value.properties as Record<string, unknown>
      const trimmedContent = extractBlockText(properties)
      if (
        !trimmedContent ||
        isTranslationInstruction(trimmedContent) ||
        isMetadata(trimmedContent) ||
        isOnlyFileName(trimmedContent)
      ) {
        return
      }

      const order = orderedBlockIds.indexOf(blockId)
      extractedBlocks.push({
        id: blockId,
        content: trimmedContent,
        type: blockType,
        order: order >= 0 ? order : 999,
      })
    })

    extractedBlocks.sort((a, b) => a.order - b.order)
    return extractedBlocks
  } catch (error) {
    console.error("Error extracting translatable blocks:", error)
    return []
  }
}

export function applyTranslatedBlocksToRecordMap(
  recordMap: ExtendedRecordMap,
  translatedByBlockId: ReadonlyMap<string, string>
): ExtendedRecordMap {
  const next = cloneRecordMap(recordMap)

  translatedByBlockId.forEach((translated, blockId) => {
    const block = next.block[blockId]
    if (!block?.value?.properties) return

    const cleaned = removeLanguageTag(translated).trim()
    if (!cleaned) return

    const properties = block.value.properties as Record<string, unknown>
    const field = properties.title
      ? "title"
      : properties.rich_text
        ? "rich_text"
        : Object.keys(properties).find((key) => /^col\d+$/.test(key))

    if (!field) return

    const current = properties[field]
    if (Array.isArray(current) && current.length > 0 && Array.isArray(current[0])) {
      const preserved = current[0].slice(1)
      properties[field] =
        preserved.length > 0 ? [[cleaned, ...preserved]] : [[cleaned]]
      return
    }

    properties[field] = [[cleaned]]
  })

  return next
}

export async function translateRecordMapForLanguage(
  recordMap: ExtendedRecordMap,
  targetLanguage: LanguageType,
  sourceLanguage: LanguageType,
  onProgress?: (progress: { current: number; total: number }) => void
): Promise<ExtendedRecordMap> {
  const blocks = extractTranslatableBlocks(recordMap)
  const translatedByBlockId = await translateBlocksInBatches(
    blocks,
    targetLanguage,
    sourceLanguage,
    onProgress
  )

  return applyTranslatedBlocksToRecordMap(recordMap, translatedByBlockId)
}

async function translateBlocksInBatches(
  blocks: TranslatableBlock[],
  targetLanguage: LanguageType,
  sourceLanguage: LanguageType,
  onProgress?: (progress: { current: number; total: number }) => void
): Promise<Map<string, string>> {
  const translatedByBlockId = new Map<string, string>()
  const validBlocks = blocks.filter((block) => block.content.trim())
  const batchSize = TRANSLATION_CONFIG.BATCH_SIZE
  const delayBetweenBatches = TRANSLATION_CONFIG.DELAY_BETWEEN_BATCHES

  onProgress?.({ current: 0, total: validBlocks.length })

  for (let i = 0; i < validBlocks.length; i += batchSize) {
    const batch = validBlocks.slice(i, i + batchSize)

    const batchResults = await Promise.all(
      batch.map(async (block) => {
        const cacheKey = `${block.content}-${sourceLanguage}-${targetLanguage}`
        let translated = translationCache.get(cacheKey)

        if (!translated) {
          translated = await translateText(
            removeLanguageTag(block.content),
            targetLanguage,
            sourceLanguage
          )

          if (translationCache.size > TRANSLATION_CONFIG.CACHE_SIZE) {
            const firstKey = translationCache.keys().next().value
            if (firstKey) translationCache.delete(firstKey)
          }
          translationCache.set(cacheKey, translated)
        }

        return { id: block.id, translated }
      })
    )

    batchResults.forEach(({ id, translated }) => {
      translatedByBlockId.set(id, translated)
    })

    onProgress?.({
      current: translatedByBlockId.size,
      total: validBlocks.length,
    })

    if (i + batchSize < validBlocks.length) {
      await new Promise((resolve) => setTimeout(resolve, delayBetweenBatches))
    }
  }

  return translatedByBlockId
}

function isOnlyFileName(text: string): boolean {
  return /^[a-zA-Z0-9_-]+\.(png|jpg|jpeg|gif|svg|webp|pdf|doc|docx|xls|xlsx|zip|rar|mp4|mp3|txt|csv|json|xml)$/i.test(
    text.trim()
  )
}

function isMetadata(text: string): boolean {
  const metadataPatterns = [
    /^\d+\s*[d,]/i,
    /\[object Object\]/i,
    /attachment:/i,
    /Public\s*\d+\.?\d*\s*MB/i,
    /^\d+\.?\d*\s*MB/i,
    /^[a-f0-9-]+$/i,
    /^[a-f0-9-]+:[a-f0-9-]+$/i,
    /^Post\s+JW-\d+/i,
    /^[a-z]+\s*,\s*[a-f0-9-]+$/i,
    /^IMG_\d+\.(jpeg|jpg|png|gif)$/i,
    /^\d+\.?\d*\s*KB$/i,
    /이\s*영어\s*텍스트를\s*한국어로\s*번역하세요/i,
    /translate\s*this\s*english\s*text\s*to\s*korean/i,
    /translate\s*this\s*korean\s*text\s*to\s*english/i,
    /번역하세요/i,
    /translate\s*this/i,
    /^translate\s*this\s*.+text\s*to\s*.+:/i,
  ]

  return metadataPatterns.some((pattern) => pattern.test(text.trim()))
}

function isTranslationInstruction(text: string): boolean {
  const instructionPatterns = [
    /^이\s*영어\s*텍스트를\s*한국어로\s*번역하세요/i,
    /^이\s*한국어\s*텍스트를\s*영어로\s*번역하세요/i,
    /^translate\s*this\s*english\s*text\s*to\s*korean/i,
    /^translate\s*this\s*korean\s*text\s*to\s*english/i,
    /^번역하세요/i,
    /^translate\s*this/i,
    /^translate\s*this\s*.+text\s*to\s*.+:/i,
    /^이\s*영어\s*텍스트를\s*한국어로\s*번역하세요\.\s*[가-힣a-zA-Z\s]+\?$/i,
  ]

  return instructionPatterns.some((pattern) => pattern.test(text.trim()))
}
