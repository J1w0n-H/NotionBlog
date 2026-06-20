import React from "react"
import styled from "@emotion/styled"
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

  if (dockNav) return null

  if (topTags.length === 0) return null

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
        <ChipList>
          {topTags.map(([tag, count]) => (
            <NavTagPill
              key={tag}
              type="button"
              data-active={isActive(tag) ? "true" : "false"}
              aria-pressed={isActive(tag) ? "true" : "false"}
              onClick={() => onClick(tag)}
              >
              {tag}
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
    color: var(--link);
    border-color: var(--link);
    box-shadow: var(--glow-cy, 0 0 10px color-mix(in srgb, var(--link) 40%, transparent));
  }

`
