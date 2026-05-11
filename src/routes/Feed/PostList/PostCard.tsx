import Link from "next/link"
import { CONFIG } from "site.config"
import { formatDate } from "src/libs/utils"
import Tag from "../../../components/Tag"
import { TPost } from "../../../types"
import Image from "next/image"
import styled from "@emotion/styled"
import { catVars, tokenForCategory } from "src/constants/categoryColors"
import { rememberFeedScrollPosition } from "src/libs/utils/feedScrollMemory"
import { buildPostHref } from "src/libs/utils/returnToFeed"
import { useFeedShell } from "src/routes/Feed/FeedShellContext"
import { useRouter } from "next/router"
import React from "react"

type Props = {
  data: TPost
}

const PostCard: React.FC<Props> = ({ data }) => {
  const router = useRouter()
  const { panelMode, activeSlug } = useFeedShell()
  const selectionOpen = panelMode === "post" && Boolean(activeSlug)
  const isActive = selectionOpen && data.slug === activeSlug
  const isDimmed = selectionOpen && data.slug !== activeSlug
  const category = (data.category && data.category?.[0]) || undefined
  const token = tokenForCategory(category)
  const style = catVars(token)
  const hasThumb = Boolean(data.thumbnail)

  const onClickCategory = (value: string) => {
    router.push({ query: { ...router.query, category: value } })
  }

  return (
    <StyledWrapper
      href={buildPostHref(data.slug, router.query)}
      scroll={false}
      onClick={() => rememberFeedScrollPosition()}
      data-active={isActive ? "true" : "false"}
      data-dimmed={isDimmed ? "true" : "false"}
    >
      <article style={style}>
        {category && (
          <div className="category">
            <button
              type="button"
              className="catChip"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onClickCategory(category)
              }}
            >
              {category}
            </button>
          </div>
        )}
        <div className="thumbnail" data-empty={!hasThumb}>
          {hasThumb && (
            <Image
              src={data.thumbnail!}
              fill
              alt={data.title}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              css={{ objectFit: "cover" }}
            />
          )}
        </div>
        <div className="content">
          <header className="top">
            <h2>{data.title}</h2>
          </header>
          <div className="date">
            <time dateTime={data?.date?.start_date || data.createdTime}>
              {formatDate(
                data?.date?.start_date || data.createdTime,
                CONFIG.lang
              )}
            </time>
          </div>
          <div className="summary">
            <p>{data.summary}</p>
          </div>
          <div className="tags">
            {data.tags &&
              data.tags.map((tag: string, idx: number) => (
                <Tag key={idx}>{tag}</Tag>
              ))}
          </div>
        </div>
      </article>
    </StyledWrapper>
  )
}

export default PostCard

const StyledWrapper = styled(Link)`
  display: flex;
  height: 100%;
  min-height: 0;

  @media (min-width: 1024px) {
    &[data-dimmed="true"] article {
      opacity: 0.5;
      filter: saturate(0.78);
    }

    &[data-active="true"] article {
      opacity: 1;
      filter: none;
      box-shadow:
        0 0 0 1px var(--cat-ring),
        0 0 0 2px var(--cat-soft),
        0 10px 28px oklch(0 0 0 / 0.1);
    }

    &[data-dimmed="true"]:hover article {
      opacity: 0.72;
      filter: saturate(0.92);
    }
  }

  article {
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100%;
    margin-bottom: 0;
    border-radius: 8px;
    border-left: 3px solid var(--cat-color);
    background-color: ${({ theme }) => theme.brand.surface};
    transition-property: box-shadow, transform, opacity, filter;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 220ms;

    :hover {
      transform: translateY(-2px);
      box-shadow:
        0 10px 28px oklch(0 0 0 / 0.08),
        0 4px 10px var(--cat-ring);
    }
    :hover .top h2 {
      text-decoration: underline;
      text-underline-offset: 0.2em;
      text-decoration-thickness: 1px;
      text-decoration-color: ${({ theme }) => theme.brand.link};
      color: ${({ theme }) => theme.brand.link};
    }
    :hover .summary p,
    :focus-within .summary p {
      -webkit-line-clamp: 4;
    }

    > .category {
      position: absolute;
      top: 0.75rem;
      left: 0.75rem;
      z-index: 10;
      .catChip {
        border: 1px solid transparent;
        border-radius: 999px;
        padding: 0.25rem 0.5rem;
        font-size: 0.8125rem;
        cursor: pointer;
        color: var(--cat-color);
        background: var(--cat-soft);
        font-family: ${({ theme }) => theme.brand.fontSans};
        transition: border-color 0.15s ease, transform 0.15s ease;
        &:hover {
          border-color: var(--cat-color);
        }
      }
    }

    > .thumbnail {
      position: relative;
      width: 100%;
      flex-shrink: 0;
      aspect-ratio: 16 / 9;
      background-color: ${({ theme }) => theme.brand.surface2};
      &[data-empty="true"] {
        background: linear-gradient(
          135deg,
          var(--cat-soft) 0%,
          ${({ theme }) => theme.brand.surface2} 72%
        );
      }
    }

    > .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
      padding: 1rem;

      > .top {
        flex-shrink: 0;
        h2 {
          margin: 0 0 0.5rem;
          font-size: 1.0625rem;
          line-height: 1.35;
          font-weight: 600;
          color: ${({ theme }) => theme.brand.text};
          cursor: pointer;
          text-decoration: none;
          transition: color 0.12s ease;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: calc(1.35em * 3);

          @media (min-width: 768px) {
            font-size: 1.125rem;
          }
        }
      }

      > .date {
        flex-shrink: 0;
        min-height: 1.35rem;
        margin-bottom: 0.5rem;
        time {
          font-size: 0.8125rem;
          line-height: 1.25rem;
          color: ${({ theme }) => theme.brand.textFaint};
          font-family: ${({ theme }) => theme.brand.fontMono};
        }
      }

      > .summary {
        flex: 1 1 auto;
        margin-bottom: 0.75rem;
        min-height: 4.6rem;
        p {
          margin: 0;
          line-height: 1.65;
          font-size: 0.875rem;
          color: ${({ theme }) => theme.brand.textMuted};
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      }

      > .tags {
        flex-shrink: 0;
        margin-top: auto;
        min-height: 1.75rem;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        align-items: center;
      }
    }
  }
`
