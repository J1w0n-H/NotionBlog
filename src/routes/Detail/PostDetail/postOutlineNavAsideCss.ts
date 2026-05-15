import type { Theme } from "@emotion/react"
import {
  POST_OUTLINE_ASIDE_MAX_HEIGHT,
  POST_OUTLINE_STICKY_TOP_REM,
} from "src/libs/utils/postOutlineAsideLayout"

/** About drawer: container-query column + compact max-height. */
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
      border-left: 1px solid ${theme.brand.borderSoft};
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
      align-self: start;
      width: 280px;
      max-width: 100%;
      max-height: ${POST_OUTLINE_ASIDE_MAX_HEIGHT};
      min-height: 0;
      padding-left: 0.5rem;
      border-left: 1px solid ${theme.brand.borderSoft};
    }
  `
}
