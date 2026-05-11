import { describe, expect, it } from "vitest"
import { comparePublishedAt, effectivePublishedAt } from "./postDate"

describe("effectivePublishedAt", () => {
  it("prefers Notion date over createdTime", () => {
    const at = effectivePublishedAt({
      date: { start_date: "2024-06-01" },
      createdTime: "2020-01-01T00:00:00.000Z",
    })
    expect(at.toISOString().startsWith("2024-06-01")).toBe(true)
  })

  it("falls back to createdTime when date is missing", () => {
    const at = effectivePublishedAt({
      createdTime: "2022-05-10T12:00:00.000Z",
    })
    expect(at.toISOString()).toBe("2022-05-10T12:00:00.000Z")
  })
})

describe("comparePublishedAt", () => {
  it("sorts desc by effective published instant", () => {
    const newer = { date: { start_date: "2024-01-02" }, createdTime: "2020-01-01" }
    const older = { createdTime: "2024-01-01T00:00:00.000Z" }
    expect(comparePublishedAt(newer, older, "desc")).toBeLessThan(0)
    expect(comparePublishedAt(older, newer, "desc")).toBeGreaterThan(0)
  })
})
