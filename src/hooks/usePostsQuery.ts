import { useQuery } from "@tanstack/react-query"
import { queryKey } from "src/constants/queryKey"
import { TPost } from "src/types"

const usePostsQuery = () => {
  const { data } = useQuery<TPost[]>({
    queryKey: queryKey.posts(),
    enabled: false,
  })

  return data ?? []
}

export default usePostsQuery
