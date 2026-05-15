import React, {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import styled from "@emotion/styled"
import { HiChevronDoubleRight } from "react-icons/hi"
import { useReturnToFeed } from "src/hooks/useReturnToFeed"

export const FEED_SIDE_PANEL_CLOSE_MS = 280

export type FeedSidePanelEdge = "left" | "right"

export function useFeedSidePanelClose() {
  const returnToFeed = useReturnToFeed()
  const [closing, setClosing] = useState(false)
  const closingRef = useRef(false)

  useEffect(() => {
    if (!closing) return
    const timer = window.setTimeout(() => {
      returnToFeed({ scroll: false })
    }, FEED_SIDE_PANEL_CLOSE_MS)
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
  showClose?: boolean
}

const FeedSidePanel: React.FC<Props> = ({
  children,
  closeAriaLabel = "Close panel",
  edge = "right",
  showClose = true,
}) => {
  const { closing, requestClose } = useFeedSidePanelClose()
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

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  flex: 1;
  transform: translateX(0);
  opacity: 1;
  transition:
    transform ${FEED_SIDE_PANEL_CLOSE_MS}ms cubic-bezier(0.4, 0, 0.2, 1),
    opacity 200ms ease;
  will-change: transform, opacity;

  &[data-edge="right"][data-closing="true"] {
    transform: translateX(40px);
    opacity: 0;
    pointer-events: none;
  }

  &[data-edge="left"][data-closing="true"] {
    transform: translateX(-40px);
    opacity: 0;
    pointer-events: none;
  }

  @media (prefers-reduced-motion: no-preference) {
    &[data-edge="right"] {
      animation: feedPanelEnterRight ${FEED_SIDE_PANEL_CLOSE_MS}ms
        cubic-bezier(0.4, 0, 0.2, 1);
    }

    &[data-edge="left"] {
      animation: feedPanelEnterLeft ${FEED_SIDE_PANEL_CLOSE_MS}ms
        cubic-bezier(0.4, 0, 0.2, 1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: opacity 0ms;
    animation: none !important;

    &[data-closing="true"] {
      transform: none;
    }
  }

  @keyframes feedPanelEnterRight {
    from {
      transform: translateX(40px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes feedPanelEnterLeft {
    from {
      transform: translateX(-40px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
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
