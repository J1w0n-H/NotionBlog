import type { FC, ReactNode } from "react"
import PostDetailLoading from "src/components/PostDetailLoading"
import type { PostDetailQueryState } from "src/hooks/postDetailTypes"
import CustomError from "src/routes/Error"
import type { PostDetail } from "src/types"

type Props = {
  state: PostDetailQueryState
  requireMeta?: boolean
  loadingFallback?: ReactNode
  errorFallback?: ReactNode
  children: (detail: PostDetail) => ReactNode
}

function hasQueryError(
  state: PostDetailQueryState,
  requireMeta: boolean
): boolean {
  if (state.isMissingMeta || state.isRecordMapError || !state.detail) {
    return true
  }

  return requireMeta && !state.meta
}

const PostDetailQueryView: FC<Props> = ({
  state,
  requireMeta = false,
  loadingFallback,
  errorFallback,
  children,
}) => {
  if (state.isPreparing || state.isLoadingContent) {
    return <>{loadingFallback ?? <PostDetailLoading />}</>
  }

  if (hasQueryError(state, requireMeta)) {
    return <>{errorFallback ?? <CustomError />}</>
  }

  return <>{children(state.detail!)}</>
}

export default PostDetailQueryView
