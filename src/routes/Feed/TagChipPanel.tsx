import React, { useCallback, useEffect, useRef, useState } from "react"
import styled from "@emotion/styled"
import { catVars } from "src/constants/categoryColors"
import { tokenForTagIndex } from "src/constants/tagPalette"
import { TagChipButton, TagChipClearButton } from "src/routes/Feed/tagChipStyles"
import { useFeedTagChips } from "src/routes/Feed/useFeedTagChips"
import { feedDesktopMinMedia } from "src/styles/feedBreakpoints"

type Props = {
  limit?: number
}

/**
 * v2: tags panel collapses to whatever fits on the first row by default
 * and exposes a "+N more / Show less" toggle to expand. When the user has
 * an active tag we always expand so they can see the selection in context.
 *
 * "First-row fit" is measured at runtime via ResizeObserver: each chip's
 * `offsetTop` is compared to the first chip's `offsetTop`, and anything
 * past the first row becomes the hidden count.
 */
const TagChipPanel: React.FC<Props> = ({ limit = 12 }) => {
  const { topTags, onClick, isActive, clearTag, hasActiveTag, indexFor } =
    useFeedTagChips(limit)

  const [expanded, setExpanded] = useState(false)
  const [hiddenCount, setHiddenCount] = useState(0)
  const listRef = useRef<HTMLDivElement | null>(null)

  /** When a tag becomes active externally, surface the full list so the
   *  user can immediately see their pick alongside related tags. */
  useEffect(() => {
    if (hasActiveTag) setExpanded(true)
  }, [hasActiveTag])

  /** Re-measure how many chips overflow past the first row. We measure
   *  the *expanded* layout (display all chips) by temporarily reading
   *  their `offsetTop` and then deciding whether to clip. */
  const remeasure = useCallback(() => {
    const list = listRef.current
    if (!list) return
    const chips = Array.from(
      list.querySelectorAll<HTMLElement>("[data-tag-chip]")
    )
    if (chips.length === 0) {
      setHiddenCount(0)
      return
    }
    const firstTop = chips[0].offsetTop
    let firstRowCount = 0
    for (const chip of chips) {
      if (chip.offsetTop === firstTop) firstRowCount += 1
      else break
    }
    setHiddenCount(Math.max(0, chips.length - firstRowCount))
  }, [])

  useEffect(() => {
    remeasure()
    const list = listRef.current
    if (!list || typeof ResizeObserver === "undefined") return
    const ro = new ResizeObserver(() => remeasure())
    ro.observe(list)
    return () => ro.disconnect()
  }, [remeasure, topTags.length])

  if (topTags.length === 0) return null

  const clipped = !expanded && hiddenCount > 0

  return (
    <Shell aria-label="Feed tags">
      <Box>
        <Head>
          <Title>Tags</Title>
          {hasActiveTag ? (
            <TagChipClearButton type="button" onClick={clearTag}>
              Clear
            </TagChipClearButton>
          ) : null}
        </Head>
        <ChipList ref={listRef} data-clipped={clipped ? "true" : "false"}>
          {topTags.map(([tag, count]) => (
            <TagChipButton
              key={tag}
              type="button"
              data-tag-chip
              style={catVars(tokenForTagIndex(indexFor(tag)))}
              data-active={isActive(tag) ? "true" : "false"}
              aria-pressed={isActive(tag) ? "true" : "false"}
              onClick={() => onClick(tag)}
              title={`${tag} (${count})`}
            >
              <span className="label">{tag}</span>
              <span className="count">{count}</span>
            </TagChipButton>
          ))}
        </ChipList>
        {hiddenCount > 0 ? (
          <ToggleButton
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
          >
            {expanded ? "Show less" : `+${hiddenCount} more`}
          </ToggleButton>
        ) : null}
      </Box>
    </Shell>
  )
}

export default TagChipPanel

const Shell = styled.div`
  display: none;

  ${feedDesktopMinMedia} {
    display: block;
    margin-top: 0.75rem;
  }
`

const Box = styled.div`
  border-radius: var(--radius-lg);
  background: ${({ theme }) => theme.brand.surface};
  border: 1px solid ${({ theme }) => theme.brand.border};
  padding: 0.75rem;
  box-shadow: ${({ theme }) => theme.brand.shadowSm};
`

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.625rem;
`

const Title = styled.div`
  font-size: 0.6875rem;
  font-weight: 750;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.textMuted};
`

const ChipList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;

  /* When clipped we still keep flex-wrap so measurement reads chips beyond
   * the first row, but clamp the visible height to a single chip line. */
  &[data-clipped="true"] {
    max-height: 1.75rem;
    overflow: hidden;
  }
`

const ToggleButton = styled.button`
  margin-top: 0.5rem;
  padding: 0;
  border: 0;
  background: transparent;
  font-family: ${({ theme }) => theme.brand.fontSans};
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.brand.accent};
  cursor: pointer;
  transition: color ${({ theme }) => theme.brand.durationFast}
    ${({ theme }) => theme.brand.ease};

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.brand.accentHover};
    text-decoration: underline;
    text-underline-offset: 3px;
    outline: none;
  }
`
