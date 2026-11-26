import { beforeEach, describe, expect, it, vi } from "vitest"
import type { TPost } from "src/types"

const getPosts = vi.fn<() => Promise<TPost[]>>()

vi.mock("src/apis", () => ({
  getPosts,
}))

import {
  findPublishedDetailPostByPageId,
  loadPublicPostCollections,
  resetPostCollectionsCache,
} from "./fetchPublishedPosts"

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
    resetPostCollectionsCache()
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

describe("findPublishedDetailPostByPageId", () => {
  beforeEach(() => {
    getPosts.mockReset()
    resetPostCollectionsCache()
  })

  it("returns a published detail post by page id", async () => {
    getPosts.mockResolvedValue([
      post({ id: "page-1", slug: "public-post", status: ["Public"], type: ["Post"] }),
    ])

    await expect(findPublishedDetailPostByPageId("page-1")).resolves.toMatchObject({
      slug: "public-post",
    })
  })

  it("returns null when the page id is not published for detail", async () => {
    getPosts.mockResolvedValue([
      post({ id: "page-1", slug: "hidden", status: ["Private"], type: ["Post"] }),
    ])

    await expect(findPublishedDetailPostByPageId("page-1")).resolves.toBeNull()
  })
})

describe("collections cache", () => {
  beforeEach(() => {
    getPosts.mockReset()
    resetPostCollectionsCache()
  })

  it("queries Notion once for concurrent callers (static build)", async () => {
    getPosts.mockResolvedValue([post({ slug: "a" })])
    await Promise.all(Array.from({ length: 20 }, () => loadPublicPostCollections()))
    expect(getPosts).toHaveBeenCalledTimes(1)
  })

  it("keeps the last good result when Notion fails, instead of emptying the site", async () => {
    vi.useFakeTimers()
    getPosts.mockResolvedValueOnce([post({ slug: "a" })])
    await loadPublicPostCollections()

    vi.advanceTimersByTime(60_000)
    getPosts.mockRejectedValueOnce(new Error("Notion 502"))
    const after = await loadPublicPostCollections()
    expect(after.feed.map((p) => p.slug)).toEqual(["a"])
    vi.useRealTimers()
  })

  it("falls back to empty on a cold failure so the build does not crash", async () => {
    getPosts.mockRejectedValueOnce(new Error("Notion 502"))
    await expect(loadPublicPostCollections()).resolves.toMatchObject({ raw: [] })
  })
})
