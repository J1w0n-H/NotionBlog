import { useRouter } from "next/router"
import React, { useMemo } from "react"
import styled from "@emotion/styled"
import { parseQueryTagParam, tagFamilyKey } from "src/libs/utils/normalizeTag"
import { buildQueryForTagChipClick } from "src/libs/utils/tagFilterQuery"
import { useTagsQuery } from "src/hooks/useTagsQuery"
import { hueFromString } from "src/constants/tagHue"
import { FEED_TAG_CHIPS_STICKY_TOP } from "src/libs/utils/feedScrollOffset"

type Props = {
  /** How many tag chips to show (global frequency, descending). */
  limit?: number
}

const TagChips: React.FC<Props> = ({ limit = 12 }) => {
  const router = useRouter()
  const current = parseQueryTagParam(router.query.tag)
  const currentFam = current ? tagFamilyKey(current) : undefined
  const data = useTagsQuery()

  const topTags = useMemo(() => {
    return Object.entries(data)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
  }, [data, limit])

  const onClick = (tag: string) => {
    router.push({
      pathname: router.pathname,
      query: buildQueryForTagChipClick(router.query, tag),
    })
  }

  if (topTags.length === 0) return null

  return (
    <Wrapper aria-label="Top tags">
      {topTags.map(([tag, count]) => (
        <Chip
          key={tag}
          type="button"
          $hue={hueFromString(tag)}
          aria-pressed={
            currentFam != null && currentFam === tagFamilyKey(tag)
              ? "true"
              : "false"
          }
          data-active={
            currentFam != null && currentFam === tagFamilyKey(tag)
          }
          onClick={() => onClick(tag)}
          title={`${tag} (${count})`}
        >
          <span className="label">{tag}</span>
          <span className="count">{count}</span>
        </Chip>
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
  box-shadow: 0 1px 0 oklch(0 0 0 / 0.04);

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
      border-radius: 999px;
    }
  }
`

const Chip = styled.button<{ $hue: number }>`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 999px;
  border: 1px solid transparent;
  font-family: ${({ theme }) => theme.brand.fontSans};
  font-size: 0.8125rem;
  cursor: pointer;
  background: transparent;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease,
    transform 0.15s ease, opacity 0.15s ease, filter 0.15s ease;

  ${({ theme, $hue }) =>
    theme.scheme === "dark"
      ? `
    border-color: oklch(0.72 0.10 ${$hue} / 0.48);
    color: oklch(0.72 0.10 ${$hue});
  `
      : `
    border-color: oklch(0.62 0.08 ${$hue} / 0.52);
    color: oklch(0.45 0.10 ${$hue});
  `}

  &:not([data-active="true"]):hover {
    ${({ theme, $hue }) =>
      theme.scheme === "dark"
        ? `
      background: oklch(0.30 0.07 ${$hue} / 0.55);
    `
        : `
      background: oklch(0.62 0.08 ${$hue} / 0.12);
    `}
    transform: translateY(-1px);
    filter: none;
  }

  &[data-active="true"] {
    ${({ theme, $hue }) =>
      theme.scheme === "dark"
        ? `
      background: oklch(0.34 0.10 ${$hue} / 0.72);
      border-color: oklch(0.78 0.12 ${$hue} / 0.55);
      color: oklch(0.94 0.04 ${$hue});
    `
        : `
      background: oklch(0.62 0.08 ${$hue} / 0.22);
      border-color: oklch(0.42 0.11 ${$hue});
      color: oklch(0.28 0.12 ${$hue});
    `}
    font-weight: 600;
    box-shadow: 0 2px 8px oklch(0 0 0 / 0.07);
    .count {
      color: inherit;
      opacity: 0.85;
    }
  }

  &[data-active="true"]:hover {
    ${({ theme, $hue }) =>
      theme.scheme === "dark"
        ? `
      background: oklch(0.38 0.11 ${$hue} / 0.78);
      border-color: oklch(0.82 0.11 ${$hue} / 0.6);
    `
        : `
      background: oklch(0.58 0.09 ${$hue} / 0.28);
      border-color: oklch(0.36 0.12 ${$hue});
    `}
    transform: translateY(-1px);
    filter: none;
  }

  &:focus-visible {
    ${({ $hue }) => `
    outline: 2px solid oklch(0.48 0.14 ${$hue} / 0.55);
    outline-offset: 2px;
    `}
  }

  &[data-active="true"]:focus-visible {
    ${({ $hue }) => `
    outline-color: oklch(0.42 0.12 ${$hue});
    `}
  }

  .label {
    flex: 0 1 auto;
    min-width: 0;
    text-align: left;
    white-space: nowrap;
  }

  @media (min-width: 1024px) {
    .label {
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .count {
    flex-shrink: 0;
    font-family: ${({ theme }) => theme.brand.fontMono};
    font-size: 0.6875rem;
    opacity: 0.9;
    color: inherit;
    white-space: nowrap;
    line-height: 1rem;
    min-width: 1.125rem;
    text-align: center;
    padding-inline-start: 0.0625rem;
  }
`
