import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/router"
import { HiSearch } from "react-icons/hi"
import { PINNED_VARS, catVars, tokenForCategory } from "src/constants/categoryColors"
import { toSectionAnchorId } from "src/libs/utils/toSectionAnchorId"
import SearchInput from "../SearchInput"
import { useSectionNavData } from "./useSectionNavData"
import { useScrollSpy } from "./useScrollSpy"
import {
  Box,
  DockInitial,
  DockSearchIconButton,
  DockSearchStack,
  DockTooltipEl,
  Dot,
  Item,
  List,
  NavHint,
  NavStickyTop,
  Wrapper,
} from "./sectionNav.styles"

type Props = {
  q: string
  onChangeQuery: (next: string) => void
  /** Desktop: About/post panel open — narrow dots-only rail. */
  dockNav?: boolean
}

function dockNavInitial(label: string): string {
  const t = label.trim()
  if (!t) return "·"
  if (t === "ExtraCurricular" || t === "과외활동") return "X"
  const first = t[0]
  if (!first) return "·"
  return /[a-z]/.test(first) ? first.toUpperCase() : first
}

const SectionNav: React.FC<Props> = ({ q, onChangeQuery, dockNav }) => {
  const router = useRouter()
  const {
    navCategories,
    resumeSectionIds,
    hasPinnedSection,
    tr,
  } = useSectionNavData(q)

  const spySectionIds = useMemo(() => {
    const ids: string[] = [...resumeSectionIds]
    if (hasPinnedSection) ids.push("section-pinned")
    ids.push(...navCategories.map((label) => toSectionAnchorId(label)))
    return ids
  }, [hasPinnedSection, navCategories, resumeSectionIds])

  const { activeId, scrollTo } = useScrollSpy(spySectionIds, router.asPath)

  const [dockSearchOpen, setDockSearchOpen] = useState(false)
  const [dockTooltip, setDockTooltip] = useState<{
    text: string
    x: number
    y: number
  } | null>(null)

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
              <SearchInput
                compact
                value={q}
                onChange={(e) => onChangeQuery(e.target.value)}
                placeholder={tr("Search…")}
                autoFocus
              />
            ) : null}
          </DockSearchStack>
        ) : (
          <SearchInput
            shortcut
            className="nav-search"
            value={q}
            onChange={(e) => onChangeQuery(e.target.value)}
            placeholder={tr("Search posts…")}
          />
        )}
      </NavStickyTop>
      {dockNav && (
      <Box className="nav-box">
        <List className="nav-list">
          {/* Only the collapsed dock (post panel open) lists jumps — it is the
              only way back into the feed from there. Filtering lives in the
              Writing bar. */}
          {dockNav && hasPinnedSection && (
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
          {dockNav && navCategories.map((label) => (
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
            </Item>
          ))}
          {dockNav && navCategories.length === 0 && (
            <NavHint className="section-nav-hint">
              {tr(
                "No category sections match the current filters. Clear tag / search."
              )}
            </NavHint>
          )}
        </List>
      </Box>
      )}
      {dockNav && dockTooltip ? (
        <DockTooltipEl style={{ left: dockTooltip.x, top: dockTooltip.y }}>
          {dockTooltip.text}
        </DockTooltipEl>
      ) : null}
    </Wrapper>
  )
}

export default SectionNav
