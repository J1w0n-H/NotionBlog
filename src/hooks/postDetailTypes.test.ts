import { describe, expect, it } from "vitest"
import { mergePostDetail } from "./postDetailTypes"
import type { PostWithOptionalRecordMap } from "./postDetailTypes"

const meta: PostWithOptionalRecordMap = {
  id: "post-id",
  slug: "hello",
  title: "Hello",
  status: ["Public"],
  type: ["Post"],
  createdTime: "2025-01-01T00:00:00.000Z",
  fullWidth: false,
}

describe("mergePostDetail", () => {
  it("returns undefined when record map is missing", () => {
    expect(mergePostDetail(meta, undefined)).toBeUndefined()
  })

  it("returns undefined when record map has no page block", () => {
    expect(
      mergePostDetail(meta, {
        block: {},
        collection: {},
        collection_view: {},
        notion_user: {},
        signed_urls: {},
      })
    ).toBeUndefined()
  })

  it("merges meta and record map", () => {
    const recordMap = { block: {} } as PostWithOptionalRecordMap["recordMap"]

    expect(mergePostDetail(meta, recordMap)).toEqual({
      ...meta,
      recordMap,
    })
  })
})
