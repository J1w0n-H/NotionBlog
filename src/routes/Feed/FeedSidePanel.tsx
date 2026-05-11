import React, { type ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/router"
import styled from "@emotion/styled"
import { HiChevronRight } from "react-icons/hi"

export const FEED_SIDE_PANEL_CLOSE_MS = 240

export function useFeedSidePanelClose() {
  const router = useRouter()
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    if (!closing) return
    const timer = window.setTimeout(() => {
      void router.push("/", undefined, { scroll: false })
    }, FEED_SIDE_PANEL_CLOSE_MS)
    return () => window.clearTimeout(timer)
  }, [closing, router])

  const requestClose = () => {
    if (closing) return
    setClosing(true)
  }

  return { closing, requestClose }
}

type Props = {
  children: ReactNode
  closeAriaLabel: string
}

const FeedSidePanel: React.FC<Props> = ({ children, closeAriaLabel }) => {
  const { closing, requestClose } = useFeedSidePanelClose()

  return (
    <Panel data-closing={closing ? "true" : "false"}>
      <PanelTop>
        <CloseButton
          type="button"
          onClick={requestClose}
          aria-label={closeAriaLabel}
          disabled={closing}
        >
          <CloseIcon aria-hidden="true">
            <HiChevronRight />
          </CloseIcon>
          <span>Close</span>
        </CloseButton>
      </PanelTop>
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

  &[data-closing="true"] {
    transform: translateX(18%);
    opacity: 0;
    pointer-events: none;
  }

  @media (prefers-reduced-motion: no-preference) {
    animation: feedPanelEnter ${FEED_SIDE_PANEL_CLOSE_MS}ms ease-out;
  }

  @keyframes feedPanelEnter {
    from {
      transform: translateX(18%);
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
  justify-content: flex-start;
  padding: 0.35rem 0 0.85rem;
  background: ${({ theme }) => theme.brand.bg};
  border-bottom: 1px solid ${({ theme }) => theme.brand.border};
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
