import useMermaidEffect from "./hooks/useMermaidEffect"
import PostDetailContentSwitcher from "./PostDetailContentSwitcher"

const Detail = () => {
  useMermaidEffect()
  return <PostDetailContentSwitcher variant="modal" />
}

export default Detail
