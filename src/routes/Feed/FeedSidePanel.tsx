import React, {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import styled from "@emotion/styled"
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
          <CloseButton
            type="button"
            onClick={requestClose}
            aria-label={closeAriaLabel}
            disabled={closing}
            data-edge={edge}
            data-panel-close="true"
          >
            <CloseGlyph aria-hidden="true">×</CloseGlyph>
            <Hint>Esc</Hint>
          </CloseButton>
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
    justify-content: flex-end;
  }
`

const CloseButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.55rem 0.3rem 0.65rem;
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  border-radius: 0.4rem;
  background: ${({ theme }) => theme.brand.surface};
  color: ${({ theme }) => theme.brand.textMuted};
  font-size: 0.875rem;
  line-height: 1;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    color 0.15s ease,
    background 0.15s ease;

  &[data-edge="left"] {
    flex-direction: row-reverse;
    padding: 0.3rem 0.65rem 0.3rem 0.55rem;
  }

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.brand.accent};
    color: ${({ theme }) => theme.brand.text};
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

const CloseGlyph = styled.span`
  display: inline-grid;
  place-items: center;
  width: 1.1rem;
  height: 1.1rem;
  font-size: 1.1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.brand.textMuted};
`

const Hint = styled.kbd`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.625rem;
  letter-spacing: 0.04em;
  padding: 1px 5px;
  background: ${({ theme }) => theme.brand.surface2};
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  border-radius: 3px;
  color: ${({ theme }) => theme.brand.textFaint};
  line-height: 1;
`

const PanelBody = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
