import { useRouter } from "next/router"
import { useMemo } from "react"
import { DEFAULT_CATEGORY } from "src/constants"
import { parseQueryTagParam } from "src/libs/utils/normalizeTag"

export type FeedRouterFilters = {
  tag?: string
  category: string
  order: string
}

/** URL `?tag` / `?category` / `?order`를 피드 리스트와 동일 규칙으로 해석 */
export function useFeedRouterFilters(): FeedRouterFilters {
  const router = useRouter()
  return useMemo(() => {
    const tag = parseQueryTagParam(router.query.tag)
    const category =
      `${router.query.category || ``}` || DEFAULT_CATEGORY
    const order = `${router.query.order || ``}` || "desc"
    return { tag, category, order }
  }, [router.query.tag, router.query.category, router.query.order])
}
