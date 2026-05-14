import { useEffect, useState, type RefObject } from "react"
import styled from "@emotion/styled"

type Props = {
  scrollRef: RefObject<HTMLDivElement | null>
}

/** Sticky 2px bar at the top of the scroll container; fill scales with scroll depth. */
export default function PostReadingProgress({ scrollRef }: Props) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const measure = () => {
      const max = el.scrollHeight - el.clientHeight
      if (max <= 0) {
        setProgress(0)
        return
      }
      setProgress(Math.min(1, Math.max(0, el.scrollTop / max)))
    }

    el.addEventListener("scroll", measure, { passive: true })
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    measure()

    return () => {
      el.removeEventListener("scroll", measure)
      ro.disconnect()
    }
  }, [scrollRef])

  return (
    <Bar aria-hidden="true">
      <Fill style={{ transform: `scaleX(${progress})` }} />
    </Bar>
  )
}

const Bar = styled.div`
  position: sticky;
  top: 0;
  z-index: 15;
  height: 2px;
  margin: 0 calc(-1 * var(--post-scroll-pad-x, 1.5rem));
  flex-shrink: 0;
  background: ${({ theme }) => theme.brand.borderSoft};
`

const Fill = styled.span`
  display: block;
  height: 100%;
  width: 100%;
  transform-origin: left center;
  background: ${({ theme }) => theme.brand.accent};
  transition: transform 120ms ${({ theme }) => theme.brand.ease};
`
