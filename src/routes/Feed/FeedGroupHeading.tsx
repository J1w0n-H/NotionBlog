import styled from "@emotion/styled"
import type { CSSProperties, ReactNode } from "react"
import { descriptionForCategory } from "src/constants/categoryDescriptions"

type Props = {
  title: string
  count?: number
  /** Override the auto-resolved category description. */
  description?: string
  style?: CSSProperties
  actions?: ReactNode
}

/**
 * v2 group heading — title is a display-weight 1.5rem line with a crimson
 * left bar, an inline count, and a one-line mono subtitle pulled from
 * `descriptionForCategory()`. A dashed border-bottom marks the boundary
 * between heading and the card grid that follows.
 */
export function FeedGroupHeading({
  title,
  count,
  description,
  style,
  actions,
}: Props) {
  const subtitle = description ?? descriptionForCategory(title)

  return (
    <Wrapper style={style}>
      <Row>
        <TitleBlock>
          <Title>{title}</Title>
          {count != null ? <Count>{count}</Count> : null}
        </TitleBlock>
        {actions}
      </Row>
      {subtitle ? <Subtitle>{subtitle}</Subtitle> : null}
    </Wrapper>
  )
}

const Wrapper = styled.header`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px dashed ${({ theme }) => theme.brand.borderSoft};
`

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.625rem;
`

const TitleBlock = styled.div`
  position: relative;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  padding-left: 0.75rem;
  min-width: 0;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0.16em;
    bottom: 0.16em;
    width: 3px;
    border-radius: 2px;
    background: ${({ theme }) => theme.brand.accent};
  }
`

const Title = styled.h2`
  margin: 0;
  min-width: 0;
  font-family: ${({ theme }) => theme.brand.fontDisplay};
  font-size: 1.5rem;
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.brand.text};
`

const Count = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.brand.textMuted};
`

const Subtitle = styled.p`
  margin: 0;
  padding-left: 0.75rem;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.6875rem;
  letter-spacing: 0.02em;
  color: ${({ theme }) => theme.brand.textFaint};
`

export const FeedGroupActions = styled.div`
  flex-shrink: 0;
  margin-left: auto;
`
