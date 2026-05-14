import styled from "@emotion/styled"
import {
  useEffect,
  useRef,
  useState,
  type FC,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react"

const KEYBOARD_STEP_PX = 12

type Props = {
  ariaLabel: string
  disabled?: boolean
  onBegin: () => void
  onPreview: (deltaPx: number) => void
  onCommit: () => void
  onCancel: () => void
  onReset: () => void
  onKeyboardAdjust?: (deltaPx: number) => void
  onDraggingChange?: (dragging: boolean) => void
}

const FeedColumnResizeHandle: FC<Props> = ({
  ariaLabel,
  disabled = false,
  onBegin,
  onPreview,
  onCommit,
  onCancel,
  onReset,
  onKeyboardAdjust,
  onDraggingChange,
}) => {
  const [dragging, setDragging] = useState(false)
  const startXRef = useRef(0)

  useEffect(() => {
    onDraggingChange?.(dragging)
  }, [dragging, onDraggingChange])

  useEffect(() => {
    if (!dragging) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel()
        setDragging(false)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [dragging, onCancel])

  const onPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (disabled) return

    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    startXRef.current = event.clientX
    onBegin()
    setDragging(true)
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!dragging || disabled) return
    onPreview(event.clientX - startXRef.current)
  }

  const endDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!dragging) return

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    setDragging(false)
    onCommit()
  }

  const onPointerUp = (event: ReactPointerEvent<HTMLButtonElement>) => {
    endDrag(event)
  }

  const onPointerCancel = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!dragging) return

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    setDragging(false)
    onCancel()
  }

  const onDoubleClick = () => {
    if (disabled) return
    onReset()
  }

  const onKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (disabled || !onKeyboardAdjust) return

    if (event.key === "ArrowLeft") {
      event.preventDefault()
      onKeyboardAdjust(-KEYBOARD_STEP_PX)
      return
    }

    if (event.key === "ArrowRight") {
      event.preventDefault()
      onKeyboardAdjust(KEYBOARD_STEP_PX)
      return
    }

    if (event.key === "Home") {
      event.preventDefault()
      onReset()
    }
  }

  return (
    <Handle
      type="button"
      role="separator"
      aria-orientation="vertical"
      aria-label={ariaLabel}
      data-dragging={dragging ? "true" : "false"}
      disabled={disabled}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onDoubleClick={onDoubleClick}
      onKeyDown={onKeyDown}
    />
  )
}

export default FeedColumnResizeHandle

const Handle = styled.button`
  position: absolute;
  top: 0;
  right: -0.45rem;
  z-index: 4;
  width: 0.9rem;
  height: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: col-resize;
  touch-action: none;

  /* The line below doubles as both the static column divider and the
   * resize affordance, so it spans (almost) full height and sits at a
   * higher idle opacity than a purely hover-only grip would. Hover and
   * dragging then bump it further to communicate the live interaction. */
  &::after {
    content: "";
    position: absolute;
    top: 0.25rem;
    bottom: 0.25rem;
    left: 50%;
    width: 1px;
    transform: translateX(-50%);
    border-radius: 999px;
    background: ${({ theme }) => theme.brand.border};
    opacity: 0.55;
    transition:
      opacity 0.15s ease,
      background 0.15s ease,
      width 0.15s ease;
  }

  &:hover::after,
  &[data-dragging="true"]::after,
  &:focus-visible::after {
    opacity: 1;
    width: 3px;
    background: ${({ theme }) => theme.brand.borderStrong};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.brand.accentRing};
    outline-offset: 1px;
  }

  &:disabled {
    cursor: default;
    pointer-events: none;
  }

  @media (prefers-reduced-motion: reduce) {
    &::after {
      transition: none;
    }
  }
`
