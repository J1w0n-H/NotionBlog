import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/router"
import { queryKey } from "src/constants/queryKey"
import { fetchPostRecordMap } from "src/libs/notion/fetchPostRecordMap"
import { isUsableRecordMap } from "src/libs/notion/isUsableRecordMap"
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
  const hasEmbeddedRecordMap = isUsableRecordMap(meta?.id, meta?.recordMap)
  const needsRecordMap = Boolean(meta?.id) && !hasEmbeddedRecordMap

  const recordMapQuery = useQuery({
    queryKey: queryKey.postRecordMap(recordMapSlug),
    queryFn: () => fetchPostRecordMap(meta!.id),
    enabled: router.isReady && needsRecordMap,
    staleTime: Infinity,
    retry: 1,
  })

  const resolvedRecordMap = hasEmbeddedRecordMap
    ? meta?.recordMap
    : recordMapQuery.data
  const detail = mergePostDetail(meta, resolvedRecordMap)
  const hasInvalidFetchedRecordMap =
    recordMapQuery.isSuccess &&
    Boolean(meta?.id) &&
    !isUsableRecordMap(meta.id, recordMapQuery.data)

  return {
    meta,
    detail,
    isPreparing: !router.isReady || router.isFallback,
    isMissingMeta: router.isReady && !router.isFallback && !meta,
    isLoadingContent:
      needsRecordMap &&
      (recordMapQuery.isLoading || recordMapQuery.isFetching),
    isRecordMapError:
      recordMapQuery.isError ||
      hasInvalidFetchedRecordMap ||
      (Boolean(meta?.recordMap) && !hasEmbeddedRecordMap),
  }
}
