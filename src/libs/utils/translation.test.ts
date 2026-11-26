import { describe, expect, it } from "vitest"
import { normalizePostLangField } from "./translation"

// detectLanguage / detectBlockLanguage were removed from translation.ts on
// main (language now comes from the Notion \`lang\` field); their tests went
// with them.

describe("normalizePostLangField", () => {
  it("normalizes supported lang labels", () => {
    expect(normalizePostLangField("ko")).toBe("ko")
    expect(normalizePostLangField("English")).toBe("en")
  })
})
