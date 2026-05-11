import {
  dehydrate,
  type DehydratedState,
  QueryClient,
} from "@tanstack/react-query"

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        refetchOnMount: false,
        retry: false,
      },
    },
  })
}

export function dehydrateServerQueries(client: QueryClient): DehydratedState {
  return dehydrate(client, {
    dehydrateOptions: {
      shouldDehydrateQuery: (query) => query.state.status === "success",
    },
  })
}

export async function prepareStaticPageProps(
  prepare: (client: QueryClient) => Promise<void>
): Promise<{ dehydratedState: DehydratedState }> {
  const client = createQueryClient()
  await prepare(client)
  return { dehydratedState: dehydrateServerQueries(client) }
}
