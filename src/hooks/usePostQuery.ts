import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/router"
import { queryKey } from "src/constants/queryKey"
import {
  useResolvedPostDetail,
  type PostWithOptionalRecordMap,
} from "src/hooks/useResolvedPostDetail"

const usePostQuery = () => {
  const router = useRouter()
  const slug = `${router.query.slug ?? ""}`
  const { data: post } = useQuery<PostWithOptionalRecordMap>({
    queryKey: queryKey.post(slug),
    enabled: false,
  })

  return useResolvedPostDetail(slug, post)
}

export default usePostQuery
