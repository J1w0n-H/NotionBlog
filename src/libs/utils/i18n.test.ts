import { describe, expect, it } from "vitest"
import { createTranslator } from "./i18n"

describe("createTranslator", () => {
  const dict = { Hello: "안녕" }

  it("returns identity for English", () => {
    const tr = createTranslator("en", dict)
    expect(tr("Hello")).toBe("Hello")
    expect(tr("Unknown")).toBe("Unknown")
  })

  it("looks up Korean translations with fallback", () => {
    const tr = createTranslator("ko", dict)
    expect(tr("Hello")).toBe("안녕")
    expect(tr("Unknown")).toBe("Unknown")
  })
})
