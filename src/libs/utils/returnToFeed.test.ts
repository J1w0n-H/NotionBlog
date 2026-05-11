import { describe, expect, it } from "vitest"
import { DEFAULT_CATEGORY } from "src/constants"
import {
  buildPostHref,
  buildReturnToFeedLocation,
  pickFeedListQuery,
} from "./returnToFeed"

describe("pickFeedListQuery", () => {
  it("keeps tag, category, and order while dropping slug", () => {
    expect(
      pickFeedListQuery({
        slug: "hello",
        tag: "react",
        category: "Projects",
        order: "asc",
      })
    ).toEqual({
      tag: "react",
      category: "Projects",
      order: "asc",
    })
  })

  it("omits default category and order", () => {
    expect(
      pickFeedListQuery({
        slug: "hello",
        category: DEFAULT_CATEGORY,
        order: "desc",
      })
    ).toEqual({})
  })
})

describe("buildReturnToFeedLocation", () => {
  it("returns the feed path with preserved filters", () => {
    expect(
      buildReturnToFeedLocation({
        slug: "hello",
        tag: "react",
        order: "asc",
      })
    ).toEqual({
      pathname: "/",
      query: { tag: "react", order: "asc" },
    })
  })
})

describe("buildPostHref", () => {
  it("keeps feed filters on post links", () => {
    expect(
      buildPostHref("hello", {
        slug: "other",
        tag: "react",
        order: "asc",
      })
    ).toEqual({
      pathname: "/hello",
      query: { tag: "react", order: "asc" },
    })
  })
})
