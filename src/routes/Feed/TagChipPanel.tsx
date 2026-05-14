import React from "react"
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
 * Tags side panel — renders every top tag at once. There's nothing else
 * stacked below the panel in the desktop sidebar, so collapsing the list
 * to a single row only hides information; just show them all.
 */
const TagChipPanel: React.FC<Props> = ({ limit = 12 }) => {
  const { topTags, onClick, isActive, clearTag, hasActiveTag, indexFor } =
    useFeedTagChips(limit)

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
            <TagChipButton
              key={tag}
              type="button"
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
`
