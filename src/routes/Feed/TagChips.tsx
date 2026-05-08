import { useRouter } from "next/router"
import React, { useMemo } from "react"
import styled from "@emotion/styled"
import { useTagsQuery } from "src/hooks/useTagsQuery"

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

const Chip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.brand.border};
  background: transparent;
  color: ${({ theme }) => theme.brand.textMuted};
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.15s ease;
  &:hover {
    background: ${({ theme }) => theme.brand.surface2};
    color: ${({ theme }) => theme.brand.text};
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
  .count {
    font-family: ${({ theme }) => theme.brand.fontMono};
    font-size: 0.6875rem;
    color: ${({ theme }) => theme.brand.textFaint};
  }
`

