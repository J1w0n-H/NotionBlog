import type { FC, ReactNode } from "react"
import PostDetailLoading from "src/components/PostDetailLoading"
import { hasPostDetailQueryError } from "src/hooks/postDetailQueryState"
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

  if (hasPostDetailQueryError(state, requireMeta)) {
    return <>{errorFallback ?? <CustomError />}</>
  }

  return <>{children(state.detail!)}</>
}

export default PostDetailQueryView
