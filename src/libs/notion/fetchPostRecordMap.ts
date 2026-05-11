import type { ExtendedRecordMap } from "notion-types"

export async function fetchPostRecordMap(
  pageId: string
): Promise<ExtendedRecordMap> {
  const response = await fetch(
    `/api/notion/record-map?pageId=${encodeURIComponent(pageId)}`
  )
  if (!response.ok) {
    throw new Error("Failed to load post content")
  }
  return response.json()
}
