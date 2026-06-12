import type { FeedLayoutMode, FeedLayoutWidths } from "src/libs/utils/feedLayoutVars"

const STORAGE_KEY = "feed-layout:v2"

type PersistedFeedLayout = {
  index?: Pick<FeedLayoutWidths, "navWidthPx">
  post?: Pick<FeedLayoutWidths, "navWidthPx" | "listWidthPx">
}

function readPersistedFeedLayout(): PersistedFeedLayout {
  if (typeof window === "undefined") return {}

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as PersistedFeedLayout
    return parsed && typeof parsed === "object" ? parsed : {}
  } catch {
    return {}
  }
}

function writePersistedFeedLayout(next: PersistedFeedLayout) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

export function loadFeedLayoutWidths(
  mode: FeedLayoutMode
): Partial<FeedLayoutWidths> {
  const persisted = readPersistedFeedLayout()

  if (mode === "index") {
    return persisted.index ?? {}
  }

  return persisted.post ?? {}
}

export function saveFeedLayoutWidths(
  mode: FeedLayoutMode,
  widths: FeedLayoutWidths
) {
  const persisted = readPersistedFeedLayout()

  if (mode === "index") {
    persisted.index = { navWidthPx: widths.navWidthPx }
  } else {
    persisted.post = {
      navWidthPx: widths.navWidthPx,
      listWidthPx: widths.listWidthPx,
    }
  }

  writePersistedFeedLayout(persisted)
}

export function clearFeedLayoutWidths(mode: FeedLayoutMode) {
  const persisted = readPersistedFeedLayout()

  if (mode === "index") {
    delete persisted.index
  } else {
    delete persisted.post
  }

  writePersistedFeedLayout(persisted)
}
