import { useMemo } from "react"
import usePostsQuery from "./usePostsQuery"

/**
 * Stable alphabetical index for every tag in the feed. Used to deterministically
 * assign each tag a slot in the 8-slot palette (alphabet > frequency: frequency
 * shifts every filter and makes colors jump).
 */
export function useTagIndex(): Map<string, number> {
  const posts = usePostsQuery()

  return useMemo(() => {
    const seen = new Set<string>()
    posts.forEach((p) => p.tags?.forEach((t) => seen.add(t)))
    const sorted = [...seen].sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" })
    )
    return new Map(sorted.map((t, i) => [t, i]))
  }, [posts])
}
