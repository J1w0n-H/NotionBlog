import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/router"
import { ABOUT_SLUG } from "src/constants"
import { queryKey } from "src/constants/queryKey"
import { PostDetail } from "src/types"

const useAboutPostQuery = () => {
  const router = useRouter()
  const slug = `${router.query.slug ?? ""}`
  const onAboutRoute =
    router.isReady && router.pathname === "/[slug]" && slug === ABOUT_SLUG

  const routed = useQuery<PostDetail>({
    queryKey: queryKey.post(slug),
    enabled: false,
  })

  const cached = useQuery<PostDetail>({
    queryKey: queryKey.post(ABOUT_SLUG),
    enabled: false,
  })

  return onAboutRoute ? routed.data ?? cached.data : cached.data
}

export default useAboutPostQuery
