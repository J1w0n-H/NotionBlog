import styled from "@emotion/styled"
import { useRouter } from "next/router"
import React from "react"
import { catVars } from "src/constants/categoryColors"
import { tokenForTagIndex } from "src/constants/tagPalette"
import { useTagIndex } from "src/hooks/useTagIndex"
import { parseQueryTagParam, tagFamilyKey } from "src/libs/utils/normalizeTag"
import { buildQueryForTagLink } from "src/libs/utils/tagFilterQuery"

type Props = {
  children: string
}

/**
 * Outline-only post-card tag. Color comes from the shared 8-slot category
 * palette indexed by stable alphabet order — the SAME palette categories use,
 * but rendered as outline so category (fill) vs tag (line) read distinctly
 * even when they share a hue.
 */
const Tag: React.FC<Props> = ({ children }) => {
  const router = useRouter()
  const tagIndex = useTagIndex()
  const active = parseQueryTagParam(router.query.tag)
  const isActive =
    active != null && tagFamilyKey(active) === tagFamilyKey(children)

  const idx = tagIndex.get(children) ?? -1
  const token = tokenForTagIndex(idx)
  const style = catVars(token)

  const handleClick = (value: string) => {
    router.push({
      pathname: router.pathname,
      query: buildQueryForTagLink(router.query, value),
    })
  }

  return (
    <StyledWrapper
      type="button"
      style={style}
      data-active={isActive}
      onClick={() => handleClick(children)}
    >
      {children}
    </StyledWrapper>
  )
}

export default Tag

const StyledWrapper = styled.button`
  appearance: none;
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.55rem;
  border-radius: var(--radius-pill);
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 400;
  font-family: ${({ theme }) => theme.brand.fontSans};
  cursor: pointer;
  background: transparent;
  border: 1px solid oklch(from var(--cat-color) l c h / 0.55);
  color: var(--cat-color);
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    transform 0.15s ease,
    font-weight 0.15s ease;

  &:hover {
    background: oklch(from var(--cat-color) l c h / 0.1);
    transform: translateY(-1px);
  }

  &[data-active="true"] {
    background: oklch(from var(--cat-color) l c h / 0.15);
    border-width: 1.5px;
    border-color: var(--cat-color);
    font-weight: 600;
  }

  &:focus-visible {
    outline: 2px solid oklch(from var(--cat-color) l c h / 0.55);
    outline-offset: 2px;
  }
`
