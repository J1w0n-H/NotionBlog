import { useQuery } from "@tanstack/react-query"
import { ABOUT_SLUG } from "src/constants"
import { queryKey } from "src/constants/queryKey"
import { PostDetail } from "src/types"

const useAboutPostQuery = () => {
  const { data } = useQuery<PostDetail>({
    queryKey: queryKey.post(ABOUT_SLUG),
    enabled: false,
  })

  return data
}

export default useAboutPostQuery
