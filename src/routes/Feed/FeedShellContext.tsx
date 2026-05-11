import { createContext, useContext, useMemo, type ReactNode } from "react"
import { useRouter } from "next/router"
import { resolveFeedShellRouteState } from "src/routes/Feed/resolveFeedShellRoute"

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

  return useMemo(
    () =>
      resolveFeedShellRouteState({
        pathname: router.pathname,
        isReady: router.isReady,
        slug: `${router.query.slug ?? ""}`,
      }),
    [router.isReady, router.pathname, router.query.slug]
  )
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
