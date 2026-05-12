import { describe, expect, it } from "vitest"
import { ExtendedRecordMap } from "notion-types"
import {
  applyTranslatedBlocksToRecordMap,
  extractTranslatableBlocks,
  hasMeaningfulTranslation,
  hasTranslatableBlocks,
} from "./translateRecordMap"

const recordMap = {
  block: {
    page: {
      value: {
        id: "page",
        type: "page",
        content: ["text-1", "header-1", "image-1"],
        properties: { title: [["Original title"]] },
      },
    },
    "text-1": {
      value: {
        id: "text-1",
        type: "text",
        properties: { title: [["Hello world"]] },
      },
    },
    "header-1": {
      value: {
        id: "header-1",
        type: "header",
        properties: { title: [["1. 발단 - 오류 발생 내용"]] },
      },
    },
    "image-1": {
      value: {
        id: "image-1",
        type: "image",
        properties: { source: [["https://example.com/image.png"]] },
      },
    },
  },
} as unknown as ExtendedRecordMap

describe("translateRecordMap", () => {
  it("extracts text blocks and skips non-text blocks", () => {
    const blocks = extractTranslatableBlocks(recordMap)

    expect(blocks.map((block) => block.id)).toEqual([
      "page",
      "text-1",
      "header-1",
    ])
    expect(blocks.find((block) => block.id === "text-1")?.content).toBe(
      "Hello world"
    )
    expect(blocks.find((block) => block.id === "header-1")?.content).toBe(
      "1. 발단 - 오류 발생 내용"
    )
  })

  it("applies translated text without changing image blocks", () => {
    const translated = applyTranslatedBlocksToRecordMap(
      recordMap,
      new Map([
        ["page", "Translated title"],
        ["text-1", "Translated body"],
      ])
    )

    expect(translated.block.page.value?.properties?.title).toEqual([
      ["Translated title"],
    ])
    expect(translated.block["text-1"].value?.properties?.title).toEqual([
      ["Translated body"],
    ])
    expect(translated.block["image-1"].value?.properties?.source).toEqual([
      ["https://example.com/image.png"],
    ])
  })

  it("applies translations when block ids use a different key format", () => {
    const dashed = {
      block: {
        text1: {
          value: {
            id: "text-1",
            type: "text",
            properties: { title: [["네트워크 탐색"]] },
          },
        },
      },
    } as unknown as ExtendedRecordMap

    const translated = applyTranslatedBlocksToRecordMap(
      dashed,
      new Map([["text-1", "Network exploration"]])
    )

    expect(translated.block.text1.value?.properties?.title).toEqual([
      ["Network exploration"],
    ])
  })

  it("detects mixed-language posts as translatable for English UI", () => {
    const mixed = {
      block: {
        page: {
          value: {
            id: "page",
            type: "page",
            content: ["header-1", "text-1"],
            properties: {
              title: [["Pentest Project: From Hacking WeppApp to System CTF"]],
            },
          },
        },
        "header-1": {
          value: {
            id: "header-1",
            type: "header",
            properties: { title: [["1. Recon"]] },
          },
        },
        "text-1": {
          value: {
            id: "text-1",
            type: "text",
            properties: { title: [["네트워크 탐색을 위해 nmap을 사용했습니다."]] },
          },
        },
      },
    } as unknown as ExtendedRecordMap

    expect(hasTranslatableBlocks(mixed, "en")).toBe(true)
    expect(hasTranslatableBlocks(mixed, "ko")).toBe(true)
  })

  it("does not mark Korean-only posts as needing Korean UI translation", () => {
    const koreanOnly = {
      block: {
        page: {
          value: {
            id: "page",
            type: "page",
            content: ["text-1"],
            properties: { title: [["RTOS와 TLS"]] },
          },
        },
        "text-1": {
          value: {
            id: "text-1",
            type: "text",
            properties: {
              title: [["처음에는 단지 운영체제 관심 하나로 수업을 들었습니다."]],
            },
          },
        },
      },
    } as unknown as ExtendedRecordMap

    expect(hasTranslatableBlocks(koreanOnly, "ko")).toBe(false)
  })

  it("detects when translated record maps actually changed", () => {
    const translated = applyTranslatedBlocksToRecordMap(
      recordMap,
      new Map([["text-1", "Translated body"]])
    )

    expect(hasMeaningfulTranslation(recordMap, translated)).toBe(true)
    expect(hasMeaningfulTranslation(recordMap, recordMap)).toBe(false)
  })
})
