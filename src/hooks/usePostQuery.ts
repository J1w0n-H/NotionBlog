import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/router"
import type { ExtendedRecordMap } from "notion-types"
import { queryKey } from "src/constants/queryKey"
import type { PostDetail, TPost } from "src/types"

type PostWithOptionalRecordMap = TPost & {
  recordMap?: ExtendedRecordMap
}

async function fetchPostRecordMap(pageId: string): Promise<ExtendedRecordMap> {
  const response = await fetch(
    `/api/notion/record-map?pageId=${encodeURIComponent(pageId)}`
  )
  if (!response.ok) {
    throw new Error("Failed to load post content")
  }
  return response.json()
}

const usePostQuery = () => {
  const router = useRouter()
  const slug = `${router.query.slug ?? ""}`
  const { data: post } = useQuery<PostWithOptionalRecordMap>({
    queryKey: queryKey.post(slug),
    enabled: false,
  })

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

export default usePostQuery
