import { beforeEach, describe, expect, it, vi } from "vitest"
import type { TPost } from "src/types"

const getPosts = vi.fn<() => Promise<TPost[]>>()

vi.mock("src/apis", () => ({
  getPosts,
}))

import { loadPublicPostCollections } from "./fetchPublishedPosts"

const post = (overrides: Partial<TPost>): TPost => ({
  id: "id",
  slug: "slug",
  title: "Title",
  status: ["Public"],
  type: ["Post"],
  createdTime: "2025-01-01T00:00:00.000Z",
  fullWidth: false,
  ...overrides,
})

describe("loadPublicPostCollections", () => {
  beforeEach(() => {
    getPosts.mockReset()
  })

  it("applies feed and detail publication gates from one ingest", async () => {
    getPosts.mockResolvedValue([
      post({ slug: "public-post", status: ["Public"], type: ["Post"] }),
      post({ slug: "detail-only", status: ["PublicOnDetail"], type: ["Post"] }),
      post({ slug: "hidden", status: ["Private"], type: ["Post"] }),
    ])

    const collections = await loadPublicPostCollections()

    expect(getPosts).toHaveBeenCalledTimes(1)
    expect(collections.feed.map((item) => item.slug)).toEqual(["public-post"])
    expect(collections.detail.map((item) => item.slug)).toEqual([
      "public-post",
      "detail-only",
    ])
  })
})
