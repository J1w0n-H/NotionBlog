import type { Theme } from "@emotion/react"
import {
  POST_OUTLINE_ASIDE_MAX_HEIGHT,
  POST_OUTLINE_FLOAT_WIDTH,
  POST_OUTLINE_STICKY_TOP_REM,
} from "src/libs/utils/postOutlineAsideLayout"

/** Legacy embedded column (narrow panels). Prefer `about` float layout. */
export function outlineAsideEmbeddedCss(theme: Theme): string {
  return `
    @container about-drawer (min-width: 380px) {
      display: block;
      position: sticky;
      top: 0.65rem;
      align-self: start;
      width: min(11rem, 100%);
      max-width: 100%;
      max-height: min(70vh, 18rem);
      min-height: 0;
      padding-left: 0.5rem;
    }
  `
}

/** About feed panel: float TOC in the right gutter (same idea as post modal). */
export function outlineAsideAboutFeedCss(theme: Theme): string {
  return `
    @container about-drawer (min-width: 480px) {
      display: block;
      position: sticky;
      top: 0.65rem;
      align-self: flex-start;
      z-index: 40;
      isolation: isolate;
      width: var(--outline-aside-ui-w, ${POST_OUTLINE_FLOAT_WIDTH});
      max-width: none;
      margin-left: calc(
        -1 * (var(--outline-aside-ui-w, ${POST_OUTLINE_FLOAT_WIDTH})) - 0.5rem
      );
      max-height: min(72vh, calc(100dvh - 7rem));
      min-height: 0;
      padding-left: 0;
      border-left: none;
      pointer-events: auto;
      border-radius: var(--radius-md);
      border: 1px solid ${theme.brand.borderSoft};
      background: ${theme.brand.surface};
      box-shadow:
        0 10px 36px -16px oklch(0 0 0 / 0.28),
        0 0 0 1px oklch(0 0 0 / 0.04);
    }
  `
}

/** Post modal or feed side panel: `lg` breakpoint, shared max-height. */
export function outlineAsideDockedLgCss(
  theme: Theme,
  docked: "modal" | "side"
): string {
  const top =
    docked === "side"
      ? POST_OUTLINE_STICKY_TOP_REM.side
      : POST_OUTLINE_STICKY_TOP_REM.modal

  return `
    @media (min-width: 1024px) {
      display: block;
      position: sticky;
      top: ${top};
      align-self: flex-start;
      z-index: 40;
      isolation: isolate;
      width: var(--outline-aside-ui-w, ${POST_OUTLINE_FLOAT_WIDTH});
      max-width: none;
      margin-left: calc(
        -1 * (var(--outline-aside-ui-w, ${POST_OUTLINE_FLOAT_WIDTH})) - 0.6rem
      );
      max-height: ${POST_OUTLINE_ASIDE_MAX_HEIGHT};
      min-height: 0;
      padding-left: 0;
      border-left: none;
      pointer-events: auto;
    }
  `
}
