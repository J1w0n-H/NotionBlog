import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getCookie, setCookie } from "cookies-next"
import { useEffect } from "react"
import { queryKey } from "src/constants"

export type LanguageType = "ko" | "en"

type SetLanguage = (language: LanguageType) => void

const useLanguage = (): [LanguageType, SetLanguage] => {
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: queryKey.language(),
    enabled: false,
    initialData: "ko" as LanguageType, // 기본값을 한국어로 설정
  })

  const setLanguage = (language: LanguageType) => {
    setCookie("language", language)
    queryClient.setQueryData(queryKey.language(), language)
  }

  useEffect(() => {
    if (typeof window === "undefined") return

    const cachedLanguage = getCookie("language") as LanguageType
    const defaultLanguage = cachedLanguage || "ko"
    setLanguage(defaultLanguage)
  }, [])

  return [data, setLanguage]
}

export default useLanguage
