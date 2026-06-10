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
import { normalizeFeedPathSlug } from "src/routes/Feed/resolveFeedShellRoute"
import { useRouter } from "next/router"
import React from "react"

type Props = {
  data: TPost
}

const PostCard: React.FC<Props> = ({ data }) => {
  const router = useRouter()
  const { panelMode, activeSlug } = useFeedShell()
  const routeSlug = normalizeFeedPathSlug(activeSlug)
  const cardSlug = normalizeFeedPathSlug(data.slug)
  const selectionOpen = panelMode === "post" && Boolean(routeSlug)
  const isActive = selectionOpen && cardSlug === routeSlug
  const isDimmed = selectionOpen && cardSlug !== routeSlug
  const category = (data.category && data.category?.[0]) || undefined
  const token = tokenForCategory(category)
  const style = catVars(token)
  const hasThumb = Boolean(data.thumbnail)
  const dateValue = data?.date?.start_date || data.createdTime
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
      <CardArticle style={style} data-flippable={hasSummary ? "true" : "false"}>
        <FlipInner>
          <FaceFront>
            <Thumbnail data-empty={!hasThumb}>
              {hasThumb && (
                <Image
                  src={data.thumbnail!}
                  fill
                  alt={data.title}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
              )}
              {category && (
                <CategoryBadge>
                  <CatChip
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      onClickCategory(category)
                    }}
                  >
                    {category}
                  </CatChip>
                </CategoryBadge>
              )}
              {data.tags && data.tags.length > 0 ? (
                <TagsOverlay>
                  {data.tags.slice(0, 3).map((tag: string, idx: number) => (
                    <Tag key={idx}>{tag}</Tag>
                  ))}
                  {data.tags.length > 3 && (
                    <TagsMore>+{data.tags.length - 3}</TagsMore>
                  )}
                </TagsOverlay>
              ) : null}
            </Thumbnail>
            <CardContent>
              <CardTop>
                <h2>{data.title}</h2>
              </CardTop>
              <CardMeta>
                <time dateTime={dateValue}>
                  {formatDate(dateValue, CONFIG.lang)}
                </time>
              </CardMeta>
            </CardContent>
          </FaceFront>
          {hasSummary ? (
            <FaceBack aria-hidden="true">
              <BackHead>
                {category ? <BackChip>{category}</BackChip> : null}
              </BackHead>
              <BackTitle>{data.title}</BackTitle>
              <BackSummary>{data.summary}</BackSummary>
            </FaceBack>
          ) : null}
        </FlipInner>
      </CardArticle>
    </StyledWrapper>
  )
}

export default PostCard

/* ── Card article & flip ──────────────────────────────────────────────────── */

const CardArticle = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  margin-bottom: 0;
  transition-property: opacity, filter;
  transition-timing-function: ${({ theme }) => theme.brand.ease};
  transition-duration: ${({ theme }) => theme.brand.duration};
`

const FlipInner = styled.div`
  flex: 1;
  position: relative;
  display: grid;
  grid-template-areas: "stack";
  min-height: 100%;
  transform-style: preserve-3d;
  transform: rotateY(0deg);
  transition: transform 300ms cubic-bezier(0.2, 0.7, 0.2, 1);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

/* ── Faces ────────────────────────────────────────────────────────────────── */

const Face = styled.div`
  grid-area: stack;
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-lg);
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  background: var(--glass-1, ${({ theme }) => theme.brand.surface});
  backdrop-filter: var(--glass-blur, none);
  -webkit-backdrop-filter: var(--glass-blur, none);
  box-shadow: var(--glass-edge, none), ${({ theme }) => theme.brand.shadowSm};
  overflow: hidden;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transition:
    box-shadow ${({ theme }) => theme.brand.duration} ${({ theme }) => theme.brand.ease},
    border-color ${({ theme }) => theme.brand.duration} ${({ theme }) => theme.brand.ease},
    transform ${({ theme }) => theme.brand.duration} ${({ theme }) => theme.brand.ease};
`

// Gives the front face its own Emotion class for targeted selectors in StyledWrapper.
const FaceFront = styled(Face)``

const FaceBack = styled(Face)`
  transform: rotateY(180deg);
  padding: 1rem 1.1rem 1.1rem;
  gap: 0.55rem;
`

/* ── Thumbnail ────────────────────────────────────────────────────────────── */

const Thumbnail = styled.div`
  position: relative;
  width: 100%;
  flex-shrink: 0;
  aspect-ratio: 16 / 9;
  background-color: ${({ theme }) => theme.brand.surface2};

  &[data-empty="true"] {
    background:
      repeating-linear-gradient(135deg, rgba(255,255,255,.025) 0 2px, transparent 2px 11px),
      radial-gradient(120% 140% at 0% 0%, rgba(155,108,255,.18), transparent 55%),
      linear-gradient(135deg, var(--surface-sunk, ${({ theme }) => theme.brand.surfaceSunk}), ${({ theme }) => theme.brand.surface2});
  }

  /* dark overlay so text is always readable on top of images */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 35%, rgba(8,6,17,.8));
    pointer-events: none;
    z-index: 1;
  }
`

const CategoryBadge = styled.div`
  position: absolute;
  top: 0.625rem;
  left: 0.625rem;
  z-index: 2;
`

const CatChip = styled.button`
  padding: 0.18rem 0.5rem;
  border: 1px solid rgba(47,230,255,.35);
  border-radius: var(--radius-pill);
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.625rem;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  cursor: pointer;
  color: ${({ theme }) => theme.brand.link};
  background: rgba(8,6,17,.62);
  backdrop-filter: saturate(160%) blur(8px);
  -webkit-backdrop-filter: saturate(160%) blur(8px);
  transition:
    border-color ${({ theme }) => theme.brand.durationFast} ${({ theme }) => theme.brand.ease},
    transform ${({ theme }) => theme.brand.durationFast} ${({ theme }) => theme.brand.ease};

  &:hover {
    border-color: ${({ theme }) => theme.brand.link};
    transform: translateY(-1px);
  }
`

const TagsOverlay = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  display: flex;
  flex-wrap: nowrap;
  gap: 0.3rem;
  padding: 0.45rem 0.625rem 0.5rem;
  overflow: hidden;
  background: linear-gradient(
    to top,
    oklch(from var(--surface) l c h / 0.88) 0%,
    oklch(from var(--surface) l c h / 0.52) 48%,
    transparent 100%
  );
  mask-image: linear-gradient(to right, black 80%, transparent 100%);
  -webkit-mask-image: linear-gradient(to right, black 80%, transparent 100%);

  > button {
    flex-shrink: 0;
    padding: 0.1rem 0.45rem;
    font-size: 0.625rem;
    font-weight: 650;
    letter-spacing: 0.04em;
    line-height: 0.95rem;
  }
`

const TagsMore = styled.span`
  flex-shrink: 0;
  align-self: center;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.5625rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.brand.textMuted};
  opacity: 0.85;
`

/* ── Card content (front face text area) ─────────────────────────────────── */

const CardContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 1rem;
  gap: 0.5rem;
`

const CardTop = styled.header`
  flex-shrink: 0;

  h2 {
    margin: 0;
    font-family: ${({ theme }) => theme.brand.fontDisplay};
    font-size: 1.125rem;
    line-height: 1.35;
    font-weight: 650;
    letter-spacing: -0.005em;
    color: ${({ theme }) => theme.brand.text};
    text-decoration: none;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`

const CardMeta = styled.div`
  flex-shrink: 0;
  /* Push meta to bottom; keeps title flush to top and date at card's lower edge. */
  margin-top: auto;
  padding-top: 0.5rem;
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
`

/* ── Back face content ────────────────────────────────────────────────────── */

const BackHead = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.6875rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.textFaint};
`

const BackChip = styled.span`
  color: var(--cat-color);
  font-weight: 700;
`

const BackTitle = styled.h3`
  margin: 0;
  font-family: ${({ theme }) => theme.brand.fontDisplay};
  font-size: 1rem;
  line-height: 1.3;
  font-weight: 650;
  letter-spacing: -0.005em;
  color: ${({ theme }) => theme.brand.text};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const BackSummary = styled.p`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.55;
  color: ${({ theme }) => theme.brand.textMuted};
  display: -webkit-box;
  -webkit-line-clamp: 8;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

/* ── Link wrapper — card shell + all state-dependent interaction styles ───── */

const StyledWrapper = styled(Link)`
  display: flex;
  height: 100%;
  min-height: 0;
  /* Keep the link itself non-3D so only the inner flipper rotates,
   * and active/dim opacity transitions stay on a flat layer. */
  perspective: 1200px;

  @media (min-width: 1024px) {
    &[data-dimmed="true"]:not([data-active="true"]) ${CardArticle} {
      opacity: 0.5;
      filter: saturate(0.78);
    }

    &[data-active="true"] ${CardArticle} {
      opacity: 1;
      filter: none;
    }
    &[data-active="true"] ${FaceFront} {
      box-shadow:
        0 0 0 1px var(--cat-ring),
        0 0 0 2px var(--cat-soft),
        ${({ theme }) => theme.brand.shadowLg};
    }

    &[data-dimmed="true"]:not([data-active="true"]):hover ${CardArticle} {
      opacity: 0.72;
      filter: saturate(0.92);
    }

    /* The flip only triggers when there is a summary worth showing
     * AND the card isn't the active selection — flipping the currently-open
     * post would be disorienting. */
    &:hover ${CardArticle}[data-flippable="true"] ${FlipInner},
    &:focus-within ${CardArticle}[data-flippable="true"] ${FlipInner} {
      transform: rotateY(180deg);
    }
    &[data-active="true"]:hover ${CardArticle} ${FlipInner},
    &[data-active="true"]:focus-within ${CardArticle} ${FlipInner} {
      transform: rotateY(0deg);
    }

    &:hover ${FlipInner} {
      will-change: transform;
    }
  }

  &:hover ${FaceFront} {
    border-color: ${({ theme }) => theme.brand.accent};
    box-shadow: var(--glass-edge, none), var(--glow-md, ${({ theme }) => theme.brand.shadowLg});
    transform: translateY(-3px);
  }
`
