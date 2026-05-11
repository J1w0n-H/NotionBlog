import { useRouter } from "next/router"
import React, { useMemo } from "react"
import styled from "@emotion/styled"
import { parseQueryTagParam, tagFamilyKey } from "src/libs/utils/normalizeTag"
import { buildQueryForTagChipClick } from "src/libs/utils/tagFilterQuery"
import { useTagsQuery } from "src/hooks/useTagsQuery"
import { hueFromString } from "src/constants/tagHue"

type Props = {
  limit?: number
  /** tags to hide from top chips (generic buckets) */
  exclude?: string[]
}

const DEFAULT_EXCLUDE = ["Tech", "Activities", "Pinned"]

const TagChips: React.FC<Props> = ({ limit = 12, exclude = DEFAULT_EXCLUDE }) => {
  const router = useRouter()
  const current = parseQueryTagParam(router.query.tag)
  const currentFam = current ? tagFamilyKey(current) : undefined
  const data = useTagsQuery()

  const topTags = useMemo(() => {
    const ex = new Set(exclude.map((t) => t.toLowerCase()))
    return Object.entries(data)
      .filter(([tag]) => !ex.has(tag.toLowerCase()))
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
  }, [data, exclude, limit])

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
  top: 5.75rem;
  z-index: 20;
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: 0.75rem;
  padding-top: 0.25rem;
  padding-bottom: 0.75rem;
  background: ${({ theme }) => theme.brand.bg};
  border-bottom: 1px solid ${({ theme }) => theme.brand.borderSoft};
  box-shadow: 0 1px 0 oklch(0 0 0 / 0.03);

  @media (max-width: 768px) {
    top: 4.5rem;
  }
`

const Chip = styled.button<{ $hue: number }>`
  display: inline-flex;
  align-items: center;
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
    background: ${({ theme }) => theme.brand.accent};
    border-color: ${({ theme }) => theme.brand.accent};
    color: ${({ theme }) => theme.brand.textOnAccent};
    .count {
      color: inherit;
      opacity: 0.75;
    }
  }

  /* Selected hover: 브랜드 톤만 살짝 — outline hover와 패턴 분리 */
  &[data-active="true"]:hover {
    background: ${({ theme }) => theme.brand.accentHover};
    border-color: ${({ theme }) => theme.brand.accentHover};
    color: ${({ theme }) => theme.brand.textOnAccent};
    transform: translateY(-1px);
    filter: none;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.brand.accentRing};
    outline-offset: 2px;
  }

  &[data-active="true"]:focus-visible {
    outline-color: ${({ theme }) => theme.brand.textOnAccent};
  }

  .label {
    flex: 1 1 auto;
    min-width: 0;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
