import { DEFAULT_CATEGORY } from "src/constants"
import {
  parseQueryCategoryParam,
  parseQueryTagParam,
} from "src/libs/utils/normalizeTag"

type RouterQuery = Record<string, string | string[] | undefined>

function parseOrderParam(order: unknown): string | undefined {
  if (order == null) return undefined
  const s = Array.isArray(order) ? order[0] : order
  if (typeof s !== "string") return undefined
  const t = s.trim()
  return t.length > 0 ? t : undefined
}

/** Feed list filters to keep when leaving a slug or side panel. */
export function pickFeedListQuery(source: RouterQuery): RouterQuery {
  const next: RouterQuery = {}

  const tag = parseQueryTagParam(source.tag)
  if (tag) next.tag = tag

  const category = parseQueryCategoryParam(source.category)
  if (category && category !== DEFAULT_CATEGORY) {
    next.category = category
  }

  const order = parseOrderParam(source.order)
  if (order && order !== "desc") {
    next.order = order
  }

  return next
}

export function buildReturnToFeedLocation(source: RouterQuery) {
  return {
    pathname: "/",
    query: pickFeedListQuery(source),
  }
}

export function buildPostHref(slug: string, source: RouterQuery) {
  return {
    pathname: `/${slug}`,
    query: pickFeedListQuery(source),
  }
}
