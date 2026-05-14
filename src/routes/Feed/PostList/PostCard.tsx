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

const READ_WORDS_PER_MIN = 200

function estimateReadingMinutes(post: TPost): number | undefined {
  const raw = post.summary?.trim()
  if (!raw) return undefined
  const words = raw.split(/\s+/).filter(Boolean).length
  if (words === 0) return undefined
  return Math.max(1, Math.round(words / READ_WORDS_PER_MIN))
}

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
  const dateValue = data?.date?.start_date || data.createdTime
  const readingMinutes = estimateReadingMinutes(data)
  const hasSummary = Boolean(data.summary?.trim())

  const onClickCategory = (value: string) => {
    router.push({ query: { ...router.query, category: value } })
  }

  return (
    <StyledWrapper
      href={buildPostHref(data.slug, router.query)}
      scroll={false}
      onMouseDown={() => rememberFeedScrollPosition()}
      onClick={() => rememberFeedScrollPosition()}
      data-active={isActive ? "true" : "false"}
      data-dimmed={isDimmed ? "true" : "false"}
    >
      <article style={style}>
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
        </div>
        <div className="content">
          <header className="top">
            <h2>{data.title}</h2>
          </header>
          <div className="meta">
            <time dateTime={dateValue}>
              {formatDate(dateValue, CONFIG.lang)}
            </time>
            {readingMinutes ? (
              <span className="readtime">{readingMinutes} min read</span>
            ) : null}
          </div>
          <div className="tags">
            {data.tags &&
              data.tags.map((tag: string, idx: number) => (
                <Tag key={idx}>{tag}</Tag>
              ))}
          </div>
        </div>
        {hasSummary ? (
          <div className="summary-popover" role="presentation">
            <div className="summary-meta">
              {category ? <span className="chip">{category}</span> : null}
              {readingMinutes ? (
                <span className="dot" aria-hidden="true">
                  ·
                </span>
              ) : null}
              {readingMinutes ? (
                <span>{readingMinutes} min read</span>
              ) : null}
            </div>
            <p>{data.summary}</p>
          </div>
        ) : null}
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
        ${({ theme }) => theme.brand.shadowLg};
    }

    &[data-dimmed="true"]:hover article {
      opacity: 0.72;
      filter: saturate(0.92);
    }
  }

  article {
    /* v2: keep overflow visible at the article level so the summary popover
     * can extend below the card on hover. The thumbnail clips itself via
     * its own border-radius + overflow:hidden. */
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100%;
    margin-bottom: 0;
    border-radius: var(--radius-lg);
    border: 1px solid ${({ theme }) => theme.brand.borderSoft};
    background-color: ${({ theme }) => theme.brand.surface};
    transition-property: box-shadow, transform, opacity, filter, border-color;
    transition-timing-function: ${({ theme }) => theme.brand.ease};
    transition-duration: ${({ theme }) => theme.brand.duration};

    :hover {
      transform: translateY(-2px);
      border-color: var(--cat-ring);
      box-shadow: ${({ theme }) => theme.brand.shadowLg};
      z-index: 2;
    }
    :hover .top h2 {
      text-decoration: underline;
      text-underline-offset: 0.2em;
      text-decoration-thickness: 1px;
      text-decoration-color: currentColor;
    }

    > .thumbnail {
      position: relative;
      width: 100%;
      flex-shrink: 0;
      /* 2:1 wide ratio gives the text block more room than the previous 16:9. */
      aspect-ratio: 2 / 1;
      border-radius: var(--radius-lg) var(--radius-lg) 0 0;
      overflow: hidden;
      background-color: ${({ theme }) => theme.brand.surface2};
      &[data-empty="true"] {
        background: linear-gradient(
          135deg,
          var(--cat-soft) 0%,
          ${({ theme }) => theme.brand.surface2} 72%
        );
      }

      /* v2: category chip lives inside the thumbnail's bottom-left corner with
       * a frosted backdrop so it reads on any image without an overlay band. */
      > .category {
        position: absolute;
        left: 0.625rem;
        bottom: 0.625rem;
        z-index: 2;

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
          background: ${({ theme }) => theme.brand.surface};
          backdrop-filter: saturate(140%) blur(6px);
          -webkit-backdrop-filter: saturate(140%) blur(6px);
          font-family: ${({ theme }) => theme.brand.fontSans};
          transition: border-color ${({ theme }) => theme.brand.durationFast}
              ${({ theme }) => theme.brand.ease},
            transform ${({ theme }) => theme.brand.durationFast}
              ${({ theme }) => theme.brand.ease};

          &:hover {
            border-color: var(--cat-color);
            transform: translateY(-1px);
          }
        }
      }
    }

    > .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
      padding: 0.875rem 1rem 1rem;
      gap: 0.5rem;

      > .top {
        flex-shrink: 0;
        h2 {
          margin: 0;
          font-family: ${({ theme }) => theme.brand.fontDisplay};
          font-size: 1.125rem;
          line-height: 1.35;
          font-weight: 650;
          letter-spacing: -0.005em;
          color: ${({ theme }) => theme.brand.text};
          cursor: pointer;
          text-decoration: none;
          transition: color ${({ theme }) => theme.brand.durationFast}
            ${({ theme }) => theme.brand.ease};
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: calc(1.35em * 2);
        }
      }

      /* v2: date + read-time on one mono line so the card has a meta strip
       * instead of an always-visible summary block. */
      > .meta {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-family: ${({ theme }) => theme.brand.fontMono};
        font-size: 0.75rem;
        line-height: 1.2;
        color: ${({ theme }) => theme.brand.textFaint};

        time {
          font: inherit;
          color: inherit;
        }

        .readtime::before {
          content: "·";
          margin-right: 0.5rem;
          color: ${({ theme }) => theme.brand.borderSoft};
        }
      }

      > .tags {
        flex-shrink: 0;
        margin-top: auto;
        padding-top: 0.25rem;
        min-height: 1.75rem;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        align-items: center;
      }
    }

    /* v2 summary popover — invisible by default, slides in on hover. Anchored
     * to the bottom of the card so it doesn't shift layout, sized to the
     * card width minus a small inset. */
    > .summary-popover {
      position: absolute;
      left: 0.5rem;
      right: 0.5rem;
      top: calc(100% + 0.5rem);
      z-index: 3;
      padding: 0.75rem 0.9rem;
      border-radius: var(--radius-md);
      border: 1px solid ${({ theme }) => theme.brand.borderSoft};
      background: ${({ theme }) => theme.brand.surface};
      box-shadow: ${({ theme }) => theme.brand.shadowLg};
      opacity: 0;
      transform: translateY(-4px);
      pointer-events: none;
      transition: opacity ${({ theme }) => theme.brand.durationFast}
          ${({ theme }) => theme.brand.ease},
        transform ${({ theme }) => theme.brand.durationFast}
          ${({ theme }) => theme.brand.ease};

      .summary-meta {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        margin-bottom: 0.35rem;
        font-family: ${({ theme }) => theme.brand.fontMono};
        font-size: 0.6875rem;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: ${({ theme }) => theme.brand.textFaint};

        .chip {
          color: var(--cat-color);
        }
        .dot {
          color: ${({ theme }) => theme.brand.borderSoft};
        }
      }

      p {
        margin: 0;
        font-size: 0.8125rem;
        line-height: 1.55;
        color: ${({ theme }) => theme.brand.textMuted};
        display: -webkit-box;
        -webkit-line-clamp: 5;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }

    &:hover > .summary-popover,
    &:focus-within > .summary-popover {
      opacity: 1;
      transform: translateY(0);
    }
  }
`
