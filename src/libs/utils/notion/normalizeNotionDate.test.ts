import { describe, expect, it } from "vitest"
import { normalizeNotionDate } from "./normalizeNotionDate"

describe("normalizeNotionDate", () => {
  it("maps official API start to start_date", () => {
    expect(normalizeNotionDate({ start: "2024-03-01", end: null })).toEqual({
      start_date: "2024-03-01",
    })
  })

  it("keeps legacy start_date payloads", () => {
    expect(
      normalizeNotionDate({ start_date: "2023-12-15", end_date: "2024-01-01" })
    ).toEqual({
      start_date: "2023-12-15",
      end_date: "2024-01-01",
    })
  })

  it("returns null when no start is present", () => {
    expect(normalizeNotionDate({ end: "2024-01-01" })).toBeNull()
    expect(normalizeNotionDate(null)).toBeNull()
  })
})
