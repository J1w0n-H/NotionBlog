import { describe, expect, it } from "vitest"
import {
  clampFeedLayoutWidth,
  defaultFeedLayoutWidths,
  feedLayoutBounds,
  resolveFeedLayoutWidths,
} from "./feedLayoutVars"

describe("clampFeedLayoutWidth", () => {
  it("clamps values to the provided range", () => {
    expect(clampFeedLayoutWidth(100, 180, 280)).toBe(180)
    expect(clampFeedLayoutWidth(300, 180, 280)).toBe(280)
    expect(clampFeedLayoutWidth(220, 180, 280)).toBe(220)
  })
})

describe("resolveFeedLayoutWidths", () => {
  it("returns defaults when no overrides are provided", () => {
    expect(resolveFeedLayoutWidths()).toEqual(defaultFeedLayoutWidths)
  })

  it("clamps out-of-range overrides", () => {
    expect(
      resolveFeedLayoutWidths({
        navWidthPx: 120,
        listWidthPx: 1200,
        aboutPanelWidthPx: 400,
      })
    ).toEqual({
      ...defaultFeedLayoutWidths,
      navWidthPx: feedLayoutBounds.navWidthPx.min,
      listWidthPx: feedLayoutBounds.listWidthPx.max,
      aboutPanelWidthPx: feedLayoutBounds.aboutPanelWidthPx.min,
    })
  })
})
