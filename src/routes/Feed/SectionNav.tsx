import React, { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/router"
import styled from "@emotion/styled"
import { DEFAULT_CATEGORY } from "src/constants"
import usePostsQuery from "src/hooks/usePostsQuery"
import SearchInput from "./SearchInput"
import { catVars, tokenForCategory } from "src/constants/categoryColors"
import { toSectionAnchorId } from "src/libs/utils/toSectionAnchorId"
import { parseQueryTagParam } from "src/libs/utils/normalizeTag"
import {
  filterPostsForFeedList,
  orderedCategoryTitles,
} from "src/routes/Feed/feedFilter"
import { filterPosts } from "src/routes/Feed/PostList/filterPosts"

type Props = {
  q: string
  onChangeQuery: (next: string) => void
}

const SectionNav: React.FC<Props> = ({ q, onChangeQuery }) => {
  const router = useRouter()
  const posts = usePostsQuery()

  const currentTag = parseQueryTagParam(router.query.tag)
  const currentCategory =
    `${router.query.category || ``}` || DEFAULT_CATEGORY
  const order = `${router.query.order || ``}` || "desc"

  const filteredForGrouped = useMemo(
    () =>
      filterPostsForFeedList(posts, {
        q,
        tag: currentTag,
        category: currentCategory,
        order,
      }),
    [posts, q, currentTag, currentCategory, order]
  )

  const navCategories = useMemo(
    () => orderedCategoryTitles(filteredForGrouped),
    [filteredForGrouped]
  )

  const hasPinnedSection = useMemo(() => {
    const baseFiltered = filterPosts({
      posts,
      q,
      tag: currentTag,
      category: DEFAULT_CATEGORY,
      order,
    })
    return baseFiltered.some((p) => p.tags?.includes("Pinned"))
  }, [posts, q, currentTag, order])

  /** DOM order aligned with 피드: optional pinned strip, then category groups. */
  const spySectionIds = useMemo(() => {
    const ids: string[] = []
    if (hasPinnedSection) ids.push("section-pinned")
    ids.push(...navCategories.map((label) => toSectionAnchorId(label)))
    return ids
  }, [hasPinnedSection, navCategories])

  const [activeId, setActiveId] = useState<string>("section-pinned")
  const rafRef = useRef<number | null>(null)
  const manualActiveRef = useRef<{ id: string; until: number } | null>(null)

  /** 라우터/검색/필터가 바뀌면 예전 스크롤 타깃 고정 상태를 깨준다 */
  useEffect(() => {
    manualActiveRef.current = null
  }, [router.asPath])

  const getHeaderOffset = () => {
    const headerEl = document.querySelector<HTMLElement>("[data-header], header")
    const h = headerEl?.getBoundingClientRect().height ?? 0
    return Math.max(96, Math.min(220, h + 24))
  }

  const computeSpyIdFromScroll = (): string | null => {
    const resolved = spySectionIds
      .map((id) => {
        const el = document.getElementById(id)
        return el ? { id, el } : null
      })
      .filter(Boolean) as { id: string; el: HTMLElement }[]

    if (resolved.length === 0) return null

    const targetY = getHeaderOffset()
    const bandBottom = Math.min(targetY + 340, Math.max(window.innerHeight * 0.5, targetY + 80))

    let bestId: string | null = null
    let bestOverlap = Number.NEGATIVE_INFINITY
    for (const { id, el } of resolved) {
      const r = el.getBoundingClientRect()
      const overlap = Math.min(r.bottom, bandBottom) - Math.max(r.top, targetY)
      if (overlap > bestOverlap) {
        bestOverlap = overlap
        bestId = id
      }
    }

    if (bestId != null && bestOverlap > 4) return bestId

    const TH = 12
    let lineCandidate: string | null = null
    for (const { id, el } of resolved) {
      const r = el.getBoundingClientRect()
      if (r.top <= targetY + TH && r.bottom > targetY + 4) {
        lineCandidate = id
      }
    }
    return lineCandidate ?? resolved[0]?.id ?? null
  }

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    manualActiveRef.current = { id, until: Date.now() + 1200 }
    const top =
      el.getBoundingClientRect().top + window.scrollY - getHeaderOffset()
    window.scrollTo({ top, behavior: "smooth" })
    setActiveId(id)
  }

  useEffect(() => {
    const computeActive = () => {
      rafRef.current = null
      const manual = manualActiveRef.current
      if (manual && Date.now() < manual.until) {
        setActiveId(manual.id)
        return
      }

      const next = computeSpyIdFromScroll()
      if (next != null) setActiveId(next)
    }

    const onScrollOrResize = () => {
      if (rafRef.current != null) return
      rafRef.current = window.requestAnimationFrame(computeActive)
    }

    window.addEventListener("scroll", onScrollOrResize, { passive: true })
    window.addEventListener("resize", onScrollOrResize)
    onScrollOrResize()

    return () => {
      window.removeEventListener("scroll", onScrollOrResize)
      window.removeEventListener("resize", onScrollOrResize)
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    // 스파이 순서/spySectionIds 문자열 변경 시 초기 재계산
  }, [
    spySectionIds.join("|"),
    hasPinnedSection,
    navCategories.length,
    router.asPath,
  ])

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
          {hasPinnedSection && (
            <Item
              type="button"
              data-active={activeId === "section-pinned"}
              onClick={() => scrollTo("section-pinned")}
              style={catVars("reverse")}
            >
              <Dot aria-hidden="true" />
              <span className="label">Pinned</span>
            </Item>
          )}
          {navCategories.map((label) => (
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
          {navCategories.length === 0 && (
            <NavHint>No category sections match the current filters. Clear tag / search.</NavHint>
          )}
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

const NavHint = styled.p`
  margin: 0.25rem 0 0;
  padding: 0 0.5rem 0.25rem;
  font-size: 0.72rem;
  line-height: 1.35;
  color: ${({ theme }) => theme.brand.textFaint};
`
