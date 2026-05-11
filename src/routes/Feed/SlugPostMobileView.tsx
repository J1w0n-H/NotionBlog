import Detail from "src/routes/Detail"
import PostDetailQueryView from "src/components/PostDetailQueryView"
import { usePostPageState } from "src/hooks/usePostPageState"

const SlugPostMobileView = () => {
  const state = usePostPageState()

  return (
    <PostDetailQueryView state={state} requireMeta>
      {() => <Detail />}
    </PostDetailQueryView>
  )
}

export default SlugPostMobileView
