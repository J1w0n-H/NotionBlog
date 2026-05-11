import { useRouter } from "next/router"
import { useMemo } from "react"
import { DEFAULT_CATEGORY } from "src/constants"
import {
  parseQueryCategoryParam,
  parseQueryTagParam,
} from "src/libs/utils/normalizeTag"

export type FeedRouterFilters = {
  tag?: string
  category: string
  order: string
}

function parseOrderParam(order: unknown): string {
  if (order == null) return "desc"
  const s = Array.isArray(order) ? order[0] : order
  if (typeof s !== "string") return "desc"
  const t = s.trim()
  return t.length > 0 ? t : "desc"
}

/** URL `?tag` / `?category` / `?order`를 피드 리스트와 동일 규칙으로 해석 */
export function useFeedRouterFilters(): FeedRouterFilters {
  const router = useRouter()
  return useMemo(() => {
    if (!router.isReady) {
      return { tag: undefined, category: DEFAULT_CATEGORY, order: "desc" }
    }
    const tag = parseQueryTagParam(router.query.tag)
    const category = parseQueryCategoryParam(router.query.category)
    const order = parseOrderParam(router.query.order)
    return { tag, category, order }
  }, [router.isReady, router.asPath])
}
