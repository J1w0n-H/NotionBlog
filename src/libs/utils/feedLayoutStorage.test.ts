import { afterEach, describe, expect, it } from "vitest"
import {
  clearFeedLayoutWidths,
  loadFeedLayoutWidths,
  saveFeedLayoutWidths,
} from "./feedLayoutStorage"
import { defaultFeedLayoutWidths } from "./feedLayoutVars"

const STORAGE_KEY = "feed-layout:v1"

describe("feedLayoutStorage", () => {
  afterEach(() => {
    window.localStorage.clear()
  })

  it("persists widths per layout mode", () => {
    saveFeedLayoutWidths("post", {
      ...defaultFeedLayoutWidths,
      navWidthPx: 240,
      listWidthPx: 700,
    })

    expect(loadFeedLayoutWidths("post")).toEqual({
      navWidthPx: 240,
      listWidthPx: 700,
    })
    expect(loadFeedLayoutWidths("index")).toEqual({})
  })

  it("clears only the requested mode", () => {
    saveFeedLayoutWidths("index", {
      ...defaultFeedLayoutWidths,
      navWidthPx: 200,
    })
    saveFeedLayoutWidths("about", {
      ...defaultFeedLayoutWidths,
      aboutPanelWidthPx: 600,
    })

    clearFeedLayoutWidths("index")

    expect(loadFeedLayoutWidths("index")).toEqual({})
    expect(loadFeedLayoutWidths("about")).toEqual({
      aboutPanelWidthPx: 600,
    })
    expect(window.localStorage.getItem(STORAGE_KEY)).toContain("about")
  })
})
