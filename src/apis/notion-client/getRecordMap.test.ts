import { beforeEach, describe, expect, it, vi } from "vitest"

const retrieve = vi.fn()
const childrenList = vi.fn()

vi.mock("@notionhq/client", () => ({
  Client: vi.fn().mockImplementation(function () {
    return { pages: { retrieve }, blocks: { children: { list: childrenList } } }
  }),
}))

import { getRecordMap } from "./getRecordMap"

const block = (id: string, type: string, extra: object = {}, hasChildren = false) => ({
  id,
  type,
  has_children: hasChildren,
  created_time: "2025-01-01T00:00:00.000Z",
  last_edited_time: "2025-01-01T00:00:00.000Z",
  [type]: extra,
})

describe("getRecordMap", () => {
  beforeEach(() => {
    vi.stubEnv("NOTION_API_KEY", "secret")
    retrieve.mockReset().mockResolvedValue({
      id: "post-1",
      parent: { type: "database_id", database_id: "db" },
      properties: { title: { title: [{ plain_text: "Post" }] } },
      created_time: "2025-01-01T00:00:00.000Z",
      last_edited_time: "2025-01-01T00:00:00.000Z",
    })
    childrenList.mockReset()
  })

  it("links child pages/databases without fetching their content", async () => {
    childrenList.mockImplementation(async ({ block_id }: { block_id: string }) => {
      if (block_id === "post-1") {
        return {
          has_more: false,
          results: [
            block("p1", "paragraph", { rich_text: [{ plain_text: "hi" }] }),
            block("sub", "child_page", { title: "Secret notes" }, true),
            block("db", "child_database", { title: "Drafts" }, true),
            block("tg", "toggle", { rich_text: [{ plain_text: "more" }] }, true),
          ],
        }
      }
      if (block_id === "tg") {
        return { has_more: false, results: [block("in", "paragraph", { rich_text: [] })] }
      }
      throw new Error(`descended into ${block_id}`)
    })

    const map: any = await getRecordMap("post-1")

    expect(childrenList.mock.calls.map((c) => c[0].block_id)).toEqual(["post-1", "tg"])
    expect(map.block["post-1"].value.content).toEqual(["p1", "sub", "db", "tg"])
    expect(map.block.sub.value.content).toBeUndefined()
    expect(map.block.tg.value.content).toEqual(["in"]) // normal nesting still works
  })
})
