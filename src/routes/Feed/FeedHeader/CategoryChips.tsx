import { useRouter } from "next/router"
import React from "react"
import styled from "@emotion/styled"
import { DEFAULT_CATEGORY } from "src/constants"
import { useCategoriesQuery } from "src/hooks/useCategoriesQuery"

const CategoryChips: React.FC = () => {
  const router = useRouter()
  const data = useCategoriesQuery()
  const current = `${router.query.category || ``}` || DEFAULT_CATEGORY

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
  border: 1px solid ${({ theme }) => theme.colors.gray6};
  background: transparent;
  color: ${({ theme }) => theme.colors.gray11};
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.15s ease;
  &:hover {
    background: ${({ theme }) => theme.colors.gray3};
    color: ${({ theme }) => theme.colors.gray12};
  }
  &[data-active="true"] {
    background: ${({ theme }) => theme.colors.gray12};
    border-color: ${({ theme }) => theme.colors.gray12};
    color: ${({ theme }) => theme.colors.gray1};
    .count { color: ${({ theme }) => theme.colors.gray1}; opacity: 0.7; }
  }
  .count {
    font-family: ui-monospace, "JetBrains Mono", Menlo, monospace;
    font-size: 0.6875rem;
    color: ${({ theme }) => theme.colors.gray10};
  }
`
