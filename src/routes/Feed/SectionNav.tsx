import React, { useEffect, useMemo, useRef, useState } from "react"
import styled from "@emotion/styled"
import { useCategoriesQuery } from "src/hooks/useCategoriesQuery"
import { DEFAULT_CATEGORY } from "src/constants"
import SearchInput from "./SearchInput"
import { catVars, tokenForCategory } from "src/constants/categoryColors"
import { toSectionAnchorId } from "src/libs/utils/toSectionAnchorId"

type Props = {
  q: string
  onChangeQuery: (next: string) => void
}

const SectionNav: React.FC<Props> = ({ q, onChangeQuery }) => {
  const categories = useCategoriesQuery()
  const [activeId, setActiveId] = useState<string>("section-pinned")
  const rafRef = useRef<number | null>(null)
  const manualActiveRef = useRef<{ id: string; until: number } | null>(null)

  const getHeaderOffset = () => {
    // sticky header height + a little buffer
    const headerEl = document.querySelector<HTMLElement>("[data-header], header")
    const h = headerEl?.getBoundingClientRect().height ?? 0
    return Math.max(96, Math.min(220, h + 24))
  }

  const items = useMemo(() => {
    return Object.keys(categories).filter((k) => k !== DEFAULT_CATEGORY)
  }, [categories])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    // During smooth scroll, keep the clicked item highlighted.
    manualActiveRef.current = { id, until: Date.now() + 1200 }
    const top =
      el.getBoundingClientRect().top + window.scrollY - getHeaderOffset()
    window.scrollTo({ top, behavior: "smooth" })
    setActiveId(id)
  }

  useEffect(() => {
    // Scroll spy based on scroll position (more deterministic than IO for fast scroll)
    const ids = ["section-pinned", ...items.map((label) => toSectionAnchorId(label))]

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

      // Choose the *last* section whose top has passed the header line.
      // This avoids "Pinned" staying active while the next section is already at the top.
      const THRESHOLD = 8
      let candidate: string | null = null
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        const topOk = rect.top <= targetY + THRESHOLD
        const hasContent = rect.bottom > targetY
        if (topOk && hasContent) candidate = id
      }

      setActiveId(candidate ?? ids[0])
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
            style={catVars("reverse")}
          >
            <Dot aria-hidden="true" />
            <span className="label">Pinned</span>
          </Item>
          {items.map((label) => (
            <Item
              key={label}
              type="button"
              data-active={activeId === toSectionAnchorId(label)}
              onClick={() => scrollTo(toSectionAnchorId(label))}
              style={catVars(tokenForCategory(label))}
            >
              <Dot aria-hidden="true" />
              <span className="label">{label}</span>
            </Item>
          ))}
        </List>
      </Box>
    </Wrapper>
  )
}

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
  display: flex;
  align-items: center;
  gap: 0.5rem;
  .label { flex: 1; }
  &:hover {
    background: var(--cat-soft);
    color: ${({ theme }) => theme.brand.text};
  }
  &[data-active="true"] {
    background: var(--cat-soft);
    border-color: var(--cat-ring);
    box-shadow: 0 0 0 1px var(--cat-ring) inset;
    color: ${({ theme }) => theme.brand.text};
  }
`

const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 3px;
  background: var(--cat-color);
  box-shadow: 0 0 0 2px var(--cat-soft);
`

