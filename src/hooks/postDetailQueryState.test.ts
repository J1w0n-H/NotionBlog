import { describe, expect, it } from "vitest"
import { hasPostDetailQueryError } from "./postDetailQueryState"
import type { PostDetailQueryState } from "./postDetailTypes"

const baseState: PostDetailQueryState = {
  meta: undefined,
  detail: undefined,
  isPreparing: false,
  isMissingMeta: false,
  isLoadingContent: false,
  isRecordMapError: false,
}

describe("hasPostDetailQueryError", () => {
  it("returns true when record map loading failed", () => {
    expect(
      hasPostDetailQueryError({
        ...baseState,
        isRecordMapError: true,
      })
    ).toBe(true)
  })

  it("requires meta when requested", () => {
    expect(
      hasPostDetailQueryError(
        {
          ...baseState,
          detail: { id: "id" } as PostDetailQueryState["detail"],
        },
        true
      )
    ).toBe(true)
  })
})
