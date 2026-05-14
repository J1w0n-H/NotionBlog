import React, { useEffect, useMemo, useState } from "react"
import { ExtendedRecordMap } from "notion-types"
import NotionRenderer from "../NotionRenderer"
import useLanguage from "src/hooks/useLanguage"
import SegmentedToggle from "src/components/SegmentedToggle"
import styled from "@emotion/styled"
import {
  hasMeaningfulTranslation,
  hasTranslatableBlocks,
  translateRecordMapForLanguage,
} from "src/libs/notion/translateRecordMap"
import { normalizePostLangField } from "src/libs/utils/translation"

type Props = {
  recordMap: ExtendedRecordMap
  lang?: string
}

const TranslatedNotionRenderer: React.FC<Props> = ({ recordMap, lang }) => {
  const [currentLanguage] = useLanguage()
  const [translatedRecordMap, setTranslatedRecordMap] =
    useState<ExtendedRecordMap | null>(null)
  const [isTranslating, setIsTranslating] = useState(false)
  const [translationProgress, setTranslationProgress] = useState({
    current: 0,
    total: 0,
  })
  const [translationError, setTranslationError] = useState<string | null>(null)
  const [viewOriginal, setViewOriginal] = useState(false)

  // Honor the post's explicit `lang` metadata when present — that's the
  // author's declaration and should override any content sniffing. We only
  // fall back to per-block content analysis when the post has no declared
  // language, which guards against mixed-language quotes inside an English
  // post being mistaken for Korean.
  const shouldTranslate = useMemo(() => {
    const declared = normalizePostLangField(lang)
    if (declared) return declared !== currentLanguage
    return hasTranslatableBlocks(recordMap, currentLanguage)
  }, [currentLanguage, lang, recordMap])

  useEffect(() => {
    let cancelled = false

    if (!shouldTranslate) {
      setTranslatedRecordMap(null)
      setIsTranslating(false)
      setTranslationError(null)
      setTranslationProgress({ current: 0, total: 0 })
      return
    }

    const run = async () => {
      setIsTranslating(true)
      setTranslationError(null)
      setTranslatedRecordMap(null)

      try {
        const next = await translateRecordMapForLanguage(
          recordMap,
          currentLanguage,
          setTranslationProgress
        )

        if (!cancelled) {
          setTranslatedRecordMap(
            hasMeaningfulTranslation(recordMap, next) ? next : null
          )
        }
      } catch (error) {
        console.error("Failed to translate content:", error)
        if (!cancelled) {
          setTranslationError(
            "번역 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
          )
          setTranslatedRecordMap(null)
        }
      } finally {
        if (!cancelled) {
          setIsTranslating(false)
        }
      }
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [currentLanguage, recordMap, shouldTranslate])

  useEffect(() => {
    setViewOriginal(false)
  }, [currentLanguage, recordMap, shouldTranslate])

  if (!recordMap) {
    return <div>Error: No content to display</div>
  }

  const hasTranslation =
    shouldTranslate && Boolean(translatedRecordMap) && !isTranslating
  const viewingTranslated = hasTranslation && !viewOriginal
  const renderingRecordMap = viewingTranslated
    ? translatedRecordMap
    : translationError
      ? recordMap
      : shouldTranslate && isTranslating
        ? null
        : recordMap
  const showTranslationBanner = hasTranslation
  const showBody = Boolean(renderingRecordMap) && !(shouldTranslate && isTranslating)

  return (
    <StyledContainer>
      {translationError ? (
        <StyledErrorMessage>
          {translationError}
          <StyledRetryButton
            type="button"
            onClick={() => {
              setTranslationError(null)
              setTranslatedRecordMap(null)
              setIsTranslating(true)
              void translateRecordMapForLanguage(
                recordMap,
                currentLanguage,
                setTranslationProgress
              )
                .then((next) => {
                  setTranslatedRecordMap(
                    hasMeaningfulTranslation(recordMap, next) ? next : null
                  )
                })
                .catch((error) => {
                  console.error("Failed to translate content:", error)
                  setTranslationError(
                    "번역 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
                  )
                })
                .finally(() => {
                  setIsTranslating(false)
                })
            }}
          >
            다시 시도
          </StyledRetryButton>
        </StyledErrorMessage>
      ) : null}

      {isTranslating ? (
        <StyledLoadingMessage>
          {currentLanguage === "ko" ? "번역 중" : "Translating"} (
          {translationProgress.current}/{translationProgress.total})
          <StyledProgressBar>
            <StyledProgressFill
              progress={
                translationProgress.total > 0
                  ? (translationProgress.current / translationProgress.total) *
                    100
                  : 0
              }
            />
          </StyledProgressBar>
        </StyledLoadingMessage>
      ) : null}

      {showTranslationBanner ? (
        <StyledTranslationBanner role="status">
          <TranslationRow>
            <SegmentedToggle
              aria-label={
                currentLanguage === "ko"
                  ? "번역문 또는 원문 보기"
                  : "Translated or original text"
              }
              left={{
                label: currentLanguage === "ko" ? "번역" : "Auto",
                selected: !viewOriginal,
                onSelect: () => setViewOriginal(false),
              }}
              right={{
                label: currentLanguage === "ko" ? "원문" : "Source",
                selected: viewOriginal,
                onSelect: () => setViewOriginal(true),
              }}
            />
            <StyledTranslationHint>
              {viewOriginal
                ? currentLanguage === "ko"
                  ? "원문 기준으로 표시 중입니다."
                  : "Showing the source text."
                : currentLanguage === "ko"
                  ? "선택한 언어로 자동 번역된 글입니다."
                  : "Machine-translated to your language."}
            </StyledTranslationHint>
          </TranslationRow>
        </StyledTranslationBanner>
      ) : null}

      {showBody && renderingRecordMap ? (
        <NotionRenderer recordMap={renderingRecordMap} />
      ) : null}
    </StyledContainer>
  )
}

export default TranslatedNotionRenderer

const StyledContainer = styled.div`
  position: relative;
  width: 100%;
`

const StyledLoadingMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.gray11};
  gap: 0.75rem;
`

const StyledProgressBar = styled.div`
  width: min(240px, 100%);
  height: 8px;
  background: ${({ theme }) => theme.colors.gray6};
  border-radius: 4px;
  overflow: hidden;
`

const StyledProgressFill = styled.div<{ progress: number }>`
  width: ${({ progress }) => progress}%;
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 4px;
  transition: width 0.3s ease;
`

const StyledErrorMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  padding: 1rem;
  color: ${({ theme }) => theme.colors.red9 || "#ef4444"};
  text-align: center;
  gap: 0.75rem;
`

const StyledRetryButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.colors.blue9 || "#3b82f6"};
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.blue10 || "#2563eb"};
  }
`

const StyledTranslationBanner = styled.div`
  margin-bottom: 1rem;
  padding: 0.65rem 0.85rem;
  border-radius: 0.75rem;
  border: 1px solid ${({ theme }) => theme.brand.border};
  background: ${({ theme }) => theme.brand.surface2};
  box-shadow: ${({ theme }) => theme.brand.shadowSm};
`

const TranslationRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.65rem 1rem;
`

const StyledTranslationHint = styled.p`
  margin: 0;
  flex: 1 1 12rem;
  min-width: 0;
  font-size: 0.75rem;
  line-height: 1.45;
  color: ${({ theme }) => theme.brand.textFaint};
`
