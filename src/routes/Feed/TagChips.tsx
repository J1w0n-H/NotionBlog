import React from "react"
import styled from "@emotion/styled"
import { catVars } from "src/constants/categoryColors"
import { tokenForTagIndex } from "src/constants/tagPalette"
import { FEED_TAG_CHIPS_STICKY_TOP } from "src/libs/utils/feedScrollOffset"
import { TagChipButton, TagChipClearButton } from "src/routes/Feed/tagChipStyles"
import { useFeedTagChips } from "src/routes/Feed/useFeedTagChips"
import { feedDesktopMinMedia } from "src/styles/feedBreakpoints"

type Props = {
  limit?: number
  /** When true: renders inline inside the sticky dock bar — no self-positioning or background. */
  inDock?: boolean
}

const TagChips: React.FC<Props> = ({ limit = 12, inDock }) => {
  const { topTags, onClick, isActive, clearTag, hasActiveTag, indexFor } =
    useFeedTagChips(limit)

  if (topTags.length === 0) return null

  return (
    <Wrapper $inDock={inDock} aria-label="Top tags">
      {topTags.map(([tag, count]) => (
        <TagChipButton
          key={tag}
          type="button"
          style={catVars(tokenForTagIndex(indexFor(tag)))}
          aria-pressed={isActive(tag) ? "true" : "false"}
          data-active={isActive(tag) ? "true" : "false"}
          onClick={() => onClick(tag)}
          title={tag}
        >
          <span className="label">{tag}</span>
        </TagChipButton>
      ))}
      {hasActiveTag ? (
        <TrailingClear type="button" onClick={clearTag}>
          Clear
        </TrailingClear>
      ) : null}
    </Wrapper>
  )
}

export default TagChips

const Wrapper = styled.div<{ $inDock?: boolean }>`
  display: flex;
  align-items: center;

  ${({ $inDock, theme }) =>
    $inDock
      ? `
    flex: 1;
    min-width: 0;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    gap: 0.4375rem;
    padding: 0.125rem 0;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    &::-webkit-scrollbar { display: none; }
  `
      : `
    flex-wrap: wrap;
    gap: 0.375rem;
    position: sticky;
    top: ${FEED_TAG_CHIPS_STICKY_TOP};
    z-index: 20;
    margin-bottom: 0.75rem;
    padding-top: 0.5rem;
    padding-bottom: 0.75rem;
    background: ${theme.brand.surface};
    border-bottom: 1px solid ${theme.brand.borderSoft};
    box-shadow: ${theme.brand.shadowSm};

    ${feedDesktopMinMedia} { display: none; }

    @media (max-width: 1023px) {
      flex-wrap: nowrap;
      overflow-x: auto;
      overflow-y: hidden;
      gap: 0.5rem;
      padding-bottom: 0.625rem;
      margin-left: -0.25rem;
      margin-right: -0.25rem;
      padding-left: 0.25rem;
      padding-right: 0.25rem;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: thin;
      scrollbar-color: ${theme.brand.border} transparent;
      &::-webkit-scrollbar { height: 5px; }
      &::-webkit-scrollbar-thumb {
        background: ${theme.brand.border};
        border-radius: 999px;
      }
    }
  `}
`

const TrailingClear = styled(TagChipClearButton)`
  flex-shrink: 0;

  @media (max-width: 1023px) {
    position: sticky;
    right: 0;
    z-index: 2;
    margin-left: auto;
    box-shadow: -10px 0 14px -2px ${({ theme }) => theme.brand.surface};
  }
`
