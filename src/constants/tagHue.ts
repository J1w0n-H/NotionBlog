/**
 * Golden-angle hue step so similarly-hashed neighbouring tags spread on the circle
 * (~137.508° ≈ inverse golden ratio × 360).
 */
const GOLDEN_ANGLE_DEG = 137.508

/** FNV-1a-ish 32-bit hash (deterministic across reloads). */
function fnvHash32(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/**
 * Outline-only tags: hue varies only; L/C tiers stay below category solids so
 * categories read as primary (fills) and tags as secondary (lines).
 */
export function hueFromString(s: string): number {
  const u = fnvHash32(s) || 1
  const deg = (u * GOLDEN_ANGLE_DEG) % 360
  return deg < 0 ? deg + 360 : deg
}
