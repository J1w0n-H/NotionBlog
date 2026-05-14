import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/router"
import styled from "@emotion/styled"
import { DEFAULT_CATEGORY, NOTION_PINNED_TAG } from "src/constants"
import usePostsQuery from "src/hooks/usePostsQuery"
import { useFeedRouterFilters } from "src/hooks/useFeedRouterFilters"
import SearchInput from "./SearchInput"
import OrderButtons from "src/routes/Feed/FeedHeader/OrderButtons"
import {
  catVars,
  PINNED_VARS,
  tokenForCategory,
} from "src/constants/categoryColors"
import { toSectionAnchorId } from "src/libs/utils/toSectionAnchorId"
import {
  filterPostsForFeedList,
  orderedCategoryTitles,
} from "src/routes/Feed/feedFilter"
import {
  measureFeedStickyStackHeightPx,
  syncFeedScrollOffsetVar,
} from "src/libs/utils/feedScrollOffset"
import { RESUME_NAV_SECTIONS } from "src/constants/resumeSections"
import { getResumeNavSectionIds } from "src/routes/Feed/ResumeSections"
import {
  feedDesktopMinMedia,
  feedTabletOnlyMedia,
} from "src/styles/feedBreakpoints"

type Props = {
  q: string
  onChangeQuery: (next: string) => void
}

const SectionNav: React.FC<Props> = ({ q, onChangeQuery }) => {
  const router = useRouter()
  const posts = usePostsQuery()
  const { tag: currentTag, category: currentCategory, order } =
    useFeedRouterFilters()
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

  const resumeSectionIds = useMemo(() => getResumeNavSectionIds(), [])
  const resumeNavItems = useMemo(
    () => RESUME_NAV_SECTIONS.filter((s) => resumeSectionIds.includes(s.id)),
    [resumeSectionIds]
  )

  const hasPinnedSection = useMemo(() => {
    const baseFiltered = filterPostsForFeedList(posts, {
      q,
      tag: currentTag,
      category: DEFAULT_CATEGORY,
      order,
    })
    return baseFiltered.some((p) => p.tags?.includes(NOTION_PINNED_TAG))
  }, [posts, q, currentTag, order])

  /** DOM order aligned with 피드: optional pinned strip, then category groups. */
  const spySectionIds = useMemo(() => {
    const ids: string[] = [...resumeSectionIds]
    if (hasPinnedSection) ids.push("section-pinned")
    ids.push(...navCategories.map((label) => toSectionAnchorId(label)))
    return ids
  }, [hasPinnedSection, navCategories, resumeSectionIds])

  const [activeId, setActiveId] = useState<string>(
    () => resumeSectionIds[0] ?? "section-pinned"
  )
  const rafRef = useRef<number | null>(null)
  const manualActiveRef = useRef<{ id: string; until: number } | null>(null)

  /** 라우터/검색/필터가 바뀌면 예전 스크롤 타깃 고정 상태를 깨준다 */
  useEffect(() => {
    manualActiveRef.current = null
  }, [router.asPath])

  /** Last section whose top has crossed the sticky stack line (not overlap on tall blocks). */
  const computeSpyIdFromScroll = useCallback((): string | null => {
    const resolved = spySectionIds
      .map((id) => {
        const el = document.getElementById(id)
        return el ? { id, el } : null
      })
      .filter(Boolean) as { id: string; el: HTMLElement }[]

    if (resolved.length === 0) return null

    const line = measureFeedStickyStackHeightPx()
    let active = resolved[0].id
    for (const { id, el } of resolved) {
      if (el.getBoundingClientRect().top <= line + 6) active = id
      else break
    }
    return active
  }, [spySectionIds])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    syncFeedScrollOffsetVar()
    manualActiveRef.current = { id, until: Date.now() + 1500 }
    const headerOffset = measureFeedStickyStackHeightPx() + 24
    const targetTop =
      el.getBoundingClientRect().top + window.scrollY - headerOffset
    window.scrollTo({ top: targetTop, behavior: "smooth" })
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
  }, [computeSpyIdFromScroll, router.asPath])

  return (
    <Wrapper aria-label="Navigation">
      <SearchInput
        className="nav-search"
        value={q}
        onChange={(e) => onChangeQuery(e.target.value)}
        placeholder="Search posts…"
      />
      <Box className="nav-box">
        <Head>
          <Title>Navigate</Title>
          <SortSlot>
            <OrderButtons />
          </SortSlot>
        </Head>
        <List>
          {resumeNavItems.map((section) => (
            <Item
              key={section.id}
              type="button"
              data-active={activeId === section.id}
              onClick={() => scrollTo(section.id)}
              style={catVars(tokenForCategory(section.label))}
            >
              <Dot aria-hidden="true" />
              <span className="label">{section.label}</span>
            </Item>
          ))}
          {hasPinnedSection && (
            <Item
              type="button"
              data-active={activeId === "section-pinned"}
              onClick={() => scrollTo("section-pinned")}
              style={PINNED_VARS}
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

  ${feedTabletOnlyMedia} {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: stretch;
    gap: 0.75rem;

    .nav-search {
      flex: 1 1 12rem;
      min-width: 12rem;
      margin-bottom: 0;

      > .top {
        display: none;
      }
    }

    .nav-box {
      flex: 1 1 100%;
      padding: 0.625rem 0.75rem;
    }
  }
`

const Box = styled.div`
  border-radius: 1rem;
  background: ${({ theme }) => theme.brand.surface};
  border: 1px solid ${({ theme }) => theme.brand.border};
  padding: 0.75rem;
  box-shadow: ${({ theme }) => theme.brand.shadowSm};
`

/* v2: title + sort controls live on a single row so Sort no longer needs
 * its own box. On tablet the whole head collapses since the nav rail
 * becomes a horizontal scroll strip without a title. */
const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.625rem;

  ${feedTabletOnlyMedia} {
    display: none;
  }
`

const Title = styled.div`
  font-size: 0.6875rem;
  font-weight: 750;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.textMuted};
`

const SortSlot = styled.div`
  display: none;

  ${feedDesktopMinMedia} {
    display: inline-flex;
  }
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  ${feedTabletOnlyMedia} {
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 0.375rem;
    overflow-x: auto;
    overflow-y: hidden;
    padding-bottom: 0.125rem;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: ${({ theme }) =>
      `${theme.brand.border} transparent`};
    &::-webkit-scrollbar {
      height: 5px;
    }
    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.brand.border};
      border-radius: 999px;
    }
  }
`

const Item = styled.button`
  text-align: left;
  padding: 0.5rem 0.75rem;
  border-radius: 0.75rem;
  border: 1px solid transparent;
  background: transparent;
  color: ${({ theme }) => theme.brand.text};
  opacity: 0.72;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.12s ease, border-color 0.12s ease, opacity 0.12s ease,
    box-shadow 0.12s ease;
  .label {
    flex: 1;
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.25;
    white-space: nowrap;
  }

  ${feedTabletOnlyMedia} {
    flex: 0 0 auto;
    padding: 0.4375rem 0.75rem;

    .label {
      flex: 0 1 auto;
    }
  }
  &:hover {
    opacity: 1;
    background: var(--cat-soft);
  }
  &[data-active="true"] {
    opacity: 1;
    background: var(--cat-soft);
    /* v2: left 4px solid stripe (was a right 3px stripe) — reads as
     * "you are here, and it's anchored to where the list begins". */
    box-shadow: inset 4px 0 0 0 var(--cat-color);
    color: ${({ theme }) => theme.brand.text};
    .label {
      font-weight: 700;
    }
  }
`

/* v2: dot 8px → 6px with proportionally tighter halo, so the dot sits in
 * the same visual weight class as the 13/14px label rather than punching
 * above it. */
const Dot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 2px;
  flex-shrink: 0;
  background: var(--cat-color);
  box-shadow: 0 0 0 2px var(--cat-soft);
  transition: transform ${({ theme }) => theme.brand.durationFast}
    ${({ theme }) => theme.brand.ease};
  ${Item}[data-active="true"] & {
    transform: scale(1.25);
  }
`

const NavHint = styled.p`
  margin: 0.25rem 0 0;
  padding: 0 0.5rem 0.25rem;
  font-size: 0.72rem;
  line-height: 1.35;
  color: ${({ theme }) => theme.brand.textFaint};
`
