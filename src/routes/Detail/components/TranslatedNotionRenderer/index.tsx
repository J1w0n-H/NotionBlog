import React, { useState, useEffect, useMemo } from "react"
import { ExtendedRecordMap } from "notion-types"
import NotionRenderer from "../NotionRenderer"
import useLanguage from "src/hooks/useLanguage"
import styled from "@emotion/styled"
import { normalizePostLangField, removeLanguageTag } from "src/libs/utils/translation"
import { TRANSLATION_CACHE_SIZE } from "src/constants/translation"

type LanguageType = "ko" | "en"

type Block = { id: string; content: string; type: string; order: number }
type TranslatedBlock = { original: string; translated: string; type: string }

const cache = new Map<string, string>()

type Props = {
  recordMap: ExtendedRecordMap
  lang?: string
}

const TranslatedNotionRenderer: React.FC<Props> = ({ recordMap, lang }) => {
  const [currentLanguage] = useLanguage()
  const [translatedBlocks, setTranslatedBlocks] = useState<TranslatedBlock[] | null>(null)
  const [isTranslating, setIsTranslating] = useState(false)

  const contentLang = useMemo(() => normalizePostLangField(lang), [lang])
  const needsTranslation = contentLang !== null && contentLang !== currentLanguage

  const blocks = useMemo(
    () => (needsTranslation && recordMap ? extractBlocks(recordMap) : []),
    [recordMap, needsTranslation]
  )

  useEffect(() => {
    if (!needsTranslation || blocks.length === 0) {
      setTranslatedBlocks([])
      return
    }
    let cancelled = false
    setIsTranslating(true)
    setTranslatedBlocks(null)
    translate(blocks, currentLanguage as LanguageType, contentLang!)
      .then((result) => { if (!cancelled) setTranslatedBlocks(result) })
      .catch(() => { if (!cancelled) setTranslatedBlocks([]) })
      .finally(() => { if (!cancelled) setIsTranslating(false) })
    return () => { cancelled = true }
  }, [blocks, contentLang, currentLanguage, needsTranslation])

  if (!needsTranslation) {
    return (
      <StyledWrapper>
        <NotionRenderer recordMap={recordMap} />
      </StyledWrapper>
    )
  }

  const label = currentLanguage === "ko" ? "번역 (한국어)" : "Translation (English)"

  return (
    <StyledSideBySide>
      <NotionRenderer recordMap={recordMap} />
      <StyledTranslationCol>
        <StyledTranslationLabel>{label}</StyledTranslationLabel>
        {isTranslating || translatedBlocks === null ? (
          <StyledStatus aria-live="polite">
            {currentLanguage === "ko" ? "번역 중…" : "Translating…"}
          </StyledStatus>
        ) : translatedBlocks.length > 0 ? (
          <StyledBlockList>
            {translatedBlocks.map((block, i) => (
              <StyledBlock
                key={i}
                data-block-type={block.type}
                dangerouslySetInnerHTML={{ __html: block.translated }}
              />
            ))}
          </StyledBlockList>
        ) : null}
      </StyledTranslationCol>
    </StyledSideBySide>
  )
}

export default TranslatedNotionRenderer

// ─── Block extraction ─────────────────────────────────────────────────────────

const FILE_RE = /^[a-zA-Z0-9_-]+\.(png|jpg|jpeg|gif|svg|webp|pdf|doc|docx|xls|xlsx|zip|rar|mp4|mp3|txt|csv|json|xml)$/i
const UUID_RE = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i
const META_RE = [
  /^\d+\s*[d,]/i,
  /\[object Object\]/i,
  UUID_RE,
  /^Post\s+JW-\d+/i,
  /^\d+\.?\d*\s*(KB|MB)$/i,
]

function isSkippable(text: string): boolean {
  const t = text.trim()
  return !t || FILE_RE.test(t) || META_RE.some((re) => re.test(t))
}

function extractBlocks(recordMap: ExtendedRecordMap): Block[] {
  const pageEntry = Object.entries(recordMap.block).find(
    ([, b]) => (b as any)?.value?.type === "page"
  )
  const pageId = pageEntry?.[0] ?? Object.keys(recordMap.block)[0]
  if (!pageId) return []

  const orderedIds: string[] = (recordMap.block[pageId] as any)?.value?.content ?? []
  const out: Block[] = []

  for (const [blockId, blockData] of Object.entries(recordMap.block)) {
    const b = blockData as any
    const props = b?.value?.properties
    const type: string = b?.value?.type ?? "text"
    if (!props) continue

    const runs: any[] = props.title ?? props.rich_text ?? []
    let content = ""
    for (const run of runs) {
      if (Array.isArray(run) && typeof run[0] === "string") {
        const text = run[0].trim()
        if (text && !isSkippable(text)) content += text + " "
      }
    }

    const trimmed = content.trim()
    if (isSkippable(trimmed)) continue

    const order = orderedIds.indexOf(blockId)
    out.push({ id: blockId, content: trimmed, type, order: order >= 0 ? order : 999 })
  }

  return out.sort((a, b) => a.order - b.order)
}

// ─── Translation ──────────────────────────────────────────────────────────────

async function translate(
  blocks: Block[],
  target: LanguageType,
  source: LanguageType
): Promise<TranslatedBlock[]> {
  const texts = blocks.map((b) => removeLanguageTag(b.content))

  const cached: (string | null)[] = texts.map((text) => {
    return cache.get(`${text}|${source}→${target}`) ?? null
  })

  const uncachedIdxs = cached.map((v, i) => (v === null ? i : -1)).filter((i) => i >= 0)
  const uncachedTexts = uncachedIdxs.map((i) => texts[i])

  let fetched: string[] = uncachedTexts
  if (uncachedTexts.length > 0) {
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texts: uncachedTexts, source, target }),
      })
      if (res.ok) {
        const data = (await res.json()) as { translations?: string[] }
        if (Array.isArray(data.translations) && data.translations.length === uncachedTexts.length) {
          fetched = data.translations
        }
      }
    } catch (err) {
      console.error("translate fetch failed:", err)
    }

    uncachedIdxs.forEach((blockIdx, i) => {
      const key = `${texts[blockIdx]}|${source}→${target}`
      const value = fetched[i] ?? texts[blockIdx]
      if (cache.size >= TRANSLATION_CACHE_SIZE) {
        const first = cache.keys().next().value
        if (first !== undefined) cache.delete(first)
      }
      cache.set(key, value)
      cached[blockIdx] = value
    })
  }

  return blocks.map((block, i) => ({
    original: texts[i],
    translated: cached[i] ?? texts[i],
    type: block.type,
  }))
}

// ─── Styled components ────────────────────────────────────────────────────────

const StyledWrapper = styled.div`
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

const StyledStatus = styled.div`
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
