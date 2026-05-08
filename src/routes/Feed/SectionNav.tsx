import React, { useEffect, useMemo, useRef, useState } from "react"
import styled from "@emotion/styled"
import { useCategoriesQuery } from "src/hooks/useCategoriesQuery"
import { DEFAULT_CATEGORY } from "src/constants"
import SearchInput from "./SearchInput"

type Props = {
  q: string
  onChangeQuery: (next: string) => void
}

const toAnchorId = (label: string) =>
  `section-${label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`

const SectionNav: React.FC<Props> = ({ q, onChangeQuery }) => {
  const categories = useCategoriesQuery()
  const [activeId, setActiveId] = useState<string>("section-pinned")
  const rafRef = useRef<number | null>(null)
  const manualActiveRef = useRef<{ id: string; until: number } | null>(null)

  const items = useMemo(() => {
    return Object.keys(categories).filter((k) => k !== DEFAULT_CATEGORY)
  }, [categories])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    // During smooth scroll, keep the clicked item highlighted.
    manualActiveRef.current = { id, until: Date.now() + 1200 }
    el.scrollIntoView({ behavior: "smooth", block: "start" })
    setActiveId(id)
  }

  useEffect(() => {
    // Scroll spy based on scroll position (more deterministic than IO for fast scroll)
    const ids = ["section-pinned", ...items.map((label) => toAnchorId(label))]
    const getHeaderOffset = () => {
      // sticky header height + a little buffer
      const headerEl = document.querySelector<HTMLElement>("header, [data-header]")
      const h = headerEl?.getBoundingClientRect().height ?? 0
      return Math.max(96, Math.min(180, h + 24))
    }

    const computeActive = () => {
      rafRef.current = null
      const headerOffset = getHeaderOffset()
      const targetY = headerOffset

      const manual = manualActiveRef.current
      if (manual && Date.now() < manual.until) {
        // keep manual highlight during the scroll animation
        setActiveId(manual.id)
        return
      }

      let bestId = ids[0]
      let bestDist = Number.POSITIVE_INFINITY

      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        const rect = el.getBoundingClientRect()

        // Only consider sections that have content around/under the header line
        if (rect.bottom < targetY) continue

        const dist = Math.abs(rect.top - targetY)
        if (dist < bestDist) {
          bestDist = dist
          bestId = id
        }
      }

      setActiveId(bestId)
    }

    const onScroll = () => {
      if (rafRef.current != null) return
      rafRef.current = window.requestAnimationFrame(computeActive)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    // initial
    onScroll()

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [items])

  return (
    <Wrapper aria-label="Navigation">
      <SearchInput
        value={q}
        onChange={(e) => onChangeQuery(e.target.value)}
        placeholder="Search posts…"
      />
      <Box>
        <Title>Navigate</Title>
        <List>
          <Item
            type="button"
            data-active={activeId === "section-pinned"}
            onClick={() => scrollTo("section-pinned")}
          >
            📌 Pinned
          </Item>
          {items.map((label) => (
            <Item
              key={label}
              type="button"
              data-active={activeId === toAnchorId(label)}
              onClick={() => scrollTo(toAnchorId(label))}
            >
              {label}
            </Item>
          ))}
        </List>
      </Box>
    </Wrapper>
  )
}

export { toAnchorId }
export default SectionNav

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const Box = styled.div`
  border-radius: 1rem;
  background: ${({ theme }) => theme.brand.surface};
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  padding: 0.75rem;
`

const Title = styled.div`
  font-size: 0.875rem;
  font-weight: 700;
  color: ${({ theme }) => theme.brand.text};
  margin-bottom: 0.5rem;
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const Item = styled.button`
  text-align: left;
  padding: 0.5rem 0.75rem;
  border-radius: 0.75rem;
  border: 1px solid transparent;
  background: transparent;
  color: ${({ theme }) => theme.brand.textMuted};
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.brand.surface2};
    color: ${({ theme }) => theme.brand.text};
  }
  &[data-active="true"] {
    background: ${({ theme }) => theme.brand.accentSoft};
    border-color: ${({ theme }) => theme.brand.accentRing};
    color: ${({ theme }) => theme.brand.text};
  }
`

