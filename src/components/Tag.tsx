import styled from "@emotion/styled"
import { useRouter } from "next/router"
import React from "react"
import { hueFromString } from "src/constants/tagHue"

type Props = {
  children: string
}

/** Post-card tags: outline-only (카테고리 = 면, 태그 = 선). */
const Tag: React.FC<Props> = ({ children }) => {
  const router = useRouter()
  const handleClick = (value: string) => {
    router.push(`/?tag=${encodeURIComponent(value)}`)
  }

  return (
    <StyledWrapper
      type="button"
      $hue={hueFromString(children)}
      onClick={() => handleClick(children)}
    >
      {children}
    </StyledWrapper>
  )
}

export default Tag

const StyledWrapper = styled.button<{ $hue: number }>`
  appearance: none;
  border-style: solid;
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 400;
  font-family: ${({ theme }) => theme.brand.fontSans};
  cursor: pointer;
  background: transparent;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease,
    transform 0.15s ease;

  ${({ theme, $hue }) =>
    theme.scheme === "dark"
      ? `
    border: 1px solid oklch(0.72 0.10 ${$hue} / 0.48);
    color: oklch(0.72 0.10 ${$hue});
    &:hover {
      background: oklch(0.30 0.07 ${$hue} / 0.55);
      transform: translateY(-1px);
    }
    &:focus-visible {
      outline: 2px solid oklch(0.72 0.10 ${$hue});
      outline-offset: 2px;
    }
  `
      : `
    border: 1px solid oklch(0.62 0.08 ${$hue} / 0.52);
    color: oklch(0.45 0.10 ${$hue});
    &:hover {
      background: oklch(0.62 0.08 ${$hue} / 0.12);
      transform: translateY(-1px);
    }
    &:focus-visible {
      outline: 2px solid oklch(0.45 0.10 ${$hue});
      outline-offset: 2px;
    }
  `}
`
