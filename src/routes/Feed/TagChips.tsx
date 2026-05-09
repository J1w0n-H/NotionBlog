import { useRouter } from "next/router"
import React, { useMemo } from "react"
import styled from "@emotion/styled"
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
  const current = `${router.query.tag || ``}` || undefined
  const data = useTagsQuery()

  const topTags = useMemo(() => {
    const ex = new Set(exclude.map((t) => t.toLowerCase()))
    return Object.entries(data)
      .filter(([tag]) => !ex.has(tag.toLowerCase()))
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
  }, [data, exclude, limit])

  const onClick = (tag: string) => {
    router.push({ query: { ...router.query, tag: current === tag ? undefined : tag } })
  }

  if (topTags.length === 0) return null

  return (
    <Wrapper aria-label="Top tags">
      {topTags.map(([tag, count]) => (
        <Chip
          key={tag}
          type="button"
          $hue={hueFromString(tag)}
          data-active={current === tag}
          onClick={() => onClick(tag)}
          title={`${tag} (${count})`}
        >
          {tag}
          <span className="count">{count}</span>
        </Chip>
      ))}
    </Wrapper>
  )
}

export default TagChips

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: 1rem;
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
  transition: transform 0.15s ease, filter 0.15s ease;

  ${({ theme, $hue }) =>
    theme.scheme === "dark"
      ? `
    border-color: oklch(0.42 0.11 ${$hue});
    background: oklch(0.26 0.065 ${$hue});
    color: oklch(0.92 0.04 ${$hue});
  `
      : `
    border-color: oklch(0.82 0.085 ${$hue});
    background: oklch(0.95 0.045 ${$hue});
    color: oklch(0.36 0.11 ${$hue});
  `}

  &:hover {
    filter: brightness(1.05);
    transform: translateY(-1px);
  }

  &[data-active="true"] {
    background: ${({ theme }) => theme.brand.accent};
    border-color: ${({ theme }) => theme.brand.accent};
    color: ${({ theme }) => theme.brand.textOnAccent};
    .count {
      color: ${({ theme }) => theme.brand.textOnAccent};
      opacity: 0.7;
    }
  }
  &[data-active="true"]:hover {
    filter: brightness(1.06);
  }
  .count {
    font-family: ${({ theme }) => theme.brand.fontMono};
    font-size: 0.6875rem;
    opacity: 0.85;
    color: inherit;
    filter: none;
  }
`

