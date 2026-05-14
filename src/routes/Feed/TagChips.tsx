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
}

const TagChips: React.FC<Props> = ({ limit = 12 }) => {
  const { topTags, onClick, isActive, clearTag, hasActiveTag, indexFor } =
    useFeedTagChips(limit)

  if (topTags.length === 0) return null

  return (
    <Wrapper aria-label="Top tags">
      {hasActiveTag ? (
        <TagChipClearButton type="button" onClick={clearTag}>
          Clear
        </TagChipClearButton>
      ) : null}
      {topTags.map(([tag, count]) => (
        <TagChipButton
          key={tag}
          type="button"
          style={catVars(tokenForTagIndex(indexFor(tag)))}
          aria-pressed={isActive(tag) ? "true" : "false"}
          data-active={isActive(tag) ? "true" : "false"}
          onClick={() => onClick(tag)}
          title={`${tag} (${count})`}
        >
          <span className="label">{tag}</span>
          <span className="count">{count}</span>
        </TagChipButton>
      ))}
    </Wrapper>
  )
}

export default TagChips

const Wrapper = styled.div`
  position: sticky;
  top: ${FEED_TAG_CHIPS_STICKY_TOP};
  z-index: 20;
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: 0.75rem;
  padding-top: 0.25rem;
  padding-bottom: 0.75rem;
  background: ${({ theme }) => theme.brand.surface};
  border-bottom: 1px solid ${({ theme }) => theme.brand.borderSoft};
  box-shadow: ${({ theme }) => theme.brand.shadowSm};

  ${feedDesktopMinMedia} {
    display: none;
  }

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
    scrollbar-color: ${({ theme }) =>
      `${theme.brand.border} transparent`};
    &::-webkit-scrollbar {
      height: 5px;
    }
    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.brand.border};
      border-radius: var(--radius-pill);
    }
  }
`
