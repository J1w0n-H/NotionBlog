import React, { useMemo } from "react"
import styled from "@emotion/styled"
import { useTagsQuery } from "src/hooks/useTagsQuery"
import { TagChipClearButton } from "src/routes/Feed/tagChipStyles"
import { useFeedTagChips } from "src/routes/Feed/useFeedTagChips"
import { feedDesktopMinMedia } from "src/styles/feedBreakpoints"

type Props = {
  limit?: number
  /** Desktop rail: hide when nav is collapsed next to About/post. */
  dockNav?: boolean
}

/**
 * Tags side panel — renders every top tag at once. There's nothing else
 * stacked below the panel in the desktop sidebar, so collapsing the list
 * to a single row only hides information; just show them all.
 */
const TagChipPanel: React.FC<Props> = ({ limit = 12, dockNav }) => {
  const { topTags, onClick, isActive, clearTag, hasActiveTag } =
    useFeedTagChips(limit)
  const allTags = useTagsQuery()
  const stats = useMemo(() => {
    const entries = Object.entries(allTags)
    const kinds = entries.length
    const uses = entries.reduce((sum, [, n]) => sum + n, 0)
    return { kinds, uses }
  }, [allTags])

  if (dockNav) return null

  if (topTags.length === 0) return null

  return (
    <Shell aria-label="Feed tags">
      <Box>
        <Head>
          <HeadStart>
            <Title>Tags</Title>
            {stats.kinds > 0 ? (
              <HeadMeta aria-hidden="true">
                {stats.uses} · {stats.kinds}
              </HeadMeta>
            ) : null}
          </HeadStart>
          {hasActiveTag ? (
            <TagChipClearButton type="button" onClick={clearTag}>
              Clear
            </TagChipClearButton>
          ) : null}
        </Head>
        <ChipList>
          {topTags.map(([tag, count]) => (
            <NavTagPill
              key={tag}
              type="button"
              data-active={isActive(tag) ? "true" : "false"}
              aria-pressed={isActive(tag) ? "true" : "false"}
              onClick={() => onClick(tag)}
              data-desc={`${count} post${count !== 1 ? "s" : ""}`}
            >
              {tag} · {count}
            </NavTagPill>
          ))}
        </ChipList>
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
  padding: 0.5rem 0 0;
`

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.625rem;
`

const HeadStart = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  min-width: 0;
  flex-wrap: wrap;
`

const Title = styled.div`
  font-size: 0.6875rem;
  font-weight: 750;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.textMuted};
`

const HeadMeta = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.brand.textFaint};
`

const ChipList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
`

const NavTagPill = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  padding: 0.25rem 0.5625rem;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  background: transparent;
  color: ${({ theme }) => theme.brand.textFaint};
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.6875rem;
  cursor: pointer;
  transition: color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;

  &:not([data-active="true"]):hover {
    color: ${({ theme }) => theme.brand.text};
    border-color: ${({ theme }) => theme.brand.border};
  }

  &[data-active="true"] {
    color: var(--link, var(--link));
    border-color: var(--link, var(--link));
    box-shadow: var(--glow-cy, 0 0 10px color-mix(in srgb, var(--link) 40%, transparent));
  }

  &[data-desc]::after {
    content: attr(data-desc);
    position: absolute;
    left: 0;
    top: calc(100% + 7px);
    z-index: 50;
    width: max-content;
    max-width: 200px;
    font-family: ${({ theme }) => theme.brand.fontSans};
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 1.45;
    color: ${({ theme }) => theme.brand.textMuted};
    background: rgba(12, 9, 24, 0.97);
    border: 1px solid ${({ theme }) => theme.brand.borderStrong};
    border-radius: 9px;
    padding: 7px 10px;
    box-shadow: 0 10px 28px rgba(5, 3, 15, 0.6);
    opacity: 0;
    transform: translateY(-3px);
    pointer-events: none;
    transition: opacity 0.15s, transform 0.15s;
    white-space: normal;
  }

  &[data-desc]:hover::after {
    opacity: 1;
    transform: translateY(0);
  }
`
