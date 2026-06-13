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

/* ── Card article ─────────────────────────────────────────────────────────── */

const CardArticle = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  margin-bottom: 0;
`

/* Positioning context for the two faces; lifts on hover via StyledWrapper. */
const FlipInner = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  transition: transform 160ms ease;
`

/* ── Faces ────────────────────────────────────────────────────────────────── */

const Face = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-lg);
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  background: var(--glass-1, ${({ theme }) => theme.brand.surface});
  backdrop-filter: var(--glass-blur, none);
  -webkit-backdrop-filter: var(--glass-blur, none);
  box-shadow: var(--glass-edge, none), ${({ theme }) => theme.brand.shadowSm};
  overflow: hidden;
  transition:
    box-shadow 160ms ease,
    border-color 160ms ease,
    opacity 160ms ease;
`

const FaceFront = styled(Face)`
  flex: 1;
`

/* FaceBack overlays FaceFront; fades in on hover when summary is present. */
const FaceBack = styled(Face)`
  position: absolute;
  inset: 0;
  padding: 1rem 1.1rem 1.1rem;
  gap: 0.55rem;
  opacity: 0;
  pointer-events: none;
`

/* ── Thumbnail ────────────────────────────────────────────────────────────── */

const Thumbnail = styled.div`
  position: relative;
  width: 100%;
  flex-shrink: 0;
  aspect-ratio: 16 / 9;
  background-color: ${({ theme }) => theme.brand.surface2};
  transition: box-shadow 160ms ease;

  &[data-empty="true"] {
    background:
      repeating-linear-gradient(135deg, rgba(255,255,255,.025) 0 2px, transparent 2px 11px),
      radial-gradient(120% 140% at 0% 0%, rgba(155,108,255,.18), transparent 55%),
      linear-gradient(135deg, var(--surface-sunk, ${({ theme }) => theme.brand.surfaceSunk}), ${({ theme }) => theme.brand.surface2});
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 35%, rgba(8,6,17,.8));
    pointer-events: none;
    z-index: 1;
    transition: box-shadow 160ms ease;
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
  transition: filter 200ms ease;

  @media (min-width: 1024px) {
    /* Counter-boost active card out of MidContent dim: 2.22 × 0.45 ≈ 1.0 */
    &[data-active="true"] {
      filter: brightness(2.22);
    }
    &[data-dimmed="true"]:hover,
    &[data-dimmed="true"]:focus-within {
      filter: brightness(1.55);
    }
    &[data-active="true"] ${FaceFront} {
      border-color: var(--accent, ${({ theme }) => theme.brand.accent});
      box-shadow:
        inset 3px 0 0 var(--accent, ${({ theme }) => theme.brand.accent}),
        var(--glow-sm, ${({ theme }) => theme.brand.shadowLg});
      background: linear-gradient(
        90deg,
        rgba(155, 108, 255, 0.12),
        var(--glass-1, ${({ theme }) => theme.brand.surface})
      );
    }

    /* Lift the whole card on hover */
    &:hover ${FlipInner},
    &:focus-within ${FlipInner} {
      transform: translateY(-3px);
    }

    /* Highlight the front face */
    &:hover ${FaceFront},
    &:focus-within ${FaceFront} {
      border-color: var(--accent, ${({ theme }) => theme.brand.accent});
      box-shadow: var(--glow-md, 0 0 26px rgba(155,108,255,.22));
    }

    /* Inset glow on thumbnail — ::after is z-index:1 above the Image fill,
       so its box-shadow is visible while Thumbnail's own shadow would be hidden */
    &:hover ${Thumbnail}::after,
    &:focus-within ${Thumbnail}::after {
      box-shadow: inset 0 0 0 2px var(--accent, ${({ theme }) => theme.brand.accent}),
                  inset 0 0 18px rgba(155,108,255,.22);
    }

    /* Fade to back face when summary is present */
    &:hover ${CardArticle}[data-flippable="true"] ${FaceFront},
    &:focus-within ${CardArticle}[data-flippable="true"] ${FaceFront} {
      opacity: 0;
    }
    &:hover ${CardArticle}[data-flippable="true"] ${FaceBack},
    &:focus-within ${CardArticle}[data-flippable="true"] ${FaceBack} {
      opacity: 1;
      pointer-events: auto;
      border-color: var(--accent, ${({ theme }) => theme.brand.accent});
      box-shadow: var(--glow-md, 0 0 26px rgba(155,108,255,.22));
    }

    /* Don't flip the currently-open post */
    &[data-active="true"]:hover ${CardArticle} ${FaceFront},
    &[data-active="true"]:focus-within ${CardArticle} ${FaceFront} {
      opacity: 1;
    }
    &[data-active="true"]:hover ${CardArticle} ${FaceBack},
    &[data-active="true"]:focus-within ${CardArticle} ${FaceBack} {
      opacity: 0;
      pointer-events: none;
    }
  }

  /* Mobile/tablet: lift + highlight only, no face swap */
  @media (max-width: 1023px) {
    &:hover ${FaceFront} {
      border-color: var(--accent, ${({ theme }) => theme.brand.accent});
      box-shadow: var(--glow-md, 0 0 26px rgba(155,108,255,.22));
      transform: translateY(-3px);
    }
  }
`
