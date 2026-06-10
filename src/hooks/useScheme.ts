import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useCallback, useEffect, useLayoutEffect } from "react"
import { queryKey } from "src/constants/queryKey"
import {
  applySchemeToDocument,
  persistScheme,
  readStoredScheme,
  resolveDefaultScheme,
  resolveScheme,
} from "src/libs/utils/scheme"
import type { SchemeType } from "src/types"

type SetScheme = (scheme: SchemeType) => void

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

function getInitialScheme(): SchemeType {
  if (typeof window === "undefined") {
    return resolveDefaultScheme()
  }
  return resolveScheme()
}

const useScheme = (): [SchemeType, SetScheme] => {
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: queryKey.scheme(),
    enabled: false,
    initialData: getInitialScheme(),
  })

  const setScheme = useCallback<SetScheme>(
    (scheme) => {
      persistScheme(scheme)
      applySchemeToDocument(scheme)
      queryClient.setQueryData(queryKey.scheme(), scheme)
    },
    [queryClient]
  )

  // Sync cookie → React Query before paint (same pattern as useLanguage).
  useIsomorphicLayoutEffect(() => {
    const stored = readStoredScheme() ?? resolveDefaultScheme()
    if (stored !== data) {
      setScheme(stored)
      return
    }
    applySchemeToDocument(stored)
  }, [data, setScheme])

  return [data, setScheme]
}

export default useScheme
