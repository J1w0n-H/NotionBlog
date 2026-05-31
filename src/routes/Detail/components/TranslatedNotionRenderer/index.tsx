import React, { useState, useEffect, useMemo } from "react"
import { ExtendedRecordMap } from "notion-types"
import NotionRenderer from "../NotionRenderer"
import useLanguage from "src/hooks/useLanguage"
import styled from "@emotion/styled"
import { detectLanguage, removeLanguageTag } from "src/libs/utils/translation"
import { TRANSLATION_CONFIG } from "src/constants/translation"

type LanguageType = "ko" | "en"

const translationCache = new Map<string, string>()

type Props = {
  recordMap: ExtendedRecordMap
  lang?: string
}

const TranslatedNotionRenderer: React.FC<Props> = ({ recordMap, lang }) => {
  const [currentLanguage] = useLanguage()
  const [translatedBlocks, setTranslatedBlocks] = useState<
    Array<{ original: string; translated: string; type: string }> | null
  >(null)
  const [isTranslating, setIsTranslating] = useState(false)

  const extractedBlocks = useMemo(() => {
    if (!recordMap) return []
    try {
      return extractBlocksFromRecordMap(recordMap)
    } catch {
      return []
    }
  }, [recordMap])

  const textContent = useMemo(
    () => extractedBlocks.map((b: { content: string }) => b.content).join("\n"),
    [extractedBlocks]
  )

  const detectedLang = useMemo(
    () => detectLanguage(textContent, lang),
    [textContent, lang]
  )

  const needsTranslation = detectedLang !== currentLanguage

  useEffect(() => {
    if (!needsTranslation || extractedBlocks.length === 0) {
      setTranslatedBlocks(null)
      return
    }
    let cancelled = false
    setIsTranslating(true)
    setTranslatedBlocks(null)
    translateBlocksBatch(
      extractedBlocks,
      currentLanguage as LanguageType,
      detectedLang
    )
      .then((blocks) => {
        if (!cancelled) setTranslatedBlocks(blocks)
      })
      .catch(() => {
        if (!cancelled) setTranslatedBlocks(null)
      })
      .finally(() => {
        if (!cancelled) setIsTranslating(false)
      })
    return () => {
      cancelled = true
    }
  }, [extractedBlocks, detectedLang, currentLanguage, needsTranslation])

  if (!recordMap) return <div>Error: No content to display</div>

  // Same language — render original directly
  if (!needsTranslation) {
    return (
      <StyledContainer>
        <NotionRenderer recordMap={recordMap} />
      </StyledContainer>
    )
  }

  // Translation in progress — show original + badge
  if (isTranslating || translatedBlocks === null) {
    return (
      <StyledContainer>
        <NotionRenderer recordMap={recordMap} />
        <StyledTranslatingBadge aria-live="polite">
          {currentLanguage === "ko" ? "번역 중…" : "Translating…"}
        </StyledTranslatingBadge>
      </StyledContainer>
    )
  }

  // Translation complete — replace with translated content
  return (
    <StyledContainer>
      <StyledTranslatedBlocks>
        {translatedBlocks.map((block: { original: string; translated: string; type: string }, i: number) => (
          <StyledTranslatedBlock
            key={i}
            data-block-type={block.type}
            dangerouslySetInnerHTML={{ __html: block.translated || "" }}
          />
        ))}
      </StyledTranslatedBlocks>
    </StyledContainer>
  )
}

export default TranslatedNotionRenderer

// ─── Translation infrastructure ──────────────────────────────────────────────

const translateBlocksBatch = async (
  blocks: Array<{ id: string; content: string; type: string; order: number }>,
  targetLanguage: LanguageType,
  sourceLanguage: LanguageType
): Promise<Array<{ original: string; translated: string; type: string }>> => {
  const FILE_RE =
    /^[a-zA-Z0-9_-]+\.(png|jpg|jpeg|gif|svg|webp|pdf|doc|docx|xls|xlsx|zip|rar|mp4|mp3|txt|csv|json|xml)$/i

  const validBlocks = blocks.filter((block) => {
    const c = block.content.trim()
    return c && !FILE_RE.test(c)
  })

  if (validBlocks.length === 0) return []

  const results: Array<{
    original: string
    translated: string
    type: string
  } | null> = validBlocks.map(() => null)

  const uncachedIndices: number[] = []
  const uncachedTexts: string[] = []

  validBlocks.forEach((block, i) => {
    const key = `${block.content}-${sourceLanguage}-${targetLanguage}`
    const hit = translationCache.get(key)
    if (hit) {
      results[i] = {
        original: removeLanguageTag(block.content),
        translated: styleFileNames(hit),
        type: block.type,
      }
    } else {
      uncachedIndices.push(i)
      uncachedTexts.push(removeLanguageTag(block.content))
    }
  })

  if (uncachedTexts.length > 0) {
    let translations: string[] = uncachedTexts

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          texts: uncachedTexts,
          source: sourceLanguage,
          target: targetLanguage,
        }),
      })

      if (res.ok) {
        const data = (await res.json()) as { translations?: string[] }
        if (
          Array.isArray(data.translations) &&
          data.translations.length === uncachedTexts.length
        ) {
          translations = data.translations
        }
      }
    } catch (err) {
      console.error("Batch translate request failed:", err)
    }

    uncachedIndices.forEach((blockIdx, partIdx) => {
      const block = validBlocks[blockIdx]
      const translated = translations[partIdx] ?? removeLanguageTag(block.content)

      const key = `${block.content}-${sourceLanguage}-${targetLanguage}`
      if (translationCache.size >= TRANSLATION_CONFIG.CACHE_SIZE) {
        const firstKey = translationCache.keys().next().value
        if (firstKey !== undefined) translationCache.delete(firstKey)
      }
      translationCache.set(key, translated)

      results[blockIdx] = {
        original: removeLanguageTag(block.content),
        translated: styleFileNames(translated),
        type: block.type,
      }
    })
  }

  return results.filter(
    (r): r is NonNullable<typeof r> => r !== null
  )
}

const extractBlocksFromRecordMap = (
  recordMap: ExtendedRecordMap
): Array<{ id: string; content: string; type: string; order: number }> => {
  const pageId = Object.keys(recordMap.block)[0]
  if (!pageId) return []

  const pageBlock = recordMap.block[pageId]
  const orderedBlockIds: string[] = pageBlock?.value?.content ?? []

  const extractedBlocks: Array<{
    id: string
    content: string
    type: string
    order: number
  }> = []

  Object.entries(recordMap.block).forEach(([blockId, block]) => {
    const b = block as { value?: { properties?: Record<string, any>; type: string } } | null
    if (!b?.value?.properties) return
    const { properties, type: blockType } = b.value
    let blockContent = ""

    const textBlocks = properties.title || properties.rich_text || []
    textBlocks.forEach((textBlock: any) => {
      if (!Array.isArray(textBlock)) return
      textBlock.forEach((text: any) => {
        if (typeof text === "string" && text.trim() && !isMetadata(text)) {
          blockContent += text + " "
        } else if (
          text &&
          typeof text === "object" &&
          typeof text[0] === "string" &&
          !isMetadata(text[0])
        ) {
          blockContent += text[0] + " "
        }
      })
    })

    const trimmed = blockContent.trim()
    if (trimmed && !isTranslationInstruction(trimmed) && !isMetadata(trimmed)) {
      const order = orderedBlockIds.indexOf(blockId)
      extractedBlocks.push({
        id: blockId,
        content: trimmed,
        type: blockType,
        order: order >= 0 ? order : 999,
      })
    }
  })

  return extractedBlocks.sort((a, b) => a.order - b.order)
}

const isMetadata = (text: string): boolean => {
  const patterns = [
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
  ]
  return patterns.some((p) => p.test(text.trim()))
}

const isTranslationInstruction = (text: string): boolean => {
  const patterns = [
    /^이\s*영어\s*텍스트를\s*한국어로\s*번역하세요/i,
    /^이\s*한국어\s*텍스트를\s*영어로\s*번역하세요/i,
    /^translate\s*this\s*(english|korean)\s*text\s*to\s*(korean|english)/i,
    /^번역하세요/i,
    /^translate\s*this/i,
  ]
  return patterns.some((p) => p.test(text.trim()))
}

const styleFileNames = (text: string | undefined): string => {
  if (!text) return ""
  return text.replace(
    /\b([a-zA-Z0-9_-]+\.(png|jpg|jpeg|gif|svg|webp|pdf|doc|docx|xls|xlsx|zip|rar|mp4|mp3|txt|csv|json|xml))\b/gi,
    (match) =>
      `<span style="color:#9ca3af;opacity:0.6;font-size:0.875em">${match}</span>`
  )
}

// ─── Styled components ────────────────────────────────────────────────────────

const StyledContainer = styled.div`
  position: relative;
  width: 100%;
`

const StyledTranslatingBadge = styled.div`
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 50;
  padding: 0.375rem 0.875rem;
  border-radius: var(--radius-pill);
  border: 1px solid ${({ theme }) => theme.brand.border};
  background: ${({ theme }) => theme.brand.surface2};
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.brand.textMuted};
  pointer-events: none;
`

const StyledTranslatedBlocks = styled.div`
  font-size: 17px;
  line-height: 1.7;
  letter-spacing: -0.008em;
  color: ${({ theme }) => theme.brand.text};
`

const StyledTranslatedBlock = styled.div`
  margin-bottom: 0.7em;

  &[data-block-type="header"] {
    margin-top: 4rem;
    margin-bottom: 0.35rem;
    font-size: 1.875rem;
    line-height: 1.25;
    font-weight: 700;
    letter-spacing: -0.02em;
    &:first-of-type { margin-top: 0; }
  }
  &[data-block-type="sub_header"] {
    margin-top: 2.5rem;
    margin-bottom: 0.35rem;
    font-size: 1.5rem;
    line-height: 1.3;
    font-weight: 700;
    letter-spacing: -0.02em;
  }
  &[data-block-type="sub_sub_header"] {
    margin-top: 2rem;
    margin-bottom: 0.35rem;
    font-size: 1.25rem;
    line-height: 1.35;
    font-weight: 650;
  }
  &[data-block-type="quote"] {
    border-left: 4px solid ${({ theme }) => theme.brand.accent};
    padding: 0.25rem 0 0.25rem 1rem;
    color: ${({ theme }) => theme.brand.textMuted};
  }
  &[data-block-type="code"] {
    font-family: var(--font-mono);
    font-size: 14px;
    line-height: 1.55;
    background: ${({ theme }) => theme.brand.codeBg};
    color: ${({ theme }) => theme.brand.codeText};
    border: 1px solid ${({ theme }) => theme.brand.codeBorder};
    border-radius: var(--radius-md);
    padding: 0.75rem 1rem;
  }
`
