import React, { useEffect, useMemo, useState } from "react"
import { ExtendedRecordMap } from "notion-types"
import NotionRenderer from "../NotionRenderer"
import useLanguage from "src/hooks/useLanguage"
import styled from "@emotion/styled"
import { detectLanguage } from "src/libs/utils/translation"
import {
  extractTranslatableBlocks,
  hasTranslatableBlocks,
  translateRecordMapForLanguage,
} from "src/libs/notion/translateRecordMap"

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

  const textContent = useMemo(() => {
    return extractTranslatableBlocks(recordMap)
      .map((block) => block.content)
      .join("\n")
  }, [recordMap])

  const contentLanguage = useMemo(() => {
    return detectLanguage(textContent, lang)
  }, [textContent, lang])

  const shouldTranslate = useMemo(() => {
    if (contentLanguage === currentLanguage) return false
    return hasTranslatableBlocks(recordMap, currentLanguage, contentLanguage)
  }, [contentLanguage, currentLanguage, recordMap])

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
          contentLanguage,
          setTranslationProgress
        )

        if (!cancelled) {
          setTranslatedRecordMap(next)
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
  }, [contentLanguage, currentLanguage, recordMap, shouldTranslate])

  useEffect(() => {
    setViewOriginal(false)
  }, [contentLanguage, currentLanguage, recordMap, shouldTranslate])

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
                contentLanguage,
                setTranslationProgress
              )
                .then((next) => {
                  setTranslatedRecordMap(next)
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
          <StyledTranslationMessage>
            {viewOriginal
              ? currentLanguage === "ko"
                ? "원문을 보고 있습니다."
                : "You are reading the original."
              : currentLanguage === "ko"
                ? "이 글은 자동 번역되었습니다."
                : "This article was automatically translated."}
          </StyledTranslationMessage>
          <StyledTranslationAction
            type="button"
            onClick={() => setViewOriginal((current) => !current)}
          >
            {viewOriginal
              ? currentLanguage === "ko"
                ? "번역문 보기"
                : "View translation"
              : currentLanguage === "ko"
                ? "원문 보기"
                : "View original"}
          </StyledTranslationAction>
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
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid ${({ theme }) => theme.brand.border};
  background: ${({ theme }) => theme.brand.surface2};
  box-shadow: ${({ theme }) => theme.brand.shadowSm};
`

const StyledTranslationMessage = styled.p`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.brand.textMuted};
`

const StyledTranslationAction = styled.button`
  flex-shrink: 0;
  padding: 0.5rem 0.875rem;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.brand.borderStrong};
  background: ${({ theme }) => theme.brand.surface};
  color: ${({ theme }) => theme.brand.text};
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.brand.accentSoft};
    border-color: ${({ theme }) => theme.brand.accent};
    color: ${({ theme }) => theme.brand.accent};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.brand.accentRing};
    outline-offset: 2px;
  }
`
