import type { ExtendedRecordMap } from "notion-types"
import { isUsableRecordMap } from "src/libs/notion/isUsableRecordMap"

export async function fetchPostRecordMap(
  pageId: string
): Promise<ExtendedRecordMap> {
  const response = await fetch(
    `/api/notion/record-map?pageId=${encodeURIComponent(pageId)}`
  )
  if (!response.ok) {
    throw new Error("Failed to load post content")
  }

  const recordMap = (await response.json()) as ExtendedRecordMap
  if (!isUsableRecordMap(pageId, recordMap)) {
    throw new Error("Post content is unavailable")
  }

  return recordMap
}
