import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getCookie, setCookie } from "cookies-next"
import { useCallback, useEffect, useLayoutEffect } from "react"
import { CONFIG } from "site.config"
import { queryKey } from "src/constants/queryKey"
import { SchemeType } from "src/types"

type SetScheme = (scheme: SchemeType) => void

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

const useScheme = (): [SchemeType, SetScheme] => {
  const queryClient = useQueryClient()
  const followsSystemTheme = CONFIG.blog.scheme === "system"

  const { data } = useQuery({
    queryKey: queryKey.scheme(),
    enabled: false,
    initialData: followsSystemTheme
      ? "dark"
      : (CONFIG.blog.scheme as SchemeType),
  })

  const setScheme = useCallback<SetScheme>((scheme) => {
    setCookie("scheme", scheme)
    queryClient.setQueryData(queryKey.scheme(), scheme)
  }, [queryClient])

  useIsomorphicLayoutEffect(() => {
    const cachedScheme = getCookie("scheme") as SchemeType
    const defaultScheme = followsSystemTheme
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : (CONFIG.blog.scheme as SchemeType)
    setScheme(cachedScheme || defaultScheme)
  }, [followsSystemTheme, setScheme])

  return [data, setScheme]
}

export default useScheme
