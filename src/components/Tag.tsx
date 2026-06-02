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
  font-size: 0.6875rem;
  line-height: 1rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  font-family: ${({ theme }) => theme.brand.fontMono};
  cursor: pointer;
  background: ${({ theme }) => theme.brand.surface};
  border: 1px solid ${({ theme }) => theme.brand.border};
  color: ${({ theme }) => theme.brand.textFaint};
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.brand.text};
    border-color: ${({ theme }) => theme.brand.borderStrong};
  }

  &[data-active="true"] {
    color: ${({ theme }) => theme.brand.link};
    border-color: ${({ theme }) => theme.brand.link};
    box-shadow: var(--glow-cy, 0 0 10px rgba(47,230,255,.40));
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.brand.accentRing};
    outline-offset: 2px;
  }
`
