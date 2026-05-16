import { useCallback, useEffect, useRef, useState } from "react"
import {
  clearFeedLayoutWidths,
  loadFeedLayoutWidths,
  saveFeedLayoutWidths,
} from "src/libs/utils/feedLayoutStorage"
import { syncFeedScrollOffsetVar } from "src/libs/utils/feedScrollOffset"
import {
  defaultFeedLayoutWidths,
  FEED_NAV_DOCK_WIDTH_PX,
  FEED_NAV_WIDTH_VAR,
  resolveFeedLayoutWidths,
  syncFeedLayoutVars,
  type FeedLayoutMode,
  type FeedLayoutWidths,
} from "src/libs/utils/feedLayoutVars"

function applyFeedLayout(widths: FeedLayoutWidths) {
  syncFeedLayoutVars(widths)
  syncFeedScrollOffsetVar()
}

export function useFeedLayoutPreferences(
  layoutMode: FeedLayoutMode,
  enabled: boolean
) {
  const [widths, setWidths] = useState<FeedLayoutWidths>(defaultFeedLayoutWidths)
  const widthsRef = useRef(widths)
  const layoutModeRef = useRef(layoutMode)

  useEffect(() => {
    widthsRef.current = widths
  }, [widths])

  useEffect(() => {
    layoutModeRef.current = layoutMode
  }, [layoutMode])

  useEffect(() => {
    if (!enabled) return

    const next = resolveFeedLayoutWidths(loadFeedLayoutWidths(layoutMode))
    widthsRef.current = next
    setWidths(next)
    applyFeedLayout(next)
  }, [enabled, layoutMode])

  const previewWidths = useCallback((patch: Partial<FeedLayoutWidths>) => {
    const next = resolveFeedLayoutWidths({
      ...widthsRef.current,
      ...patch,
    })
    widthsRef.current = next
    // Skip setWidths during drag preview — CSS vars applied immediately via applyFeedLayout,
    // no React re-render needed until commit.
    applyFeedLayout(next)
    // In dock mode (non-index), applyFeedLayout would expand the nav back to stored width.
    // Keep it pinned to dock width so the nav doesn't flash wider during resize.
    if (layoutModeRef.current !== "index" && typeof document !== "undefined") {
      document.documentElement.style.setProperty(
        FEED_NAV_WIDTH_VAR,
        `${FEED_NAV_DOCK_WIDTH_PX}px`
      )
    }
  }, [])

  const commitWidths = useCallback(
    (patch?: Partial<FeedLayoutWidths>) => {
      const next = resolveFeedLayoutWidths({
        ...widthsRef.current,
        ...(patch ?? {}),
      })
      widthsRef.current = next
      setWidths(next)
      applyFeedLayout(next)
      saveFeedLayoutWidths(layoutMode, next)
    },
    [layoutMode]
  )

  const resetWidths = useCallback(() => {
    const next = resolveFeedLayoutWidths()
    widthsRef.current = next
    setWidths(next)
    applyFeedLayout(next)
    clearFeedLayoutWidths(layoutMode)
  }, [layoutMode])

  const snapshotRef = useRef<FeedLayoutWidths | null>(null)

  const beginResize = useCallback(() => {
    snapshotRef.current = widthsRef.current
  }, [])

  const cancelResize = useCallback(() => {
    if (!snapshotRef.current) return

    const next = resolveFeedLayoutWidths(snapshotRef.current)
    widthsRef.current = next
    setWidths(next)
    applyFeedLayout(next)
    snapshotRef.current = null
  }, [])

  const commitResize = useCallback(() => {
    commitWidths()
    snapshotRef.current = null
  }, [commitWidths])

  const nudgeWidth = useCallback(
    (field: keyof FeedLayoutWidths, deltaPx: number) => {
      commitWidths({
        [field]: widthsRef.current[field] + deltaPx,
      })
    },
    [commitWidths]
  )

  return {
    widths,
    previewWidths,
    commitWidths,
    resetWidths,
    beginResize,
    cancelResize,
    commitResize,
    nudgeWidth,
  }
}
