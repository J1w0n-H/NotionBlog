import { describe, expect, it } from "vitest"
import { formatDate } from "./formatDate"

describe("formatDate", () => {
  it("formats Notion date-only values in UTC", () => {
    expect(formatDate("2025-11-04", "en-US")).toMatch(/Nov 4, 2025/)
  })

  it("formats ISO timestamps in UTC", () => {
    expect(formatDate("2025-11-04T18:30:00.000Z", "en-US")).toMatch(
      /Nov 4, 2025/
    )
  })
})
