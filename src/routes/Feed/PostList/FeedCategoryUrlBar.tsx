import { useRouter } from "next/router"
import React, { useCallback } from "react"
import styled from "@emotion/styled"

type Props = { categoryLabel: string }

/** Post 카드 등으로 `?category=`가 켜졌을 때만 사용 — 드롭다운이 숨겨진 피드에서 복귀용 */
const FeedCategoryUrlBar: React.FC<Props> = ({ categoryLabel }) => {
  const router = useRouter()

  const clearCategory = useCallback(() => {
    const next = { ...router.query }
    delete next.category
    router.push({ pathname: router.pathname, query: next })
  }, [router])

  return (
    <Bar>
      <span className="label">
        Category: <strong>{categoryLabel}</strong>
      </span>
      <ClearBtn type="button" onClick={clearCategory}>
        All categories
      </ClearBtn>
    </Bar>
  )
}

export default FeedCategoryUrlBar

const Bar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.75rem;
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  background: ${({ theme }) => theme.brand.surface2};
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.brand.textMuted};
  .label strong {
    color: ${({ theme }) => theme.brand.text};
    font-weight: 600;
  }
`

const ClearBtn = styled.button`
  padding: 0.25rem 0.65rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.brand.border};
  background: ${({ theme }) => theme.brand.surface};
  color: ${({ theme }) => theme.brand.link};
  font-size: 0.8125rem;
  cursor: pointer;
  &:hover {
    border-color: ${({ theme }) => theme.brand.link};
    background: ${({ theme }) => theme.brand.linkSoft};
  }
`
