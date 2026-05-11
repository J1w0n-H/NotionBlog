import { describe, expect, it } from "vitest"
import { resolveFeedShellRouteState } from "./resolveFeedShellRoute"

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
})
