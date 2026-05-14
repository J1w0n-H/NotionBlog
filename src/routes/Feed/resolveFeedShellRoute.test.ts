import { describe, expect, it } from "vitest"
import {
  normalizeFeedPathSlug,
  resolveFeedShellRouteState,
} from "./resolveFeedShellRoute"

describe("normalizeFeedPathSlug", () => {
  it("returns empty for nullish", () => {
    expect(normalizeFeedPathSlug(null)).toBe("")
    expect(normalizeFeedPathSlug(undefined)).toBe("")
  })

  it("uses first element when slug is a string[]", () => {
    expect(normalizeFeedPathSlug(["JW-132", "x"])).toBe("JW-132")
  })

  it("decodes URI-encoded segments", () => {
    expect(normalizeFeedPathSlug("hello%20world")).toBe("hello world")
  })
})

describe("resolveFeedShellRouteState", () => {
  it("returns index mode on the home route", () => {
    expect(
      resolveFeedShellRouteState({
        pathname: "/",
        isReady: true,
        slug: "",
      })
    ).toEqual({ panelMode: "index", activeSlug: null })
  })

  it("returns post mode for slug routes", () => {
    expect(
      resolveFeedShellRouteState({
        pathname: "/[slug]",
        isReady: true,
        slug: "hello",
      })
    ).toEqual({ panelMode: "post", activeSlug: "hello" })
  })

  it("returns about mode for the about slug", () => {
    expect(
      resolveFeedShellRouteState({
        pathname: "/[slug]",
        isReady: true,
        slug: "about",
      })
    ).toEqual({ panelMode: "about", activeSlug: "about" })
  })

  it("returns post mode when slug is a single-element array", () => {
    expect(
      resolveFeedShellRouteState({
        pathname: "/[slug]",
        isReady: true,
        slug: ["hello"],
      })
    ).toEqual({ panelMode: "post", activeSlug: "hello" })
  })
})
