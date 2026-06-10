import { usePostPageState } from "src/hooks/usePostPageState"

const usePostQuery = () => {
  return usePostPageState().detail
}

export default usePostQuery
