import "src/styles/sentinel-theme.css"
import { useState } from "react"
import { AppPropsWithLayout } from "../types"
import { Hydrate, QueryClientProvider } from "@tanstack/react-query"
import { RootLayout } from "src/layouts"
import { createQueryClient } from "src/libs/react-query"

function App({ Component, pageProps }: AppPropsWithLayout) {
  const [queryClient] = useState(() => createQueryClient())
  const getLayout = Component.getLayout || ((page) => page)

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <RootLayout>{getLayout(<Component {...pageProps} />)}</RootLayout>
      </Hydrate>
    </QueryClientProvider>
  )
}

export default App
