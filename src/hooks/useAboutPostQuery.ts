import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/router"
import { ABOUT_SLUG } from "src/constants"
import { queryKey } from "src/constants/queryKey"
import {
  useResolvedPostDetail,
  type PostWithOptionalRecordMap,
} from "src/hooks/useResolvedPostDetail"

const useAboutPostQuery = () => {
  const router = useRouter()
  const slug = `${router.query.slug ?? ""}`
  const onAboutRoute =
    router.isReady && router.pathname === "/[slug]" && slug === ABOUT_SLUG

  const { data: routed } = useQuery<PostWithOptionalRecordMap>({
    queryKey: queryKey.post(slug),
    enabled: false,
  })

  const { data: cached } = useQuery<PostWithOptionalRecordMap>({
    queryKey: queryKey.post(ABOUT_SLUG),
    enabled: false,
  })

  const post = onAboutRoute ? routed ?? cached : cached
  const recordMapSlug = onAboutRoute && routed ? slug : ABOUT_SLUG

  return useResolvedPostDetail(recordMapSlug, post)
}

export default useAboutPostQuery
