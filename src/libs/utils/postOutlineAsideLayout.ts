/**
 * Shared layout tokens for sticky "On this page" asides
 * (`PostOutlineNav`: post modal + feed side panel).
 */

/** Floated docked outline width; paired with the same expression in negative `margin-left`. */
export const POST_OUTLINE_FLOAT_WIDTH =
  "min(11.5rem, min(32vw, 14rem))" as const

/** Collapsed docked strip — sits in the gutter without covering body text. */
export const POST_OUTLINE_PEEK_WIDTH = "2.75rem" as const

/** Keeps long outlines scrollable without fighting viewport chrome. */
export const POST_OUTLINE_ASIDE_MAX_HEIGHT =
  "min(80dvh, calc(100dvh - 6rem))" as const

/** Sticky `top` offset inside the scroll container (modal vs docked side panel). */
export const POST_OUTLINE_STICKY_TOP_REM = {
  modal: "1.25rem",
  side: "0.75rem",
} as const
