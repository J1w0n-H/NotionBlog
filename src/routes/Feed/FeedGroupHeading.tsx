import styled from "@emotion/styled"
import type { CSSProperties, ReactNode } from "react"

type Props = {
  title: string
  count?: number
  style?: CSSProperties
  actions?: ReactNode
}

export function FeedGroupHeading({ title, count, style, actions }: Props) {
  return (
    <Header style={style}>
      <Marker aria-hidden="true" />
      <Title>{title}</Title>
      {count != null ? <Count>{count}</Count> : null}
      {actions}
    </Header>
  )
}

const Header = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.625rem;
`

const Marker = styled.span`
  width: 6px;
  height: 18px;
  border-radius: var(--radius-sm);
  background: var(--cat-color);
`

const Title = styled.h2`
  margin: 0;
  min-width: 0;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.35;
  color: ${({ theme }) => theme.brand.text};
`

const Count = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border: 1px solid var(--cat-ring);
  border-radius: var(--radius-pill);
  color: var(--cat-color);
  background: var(--cat-soft);
`

export const FeedGroupActions = styled.div`
  flex-shrink: 0;
  margin-left: auto;
`
