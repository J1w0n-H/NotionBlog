import { describe, expect, it } from "vitest"
import { resolvePostOgImage } from "./resolvePostOgImage"

describe("resolvePostOgImage", () => {
  it("prefers the post thumbnail", () => {
    expect(resolvePostOgImage("https://example.com/thumb.png", "Title")).toBe(
      "https://example.com/thumb.png"
    )
  })

  it("adds a title query param to the configured OG URL", () => {
    const image = resolvePostOgImage(null, "Hello World")
    expect(image).toContain("title=Hello+World")
  })
})
