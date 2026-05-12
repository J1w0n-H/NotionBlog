import { describe, expect, it } from "vitest"
import { detectLanguage } from "./translation"

describe("detectLanguage", () => {
  it("detects Korean from body text even when lang metadata is English", () => {
    expect(
      detectLanguage("1. 발단 - 오류 발생 내용", "en")
    ).toBe("ko")
  })

  it("falls back to lang metadata when body text is empty", () => {
    expect(detectLanguage("", "en")).toBe("en")
    expect(detectLanguage("", "ko")).toBe("ko")
  })
})
