import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/router"
import { ABOUT_SLUG } from "src/constants"
import { queryKey } from "src/constants/queryKey"
import type { PostWithOptionalRecordMap } from "src/hooks/postDetailTypes"
import { usePostDetailFromMeta } from "src/hooks/usePostDetailFromMeta"

export function usePostPageState() {
  const router = useRouter()
  const slug = `${router.query.slug ?? ""}`

  const { data: routedMeta } = useQuery<PostWithOptionalRecordMap>({
    queryKey: queryKey.post(slug),
    enabled: false,
  })

  const { data: aboutMeta } = useQuery<PostWithOptionalRecordMap>({
    queryKey: queryKey.post(ABOUT_SLUG),
    enabled: false,
  })

  const meta =
    routedMeta ?? (slug === ABOUT_SLUG ? aboutMeta : undefined)

  return {
    slug,
    ...usePostDetailFromMeta(meta, slug),
  }
}

/** Resolved post detail from dehydrated React Query cache. */
export function usePostDetail() {
  return usePostPageState().detail
}
