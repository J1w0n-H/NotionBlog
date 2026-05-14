import type { CSSProperties } from "react"
import { indexOfCategory } from "src/constants/feedSections"

/**
 * 8-slot palette tokens (warm/cool 교차로 인접 카테고리 hue 대비 최대).
 * - reverse  (22°  crimson)
 * - systems  (195° teal)
 * - ctf      (75°  amber)
 * - crypto   (252° indigo)
 * - lime     (125° warm-green)
 * - research (295° violet)
 * - rose     (355° warm-pink)
 * - cyan     (220° cool teal-blue)
 *
 * `other` is an explicit unclassified token, NOT a palette slot.
 */
export type CategoryToken =
  | "reverse"
  | "systems"
  | "ctf"
  | "crypto"
  | "lime"
  | "research"
  | "rose"
  | "cyan"
  | "other"

export const PALETTE_ORDER: readonly Exclude<CategoryToken, "other">[] = [
  "reverse",
  "systems",
  "ctf",
  "crypto",
  "lime",
  "research",
  "rose",
  "cyan",
] as const

/** Pure index-based palette lookup. Negative → `other`. */
export function tokenForCategoryIndex(i: number): CategoryToken {
  if (i < 0 || !Number.isFinite(i)) return "other"
  const len = PALETTE_ORDER.length
  return PALETTE_ORDER[((i % len) + len) % len]
}

/** Label-driven convenience wrapper: looks up index then maps to slot. */
export function tokenForCategory(label?: string): CategoryToken {
  const idx = indexOfCategory(label)
  return idx === -1 ? "other" : tokenForCategoryIndex(idx)
}

/**
 * Inline CSS-var pack for a category. Pass via `style={catVars(token)}` and
 * downstream styled-components read `var(--cat-color)` etc.
 */
export function catVars(token: CategoryToken): CSSProperties {
  return {
    ["--cat-color" as never]: `var(--cat-${token}-solid)`,
    ["--cat-soft" as never]: `var(--cat-${token}-soft)`,
    ["--cat-ring" as never]: `var(--cat-${token}-ring)`,
  } as CSSProperties
}

/**
 * Pinned uses the brand crimson accent — it is a *brand cue*, not a category
 * channel, so it does NOT participate in the 8-slot palette rotation.
 */
export const PINNED_VARS: CSSProperties = {
  ["--cat-color" as never]: "var(--accent)",
  ["--cat-soft" as never]: "oklch(0.95 0.05 22)",
  ["--cat-ring" as never]: "oklch(0.52 0.19 22 / 0.28)",
} as CSSProperties
