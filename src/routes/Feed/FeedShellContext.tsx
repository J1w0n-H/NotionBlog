import { createContext, useContext, useMemo, type ReactNode } from "react"
import { useRouter } from "next/router"
import { ABOUT_SLUG } from "src/constants"

export type FeedPanelMode = "index" | "post" | "about"

type FeedShellContextValue = {
  panelMode: FeedPanelMode
  activeSlug: string | null
}

const FeedShellContext = createContext<FeedShellContextValue>({
  panelMode: "index",
  activeSlug: null,
})

function useFeedShellRouteState(): FeedShellContextValue {
  const router = useRouter()

  return useMemo(() => {
    if (!router.isReady || router.pathname !== "/[slug]") {
      return { panelMode: "index", activeSlug: null }
    }

    const slug = `${router.query.slug ?? ""}`
    if (!slug) {
      return { panelMode: "index", activeSlug: null }
    }

    if (slug === ABOUT_SLUG) {
      return { panelMode: "about", activeSlug: slug }
    }

    return { panelMode: "post", activeSlug: slug }
  }, [router.isReady, router.pathname, router.query.slug])
}

export function FeedShellProvider({ children }: { children: ReactNode }) {
  const value = useFeedShellRouteState()

  return (
    <FeedShellContext.Provider value={value}>{children}</FeedShellContext.Provider>
  )
}

export function useFeedShell() {
  return useContext(FeedShellContext)
}
