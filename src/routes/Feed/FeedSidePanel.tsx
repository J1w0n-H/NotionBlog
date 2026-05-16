import React, {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import styled from "@emotion/styled"
import { HiChevronDoubleRight } from "react-icons/hi"
import { useAboutPanelMotion } from "src/contexts/AboutPanelMotionContext"
import { useReturnToFeed } from "src/hooks/useReturnToFeed"

/** Slide (post / about header) — panel opening into view. */
export const FEED_SIDE_PANEL_ENTER_MS = 320
/**
 * Slide panels — exit; must finish before `returnToFeed` removes the route,
 * or the page swap “pops” over a half-finished motion.
 */
export const FEED_SIDE_PANEL_EXIT_MS = 400
export const FEED_SIDE_PANEL_UNFOLD_MS = 420
/** About left column: longer than post panel so open feels smooth. */
export const FEED_ABOUT_PANEL_UNFOLD_MS = 660
/**
 * About route close → index: align with side column + panel fade so the
 * hard navigation lands after visuals settle.
 */
export const FEED_ABOUT_PANEL_EXIT_MS = 440
/** @deprecated Use FEED_ABOUT_PANEL_EXIT_MS */
export const FEED_ABOUT_PANEL_CLOSE_MS = FEED_ABOUT_PANEL_EXIT_MS
export const FEED_ABOUT_EXIT_EASE = "cubic-bezier(0.4, 0, 0.2, 1)"
/** Back-compat: used by older imports; prefer FEED_ABOUT_EXIT_EASE */
export const FEED_ABOUT_CLOSE_EASE = FEED_ABOUT_EXIT_EASE
/** Shared easing for About column open / banner. */
export const FEED_ABOUT_MOTION_EASE = "cubic-bezier(0.18, 0.92, 0.28, 1)"

export type FeedSidePanelEdge = "left" | "right"
export type FeedSidePanelEnterMotion = "slide" | "unfold"

export function useFeedSidePanelClose() {
  const returnToFeed = useReturnToFeed()
  const [closing, setClosing] = useState(false)
  const closingRef = useRef(false)

  useEffect(() => {
    if (!closing) return
    const timer = window.setTimeout(() => {
      returnToFeed({ scroll: false })
    }, FEED_SIDE_PANEL_EXIT_MS)
    return () => window.clearTimeout(timer)
  }, [closing, returnToFeed])

  /** Stable identity so downstream effects (Esc listener) don't re-bind every render. */
  const requestClose = useCallback(() => {
    if (closingRef.current) return
    closingRef.current = true
    setClosing(true)
  }, [])

  return { closing, requestClose }
}

type Props = {
  children: ReactNode
  closeAriaLabel?: string
  edge?: FeedSidePanelEdge
  /** `unfold`: drops open from the header (About). `slide`: horizontal slide (post). */
  enterMotion?: FeedSidePanelEnterMotion
  showClose?: boolean
}

const FeedSidePanel: React.FC<Props> = ({
  children,
  closeAriaLabel = "Close panel",
  edge = "right",
  enterMotion = "slide",
  showClose = true,
}) => {
  const { closing: slideClosing, requestClose } = useFeedSidePanelClose()
  const aboutMotion = useAboutPanelMotion()
  const closing =
    enterMotion === "unfold" && edge === "left"
      ? aboutMotion?.closing ?? false
      : slideClosing
  const panelRef = useRef<HTMLDivElement | null>(null)
  const lastFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!showClose || closing) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        requestClose()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [closing, requestClose, showClose])

  // Capture the element that had focus before the panel mounted; restore on close.
  useEffect(() => {
    if (typeof document === "undefined") return
    const previouslyFocused = document.activeElement
    if (previouslyFocused instanceof HTMLElement) {
      lastFocusRef.current = previouslyFocused
    }

    // Move focus into the panel so Esc / Tab work intuitively.
    const focusTarget = panelRef.current?.querySelector<HTMLElement>(
      "[data-panel-close], button, a, [tabindex]:not([tabindex='-1'])"
    )
    focusTarget?.focus({ preventScroll: true })

    return () => {
      lastFocusRef.current?.focus({ preventScroll: true })
    }
  }, [])

  return (
    <Panel
      ref={panelRef}
      data-closing={closing ? "true" : "false"}
      data-edge={edge}
      data-enter-motion={enterMotion}
      role="dialog"
      aria-modal="false"
    >
      {showClose ? (
        <PanelTop data-edge={edge}>
          {edge === "left" ? (
            <>
              <PanelTopLead aria-hidden="true" />
              <PanelGrabber aria-hidden="true" />
              <PanelTopTrail>
                <CloseButton
                  type="button"
                  onClick={requestClose}
                  aria-label={closeAriaLabel}
                  disabled={closing}
                  data-edge={edge}
                  data-panel-close="true"
                >
                  <CloseLabel>Close</CloseLabel>
                  <CloseChevrons aria-hidden="true">
                    <HiChevronDoubleRight />
                  </CloseChevrons>
                </CloseButton>
              </PanelTopTrail>
            </>
          ) : (
            <CloseButton
              type="button"
              onClick={requestClose}
              aria-label={closeAriaLabel}
              disabled={closing}
              data-edge={edge}
              data-panel-close="true"
            >
              <CloseLabel>Close</CloseLabel>
              <CloseChevrons aria-hidden="true">
                <HiChevronDoubleRight />
              </CloseChevrons>
            </CloseButton>
          )}
        </PanelTop>
      ) : null}
      <PanelBody>{children}</PanelBody>
    </Panel>
  )
}

export default FeedSidePanel

const unfoldEase = "cubic-bezier(0.22, 1, 0.36, 1)"
const slideEase = "cubic-bezier(0.4, 0, 0.2, 1)"
const slideExitEase = "cubic-bezier(0.4, 0, 1, 1)"

const Panel = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  flex: 1;
  transform: translateX(0) scaleY(1);
  opacity: 1;
  transition:
    transform ${FEED_SIDE_PANEL_EXIT_MS}ms ${slideExitEase},
    opacity ${FEED_SIDE_PANEL_EXIT_MS}ms ${slideExitEase};
  will-change: transform, opacity;

  &[data-edge="right"][data-closing="true"] {
    transform: translateX(18px);
    opacity: 0;
    pointer-events: none;
  }

  &[data-edge="left"][data-enter-motion="slide"][data-closing="true"] {
    transform: translateX(-18px);
    opacity: 0;
    pointer-events: none;
  }

  &[data-edge="left"][data-enter-motion="unfold"][data-closing="true"] {
    animation: none;
    transform-origin: top center;
    /* Avoid scaleY(0): it fights the grid and reads as a harsh “snap”. */
    transform: translateX(-14px) scaleY(0.96);
    opacity: 0;
    pointer-events: none;
    transition-duration: ${FEED_ABOUT_PANEL_EXIT_MS}ms;
    transition-timing-function: ${FEED_ABOUT_EXIT_EASE};

    &::before {
      animation: none;
      transform: scaleX(0);
      opacity: 0;
      transition: opacity ${FEED_ABOUT_PANEL_EXIT_MS}ms ${FEED_ABOUT_EXIT_EASE};
    }
  }

  &[data-edge="left"][data-enter-motion="unfold"]::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    z-index: 4;
    border-radius: 999px 999px 0 0;
    pointer-events: none;
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.brand.accent} 0%,
      ${({ theme }) => theme.brand.signal} 50%,
      ${({ theme }) => theme.brand.accent} 100%
    );
    transform: scaleX(0);
    transform-origin: left center;
    opacity: 0.9;
  }

  @media (prefers-reduced-motion: no-preference) {
    &[data-edge="right"] {
      animation: feedPanelEnterRight ${FEED_SIDE_PANEL_ENTER_MS}ms ${slideEase};
    }

    &[data-edge="left"][data-enter-motion="slide"] {
      animation: feedPanelEnterLeft ${FEED_SIDE_PANEL_ENTER_MS}ms ${slideEase};
    }

    &[data-edge="left"][data-enter-motion="unfold"] {
      transform-origin: top center;
      animation: feedPanelEnterUnfold ${FEED_SIDE_PANEL_UNFOLD_MS}ms ${unfoldEase}
        forwards;

      &::before {
        animation: feedPanelCarpetSweep ${FEED_SIDE_PANEL_UNFOLD_MS}ms ${unfoldEase}
          forwards;
      }
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: opacity 0ms;
    animation: none !important;

    &::before {
      display: none;
    }

    &[data-closing="true"] {
      transform: none;
    }

    &[data-edge="left"][data-enter-motion="unfold"][data-closing="true"] {
      opacity: 0;
    }
  }

  @keyframes feedPanelEnterRight {
    from {
      transform: translateX(22px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes feedPanelEnterLeft {
    from {
      transform: translateX(-22px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes feedPanelEnterUnfold {
    from {
      transform: scaleY(0);
      opacity: 0;
    }
    to {
      transform: scaleY(1);
      opacity: 1;
    }
  }

  @keyframes feedPanelCarpetSweep {
    from {
      transform: scaleX(0);
      opacity: 0.4;
    }
    to {
      transform: scaleX(1);
      opacity: 0.95;
    }
  }
`

const PanelTop = styled.div`
  flex: 0 0 auto;
  position: sticky;
  top: 0;
  z-index: 3;
  display: flex;
  padding: 0.35rem 0 0.85rem;
  background: ${({ theme }) => theme.brand.bg};
  border-bottom: 1px solid ${({ theme }) => theme.brand.border};

  &[data-edge="right"] {
    justify-content: flex-start;
  }

  &[data-edge="left"] {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto auto;
    align-items: center;
    column-gap: 0.35rem;
    padding: 0.45rem 0.5rem 0.75rem;
    justify-content: unset;
  }
`

const PanelTopLead = styled.span`
  grid-column: 1;
  min-width: 0;
`

const PanelGrabber = styled.span`
  grid-column: 2;
  display: flex;
  justify-content: center;
  pointer-events: none;

  &::after {
    content: "";
    width: 2.5rem;
    height: 4px;
    border-radius: 999px;
    background: ${({ theme }) => theme.brand.border};
    opacity: 0.55;
  }
`

const PanelTopTrail = styled.div`
  grid-column: 3;
  display: flex;
  justify-content: flex-end;
  min-width: 0;
`

const CloseButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.55rem 0.3rem 0.65rem;
  border: 1px solid transparent;
  border-radius: 0.4rem;
  background: transparent;
  color: ${({ theme }) => theme.brand.textMuted};
  font-size: 0.875rem;
  line-height: 1;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    color 0.15s ease,
    background 0.15s ease,
    box-shadow 0.15s ease;

  &[data-edge="left"] {
    flex-direction: row-reverse;
    padding: 0.3rem 0.65rem 0.3rem 0.55rem;
  }

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.brand.surface2};
    border-color: ${({ theme }) => theme.brand.borderStrong};
    color: ${({ theme }) => theme.brand.text};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.brand.accentSoft};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.brand.accentRing};
    outline-offset: 2px;
  }

  &:disabled {
    cursor: default;
    opacity: 0.72;
  }
`

const CloseLabel = styled.span`
  font-weight: 600;
  letter-spacing: 0.02em;
`

const CloseChevrons = styled.span`
  display: inline-flex;
  align-items: center;
  color: ${({ theme }) => theme.brand.textMuted};

  svg {
    width: 1.05rem;
    height: 1.05rem;
  }

  ${CloseButton}:hover:not(:disabled) & {
    color: ${({ theme }) => theme.brand.text};
  }
`

const PanelBody = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
