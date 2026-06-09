import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/router"
import styled from "@emotion/styled"
import { HiSearch } from "react-icons/hi"
import { DEFAULT_CATEGORY, NOTION_PINNED_TAG } from "src/constants"
import usePostsQuery from "src/hooks/usePostsQuery"
import { useFeedRouterFilters } from "src/hooks/useFeedRouterFilters"
import useLanguage from "src/hooks/useLanguage"
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
import { RESUME_NAV_SECTIONS, RESUME_OWNED_CATEGORIES } from "src/constants/resumeSections"
import { getResumeNavSectionIds } from "src/routes/Feed/ResumeSections"
import {
  feedDesktopMinMedia,
  feedTabletOnlyMedia,
} from "src/styles/feedBreakpoints"

type Props = {
  q: string
  onChangeQuery: (next: string) => void
  /** Desktop: About/post panel open — narrow dots-only rail. */
  dockNav?: boolean
}

/** First grapheme for dock rail (letter chip); uppercases ASCII/Latin. */
function dockNavInitial(label: string): string {
  const t = label.trim()
  if (!t) return "·"
  // ExtraCurricular uses "X" to disambiguate from Education ("E")
  if (t === "ExtraCurricular" || t === "과외활동") return "X"
  const first = t[0]
  if (!first) return "·"
  return /[a-z]/.test(first) ? first.toUpperCase() : first
}

const KO_NAV: Record<string, string> = {
  Navigate: "탐색",
  Pinned: "고정됨",
  "Search posts…": "게시물 검색…",
  "Search…": "검색…",
  "No category sections match the current filters. Clear tag / search.":
    "현재 필터에 맞는 카테고리가 없습니다. 태그 또는 검색을 지워주세요.",
  Education: "학력",
  "Work Experience": "경력",
  Conferences: "컨퍼런스",
  ExtraCurricular: "과외 활동",
  Life: "일상",
  "Career / Talks / Community": "커리어 / 강연 / 커뮤니티",
  Activities: "활동",
  Personal: "개인",
  "Personal Life": "개인 생활",
  "Cloud Security": "클라우드 보안",
  "Detection & Response (Observability)": "탐지 & 대응 (관측)",
  "Security Research (AI Security)": "보안 연구 (AI 보안)",
  "Cryptography & TLS": "암호학 & TLS",
  "Reverse Engineering": "리버스 엔지니어링",
  "CTF Writeups": "CTF 풀이",
  "Systems & RTOS": "시스템 & RTOS",
  "Research Notes": "연구 노트",
  "Infrastructure Engineering": "인프라 엔지니어링",
  Other: "기타",
}

const SectionNav: React.FC<Props> = ({ q, onChangeQuery, dockNav }) => {
  const router = useRouter()
  const posts = usePostsQuery()
  const { tag: currentTag, category: currentCategory, order } =
    useFeedRouterFilters()
  const [language] = useLanguage()
  const tr = language === "ko" ? (t: string) => KO_NAV[t] ?? t : (t: string) => t
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
    () => orderedCategoryTitles(filteredForGrouped).filter((c) => !RESUME_OWNED_CATEGORIES.has(c)),
    [filteredForGrouped]
  )

  const resumeSectionIds = useMemo(() => getResumeNavSectionIds(), [])
  const resumeNavItems = useMemo(
    () => RESUME_NAV_SECTIONS.filter((s) => resumeSectionIds.includes(s.id)),
    [resumeSectionIds]
  )

  const postsForCount = useMemo(
    () => filterPostsForFeedList(posts, { q, tag: currentTag, order, category: DEFAULT_CATEGORY }),
    [posts, q, currentTag, order]
  )
  const countFor = useCallback(
    (categoryLabel: string) =>
      postsForCount.filter((p) => p.category?.includes(categoryLabel)).length,
    [postsForCount]
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

  const [dockSearchOpen, setDockSearchOpen] = useState(false)
  const [dockTooltip, setDockTooltip] = useState<{ text: string; x: number; y: number } | null>(null)

  useEffect(() => {
    if (!dockNav) setDockSearchOpen(false)
  }, [dockNav])

  useEffect(() => {
    if (!dockNav) setDockTooltip(null)
  }, [dockNav])

  const onItemEnter = useCallback(
    (text: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!dockNav) return
      const r = e.currentTarget.getBoundingClientRect()
      setDockTooltip({ text, x: r.right + 10, y: r.top + r.height / 2 })
    },
    [dockNav]
  )
  const onItemLeave = useCallback(() => setDockTooltip(null), [])

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
    <Wrapper aria-label="Navigation" data-nav-dock={dockNav ? "true" : undefined}>
      <NavStickyTop
        className="section-nav-sticky"
        data-nav-dock-trim={dockNav ? "true" : undefined}
      >
        {dockNav ? (
          <DockSearchStack>
            <DockSearchIconButton
              type="button"
              aria-label={dockSearchOpen ? "Close search" : "Search posts"}
              aria-expanded={dockSearchOpen}
              onClick={() => setDockSearchOpen((o) => !o)}
            >
              <HiSearch aria-hidden="true" size={18} />
            </DockSearchIconButton>
            {dockSearchOpen ? (
              <DockSearchInput
                value={q}
                onChange={(e) => onChangeQuery(e.target.value)}
                placeholder={tr("Search…")}
                aria-label="Search posts"
                autoFocus
              />
            ) : null}
          </DockSearchStack>
        ) : (
          <>
            <SearchInput
              className="nav-search"
              value={q}
              onChange={(e) => onChangeQuery(e.target.value)}
              placeholder={tr("Search posts…")}
            />
            <Head>
              <Title>{tr("Navigate")}</Title>
              <SortSlot>
                <OrderButtons />
              </SortSlot>
            </Head>
          </>
        )}
      </NavStickyTop>
      <Box className="nav-box">
        <List className="nav-list">
          {resumeNavItems.map((section) => (
            <Item
              key={section.id}
              type="button"
              data-dock-item={dockNav ? "true" : undefined}
              data-active={activeId === section.id}
              aria-label={tr(section.label)}
              onClick={() => scrollTo(section.id)}
              onMouseEnter={dockNav ? onItemEnter(tr(section.label)) : undefined}
              onMouseLeave={dockNav ? onItemLeave : undefined}
              style={catVars(tokenForCategory(section.label))}
            >
              {dockNav ? (
                <DockInitial aria-hidden="true">
                  {dockNavInitial(tr(section.label))}
                </DockInitial>
              ) : (
                <Dot aria-hidden="true" />
              )}
              <span className="label">{tr(section.label)}</span>
              {!dockNav && <CountBadge>{countFor(section.label)}</CountBadge>}
            </Item>
          ))}
          {hasPinnedSection && (
            <Item
              type="button"
              data-dock-item={dockNav ? "true" : undefined}
              data-active={activeId === "section-pinned"}
              aria-label={tr("Pinned")}
              onClick={() => scrollTo("section-pinned")}
              onMouseEnter={dockNav ? onItemEnter(tr("Pinned")) : undefined}
              onMouseLeave={dockNav ? onItemLeave : undefined}
              style={PINNED_VARS}
            >
              {dockNav ? (
                <DockInitial aria-hidden="true">
                  {dockNavInitial(tr("Pinned"))}
                </DockInitial>
              ) : (
                <Dot aria-hidden="true" />
              )}
              <span className="label">{tr("Pinned")}</span>
            </Item>
          )}
          {navCategories.map((label) => (
            <Item
              key={label}
              type="button"
              data-dock-item={dockNav ? "true" : undefined}
              data-active={activeId === toSectionAnchorId(label)}
              aria-label={tr(label)}
              onClick={() => scrollTo(toSectionAnchorId(label))}
              onMouseEnter={dockNav ? onItemEnter(tr(label)) : undefined}
              onMouseLeave={dockNav ? onItemLeave : undefined}
              style={catVars(tokenForCategory(label))}
            >
              {dockNav ? (
                <DockInitial aria-hidden="true">
                  {dockNavInitial(tr(label))}
                </DockInitial>
              ) : (
                <Dot aria-hidden="true" />
              )}
              <span className="label">{tr(label)}</span>
              {!dockNav && <CountBadge>{countFor(label)}</CountBadge>}
            </Item>
          ))}
          {navCategories.length === 0 && (
            <NavHint className="section-nav-hint">
              {tr("No category sections match the current filters. Clear tag / search.")}
            </NavHint>
          )}
        </List>
      </Box>
      {dockNav && dockTooltip ? (
        <DockTooltipEl style={{ left: dockTooltip.x, top: dockTooltip.y }}>
          {dockTooltip.text}
        </DockTooltipEl>
      ) : null}
    </Wrapper>
  )
}

export default SectionNav

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;

  &[data-nav-dock="true"] {
    flex: 1;
    min-height: 0;

    .section-nav-sticky {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 0.35rem;
      flex-shrink: 0;
      margin-bottom: 0.35rem;
      padding-bottom: 0.35rem;
      border-bottom: 1px solid ${({ theme }) => theme.brand.borderSoft};
      background: ${({ theme }) => theme.brand.bg};
      box-shadow: none;
      position: sticky;
      top: 0;
      z-index: 4;
    }

    .nav-box {
      flex: 1 1 auto;
      min-height: 0;
      display: flex;
      flex-direction: column;
      padding: 0.35rem 0.25rem;
    }

    .nav-box > .nav-list {
      flex: 1 1 auto;
      min-height: 0;
      overflow-y: auto;
      overflow-x: hidden;
      gap: 0.2rem;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    .nav-box > .nav-list > .section-nav-hint {
      display: none;
    }

    .nav-box > .nav-list > button {
      justify-content: center;
      padding: 0.45rem 0.125rem;
      gap: 0;
    }

    .nav-box > .nav-list > button .label {
      display: none;
    }
  }

  ${feedDesktopMinMedia} {
    flex: 1;
    min-height: 0;
  }

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

  @media (max-width: 767px) {
    display: block;

    .section-nav-sticky {
      display: block;
    }

    .nav-box {
      display: none;
    }
  }
`

const NavStickyTop = styled.div`
  flex-shrink: 0;

  ${feedDesktopMinMedia} {
    position: sticky;
    top: 0;
    z-index: 3;
    margin-bottom: 0.25rem;
    padding-bottom: 0.375rem;
    border-bottom: 1px solid ${({ theme }) => theme.brand.borderSoft};
    background: ${({ theme }) => theme.brand.bg};
    box-shadow: 0 8px 16px -10px oklch(0 0 0 / 0.18);
  }

  &[data-nav-dock-trim="true"] {
    ${feedDesktopMinMedia} {
      box-shadow: none;
      margin-bottom: 0.35rem;
      padding-bottom: 0.35rem;
    }
  }

  ${feedTabletOnlyMedia} {
    display: contents;
  }

  .nav-search {
    margin-bottom: 0.5rem;

    ${feedTabletOnlyMedia} {
      margin-bottom: 0;
    }

    @media (max-width: 767px) {
      margin-bottom: 0;

      > .top {
        display: none;
      }
    }
  }
`

const DockSearchStack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.35rem;
`

const DockSearchIconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  align-self: flex-start;
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
  border-radius: 0.65rem;
  border: 1px solid ${({ theme }) => theme.brand.border};
  background: ${({ theme }) => theme.brand.surface};
  color: ${({ theme }) => theme.brand.textMuted};
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.12s ease, border-color 0.12s ease, color 0.12s ease;

  &:hover {
    color: ${({ theme }) => theme.brand.text};
    border-color: ${({ theme }) => theme.brand.borderStrong};
    background: ${({ theme }) => theme.brand.surface2};
  }
`

const DockSearchInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  padding: 0.45rem 0.55rem;
  border-radius: 0.65rem;
  outline: none;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.brand.text};
  background: ${({ theme }) => theme.brand.surfaceSunk};
  border: 1px solid ${({ theme }) => theme.brand.border};
  transition: border-color 0.12s ease, box-shadow 0.12s ease;

  &::placeholder {
    color: ${({ theme }) => theme.brand.textFaint};
  }

  &:hover {
    border-color: ${({ theme }) => theme.brand.borderStrong};
  }

  &:focus {
    border-color: ${({ theme }) => theme.brand.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.brand.accentSoft};
  }
`

const DockInitial = styled.span`
  width: 1.375rem;
  height: 1.375rem;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.4rem;
  font-size: 0.6875rem;
  font-weight: 750;
  line-height: 1;
  letter-spacing: -0.02em;
  color: var(--cat-color);
  background: var(--cat-soft);
`

const Box = styled.div`
  border-radius: 1rem;
  background: var(--glass-1, ${({ theme }) => theme.brand.surface});
  backdrop-filter: var(--glass-blur, none);
  -webkit-backdrop-filter: var(--glass-blur, none);
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  padding: 0.75rem;
  box-shadow: var(--glass-edge, none), var(--glass-shadow, ${({ theme }) => theme.brand.shadowSm});

  ${feedDesktopMinMedia} {
    flex: 1 1 auto;
    min-height: 0;
  }
`

/* v2: title + sort controls live on a single row so Sort no longer needs
 * its own box. On tablet the whole head collapses since the nav rail
 * becomes a horizontal scroll strip without a title. */
const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;

  ${feedDesktopMinMedia} {
    margin-bottom: 0;
  }

  ${feedTabletOnlyMedia} {
    display: none;
  }

  @media (max-width: 767px) {
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
    background: ${({ theme }) => theme.brand.accentSoft};
    color: ${({ theme }) => theme.brand.text};
  }
  &[data-active="true"] {
    opacity: 1;
    background: linear-gradient(90deg, ${({ theme }) => theme.brand.accentSoft}, transparent);
    box-shadow: inset 4px 0 0 0 ${({ theme }) => theme.brand.accent};
    color: ${({ theme }) => theme.brand.text};
    .label {
      font-weight: 700;
    }
  }

  &[data-dock-item="true"][data-active="true"] {
    background: ${({ theme }) => theme.brand.accentSoft};
    box-shadow: inset 0 0 0 1.5px ${({ theme }) => theme.brand.accent},
      var(--glow-sm, none);
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

const CountBadge = styled.span`
  flex-shrink: 0;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.6875rem;
  font-weight: 500;
  line-height: 1;
  color: ${({ theme }) => theme.brand.textFaint};
  min-width: 1.25rem;
  text-align: right;
  letter-spacing: 0.01em;
`

const DockTooltipEl = styled.div`
  position: fixed;
  transform: translateY(-50%);
  background: ${({ theme }) => theme.brand.surface2};
  color: ${({ theme }) => theme.brand.text};
  border: 1px solid ${({ theme }) => theme.brand.borderStrong};
  border-radius: 8px;
  padding: 5px 10px;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  white-space: nowrap;
  pointer-events: none;
  z-index: 200;
  box-shadow: ${({ theme }) => theme.brand.shadowLg};
`
