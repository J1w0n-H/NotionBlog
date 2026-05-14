import { CONFIG } from "site.config"
import Tag from "src/components/Tag"
import { TPost } from "src/types"
import { formatDate } from "src/libs/utils"
import { estimateReadingMinutesFromPost } from "src/libs/utils/estimateReadingMinutes"
import { catVars, tokenForCategory } from "src/constants/categoryColors"
import Image from "next/image"
import Link from "next/link"
import React from "react"
import styled from "@emotion/styled"
import { useRouter } from "next/router"
import { HiOutlineExternalLink } from "react-icons/hi"

type Props = {
  data: TPost
  titleId?: string
}

const PostHeader: React.FC<Props> = ({ data, titleId }) => {
  const router = useRouter()
  const category = (data.category && data.category[0]) || undefined
  const token = tokenForCategory(category)
  const chipStyle = catVars(token)
  const summary = data.summary?.trim()
  const readingMinutes = estimateReadingMinutesFromPost(data)
  const summaryWords = summary
    ? summary.split(/\s+/).filter(Boolean).length
    : 0
  const dateValue = data?.date?.start_date || data.createdTime
  const fullPageUrl = `${String(CONFIG.link).replace(/\/+$/, "")}/${data.slug}`

  const onCategoryClick = () => {
    if (!category) return
    router.push({
      pathname: "/",
      query: { ...router.query, category },
    })
  }

  return (
    <StyledWrapper>
      <MetaTop $onlyLink={!category}>
        {category ? (
          <ChipWrap style={chipStyle}>
            <button type="button" className="catChip" onClick={onCategoryClick}>
              {category}
            </button>
          </ChipWrap>
        ) : null}
        <FullPageLink
          href={fullPageUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Open in full page</span>
          <HiOutlineExternalLink aria-hidden="true" />
        </FullPageLink>
      </MetaTop>

      <h1 className="title" id={titleId}>
        {data.title}
      </h1>

      {summary ? <p className="lead">{summary}</p> : null}

      {data.type[0] !== "Paper" && (
        <MetaStrip>
          {data.author && data.author[0] && data.author[0].name && (
            <>
              <span className="author">
                <Image
                  css={{ borderRadius: "50%" }}
                  src={data.author[0].profile_photo || CONFIG.profile.image}
                  alt=""
                  width={24}
                  height={24}
                />
                <span className="authorNames">
                  <span>{data.author[0].name}</span>
                  {data.author[0].name === CONFIG.profile.name &&
                  CONFIG.profile.role ? (
                    <span className="role">{CONFIG.profile.role}</span>
                  ) : null}
                </span>
              </span>
              <span className="dot" aria-hidden="true">
                ·
              </span>
            </>
          )}
          <time className="date" dateTime={dateValue}>
            {formatDate(dateValue, CONFIG.lang)}
          </time>
          {readingMinutes ? (
            <>
              <span className="dot" aria-hidden="true">
                ·
              </span>
              <span className="read">{readingMinutes} min read</span>
            </>
          ) : null}
          {summaryWords > 0 ? (
            <>
              <span className="dot" aria-hidden="true">
                ·
              </span>
              <span className="read" title="From summary; approximate">
                ~{summaryWords.toLocaleString()} words
              </span>
            </>
          ) : null}
          {data.tags && data.tags.length > 0 ? (
            <>
              <span className="dot" aria-hidden="true">
                ·
              </span>
              <TagRow>
                {data.tags.map((tag: string) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </TagRow>
            </>
          ) : null}
        </MetaStrip>
      )}
    </StyledWrapper>
  )
}

export default PostHeader

const StyledWrapper = styled.header`
  margin-bottom: 2rem;

  .title {
    margin: 0;
    font-family: ${({ theme }) => theme.brand.fontDisplay};
    font-size: 2.25rem;
    line-height: 1.15;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: ${({ theme }) => theme.brand.text};
  }

  .lead {
    margin: 0.75rem 0 0;
    font-size: 1.125rem;
    line-height: 1.55;
    font-style: italic;
    color: ${({ theme }) => theme.brand.textMuted};
  }
`

const MetaTop = styled.div<{ $onlyLink: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $onlyLink }) =>
    $onlyLink ? "flex-end" : "space-between"};
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  min-height: 1.5rem;
`

const ChipWrap = styled.span`
  .catChip {
    padding: 0.2rem 0.55rem;
    border: 1px solid var(--cat-ring);
    border-radius: var(--radius-pill);
    font-size: 0.75rem;
    font-weight: 600;
    line-height: 1.1;
    letter-spacing: 0.01em;
    cursor: pointer;
    color: var(--cat-color);
    background: ${({ theme }) => theme.brand.surface2};
    font-family: ${({ theme }) => theme.brand.fontSans};
    transition: border-color ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease};

    &:hover {
      border-color: var(--cat-color);
    }
  }
`

const FullPageLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  flex-shrink: 0;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  text-decoration: none;
  color: ${({ theme }) => theme.brand.textMuted};

  &:hover {
    color: ${({ theme }) => theme.brand.accent};
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  svg {
    width: 0.95rem;
    height: 0.95rem;
  }
`

const MetaStrip = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem 0.5rem;
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.brand.borderSoft};
  font-size: 0.8125rem;
  line-height: 1.4;
  color: ${({ theme }) => theme.brand.textMuted};

  .author {
    display: inline-flex;
    align-items: flex-start;
    gap: 0.45rem;
    font-weight: 500;
    color: ${({ theme }) => theme.brand.text};
  }

  .authorNames {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.1rem;
    min-width: 0;
  }

  .role {
    font-size: 0.6875rem;
    font-weight: 500;
    line-height: 1.2;
    color: ${({ theme }) => theme.brand.textFaint};
  }

  .date,
  .read {
    font-family: ${({ theme }) => theme.brand.fontMono};
    font-size: 0.75rem;
    color: ${({ theme }) => theme.brand.textFaint};
  }

  .dot {
    color: ${({ theme }) => theme.brand.border};
    user-select: none;
  }
`

const TagRow = styled.span`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  align-items: center;
  vertical-align: middle;
`
