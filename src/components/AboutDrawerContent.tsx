import { keyframes } from "@emotion/react"
import Image from "next/image"
import React, { type RefObject } from "react"
import styled from "@emotion/styled"
import { CONFIG } from "site.config"
import ErrorBoundary from "src/components/ErrorBoundary"
import PostDetailQueryView from "src/components/PostDetailQueryView"
import useAboutPostQuery from "src/hooks/useAboutPostQuery"
import { extractOutlineFromRecordMap } from "src/libs/notion/extractOutlineFromRecordMap"
import { resolvePostBannerImageUrl } from "src/libs/utils/notion/resolvePostBannerImageUrl"
import NotionRenderer from "src/routes/Detail/components/NotionRenderer"
import TranslatedNotionRenderer from "src/routes/Detail/components/TranslatedNotionRenderer"
import PostOutlineNav from "src/routes/Detail/PostDetail/PostOutlineNav"
import {
  FEED_ABOUT_MOTION_EASE,
  FEED_ABOUT_PANEL_UNFOLD_MS,
} from "src/routes/Feed/FeedSidePanel"
import {
  AboutDrawerAsideCol,
  AboutDrawerBodyGrid,
  AboutDrawerMainCol,
  AsideOutlineMount,
} from "src/routes/Detail/PostDetail/PostDetailLayout"

type Props = {
  scrollRootRef: RefObject<HTMLDivElement | null>
}

const aboutBannerEnter = keyframes`
  from {
    opacity: 0;
    transform: translateX(0.55rem) scale(0.992);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
`

const AboutDrawerContent: React.FC<Props> = ({ scrollRootRef }) => {
  const state = useAboutPostQuery()

  return (
    <PostDetailQueryView
      state={state}
      statusScope="panel"
      statusSubject="about"
    >
      {(detail) => {
        const isPost = detail.type[0] === "Post"
        const outline = extractOutlineFromRecordMap(detail.recordMap)
        const bannerUrl = resolvePostBannerImageUrl(detail)

        return (
          <Shell>
            {bannerUrl ? (
              <AboutBanner>
                <Image
                  src={bannerUrl}
                  alt={`${CONFIG.profile.name} · ${CONFIG.profile.role}`}
                  priority
                  sizes="(max-width: 640px) 100vw, min(100vw, 36rem)"
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                  }}
                />
              </AboutBanner>
            ) : null}
            <AboutDrawerBodyGrid $hasAside={outline.length > 0}>
              <AboutDrawerMainCol>
                <Body className="about-edgy-prose">
                  {isPost ? (
                    <ErrorBoundary>
                      <TranslatedNotionRenderer
                        recordMap={detail.recordMap}
                        lang={detail.lang}
                      />
                    </ErrorBoundary>
                  ) : (
                    <NotionRenderer recordMap={detail.recordMap} />
                  )}
                </Body>
              </AboutDrawerMainCol>
              {outline.length > 0 ? (
                <AboutDrawerAsideCol>
                  <AsideOutlineMount>
                    <PostOutlineNav
                      items={outline}
                      scrollRef={scrollRootRef}
                      outlineLayout="about"
                    />
                  </AsideOutlineMount>
                </AboutDrawerAsideCol>
              ) : null}
            </AboutDrawerBodyGrid>
          </Shell>
        )
      }}
    </PostDetailQueryView>
  )
}

export default AboutDrawerContent

const Shell = styled.div`
  min-width: 0;
  position: relative;
  padding: 1.25rem 1rem 3.25rem;
  container-type: inline-size;
  container-name: about-drawer;
  isolation: isolate;
  overflow: hidden;
  background: ${({ theme }) => theme.brand.bg};

  &::before {
    content: "";
    position: absolute;
    top: -25%;
    left: -35%;
    width: 140%;
    height: 70%;
    background: linear-gradient(
      118deg,
      transparent 38%,
      ${({ theme }) => theme.brand.accentSoft} 52%,
      ${({ theme }) => theme.brand.linkSoft} 62%,
      transparent 78%
    );
    opacity: ${({ theme }) => (theme.scheme === "dark" ? 0.35 : 0.65)};
    pointer-events: none;
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }
`

const AboutBanner = styled.div`
  margin: 0 0 1.5rem;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  box-shadow: ${({ theme }) => theme.brand.shadowLg};
  line-height: 0;

  @media (prefers-reduced-motion: no-preference) {
    animation: ${aboutBannerEnter} ${FEED_ABOUT_PANEL_UNFOLD_MS}ms
      ${FEED_ABOUT_MOTION_EASE} both;
  }
`

/**
 * Notion `quote` blocks become pull-quote boxes inside About.
 */
const Body = styled.div`
  min-width: 0;
  font-family: ${({ theme }) => theme.brand.fontProse};

  &.about-edgy-prose .notion-page-cover-wrapper {
    display: none !important;
  }

  /* Compact prose: tighter body text and paragraph gaps so the panel
   * scans more like a résumé than a blog post. */
  &.about-edgy-prose .post-prose .notion-page-content {
    font-size: 15px;
    line-height: 1.65;
  }

  /* Tighten paragraph spacing. */
  &.about-edgy-prose .post-prose .notion-page-content .notion-text {
    margin-top: 0;
    margin-bottom: 0.35em;
  }

  &.about-edgy-prose .post-prose .notion-page-content h1.notion-h1 {
    font-family: ${({ theme }) => theme.brand.fontDisplay};
    letter-spacing: -0.03em;
    font-size: 1.5rem;
    margin-top: 1.75rem;
    margin-bottom: 0.2rem;
  }

  &.about-edgy-prose .post-prose .notion-page-content h2.notion-h2,
  &.about-edgy-prose
    .post-prose
    .notion-page-content
    div.notion-h2:not(:has(h2.notion-h2)) {
    padding: 0.35rem 0.55rem 0.45rem;
    font-size: 1.125rem;
    margin-top: 2rem;
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.brand.accentSoft},
      transparent 72%
    );
    border-radius: var(--radius-md);
  }

  &.about-edgy-prose .post-prose .notion-page-content h3.notion-h3 {
    font-size: 0.9375rem;
    margin-top: 1.25rem;
    margin-bottom: 0.15rem;
    font-weight: 700;
    letter-spacing: 0.01em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.brand.textMuted};
  }

  &.about-edgy-prose .post-prose .notion-page-content h2.notion-h2::before,
  &.about-edgy-prose
    .post-prose
    .notion-page-content
    div.notion-h2:not(:has(h2.notion-h2))::before {
    color: ${({ theme }) => theme.brand.textOnAccent};
    background: ${({ theme }) => theme.brand.accent};
    border-color: transparent;
  }

  /* Bullet lists: tighter. */
  &.about-edgy-prose .post-prose .notion-page-content .notion-list {
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
  }

  &.about-edgy-prose .post-prose .notion-page-content .notion-list-item {
    padding-top: 0.1rem;
    padding-bottom: 0.1rem;
  }

  .notion-quote {
    margin: 20px 0;
    padding: 14px 18px;
    background: ${({ theme }) =>
      theme.scheme === "dark"
        ? "oklch(0.3 0.07 22 / 0.5)"
        : "oklch(0.95 0.05 22 / 0.4)"};
    border-top: 3px solid ${({ theme }) => theme.brand.accent};
    border-radius: var(--radius-md);
    font-size: 15px;
    line-height: 1.5;
    color: ${({ theme }) => theme.brand.text};
    font-weight: 500;
    border-left: 0;
    border-right: 0;
    border-bottom: 0;
  }
`
