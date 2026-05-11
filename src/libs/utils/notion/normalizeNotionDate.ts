export type NormalizedNotionDate = {
  start_date: string
  end_date?: string
}

/** Official API uses `start`; legacy/unofficial payloads used `start_date`. */
export function normalizeNotionDate(raw: unknown): NormalizedNotionDate | null {
  if (!raw || typeof raw !== "object") return null
  const value = raw as {
    start?: string
    start_date?: string
    end?: string | null
    end_date?: string | null
  }
  const start = value.start_date ?? value.start
  if (!start) return null
  const normalized: NormalizedNotionDate = { start_date: start }
  const end = value.end_date ?? value.end
  if (end) normalized.end_date = end
  return normalized
}
