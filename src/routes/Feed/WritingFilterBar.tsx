import React, { useEffect, useId, useMemo, useRef, useState } from "react"
import styled from "@emotion/styled"
import { useRouter } from "next/router"
import { HiAdjustments, HiX } from "react-icons/hi"
import { DEFAULT_CATEGORY } from "src/constants"
import { KO_NAV } from "src/constants/i18n"
import { RESUME_OWNED_CATEGORIES } from "src/constants/resumeSections"
import { catVars, tokenForCategory } from "src/constants/categoryColors"
import { tokenForTagIndex } from "src/constants/tagPalette"
import usePostsQuery from "src/hooks/usePostsQuery"
import { useTranslate, type Translate } from "src/hooks/useTranslate"
import { useEscapeKey } from "src/hooks/useEscapeKey"
import { useFeedRouterFilters } from "src/hooks/useFeedRouterFilters"
import {
  filterPostsForFeedList,
  groupPostsByCategoryTitle,
} from "src/routes/Feed/feedFilter"
import { useFeedTagChips } from "src/routes/Feed/useFeedTagChips"
import { TagChipButton, TagChipClearButton } from "src/routes/Feed/tagChipStyles"
import { feedMobileOnlyMedia } from "src/styles/feedBreakpoints"

/** Scroll target for "Jump to → Writing". */
export const WRITING_SECTION_ID = "section-writing"

const TAG_LIMIT = 30

type Props = { q: string }

/**
 * The single place to filter the post list: category tabs (with counts),
 * sort order, and a tag filter that opens as a popover (desktop) or a bottom
 * sheet (mobile). All state lives in the URL (?category, ?tag, ?order), so
 * cards / nav links that set those params stay in sync with this bar.
 */
const WritingFilterBar: React.FC<Props> = ({ q }) => {
  const router = useRouter()
  const posts = usePostsQuery()
  const { tag, category, order } = useFeedRouterFilters()
  const tr = useTranslate(KO_NAV)

  // Counts reflect search + tag, but not the category itself, so every tab
  // shows how many posts it would reveal.
  const tabs = useMemo(() => {
    const base = filterPostsForFeedList(posts, {
      q,
      tag,
      category: DEFAULT_CATEGORY,
      order,
    })
    const groups = groupPostsByCategoryTitle(base).filter(
      ([title]) => !RESUME_OWNED_CATEGORIES.has(title)
    )
    const total = groups.reduce((n, [, list]) => n + list.length, 0)
    return { groups, total }
  }, [posts, q, tag, order])

  const pushQuery = (patch: Record<string, string | undefined>) => {
    const query = { ...router.query }
    for (const [k, v] of Object.entries(patch)) {
      if (v === undefined) delete query[k]
      else query[k] = v
    }
    void router.push({ pathname: router.pathname, query }, undefined, {
      shallow: true,
      scroll: false,
    })
  }

  const selectCategory = (next: string) =>
    pushQuery({ category: next === DEFAULT_CATEGORY ? undefined : next })

  const toggleOrder = () =>
    pushQuery({ order: order === "asc" ? undefined : "asc" })

  return (
    <Bar id={WRITING_SECTION_ID} aria-label={tr("Writing")}>
      <TitleRow>
        <h2>{tr("Writing")}</h2>
        <Meta>
          <SortButton
            type="button"
            onClick={toggleOrder}
            aria-label={tr(order === "asc" ? "Sort: oldest first" : "Sort: latest first")}
          >
            {tr(order === "asc" ? "Oldest first" : "Newest first")}
          </SortButton>
          <TagFilter tr={tr} />
        </Meta>
      </TitleRow>

      <Tabs role="toolbar" aria-label={tr("Categories")}>
        <Tab
          type="button"
          aria-pressed={category === DEFAULT_CATEGORY}
          onClick={() => selectCategory(DEFAULT_CATEGORY)}
        >
          {tr("All")}
          <span className="n">{tabs.total}</span>
        </Tab>
        {tabs.groups.map(([title, list]) => (
          <Tab
            key={title}
            type="button"
            aria-pressed={category === title}
            style={catVars(tokenForCategory(title))}
            onClick={() => selectCategory(title)}
          >
            {tr(title)}
            <span className="n">{list.length}</span>
          </Tab>
        ))}
        {/* Selected category may have no matches under the current search/tag. */}
        {category !== DEFAULT_CATEGORY &&
          !tabs.groups.some(([t]) => t === category) && (
            <Tab type="button" aria-pressed onClick={() => selectCategory(DEFAULT_CATEGORY)}>
              {tr(category)}
              <span className="n">0</span>
            </Tab>
          )}
      </Tabs>
    </Bar>
  )
}

export default WritingFilterBar

/* ── Tag filter: popover on desktop, bottom sheet on mobile ─────────────── */

const TagFilter: React.FC<{ tr: Translate }> = ({ tr }) => {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const panelId = useId()
  const { topTags, onClick, isActive, clearTag, hasActiveTag, indexFor } =
    useFeedTagChips(TAG_LIMIT)
  const activeTag = topTags.find(([t]) => isActive(t))?.[0]

  useEscapeKey(() => setOpen(false), open)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDown)
    return () => document.removeEventListener("mousedown", onDown)
  }, [open])

  if (topTags.length === 0) return null

  return (
    <TagRoot ref={rootRef}>
      <TagButton
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        data-active={hasActiveTag ? "true" : undefined}
        onClick={() => setOpen((o) => !o)}
      >
        <HiAdjustments aria-hidden="true" size={16} />
        <span>{activeTag ? `#${activeTag}` : tr("Tags")}</span>
      </TagButton>
      {open && (
        <>
          <Scrim aria-hidden="true" onClick={() => setOpen(false)} />
          <Panel id={panelId} role="dialog" aria-label={tr("Filter by tag")}>
            <PanelHead>
              <span>{tr("Filter by tag")}</span>
              <CloseButton type="button" aria-label={tr("Close")} onClick={() => setOpen(false)}>
                <HiX size={18} aria-hidden="true" />
              </CloseButton>
            </PanelHead>
            <Chips>
              {topTags.map(([t]) => (
                <TagChipButton
                  key={t}
                  type="button"
                  style={catVars(tokenForTagIndex(indexFor(t)))}
                  aria-pressed={isActive(t) ? "true" : "false"}
                  data-active={isActive(t) ? "true" : "false"}
                  onClick={() => {
                    onClick(t)
                    setOpen(false)
                  }}
                >
                  <span className="label">{t}</span>
                </TagChipButton>
              ))}
              {hasActiveTag && (
                <TagChipClearButton
                  type="button"
                  onClick={() => {
                    clearTag()
                    setOpen(false)
                  }}
                >
                  {tr("Clear")}
                </TagChipClearButton>
              )}
            </Chips>
          </Panel>
        </>
      )}
    </TagRoot>
  )
}

/* ── Styles ─────────────────────────────────────────────────────────────── */

const Bar = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
  scroll-margin-top: calc(var(--feed-header-height, 4.5rem) + 16px);
`

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;

  h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 800;
    color: ${({ theme }) => theme.brand.text};
  }
`

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.brand.textMuted};

`

const ControlButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 32px;
  padding: 0 12px;
  border-radius: var(--radius-sm);
  border: 1px solid ${({ theme }) => theme.brand.border};
  background: transparent;
  color: ${({ theme }) => theme.brand.textMuted};
  font: inherit;
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.brand.borderStrong};
    color: ${({ theme }) => theme.brand.text};
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.brand.accent};
    outline-offset: 2px;
  }
  ${feedMobileOnlyMedia} {
    min-height: 44px;
  }
`

const SortButton = ControlButton

const TagButton = styled(ControlButton)`
  &[data-active="true"] {
    border-color: ${({ theme }) => theme.brand.accent};
    color: ${({ theme }) => theme.brand.accent};
  }
`

const Tabs = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  padding-bottom: 2px;
  &::-webkit-scrollbar {
    display: none;
  }
`

const Tab = styled.button`
  --cat-color: ${({ theme }) => theme.brand.accent};
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 12px;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  background: transparent;
  color: ${({ theme }) => theme.brand.textMuted};
  font: inherit;
  font-size: 0.8125rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;

  .n {
    font-size: 0.6875rem;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    color: ${({ theme }) => theme.brand.textFaint};
  }

  &:hover {
    color: ${({ theme }) => theme.brand.text};
  }

  &[aria-pressed="true"] {
    color: var(--cat-color);
    border-color: color-mix(in srgb, var(--cat-color) 45%, transparent);
    background: color-mix(in srgb, var(--cat-color) 12%, transparent);
    .n {
      color: inherit;
    }
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.brand.accent};
    outline-offset: 2px;
  }

  ${feedMobileOnlyMedia} {
    height: 44px;
  }
`

const TagRoot = styled.div`
  position: relative;
`

const Scrim = styled.div`
  display: none;
  ${feedMobileOnlyMedia} {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 80;
    background: rgb(0 0 0 / 0.45);
  }
`

const Panel = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 81;
  width: min(360px, 80vw);
  max-height: 60vh;
  overflow-y: auto;
  padding: 12px;
  border-radius: var(--radius-md);
  border: 1px solid ${({ theme }) => theme.brand.border};
  background: ${({ theme }) => theme.brand.surface};
  box-shadow: ${({ theme }) => theme.brand.shadowSm};

  /* Bottom sheet on phones */
  ${feedMobileOnlyMedia} {
    position: fixed;
    top: auto;
    left: 0;
    right: 0;
    bottom: 0;
    width: auto;
    max-height: 70vh;
    border-radius: 12px 12px 0 0;
    padding: 16px 16px calc(16px + env(safe-area-inset-bottom, 0px));
  }
`

const PanelHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 0.8125rem;
  font-weight: 700;
  color: ${({ theme }) => theme.brand.text};
`

const CloseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: var(--radius-sm);
  background: transparent;
  color: ${({ theme }) => theme.brand.textMuted};
  cursor: pointer;
  ${feedMobileOnlyMedia} {
    width: 44px;
    height: 44px;
  }
`

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`
