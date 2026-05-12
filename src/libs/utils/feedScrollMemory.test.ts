import { afterEach, describe, expect, it, vi } from "vitest"
import {
  rememberFeedScrollPosition,
  restoreFeedScrollPosition,
} from "./feedScrollMemory"

describe("feedScrollMemory", () => {
  afterEach(() => {
    sessionStorage.clear()
    vi.restoreAllMocks()
  })

  it("stores and restores list scroll position", () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem")
    const getItem = vi
      .spyOn(Storage.prototype, "getItem")
      .mockReturnValue("240")

    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 120,
    })

    const scrollTo = vi
      .spyOn(window, "scrollTo")
      .mockImplementation(() => undefined)
    const raf = vi
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((cb) => {
        cb(0)
        return 1
      })
    rememberFeedScrollPosition("list")
    restoreFeedScrollPosition("list")

    expect(setItem).toHaveBeenCalledWith("feed-scroll-y:list", "120")
    expect(getItem).toHaveBeenCalledWith("feed-scroll-y:list")
    expect(raf).toHaveBeenCalled()
    expect(scrollTo).toHaveBeenCalledWith({ top: 240, behavior: "auto" })
    expect(scrollTo.mock.calls.length).toBeGreaterThan(1)
  })
})
