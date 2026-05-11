import { describe, expect, it } from "vitest"
import {
  parseFeedSearchParam,
  withFeedSearchQuery,
} from "./feedSearchQuery"

describe("parseFeedSearchParam", () => {
  it("trims string query values", () => {
    expect(parseFeedSearchParam("  react  ")).toBe("react")
  })

  it("returns an empty string for missing values", () => {
    expect(parseFeedSearchParam(undefined)).toBe("")
  })
})

describe("withFeedSearchQuery", () => {
  it("adds q when search is non-empty", () => {
    expect(withFeedSearchQuery({ tag: "react" }, "next")).toEqual({
      tag: "react",
      q: "next",
    })
  })

  it("removes q when search is empty", () => {
    expect(withFeedSearchQuery({ tag: "react", q: "old" }, "  ")).toEqual({
      tag: "react",
    })
  })
})
