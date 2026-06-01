import React, { useState, useEffect, useMemo } from "react"
import { ExtendedRecordMap } from "notion-types"
import NotionRenderer from "../NotionRenderer"
import useLanguage from "src/hooks/useLanguage"
import styled from "@emotion/styled"
import { removeLanguageTag, normalizePostLangField } from "src/libs/utils/translation"
import { TRANSLATION_CONFIG } from "src/constants/translation"

type LanguageType = "ko" | "en"

const translationCache = new Map<string, string>()

type Props = {
  recordMap: ExtendedRecordMap
  lang?: string
}

const TranslatedNotionRenderer: React.FC<Props> = ({ recordMap, lang }) => {
  const [currentLanguage] = useLanguage()
  // null = loading, [] = no translatable blocks, [...] = translated
  const [translatedBlocks, setTranslatedBlocks] = useState<
    Array<{ original: string; translated: string; type: string }> | null
  >(null)
  const [isTranslating, setIsTranslating] = useState(false)

  const contentLang = useMemo(() => {
    const fromLabel = normalizePostLangField(lang)
    if (fromLabel !== null) return fromLabel
    // Fallback: scan recordMap for Korean characters when no Notion lang label
    if (!recordMap) return null
    for (const blockData of Object.values(recordMap.block)) {
      const title = (blockData as any)?.value?.properties?.title
      if (!Array.isArray(title)) continue
      for (const run of title) {
        if (Array.isArray(run) && typeof run[0] === "string" && /[가-힣]/.test(run[0])) {
          return "ko" as LanguageType
        }
      }
    }
    return "en" as LanguageType
  }, [recordMap, lang])
  const needsTranslation = contentLang !== null && contentLang !== currentLanguage

  const extractedBlocks = useMemo(() => {
    if (!needsTranslation || !recordMap) return []
    return extractBlocksFromRecordMap(recordMap)
  }, [recordMap, needsTranslation])

  useEffect(() => {
    if (!needsTranslation || extractedBlocks.length === 0) {
      setTranslatedBlocks([])
      return
    }
    let cancelled = false
    setIsTranslating(true)
    setTranslatedBlocks(null)
    translateBlocksBatch(extractedBlocks, currentLanguage as LanguageType, contentLang!)
      .then((blocks) => { if (!cancelled) setTranslatedBlocks(blocks) })
      .catch(() => { if (!cancelled) setTranslatedBlocks([]) })
      .finally(() => { if (!cancelled) setIsTranslating(false) })
    return () => { cancelled = true }
  }, [extractedBlocks, contentLang, currentLanguage, needsTranslation])

  if (!recordMap) return <div>Error: No content to display</div>

  if (!needsTranslation) {
    return (
      <StyledContainer>
        <NotionRenderer recordMap={recordMap} />
      </StyledContainer>
    )
  }

  const label = currentLanguage === "ko" ? "번역 (한국어)" : "Translation (English)"

  return (
    <StyledSideBySide>
      <NotionRenderer recordMap={recordMap} />
      <StyledTranslationCol>
        <StyledTranslationLabel>{label}</StyledTranslationLabel>
        {isTranslating || translatedBlocks === null ? (
          <StyledTranslatingMsg aria-live="polite">
            {currentLanguage === "ko" ? "번역 중…" : "Translating…"}
          </StyledTranslatingMsg>
        ) : translatedBlocks.length > 0 ? (
          <StyledBlockList>
            {translatedBlocks.map(
              (block: { original: string; translated: string; type: string }, i: number) => (
                <StyledBlock
                  key={i}
                  data-block-type={block.type}
                  dangerouslySetInnerHTML={{ __html: block.translated || "" }}
                />
              )
            )}
          </StyledBlockList>
        ) : null}
      </StyledTranslationCol>
    </StyledSideBySide>
  )
}

export default TranslatedNotionRenderer

// ─── Translation infrastructure ──────────────────────────────────────────────

const FILE_RE =
  /^[a-zA-Z0-9_-]+\.(png|jpg|jpeg|gif|svg|webp|pdf|doc|docx|xls|xlsx|zip|rar|mp4|mp3|txt|csv|json|xml)$/i

const isMetadata = (text: string): boolean =>
  [
    /^\d+\s*[d,]/i,
    /\[object Object\]/i,
    /attachment:/i,
    /Public\s*\d+\.?\d*\s*MB/i,
    /^\d+\.?\d*\s*MB/i,
    /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i,
    /^Post\s+JW-\d+/i,
    /^IMG_\d+\.(jpeg|jpg|png|gif)$/i,
    /^\d+\.?\d*\s*KB$/i,
  ].some((p) => p.test(text.trim()))

const extractBlocksFromRecordMap = (
  recordMap: ExtendedRecordMap
): Array<{ id: string; content: string; type: string; order: number }> => {
  // Find the page block by type, not by insertion order
  const pageEntry = Object.entries(recordMap.block).find(
    ([, b]) => (b as any)?.value?.type === "page"
  )
  const pageId = pageEntry?.[0] ?? Object.keys(recordMap.block)[0]
  if (!pageId) return []

  const orderedIds: string[] = (recordMap.block[pageId] as any)?.value?.content ?? []
  const out: Array<{ id: string; content: string; type: string; order: number }> = []

  for (const [blockId, blockData] of Object.entries(recordMap.block)) {
    const b = blockData as any
    const props = b?.value?.properties
    const blockType: string = b?.value?.type ?? "text"
    if (!props) continue

    let content = ""
    const runs: any[] = props.title ?? props.rich_text ?? []
    for (const run of runs) {
      if (!Array.isArray(run)) continue
      const text = run[0]
      if (typeof text === "string" && text.trim() && !isMetadata(text)) {
        content += text + " "
      }
    }

    const trimmed = content.trim()
    if (!trimmed || FILE_RE.test(trimmed)) continue

    const order = orderedIds.indexOf(blockId)
    out.push({ id: blockId, content: trimmed, type: blockType, order: order >= 0 ? order : 999 })
  }

  return out.sort((a, b) => a.order - b.order)
}

const styleFileNames = (text: string | undefined): string => {
  if (!text) return ""
  return text.replace(
    /\b([a-zA-Z0-9_-]+\.(png|jpg|jpeg|gif|svg|webp|pdf|doc|docx|xls|xlsx|zip|rar|mp4|mp3|txt|csv|json|xml))\b/gi,
    (m) => `<span style="color:#9ca3af;opacity:0.6;font-size:0.875em">${m}</span>`
  )
}

const translateBlocksBatch = async (
  blocks: Array<{ id: string; content: string; type: string; order: number }>,
  targetLanguage: LanguageType,
  sourceLanguage: LanguageType
): Promise<Array<{ original: string; translated: string; type: string }>> => {
  const valid = blocks.filter((b) => b.content.trim() && !FILE_RE.test(b.content.trim()))
  if (valid.length === 0) return []

  const results: Array<{ original: string; translated: string; type: string } | null> =
    valid.map(() => null)
  const uncachedIdx: number[] = []
  const uncachedTexts: string[] = []

  valid.forEach((block, i) => {
    const key = `${block.content}-${sourceLanguage}-${targetLanguage}`
    const hit = translationCache.get(key)
    if (hit) {
      results[i] = { original: removeLanguageTag(block.content), translated: styleFileNames(hit), type: block.type }
    } else {
      uncachedIdx.push(i)
      uncachedTexts.push(removeLanguageTag(block.content))
    }
  })

  if (uncachedTexts.length > 0) {
    let translations: string[] = uncachedTexts
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texts: uncachedTexts, source: sourceLanguage, target: targetLanguage }),
      })
      if (res.ok) {
        const data = (await res.json()) as { translations?: string[] }
        if (Array.isArray(data.translations) && data.translations.length === uncachedTexts.length) {
          translations = data.translations
        }
      }
    } catch (err) {
      console.error("Batch translate failed:", err)
    }

    uncachedIdx.forEach((blockIdx, partIdx) => {
      const block = valid[blockIdx]
      const translated = translations[partIdx] ?? removeLanguageTag(block.content)
      const key = `${block.content}-${sourceLanguage}-${targetLanguage}`
      if (translationCache.size >= TRANSLATION_CONFIG.CACHE_SIZE) {
        const first = translationCache.keys().next().value
        if (first !== undefined) translationCache.delete(first)
      }
      translationCache.set(key, translated)
      results[blockIdx] = { original: removeLanguageTag(block.content), translated: styleFileNames(translated), type: block.type }
    })
  }

  return results.filter((r): r is NonNullable<typeof r> => r !== null)
}

// ─── Styled components ────────────────────────────────────────────────────────

const StyledContainer = styled.div`
  position: relative;
  width: 100%;
`

const StyledSideBySide = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

const StyledTranslationCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 0;
`

const StyledTranslationLabel = styled.div`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.textMuted};
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.brand.borderSoft};
`

const StyledTranslatingMsg = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.brand.textFaint};
  padding: 1rem 0;
`

const StyledBlockList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 15px;
  line-height: 1.7;
  color: ${({ theme }) => theme.brand.text};
`

const StyledBlock = styled.div`
  &[data-block-type="header"] {
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin-top: 1.5rem;
    &:first-of-type { margin-top: 0; }
  }
  &[data-block-type="sub_header"] {
    font-size: 1.2rem;
    font-weight: 700;
    margin-top: 1rem;
  }
  &[data-block-type="sub_sub_header"] {
    font-size: 1rem;
    font-weight: 650;
    margin-top: 0.75rem;
  }
  &[data-block-type="quote"] {
    border-left: 3px solid ${({ theme }) => theme.brand.accent};
    padding-left: 0.75rem;
    color: ${({ theme }) => theme.brand.textMuted};
  }
  &[data-block-type="code"] {
    font-family: var(--font-mono);
    font-size: 13px;
    background: ${({ theme }) => theme.brand.codeBg};
    border: 1px solid ${({ theme }) => theme.brand.codeBorder};
    border-radius: var(--radius-md);
    padding: 0.5rem 0.75rem;
  }
`
