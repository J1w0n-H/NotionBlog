import styled from "@emotion/styled"
import { useRouter } from "next/router"
import React from "react"
import { hueFromString } from "src/constants/tagHue"

type Props = {
  children: string
}

const Tag: React.FC<Props> = ({ children }) => {
  const router = useRouter()
  const handleClick = (value: string) => {
    router.push(`/?tag=${encodeURIComponent(value)}`)
  }

  return (
    <StyledWrapper $hue={hueFromString(children)} onClick={() => handleClick(children)}>
      {children}
    </StyledWrapper>
  )
}

export default Tag

const StyledWrapper = styled.div<{ $hue: number }>`
  padding: 0.25rem 0.5rem;
  border-radius: 50px;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 400;
  font-family: ${({ theme }) => theme.brand.fontSans};
  cursor: pointer;
  transition: filter 0.15s ease, transform 0.15s ease;
  ${({ theme, $hue }) =>
    theme.scheme === "dark"
      ? `
    background: oklch(0.28 0.07 ${$hue});
    border: 1px solid oklch(0.45 0.12 ${$hue});
    color: oklch(0.93 0.04 ${$hue});
  `
      : `
    background: oklch(0.95 0.045 ${$hue});
    border: 1px solid oklch(0.82 0.085 ${$hue});
    color: oklch(0.38 0.12 ${$hue});
  `}
  &:hover {
    filter: brightness(1.06);
    transform: translateY(-1px);
  }
`
