import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getCookie, setCookie } from "cookies-next"
import { useEffect, useLayoutEffect, useCallback } from "react"
import { queryKey } from "src/constants"

export type LanguageType = "ko" | "en"

type SetLanguage = (language: LanguageType) => void

// useLayoutEffect on the client so the cookie is applied before the first paint,
// preventing KO-mode users from seeing a wrong initial state.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

const useLanguage = (): [LanguageType, SetLanguage] => {
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: queryKey.language(),
    enabled: false,
    initialData: "en" as LanguageType,
  })

  const setLanguage = useCallback((language: LanguageType) => {
    setCookie("language", language)
    queryClient.setQueryData(queryKey.language(), language)
  }, [queryClient])

  useIsomorphicLayoutEffect(() => {
    const cachedLanguage = getCookie("language") as LanguageType
    setLanguage(cachedLanguage || "en")
  }, [setLanguage])

  return [data, setLanguage]
}

export default useLanguage
