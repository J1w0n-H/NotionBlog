import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/router"
import { ABOUT_SLUG } from "src/constants"
import { queryKey } from "src/constants/queryKey"
import { fetchPostRecordMap } from "src/libs/notion/fetchPostRecordMap"
import type { PostDetail } from "src/types"
import type { PostWithOptionalRecordMap } from "src/hooks/useResolvedPostDetail"

function toPostDetail(
  meta: PostWithOptionalRecordMap,
  recordMap: PostWithOptionalRecordMap["recordMap"]
): PostDetail | undefined {
  if (!recordMap) return undefined
  return {
    ...meta,
    recordMap,
  }
}

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

  const needsRecordMap = Boolean(meta?.id) && !meta?.recordMap
  const recordMapQuery = useQuery({
    queryKey: queryKey.postRecordMap(slug),
    queryFn: () => fetchPostRecordMap(meta!.id),
    enabled: router.isReady && needsRecordMap,
    staleTime: Infinity,
  })

  const detail = meta
    ? toPostDetail(meta, meta.recordMap ?? recordMapQuery.data)
    : undefined

  return {
    slug,
    meta,
    detail,
    isPreparing: !router.isReady || router.isFallback,
    isMissingMeta:
      router.isReady && !router.isFallback && !meta,
    isLoadingContent:
      needsRecordMap &&
      (recordMapQuery.isLoading || recordMapQuery.isFetching),
    isRecordMapError: recordMapQuery.isError,
  }
}
