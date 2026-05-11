import React, { type ReactNode, useEffect, useState } from "react"
import styled from "@emotion/styled"
import { HiChevronLeft, HiChevronRight } from "react-icons/hi"
import { useReturnToFeed } from "src/hooks/useReturnToFeed"

export const FEED_SIDE_PANEL_CLOSE_MS = 240

export type FeedSidePanelEdge = "left" | "right"

export function useFeedSidePanelClose() {
  const returnToFeed = useReturnToFeed()
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    if (!closing) return
    const timer = window.setTimeout(() => {
      returnToFeed({ scroll: false })
    }, FEED_SIDE_PANEL_CLOSE_MS)
    return () => window.clearTimeout(timer)
  }, [closing, returnToFeed])

  const requestClose = () => {
    if (closing) return
    setClosing(true)
  }

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
  const CloseIconComponent = edge === "left" ? HiChevronLeft : HiChevronRight

  return (
    <Panel data-closing={closing ? "true" : "false"} data-edge={edge}>
      {showClose ? (
        <PanelTop data-edge={edge}>
          <CloseButton
            type="button"
            onClick={requestClose}
            aria-label={closeAriaLabel}
            disabled={closing}
            data-edge={edge}
          >
            <CloseIcon aria-hidden="true">
              <CloseIconComponent />
            </CloseIcon>
            <span>Close</span>
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
    transform ${FEED_SIDE_PANEL_CLOSE_MS}ms ease,
    opacity ${FEED_SIDE_PANEL_CLOSE_MS}ms ease;

  &[data-edge="right"][data-closing="true"] {
    transform: translateX(18%);
    opacity: 0;
    pointer-events: none;
  }

  &[data-edge="left"][data-closing="true"] {
    transform: translateX(-18%);
    opacity: 0;
    pointer-events: none;
  }

  @media (prefers-reduced-motion: no-preference) {
    &[data-edge="right"] {
      animation: feedPanelEnterRight ${FEED_SIDE_PANEL_CLOSE_MS}ms ease-out;
    }

    &[data-edge="left"] {
      animation: feedPanelEnterLeft ${FEED_SIDE_PANEL_CLOSE_MS}ms ease-out;
    }
  }

  @keyframes feedPanelEnterRight {
    from {
      transform: translateX(18%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes feedPanelEnterLeft {
    from {
      transform: translateX(-18%);
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
  gap: 0.35rem;
  border: 1px solid ${({ theme }) => theme.brand.borderStrong};
  background: ${({ theme }) => theme.brand.surface};
  color: ${({ theme }) => theme.brand.text};
  border-radius: 999px;
  padding: 0.45rem 0.85rem 0.45rem 0.65rem;
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 1px 2px oklch(0 0 0 / 0.08);

  &[data-edge="left"] {
    flex-direction: row-reverse;
    padding: 0.45rem 0.65rem 0.45rem 0.85rem;
  }

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.brand.surface2};
  }

  &:disabled {
    cursor: default;
    opacity: 0.72;
  }
`

const CloseIcon = styled.span`
  display: grid;
  place-items: center;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 999px;
  background: ${({ theme }) => theme.brand.surface2};
  color: ${({ theme }) => theme.brand.textMuted};

  svg {
    width: 0.95rem;
    height: 0.95rem;
  }
`

const PanelBody = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
