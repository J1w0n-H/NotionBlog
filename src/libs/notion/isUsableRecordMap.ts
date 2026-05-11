import type { ExtendedRecordMap } from "notion-types"

export function isUsableRecordMap(
  pageId: string | undefined,
  recordMap: ExtendedRecordMap | undefined
): boolean {
  if (!pageId || !recordMap?.block) return false
  if (Object.keys(recordMap.block).length === 0) return false
  return pageId in recordMap.block
}
