import { useRouter } from "next/router"
import { useMemo } from "react"
import { hueFromString } from "src/constants/tagHue"
import { useTagsQuery } from "src/hooks/useTagsQuery"
import { buildQueryForTagChipClick, buildQueryForTagClear } from "src/libs/utils/tagFilterQuery"
import { parseQueryTagParam, tagFamilyKey } from "src/libs/utils/normalizeTag"

export function useFeedTagChips(limit = 12) {
  const router = useRouter()
  const current = parseQueryTagParam(router.query.tag)
  const currentFam = current ? tagFamilyKey(current) : undefined
  const data = useTagsQuery()

  const topTags = useMemo(() => {
    return Object.entries(data)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
  }, [data, limit])

  const onClick = (tag: string) => {
    router.push({
      pathname: router.pathname,
      query: buildQueryForTagChipClick(router.query, tag),
    })
  }

  const isActive = (tag: string) =>
    currentFam != null && currentFam === tagFamilyKey(tag)

  const clearTag = () => {
    router.push({
      pathname: router.pathname,
      query: buildQueryForTagClear(router.query),
    })
  }

  return {
    topTags,
    onClick,
    isActive,
    clearTag,
    hasActiveTag: currentFam != null,
    hueFor: hueFromString,
  }
}
