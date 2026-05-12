import type { QueryClient } from "@tanstack/react-query"
import { getRecordMap } from "src/apis"
import { ABOUT_SLUG } from "src/constants"
import { queryKey } from "src/constants/queryKey"
import { isUsableRecordMap } from "src/libs/notion/isUsableRecordMap"
import type { TPost } from "src/types"

export async function prefetchAboutPostQuery(
  client: QueryClient,
  aboutPost: TPost
) {
  const recordMap = await getRecordMap(aboutPost.id)
  const payload = isUsableRecordMap(aboutPost.id, recordMap)
    ? { ...aboutPost, recordMap }
    : aboutPost

  await client.prefetchQuery(queryKey.post(ABOUT_SLUG), () => payload)
}
