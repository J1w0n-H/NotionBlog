import { ExtendedRecordMap } from "notion-types"
import { TRANSLATION_CONFIG } from "src/constants/translation"
import type { LanguageType } from "src/hooks/useLanguage"
import {
  detectBlockLanguage,
  removeLanguageTag,
  translateLongText,
  translateText,
} from "src/libs/utils/translation"

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

function normalizeNotionBlockId(id: string): string {
  return id.replace(/-/g, "").toLowerCase()
}

function findRecordMapBlockEntry(
  blocks: ExtendedRecordMap["block"],
  blockId: string
): { key: string; block: ExtendedRecordMap["block"][string] } | null {
  const direct = blocks[blockId]
  if (direct) return { key: blockId, block: direct }

  const target = normalizeNotionBlockId(blockId)
  for (const [key, block] of Object.entries(blocks)) {
    const candidate = block.value?.id ?? key
    if (normalizeNotionBlockId(candidate) === target) {
      return { key, block }
    }
  }

  return null
}

function richTextToPlainText(value: unknown): string {
  if (typeof value === "string") return value
  if (!Array.isArray(value)) return ""
  if (typeof value[0] === "string") return value[0]
  return value.map(richTextToPlainText).filter(Boolean).join("")
}

function extractPlainTextFromNotionProperty(value: unknown): string {
  if (!Array.isArray(value)) return ""

  return value
    .map((segment) => {
      const text = richTextToPlainText(segment).trim()
      if (!text || isMetadata(text)) return ""
      return text
    })
    .filter(Boolean)
    .join(" ")
    .trim()
}

function resolveWritableTextProperty(
  properties: Record<string, unknown>
): string | null {
  if (properties.title) return "title"
  if (properties.rich_text) return "rich_text"

  const columnKey = Object.keys(properties).find((key) => /^col\d+$/.test(key))
  return columnKey ?? null
}

function writeTranslatedProperty(
  property: unknown,
  translated: string
): unknown {
  if (!Array.isArray(property) || property.length === 0) {
    return [[translated]]
  }

  const first = property[0]
  if (!Array.isArray(first)) {
    return [[translated]]
  }

  const preserved = first.slice(1)
  return preserved.length > 0 ? [[translated, ...preserved]] : [[translated]]
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

      const resolvedId = block.value?.id ?? blockId
      const order = orderedBlockIds.findIndex(
        (id) => normalizeNotionBlockId(id) === normalizeNotionBlockId(resolvedId)
      )
      extractedBlocks.push({
        id: resolvedId,
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
    const entry = findRecordMapBlockEntry(next.block, blockId)
    if (!entry?.block?.value?.properties) return

    const cleaned = removeLanguageTag(translated).trim()
    if (!cleaned) return

    const properties = entry.block.value.properties as Record<string, unknown>
    const field = resolveWritableTextProperty(properties)
    if (!field) return

    properties[field] = writeTranslatedProperty(properties[field], cleaned)
  })

  return next
}

export function hasTranslatableBlocks(
  recordMap: ExtendedRecordMap,
  targetLanguage: LanguageType
): boolean {
  // Default ambiguous (no Hangul/Latin) blocks to the *target* language so a
  // post full of code, numbers, or emoji doesn't get falsely flagged as
  // needing translation.
  return extractTranslatableBlocks(recordMap).some(
    (block) =>
      detectBlockLanguage(block.content, targetLanguage) !== targetLanguage
  )
}

export function hasMeaningfulTranslation(
  original: ExtendedRecordMap,
  translated: ExtendedRecordMap
): boolean {
  return extractTranslatableBlocks(original).some((block) => {
    const entry = findRecordMapBlockEntry(translated.block, block.id)
    if (!entry?.block?.value?.properties) return false

    const nextText = extractBlockText(
      entry.block.value.properties as Record<string, unknown>
    )

    return nextText.trim() !== block.content.trim()
  })
}

export async function translateRecordMapForLanguage(
  recordMap: ExtendedRecordMap,
  targetLanguage: LanguageType,
  onProgress?: (progress: { current: number; total: number }) => void
): Promise<ExtendedRecordMap> {
  const blocks = extractTranslatableBlocks(recordMap)
  const translatedByBlockId = await translateBlocksInBatches(
    blocks,
    targetLanguage,
    onProgress
  )

  return applyTranslatedBlocksToRecordMap(recordMap, translatedByBlockId)
}

async function translateBlocksInBatches(
  blocks: TranslatableBlock[],
  targetLanguage: LanguageType,
  onProgress?: (progress: { current: number; total: number }) => void
): Promise<Map<string, string>> {
  const translatedByBlockId = new Map<string, string>()
  const validBlocks = blocks.filter((block) => block.content.trim())
  const batchSize = TRANSLATION_CONFIG.BATCH_SIZE
  const delayBetweenBatches = TRANSLATION_CONFIG.DELAY_BETWEEN_BATCHES
  // Treat ambiguous blocks (emoji/numbers/code only) as already in the target
  // language so we silently skip them instead of round-tripping through the
  // translation API.
  const blockFallback = targetLanguage

  onProgress?.({ current: 0, total: validBlocks.length })

  for (let i = 0; i < validBlocks.length; i += batchSize) {
    const batch = validBlocks.slice(i, i + batchSize)

    for (const block of batch) {
      const blockLanguage = detectBlockLanguage(block.content, blockFallback)
      if (blockLanguage === targetLanguage) {
        translatedByBlockId.set(block.id, block.content)
        continue
      }

      const cacheKey = `${block.content}-${blockLanguage}-${targetLanguage}`
      let translated = translationCache.get(cacheKey)

      if (!translated) {
        const sourceText = removeLanguageTag(block.content)
        translated =
          sourceText.length > TRANSLATION_CONFIG.CHUNK_SIZE
            ? await translateLongText(
                sourceText,
                targetLanguage,
                blockLanguage,
                TRANSLATION_CONFIG.CHUNK_SIZE
              )
            : await translateText(sourceText, targetLanguage, blockLanguage)

        if (translationCache.size > TRANSLATION_CONFIG.CACHE_SIZE) {
          const firstKey = translationCache.keys().next().value
          if (firstKey) translationCache.delete(firstKey)
        }
        translationCache.set(cacheKey, translated)
      }

      translatedByBlockId.set(block.id, translated)
      onProgress?.({
        current: translatedByBlockId.size,
        total: validBlocks.length,
      })

      await new Promise((resolve) =>
        setTimeout(resolve, TRANSLATION_CONFIG.DELAY_BETWEEN_BATCHES)
      )
    }

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
