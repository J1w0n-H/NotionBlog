import { useRouter } from "next/router"
import React, { useMemo } from "react"
import styled from "@emotion/styled"
import { hueFromString } from "src/constants/tagHue"
import { useTagsQuery } from "src/hooks/useTagsQuery"
import { buildQueryForTagChipClick } from "src/libs/utils/tagFilterQuery"
import { parseQueryTagParam, tagFamilyKey } from "src/libs/utils/normalizeTag"
import { feedDesktopMinMedia } from "src/styles/feedBreakpoints"

type Props = {
  limit?: number
}

const TagSidebar: React.FC<Props> = ({ limit = 16 }) => {
  const router = useRouter()
  const current = parseQueryTagParam(router.query.tag)
  const currentFam = current ? tagFamilyKey(current) : undefined
  const data = useTagsQuery()

  const topTags = useMemo(() => {
    return Object.entries(data)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
  }, [data, limit])

  const onClick = (tag: string) => {
    router.push({
      pathname: router.pathname,
      query: buildQueryForTagChipClick(router.query, tag),
    })
  }

  if (topTags.length === 0) return null

  return (
    <Shell aria-label="Feed tags">
      <Box>
        <Title>Tags</Title>
        <List>
          {topTags.map(([tag, count]) => {
            const active =
              currentFam != null && currentFam === tagFamilyKey(tag)

            return (
              <Item
                key={tag}
                type="button"
                $hue={hueFromString(tag)}
                data-active={active ? "true" : "false"}
                aria-pressed={active ? "true" : "false"}
                onClick={() => onClick(tag)}
                title={`${tag} (${count})`}
              >
                <Swatch aria-hidden="true" />
                <span className="label">{tag}</span>
                <Count>{count}</Count>
              </Item>
            )
          })}
        </List>
      </Box>
    </Shell>
  )
}

export default TagSidebar

const Shell = styled.div`
  display: none;

  ${feedDesktopMinMedia} {
    display: block;
    margin-top: 0.75rem;
  }
`

const Box = styled.div`
  border-radius: var(--radius-lg);
  background: ${({ theme }) => theme.brand.surface};
  border: 1px solid ${({ theme }) => theme.brand.border};
  padding: 0.75rem;
  box-shadow: ${({ theme }) => theme.brand.shadowSm};
`

const Title = styled.div`
  font-size: 0.6875rem;
  font-weight: 750;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.textMuted};
  margin-bottom: 0.625rem;
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  max-height: 16rem;
  overflow-y: auto;
  padding-right: 0.125rem;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => `${theme.brand.border} transparent`};

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.brand.border};
    border-radius: var(--radius-pill);
  }
`

const Swatch = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 3px;
  flex-shrink: 0;
  background: currentColor;
  opacity: 0.9;
  transition: transform 0.12s ease;
`

const Count = styled.span`
  flex-shrink: 0;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.6875rem;
  line-height: 1rem;
  min-width: 1.125rem;
  text-align: center;
  opacity: 0.85;
`

const Item = styled.button<{ $hue: number }>`
  text-align: left;
  width: 100%;
  padding: 0.5rem 0.625rem;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition:
    background 0.12s ease,
    border-color 0.12s ease,
    box-shadow 0.12s ease,
    transform 0.12s ease;

  ${({ theme, $hue }) =>
    theme.scheme === "dark"
      ? `
    color: oklch(0.72 0.10 ${$hue});
  `
      : `
    color: oklch(0.45 0.10 ${$hue});
  `}

  .label {
    flex: 1;
    min-width: 0;
    font-size: 0.8125rem;
    font-weight: 500;
    line-height: 1.25;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
  }

  &:hover {
    transform: translateX(1px);
    ${({ theme, $hue }) =>
      theme.scheme === "dark"
        ? `
      background: oklch(0.30 0.07 ${$hue} / 0.55);
      border-color: oklch(0.72 0.10 ${$hue} / 0.48);
    `
        : `
      background: oklch(0.62 0.08 ${$hue} / 0.12);
      border-color: oklch(0.62 0.08 ${$hue} / 0.52);
    `}
  }

  &[data-active="true"] {
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
    box-shadow: ${({ theme }) => theme.brand.shadowSm};

    .label {
      font-weight: 700;
    }

    ${Swatch} {
      transform: scale(1.12);
    }
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.brand.accentRing};
    outline-offset: 2px;
  }
`
