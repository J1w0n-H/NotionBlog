/**
 * Shared layout tokens for sticky "On this page" asides
 * (`PostOutlineNav`: post modal + feed side panel).
 */

/** Keeps long outlines scrollable without fighting viewport chrome. */
export const POST_OUTLINE_ASIDE_MAX_HEIGHT =
  "min(80dvh, calc(100dvh - 6rem))" as const

/** Sticky `top` offset inside the scroll container (modal vs docked side panel). */
export const POST_OUTLINE_STICKY_TOP_REM = {
  modal: "1.25rem",
  side: "0.75rem",
} as const
