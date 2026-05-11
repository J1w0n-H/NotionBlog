import { describe, expect, it } from "vitest"
import type { TPost } from "src/types"
import { filterPosts } from "./filterPosts"

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

describe("filterPosts", () => {
  it("drops posts without title or slug", () => {
    const posts = [
      base({ title: "" }),
      base({ slug: "" }),
      base({ slug: "ok" }),
    ]
    expect(filterPosts(posts)).toHaveLength(1)
  })

  it("respects status and type presets", () => {
    const posts = [
      base({ status: ["Private"] }),
      base({ type: ["Page"] }),
      base({ slug: "public-post" }),
    ]
    expect(filterPosts(posts)).toHaveLength(1)
    expect(
      filterPosts(posts, {
        acceptStatus: ["Public", "PublicOnDetail"],
        acceptType: ["Page", "Post"],
      })
    ).toHaveLength(2)
  })

  it("uses createdTime when date is absent for future filtering", () => {
    const future = new Date()
    future.setFullYear(future.getFullYear() + 2)
    const posts = [base({ createdTime: future.toISOString() })]
    expect(filterPosts(posts)).toHaveLength(0)
  })
})
