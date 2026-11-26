import { describe, expect, it } from "vitest"
import { tokenForCategory } from "src/constants/categoryColors"
import { FEED_CATEGORY_ORDER, rankFeedCategory } from "src/constants/feedSections"

const CURRENT = [
  "Research",
  "Engineering",
  "Insights",
  "Conferences",
  "Community",
  "Life & Career",
]

describe("current Notion categories", () => {
  it("are listed once each, in feed order", () => {
    const ranks = CURRENT.map(rankFeedCategory)
    expect([...ranks].sort((a, b) => a - b)).toEqual(ranks)
    for (const c of CURRENT) {
      expect(FEED_CATEGORY_ORDER.filter((x) => x === c)).toHaveLength(1)
    }
  })

  it("get six distinct colours", () => {
    const tokens = CURRENT.map(tokenForCategory)
    expect(new Set(tokens).size).toBe(CURRENT.length)
    expect(tokens).not.toContain("other")
  })

  it("an unlisted category gets a stable non-grey colour and sorts last", () => {
    expect(tokenForCategory("Brand New Category")).not.toBe("other")
    expect(tokenForCategory("Brand New Category")).toBe(tokenForCategory("Brand New Category"))
    expect(rankFeedCategory("Brand New Category")).toBeGreaterThan(rankFeedCategory("Life & Career"))
    expect(tokenForCategory(undefined)).toBe("other")
  })
})
