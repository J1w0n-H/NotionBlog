import { useCallback } from "react"
import { useRouter } from "next/router"
import { buildReturnToFeedLocation } from "src/libs/utils/returnToFeed"

export function useReturnToFeed() {
  const router = useRouter()

  return useCallback(
    (options?: { scroll?: boolean }) => {
      void router.push(buildReturnToFeedLocation(router.query), undefined, {
        scroll: options?.scroll ?? false,
      })
    },
    [router]
  )
}
