import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/router"
import { ABOUT_SLUG } from "src/constants"
import { queryKey } from "src/constants/queryKey"
import type { PostWithOptionalRecordMap } from "src/hooks/postDetailTypes"
import { usePostDetailFromMeta } from "src/hooks/usePostDetailFromMeta"

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

  const meta = onAboutRoute ? routed ?? cached : cached
  const recordMapSlug = onAboutRoute && routed ? slug : ABOUT_SLUG

  return usePostDetailFromMeta(meta, recordMapSlug)
}

export default useAboutPostQuery
