import type { PostDetailQueryState } from "src/hooks/postDetailTypes"

export function hasPostDetailQueryError(
  state: PostDetailQueryState,
  requireMeta = false
): boolean {
  if (state.isMissingMeta || state.isRecordMapError || !state.detail) {
    return true
  }

  return requireMeta && !state.meta
}
