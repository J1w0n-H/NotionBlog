import type { FC, ReactNode } from "react"
import {
  PostDetailErrorStatus,
  PostDetailLoadingStatus,
  type PostDetailStatusScope,
  type PostDetailStatusSubject,
} from "src/components/PostDetailStatus"
import { hasPostDetailQueryError } from "src/hooks/postDetailQueryState"
import type { PostDetailQueryState } from "src/hooks/postDetailTypes"
import type { PostDetail } from "src/types"

type Props = {
  state: PostDetailQueryState
  requireMeta?: boolean
  statusScope?: PostDetailStatusScope
  statusSubject?: PostDetailStatusSubject
  loadingFallback?: ReactNode
  errorFallback?: ReactNode
  children: (detail: PostDetail) => ReactNode
}

const PostDetailQueryView: FC<Props> = ({
  state,
  requireMeta = false,
  statusScope = "page",
  statusSubject = "post",
  loadingFallback,
  errorFallback,
  children,
}) => {
  if (state.isPreparing || state.isLoadingContent) {
    return (
      <>
        {loadingFallback ?? (
          <PostDetailLoadingStatus
            scope={statusScope}
            subject={statusSubject}
          />
        )}
      </>
    )
  }

  if (hasPostDetailQueryError(state, requireMeta)) {
    return (
      <>
        {errorFallback ?? (
          <PostDetailErrorStatus scope={statusScope} subject={statusSubject} />
        )}
      </>
    )
  }

  return <>{children(state.detail!)}</>
}

export default PostDetailQueryView
