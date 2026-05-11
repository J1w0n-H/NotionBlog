const FEED_SCROLL_KEY = "feed-scroll-y"

export function rememberFeedScrollPosition() {
  if (typeof window === "undefined") return
  sessionStorage.setItem(FEED_SCROLL_KEY, String(window.scrollY))
}

export function restoreFeedScrollPosition() {
  if (typeof window === "undefined") return
  const raw = sessionStorage.getItem(FEED_SCROLL_KEY)
  if (!raw) return
  const y = Number(raw)
  if (!Number.isFinite(y)) return
  requestAnimationFrame(() => {
    window.scrollTo({ top: y, behavior: "auto" })
  })
}
