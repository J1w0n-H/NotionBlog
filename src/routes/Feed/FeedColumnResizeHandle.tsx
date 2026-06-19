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
  right: -0.625rem;
  z-index: 4;
  width: 1.25rem;
  height: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: col-resize;
  touch-action: none;

  /* Full-height 5px bar — matches mock .divider background */
  &::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 5px;
    transform: translateX(-50%);
    border-radius: 3px;
    background: ${({ theme }) => theme.brand.borderStrong};
    opacity: 0.28;
    transition: opacity 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
  }

  /* 4×34px pill grip — matches mock .divider::after */
  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 4px;
    height: 34px;
    border-radius: 3px;
    background: var(--accent, var(--accent));
    box-shadow: var(--glow-sm, 0 0 10px color-mix(in srgb, var(--accent) 40%, transparent));
    transition: background 0.15s ease, box-shadow 0.15s ease;
  }

  /* Hover / drag → cyan bar + cyan grip */
  &:hover::after,
  &[data-dragging="true"]::after,
  &:focus-visible::after {
    opacity: 1;
    background: var(--link, var(--link));
    box-shadow: 0 0 12px color-mix(in srgb, var(--link) 45%, transparent);
  }

  &:hover::before,
  &[data-dragging="true"]::before,
  &:focus-visible::before {
    background: var(--link, var(--link));
    box-shadow: var(--glow-cy, 0 0 10px color-mix(in srgb, var(--link) 40%, transparent));
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
    &::after,
    &::before {
      transition: none;
    }
  }
`
