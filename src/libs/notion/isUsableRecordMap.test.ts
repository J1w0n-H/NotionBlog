import { describe, expect, it } from "vitest"
import { isUsableRecordMap } from "./isUsableRecordMap"

describe("isUsableRecordMap", () => {
  it("returns false for empty block maps", () => {
    expect(
      isUsableRecordMap("page-id", {
        block: {},
        collection: {},
        collection_view: {},
        notion_user: {},
        signed_urls: {},
      })
    ).toBe(false)
  })

  it("returns true when the page block is present", () => {
    expect(
      isUsableRecordMap("page-id", {
        block: {
          "page-id": {
            value: { id: "page-id", type: "page" },
            role: "reader",
          },
        },
        collection: {},
        collection_view: {},
        notion_user: {},
        signed_urls: {},
      })
    ).toBe(true)
  })
})
