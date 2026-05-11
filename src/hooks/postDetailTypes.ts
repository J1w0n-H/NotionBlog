import type { ExtendedRecordMap } from "notion-types"
import type { PostDetail, TPost } from "src/types"

export type PostWithOptionalRecordMap = TPost & {
  recordMap?: ExtendedRecordMap
}

export type PostDetailQueryState = {
  meta: PostWithOptionalRecordMap | undefined
  detail: PostDetail | undefined
  isPreparing: boolean
  isMissingMeta: boolean
  isLoadingContent: boolean
  isRecordMapError: boolean
}

export function mergePostDetail(
  meta: PostWithOptionalRecordMap | undefined,
  recordMap: ExtendedRecordMap | undefined
): PostDetail | undefined {
  if (!meta || !recordMap) return undefined

  return {
    ...meta,
    recordMap,
  }
}
