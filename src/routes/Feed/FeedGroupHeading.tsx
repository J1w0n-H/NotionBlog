import styled from "@emotion/styled"
import type { CSSProperties, ReactNode } from "react"

type Props = {
  title: string
  count?: number
  style?: CSSProperties
  actions?: ReactNode
}

/**
 * v2 group heading — title is a display-weight 1.5rem line with a
 * per-category stripe on the left, an inline count, and a dashed
 * border-bottom marking the boundary between heading and card grid.
 *
 * The stripe uses `var(--cat-color)` (set by the caller via `catVars()`
 * on a wrapping element) so its hue matches the corresponding entry in
 * SectionNav and PostCard chips. No hard-coded accent or theme tokens.
 */
export function FeedGroupHeading({ title, count, style, actions }: Props) {
  return (
    <Wrapper style={style}>
      <Row>
        <TitleBlock>
          <Title>{title}</Title>
          {count != null ? <Count>{count}</Count> : null}
        </TitleBlock>
        {actions}
      </Row>
    </Wrapper>
  )
}

const Wrapper = styled.header`
  display: flex;
  flex-direction: column;
  padding-bottom: 0.25rem;
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
    background: linear-gradient(180deg, var(--link), var(--accent));
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
  font-size: 0.6875rem;
  font-weight: 500;
  color: var(--accent, ${({ theme }) => theme.brand.accent});
  border: 1px solid color-mix(in srgb, var(--accent) 40%, transparent);
  border-radius: 6px;
  padding: 1px 7px;
  line-height: 1.4;
`

export const FeedGroupActions = styled.div`
  flex-shrink: 0;
  margin-left: auto;
`
