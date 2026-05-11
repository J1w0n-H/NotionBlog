import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/router"
import { queryKey } from "src/constants/queryKey"
import { fetchPostRecordMap } from "src/libs/notion/fetchPostRecordMap"
import {
  mergePostDetail,
  type PostDetailQueryState,
  type PostWithOptionalRecordMap,
} from "src/hooks/postDetailTypes"

export function usePostDetailFromMeta(
  meta: PostWithOptionalRecordMap | undefined,
  recordMapSlug: string
): PostDetailQueryState {
  const router = useRouter()
  const needsRecordMap = Boolean(meta?.id) && !meta?.recordMap

  const recordMapQuery = useQuery({
    queryKey: queryKey.postRecordMap(recordMapSlug),
    queryFn: () => fetchPostRecordMap(meta!.id),
    enabled: router.isReady && needsRecordMap,
    staleTime: Infinity,
  })

  const detail = mergePostDetail(meta, meta?.recordMap ?? recordMapQuery.data)

  return {
    meta,
    detail,
    isPreparing: !router.isReady || router.isFallback,
    isMissingMeta: router.isReady && !router.isFallback && !meta,
    isLoadingContent:
      needsRecordMap &&
      (recordMapQuery.isLoading || recordMapQuery.isFetching),
    isRecordMapError: recordMapQuery.isError,
  }
}
