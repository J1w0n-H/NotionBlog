import { describe, expect, it } from "vitest"
import { schemeBootstrapScript } from "./scheme"

describe("schemeBootstrapScript", () => {
  it("emits a self-contained script that sets data-scheme", () => {
    const script = schemeBootstrapScript()
    expect(script).toContain("document.documentElement.setAttribute('data-scheme',s)")
    expect(script).toContain("document.documentElement.style.colorScheme=s")
    expect(script).toContain("scheme=")
  })
})
