/** "Jiwon Hwang" → "JH". Falls back to the first character, then "•". */
export function getInitials(text: string): string {
  const cleaned = (text || "").trim()
  if (!cleaned) return "•"
  const parts = cleaned.split(/\s+/).filter(Boolean)
  const out = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("")
  return out || cleaned[0].toUpperCase()
}
