import { describe, expect, it } from "vitest"
import {
  detectBlockLanguage,
  detectLanguage,
  normalizePostLangField,
} from "./translation"

describe("detectLanguage", () => {
  it("prefers Notion lang metadata over body text", () => {
    expect(detectLanguage("1. 발단 - 오류 발생 내용", "en")).toBe("en")
    expect(detectLanguage("1. 발단 - 오류 발생 내용", "ko")).toBe("ko")
  })

  it("falls back to body text when lang metadata is missing", () => {
    expect(detectLanguage("1. 발단 - 오류 발생 내용")).toBe("ko")
    expect(detectLanguage("Environment Setting")).toBe("en")
  })
})

describe("normalizePostLangField", () => {
  it("normalizes supported lang labels", () => {
    expect(normalizePostLangField("ko")).toBe("ko")
    expect(normalizePostLangField("English")).toBe("en")
  })
})

describe("detectBlockLanguage", () => {
  it("reads explicit block tags", () => {
    expect(detectBlockLanguage("[KOR] 네트워크 탐색", "en")).toBe("ko")
    expect(detectBlockLanguage("[ENG] Recon", "ko")).toBe("en")
  })

  it("detects Korean and English from block text", () => {
    expect(detectBlockLanguage("네트워크 탐색", "en")).toBe("ko")
    expect(detectBlockLanguage("Environment Setting", "ko")).toBe("en")
  })

  it("uses majority script — rare Korean characters do not flip an English block", () => {
    expect(
      detectBlockLanguage("I once visited 서울 for a conference.", "en")
    ).toBe("en")
    expect(
      detectBlockLanguage("그 회의는 서울에서 열렸고 keynote 발표가 있었다.", "ko")
    ).toBe("ko")
  })

  it("returns the caller-provided fallback when no alphabet is present", () => {
    expect(detectBlockLanguage("2024 🎯 → ✅", "en")).toBe("en")
    expect(detectBlockLanguage("2024 🎯 → ✅", "ko")).toBe("ko")
  })
})
