import styled from "@emotion/styled"
import { useRouter } from "next/router"
import React from "react"
import { hueFromString } from "src/constants/tagHue"
import { buildQueryForTagLink } from "src/libs/utils/tagFilterQuery"
import { parseQueryTagParam, tagFamilyKey } from "src/libs/utils/normalizeTag"

type Props = {
  children: string
}

/** Post-card tags: outline-only; active = same hue as chips (no brand crimson). */
const Tag: React.FC<Props> = ({ children }) => {
  const router = useRouter()
  const active = parseQueryTagParam(router.query.tag)
  const isActive =
    active != null && tagFamilyKey(active) === tagFamilyKey(children)

  const handleClick = (value: string) => {
    router.push({
      pathname: router.pathname,
      query: buildQueryForTagLink(router.query, value),
    })
  }

  return (
    <StyledWrapper
      type="button"
      $hue={hueFromString(children)}
      data-active={isActive}
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
    transform 0.15s ease, font-weight 0.15s ease;

  ${({ theme, $hue }) =>
    theme.scheme === "dark"
      ? `
    border: 1px solid oklch(0.72 0.10 ${$hue} / 0.48);
    color: oklch(0.72 0.10 ${$hue});
    &:hover {
      background: oklch(0.30 0.07 ${$hue} / 0.55);
      transform: translateY(-1px);
    }
  `
      : `
    border: 1px solid oklch(0.62 0.08 ${$hue} / 0.52);
    color: oklch(0.45 0.10 ${$hue});
    &:hover {
      background: oklch(0.62 0.08 ${$hue} / 0.12);
      transform: translateY(-1px);
    }
  `}

  &[data-active="true"] {
    font-weight: 600;
    ${({ theme, $hue }) =>
      theme.scheme === "dark"
        ? `
      background: oklch(0.34 0.10 ${$hue} / 0.72);
      border-color: oklch(0.78 0.12 ${$hue} / 0.55);
      color: oklch(0.94 0.04 ${$hue});
    `
        : `
      background: oklch(0.62 0.08 ${$hue} / 0.22);
      border-color: oklch(0.42 0.11 ${$hue});
      color: oklch(0.28 0.12 ${$hue});
    `}
  }

  &:focus-visible {
    ${({ $hue }) => `
    outline: 2px solid oklch(0.48 0.14 ${$hue} / 0.55);
    outline-offset: 2px;
    `}
  }
`
