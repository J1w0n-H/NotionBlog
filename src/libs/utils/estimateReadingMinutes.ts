import type { TPost } from "src/types"

const READ_WORDS_PER_MIN = 200

/** Rough read-time from the post summary (same heuristic as feed PostCard). */
export function estimateReadingMinutesFromPost(post: TPost): number | undefined {
  const raw = post.summary?.trim()
  if (!raw) return undefined
  const words = raw.split(/\s+/).filter(Boolean).length
  if (words === 0) return undefined
  return Math.max(1, Math.round(words / READ_WORDS_PER_MIN))
}
