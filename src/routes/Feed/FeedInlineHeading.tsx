import styled from "@emotion/styled"
import type { ReactNode } from "react"

type Props = {
  children: ReactNode
}

export function FeedInlineHeading({ children }: Props) {
  return <Heading>{children}</Heading>
}

const Heading = styled.h2`
  margin: 0 0 0.75rem;
  padding: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.textMuted};
`
