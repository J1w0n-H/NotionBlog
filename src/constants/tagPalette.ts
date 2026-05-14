/**
 * Tags share the same 8-slot palette as categories — but render as outline-only
 * (vs categories which render as fills). Tag index is alphabet-stable
 * (vs frequency-based, which would shift per filter and make colors flicker).
 */
import { PALETTE_ORDER, type CategoryToken } from "./categoryColors"

export function tokenForTagIndex(i: number): CategoryToken {
  if (i < 0 || !Number.isFinite(i)) return "other"
  const len = PALETTE_ORDER.length
  return PALETTE_ORDER[((i % len) + len) % len]
}
