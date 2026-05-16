export type FeedScrollScope = "list"

const FEED_SCROLL_KEY_PREFIX = "feed-scroll-y:"
const LEGACY_FEED_SCROLL_KEY = "feed-scroll-y"

function feedScrollStorageKey(scope: FeedScrollScope = "list") {
  return `${FEED_SCROLL_KEY_PREFIX}${scope}`
}

export function rememberFeedScrollPosition(scope: FeedScrollScope = "list") {
  if (typeof window === "undefined") return
  sessionStorage.setItem(feedScrollStorageKey(scope), String(window.scrollY))
}

const RESTORE_SCROLL_MAX_FRAMES = 3

export function restoreFeedScrollPosition(scope: FeedScrollScope = "list") {
  if (typeof window === "undefined") return

  const key = feedScrollStorageKey(scope)
  const raw = sessionStorage.getItem(key) ?? sessionStorage.getItem(LEGACY_FEED_SCROLL_KEY)
  if (!raw) return

  const y = Number(raw)
  if (!Number.isFinite(y)) return

  let frame = 0

  const apply = () => {
    window.scrollTo({ top: y, behavior: "auto" })
    frame += 1
    if (frame < RESTORE_SCROLL_MAX_FRAMES) {
      requestAnimationFrame(apply)
    }
  }

  // First call is synchronous to avoid a 1-frame flash of scroll=0 during route changes.
  apply()
}
