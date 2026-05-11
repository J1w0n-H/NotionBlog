type RouterQuery = Record<string, string | string[] | undefined>

export function parseFeedSearchParam(value: unknown): string {
  if (value == null) return ""
  const raw = Array.isArray(value) ? value[0] : value
  if (typeof raw !== "string") return ""
  return raw.trim()
}

export function withFeedSearchQuery(
  query: RouterQuery,
  search: string
): RouterQuery {
  const next = { ...query }
  const trimmed = search.trim()

  if (trimmed) {
    next.q = trimmed
  } else {
    delete next.q
  }

  return next
}
