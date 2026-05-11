import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/router"
import type { ExtendedRecordMap } from "notion-types"
import { queryKey } from "src/constants/queryKey"
import { fetchPostRecordMap } from "src/libs/notion/fetchPostRecordMap"
import type { PostDetail, TPost } from "src/types"

export type PostWithOptionalRecordMap = TPost & {
  recordMap?: ExtendedRecordMap
}

export function useResolvedPostDetail(
  slug: string,
  post?: PostWithOptionalRecordMap
) {
  const router = useRouter()
  const { data: recordMap } = useQuery({
    queryKey: queryKey.postRecordMap(slug),
    queryFn: () => fetchPostRecordMap(post!.id),
    enabled: router.isReady && Boolean(post?.id) && !post?.recordMap,
    staleTime: Infinity,
  })

  if (!post) return undefined

  const resolvedRecordMap = post.recordMap ?? recordMap
  if (!resolvedRecordMap) return undefined

  return {
    ...post,
    recordMap: resolvedRecordMap,
  } satisfies PostDetail
}
