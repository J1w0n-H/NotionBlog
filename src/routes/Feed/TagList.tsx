import styled from "@emotion/styled"
import { useRouter } from "next/router"
import React from "react"
import { parseQueryTagParam, tagFamilyKey } from "src/libs/utils/normalizeTag"
import { buildQueryForTagChipClick } from "src/libs/utils/tagFilterQuery"
import { Emoji } from "src/components/Emoji"
import { useTagsQuery } from "src/hooks/useTagsQuery"

type Props = {}

const TagList: React.FC<Props> = () => {
  const router = useRouter()
  const currentTag = parseQueryTagParam(router.query.tag)
  const currentFam = currentTag ? tagFamilyKey(currentTag) : undefined
  const data = useTagsQuery()

  const handleClickTag = (value: string) => {
    router.push({
      pathname: router.pathname,
      query: buildQueryForTagChipClick(router.query, value),
    })
  }

  return (
    <StyledWrapper>
      <div className="top">
        <Emoji>🏷️</Emoji> Tags
      </div>
      <div className="list">
        {Object.keys(data).map((key) => (
          <a
            key={key}
            data-active={
              currentFam != null && currentFam === tagFamilyKey(key)
            }
            onClick={() => handleClickTag(key)}
          >
            {key}
          </a>
        ))}
      </div>
    </StyledWrapper>
  )
}

export default TagList

const StyledWrapper = styled.div`
  .top {
    display: none;
    padding: 0.25rem;
    margin-bottom: 0.75rem;

    @media (min-width: 1024px) {
      display: block;
    }
  }

  .list {
    display: flex;
    margin-bottom: 1.5rem;
    gap: 0.25rem;
    overflow: scroll;

    scrollbar-width: none;
    -ms-overflow-style: none;
    ::-webkit-scrollbar {
      width: 0;
      height: 0;
    }

    @media (min-width: 1024px) {
      display: block;
    }

    a {
      display: block;
      padding: 0.22rem 0.875rem;
      margin-top: 0.2rem;
      margin-bottom: 0.2rem;
      border-radius: var(--radius-pill, 999px);
      border: 1px solid ${({ theme }) => theme.brand.borderSoft};
      font-size: 0.8125rem;
      line-height: 1.4;
      color: ${({ theme }) => theme.brand.textMuted};
      flex-shrink: 0;
      cursor: pointer;
      transition:
        background 0.12s ease,
        border-color 0.12s ease,
        color 0.12s ease,
        box-shadow 0.12s ease;

      :hover {
        background-color: ${({ theme }) => theme.brand.surface2};
        border-color: ${({ theme }) => theme.brand.border};
        color: ${({ theme }) => theme.brand.text};
      }
      &[data-active="true"] {
        color: ${({ theme }) => theme.brand.link};
        border-color: ${({ theme }) => theme.brand.link};
        background: ${({ theme }) => theme.brand.surface2};
        box-shadow: var(--glow-cy, 0 0 10px rgba(47,230,255,.35));
      }
    }
  }
`
