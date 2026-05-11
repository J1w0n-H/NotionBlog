import { useRouter } from "next/router"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { parseFeedSearchParam } from "src/libs/utils/feedSearchQuery"

const SEARCH_DEBOUNCE_MS = 300

export function useFeedSearchQuery() {
  const router = useRouter()
  const committedQ = useMemo(
    () => (router.isReady ? parseFeedSearchParam(router.query.q) : ""),
    [router.isReady, router.query.q]
  )
  const [draft, setDraft] = useState("")
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    setDraft(committedQ)
  }, [committedQ])

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [])

  const onChangeQuery = useCallback(
    (value: string) => {
      setDraft(value)

      if (timerRef.current) window.clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(() => {
        const query = { ...router.query }
        const trimmed = value.trim()

        if (trimmed) {
          query.q = trimmed
        } else {
          delete query.q
        }

        void router.replace(
          { pathname: router.pathname, query },
          undefined,
          { shallow: true, scroll: false }
        )
      }, SEARCH_DEBOUNCE_MS)
    },
    [router]
  )

  return {
    q: committedQ,
    draft,
    onChangeQuery,
  }
}
