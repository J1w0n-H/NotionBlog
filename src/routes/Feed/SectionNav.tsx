import React, { useEffect, useMemo, useState } from "react"
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

  const items = useMemo(() => {
    return Object.keys(categories).filter((k) => k !== DEFAULT_CATEGORY)
  }, [categories])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: "smooth", block: "start" })
    setActiveId(id)
  }

  useEffect(() => {
    // Scroll spy via IntersectionObserver
    const ids = ["section-pinned", ...items.map((label) => toAnchorId(label))]
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // pick the visible section closest to top
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              (a.boundingClientRect.top ?? 0) - (b.boundingClientRect.top ?? 0)
          )
        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id)
        }
      },
      {
        // account for sticky header height
        root: null,
        rootMargin: "-110px 0px -60% 0px",
        threshold: [0.01, 0.1, 0.25],
      }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
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

