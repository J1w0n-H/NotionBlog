import { describe, expect, it } from "vitest"
import type { TPost } from "src/types"
import { filterPinnedPostsForFeed, filterPostsForFeedList } from "./feedFilter"

const base = (overrides: Partial<TPost>): TPost => ({
  id: "id",
  slug: "slug",
  title: "Title",
  status: ["Public"],
  type: ["Post"],
  createdTime: "2020-01-01T00:00:00.000Z",
  fullWidth: false,
  ...overrides,
})

describe("filterPostsForFeedList", () => {
  it("sorts by Notion date when present", () => {
    const posts = [
      base({ slug: "old", createdTime: "2024-01-01T00:00:00.000Z" }),
      base({
        slug: "new",
        date: { start_date: "2025-01-01" },
        createdTime: "2020-01-01T00:00:00.000Z",
      }),
    ]
    const sorted = filterPostsForFeedList(posts, {
      q: "",
      category: "📂 All",
      order: "desc",
    })
    expect(sorted.map((p) => p.slug)).toEqual(["new", "old"])
  })

  it("falls back to createdTime when date is missing", () => {
    const posts = [
      base({ slug: "older", createdTime: "2021-01-01T00:00:00.000Z" }),
      base({ slug: "newer", createdTime: "2023-01-01T00:00:00.000Z" }),
    ]
    const sorted = filterPostsForFeedList(posts, {
      q: "",
      category: "📂 All",
      order: "asc",
    })
    expect(sorted.map((p) => p.slug)).toEqual(["older", "newer"])
  })

  it("returns only pinned posts in the default category view", () => {
    const posts = [
      base({ slug: "pinned", tags: ["Pinned"] }),
      base({ slug: "plain" }),
    ]
    expect(
      filterPinnedPostsForFeed(posts, {
        q: "",
        order: "desc",
      }).map((post) => post.slug)
    ).toEqual(["pinned"])
  })
})
