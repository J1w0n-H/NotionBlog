import React, { useEffect, useMemo, useState } from "react"
import { ExtendedRecordMap } from "notion-types"
import NotionRenderer from "../NotionRenderer"
import useLanguage from "src/hooks/useLanguage"
import styled from "@emotion/styled"
import { detectLanguage } from "src/libs/utils/translation"
import {
  extractTranslatableBlocks,
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
  const [contentLanguage, setContentLanguage] = useState<"ko" | "en">("ko")
  const [translationProgress, setTranslationProgress] = useState({
    current: 0,
    total: 0,
  })
  const [translationError, setTranslationError] = useState<string | null>(null)

  const textContent = useMemo(() => {
    return extractTranslatableBlocks(recordMap)
      .map((block) => block.content)
      .join("\n")
  }, [recordMap])

  const detectedLang = useMemo(() => {
    return detectLanguage(textContent, lang)
  }, [textContent, lang])

  useEffect(() => {
    setContentLanguage(detectedLang)
  }, [detectedLang])

  useEffect(() => {
    let cancelled = false

    if (contentLanguage === currentLanguage) {
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
  }, [contentLanguage, currentLanguage, recordMap])

  if (!recordMap) {
    return <div>Error: No content to display</div>
  }

  const shouldTranslate = contentLanguage !== currentLanguage
  const activeRecordMap = shouldTranslate ? translatedRecordMap : recordMap
  const renderingRecordMap =
    activeRecordMap ?? (translationError ? recordMap : null)
  const showTranslatedNote =
    shouldTranslate && Boolean(translatedRecordMap) && !isTranslating
  const showBody =
    Boolean(renderingRecordMap) && !(shouldTranslate && isTranslating)

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

      {showBody && renderingRecordMap ? (
        <NotionRenderer recordMap={renderingRecordMap} />
      ) : null}

      {showTranslatedNote ? (
        <StyledTranslationNote>
          {currentLanguage === "ko"
            ? "Google 번역을 통해 자동 번역되었습니다."
            : "Automatically translated via Google Translate."}
        </StyledTranslationNote>
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

const StyledTranslationNote = styled.div`
  margin-top: 1rem;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.gray3};
  border-radius: 0.5rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.gray11};
  text-align: center;
  border: 1px solid ${({ theme }) => theme.colors.gray6};
`
