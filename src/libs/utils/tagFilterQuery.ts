import { parseQueryTagParam, tagFamilyKey } from "src/libs/utils/normalizeTag"

type RouterQuery = Record<string, string | string[] | undefined>

/**
 * Tag chips are counted across all categories. When user picks a tag, drop
 * `category` so the list matches the chip count (intersection was often empty).
 */
export function buildQueryForTagChipClick(
  query: RouterQuery,
  chipLabel: string
): RouterQuery {
  const current = parseQueryTagParam(query.tag)
  const togglingOff =
    current != null && tagFamilyKey(current) === tagFamilyKey(chipLabel)

  const next: RouterQuery = { ...query }

  if (togglingOff) {
    delete next.tag
  } else {
    next.tag = chipLabel
    delete next.category
  }

  return next
}

export function buildQueryForTagClear(query: RouterQuery): RouterQuery {
  if (parseQueryTagParam(query.tag) == null) return query

  const next: RouterQuery = { ...query }
  delete next.tag
  return next
}

/** Post-card tag click: filter by tag and show all categories. */
export function buildQueryForTagLink(
  query: RouterQuery,
  tagLabel: string
): RouterQuery {
  const next: RouterQuery = { ...query, tag: tagLabel }
  delete next.category
  return next
}
