import { useRouter } from "next/router"
import React from "react"
import styled from "@emotion/styled"
import { useCategoriesQuery } from "src/hooks/useCategoriesQuery"
import { parseQueryCategoryParam } from "src/libs/utils/normalizeTag"

const CategoryChips: React.FC = () => {
  const router = useRouter()
  const data = useCategoriesQuery()
  const current = parseQueryCategoryParam(router.query.category)

  const onClick = (category: string) => {
    router.push({ query: { ...router.query, category } })
  }

  return (
    <Wrapper>
      {Object.entries(data).map(([key, count]) => (
        <Chip
          key={key}
          data-active={current === key}
          onClick={() => onClick(key)}
        >
          {key}<span className="count">{count}</span>
        </Chip>
      ))}
    </Wrapper>
  )
}

export default CategoryChips

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
    .count { color: ${({ theme }) => theme.brand.textOnAccent}; opacity: 0.7; }
  }
  .count {
    font-family: ${({ theme }) => theme.brand.fontMono};
    font-size: 0.6875rem;
    color: ${({ theme }) => theme.brand.textFaint};
  }
`
