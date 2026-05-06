import { Theme } from "@emotion/react"
import { Colors, colors } from "./colors"
import { variables } from "./variables"
import { zIndexes } from "./zIndexes"
import { SchemeType } from "src/types"

const brand = {
  bg:           "var(--bg)",
  surface:      "var(--surface)",
  surface2:     "var(--surface-2)",
  surfaceSunk:  "var(--surface-sunk)",
  text:         "var(--text)",
  textMuted:    "var(--text-muted)",
  textFaint:    "var(--text-faint)",
  textOnAccent: "var(--text-on-accent)",
  border:       "var(--border)",
  borderSoft:   "var(--border-soft)",
  borderStrong: "var(--border-strong)",
  accent:       "var(--accent)",
  accentHover:  "var(--accent-hover)",
  accentSoft:   "var(--accent-soft)",
  accentRing:   "var(--accent-ring)",
  link:         "var(--link)",
  linkHover:    "var(--link-hover)",
  linkSoft:     "var(--link-soft)",
  signal:       "var(--signal)",
  signalSoft:   "var(--signal-soft)",
  codeBg:       "var(--code-bg)",
  codeText:     "var(--code-text)",
  codeBorder:   "var(--code-border)",
  fontSans:     "var(--font-sans)",
  fontMono:     "var(--font-mono)",
}

declare module "@emotion/react" {
  export interface Theme {
    scheme: SchemeType
    colors: Colors
    zIndexes: typeof zIndexes
    variables: typeof variables
    brand: typeof brand
  }
}

type Options = {
  scheme: SchemeType
}

export const createTheme = (options: Options): Theme => ({
  scheme: options.scheme,
  colors: colors[options.scheme],
  variables: variables,
  zIndexes: zIndexes,
  brand,
})
