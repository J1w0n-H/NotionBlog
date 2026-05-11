const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/

export function formatDate(
  date: string | null | undefined,
  locale: string
): string {
  if (!date) return ""

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }

  const instant = DATE_ONLY_RE.test(date) ? `${date}T00:00:00.000Z` : date
  const parsed = new Date(instant)
  if (Number.isNaN(parsed.getTime())) return ""

  return parsed.toLocaleDateString(locale, options)
}
