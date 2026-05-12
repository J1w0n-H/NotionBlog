import { afterEach, describe, expect, it, vi } from "vitest"
import {
  FEED_SECTION_NAV_BAND_HEIGHT_VAR,
  measureFeedStickyStackHeightPx,
  syncFeedScrollOffsetVar,
} from "./feedScrollOffset"

function mockRect(height: number): DOMRect {
  return {
    height,
    width: 0,
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: height,
    toJSON: () => ({}),
  } as DOMRect
}

function mockMatchMedia(matches: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation(() => ({
      matches,
      media: "",
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  )
}

describe("feedScrollOffset", () => {
  afterEach(() => {
    document.documentElement.style.removeProperty(FEED_SECTION_NAV_BAND_HEIGHT_VAR)
    document.body.innerHTML = ""
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it("includes the tablet section nav band in the sticky stack", () => {
    mockMatchMedia(true)

    document.body.innerHTML = `
      <header data-header></header>
      <aside class="lt" data-feed-section-nav-band></aside>
      <div aria-label="Top tags"></div>
    `

    const header = document.querySelector<HTMLElement>("[data-header]")!
    const band = document.querySelector<HTMLElement>(
      "aside.lt[data-feed-section-nav-band]"
    )!
    const tags = document.querySelector<HTMLElement>('[aria-label="Top tags"]')!

    vi.spyOn(header, "getBoundingClientRect").mockReturnValue(mockRect(80))
    vi.spyOn(band, "getBoundingClientRect").mockReturnValue(mockRect(56))
    vi.spyOn(tags, "getBoundingClientRect").mockReturnValue(mockRect(40))
    vi.spyOn(window, "getComputedStyle").mockReturnValue({
      display: "block",
      visibility: "visible",
    } as CSSStyleDeclaration)

    expect(measureFeedStickyStackHeightPx()).toBe(188)
    expect(syncFeedScrollOffsetVar()).toBe(188)
    expect(
      document.documentElement.style.getPropertyValue(
        FEED_SECTION_NAV_BAND_HEIGHT_VAR
      )
    ).toBe("56px")
  })

  it("omits the section nav band outside the tablet layout", () => {
    mockMatchMedia(false)

    document.body.innerHTML = `
      <header data-header></header>
      <aside class="lt" data-feed-section-nav-band></aside>
      <div aria-label="Top tags"></div>
    `

    const header = document.querySelector<HTMLElement>("[data-header]")!
    const tags = document.querySelector<HTMLElement>('[aria-label="Top tags"]')!

    vi.spyOn(header, "getBoundingClientRect").mockReturnValue(mockRect(80))
    vi.spyOn(tags, "getBoundingClientRect").mockReturnValue(mockRect(40))

    expect(measureFeedStickyStackHeightPx()).toBe(132)
    expect(syncFeedScrollOffsetVar()).toBe(132)
    expect(
      document.documentElement.style.getPropertyValue(
        FEED_SECTION_NAV_BAND_HEIGHT_VAR
      )
    ).toBe("0px")
  })
})
