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
  AboutDrawerAsideCol,
  AboutDrawerBodyGrid,
  AboutDrawerMainCol,
  AsideOutlineMount,
} from "src/routes/Detail/PostDetail/PostDetailLayout"

type Props = {
  scrollRootRef?: RefObject<HTMLDivElement | null>
}

const AboutDrawerContent: React.FC<Props> = ({ scrollRootRef }) => {
  const { profile } = CONFIG
  const state = useAboutPostQuery()

  return (
    <PostDetailQueryView state={state} statusScope="panel" statusSubject="about">
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
                  alt={`${profile.name} · ${profile.role}`}
                  fill
                  priority
                  sizes="(max-width: 640px) 100vw, min(100vw, 72rem)"
                  style={{ objectFit: "cover", objectPosition: "center 30%" }}
                />
              </AboutBanner>
            ) : null}

            {/* ── Notion body ── */}
            <AboutDrawerBodyGrid $hasAside={outline.length > 0}>
              <AboutDrawerMainCol>
                <Body className="about-prose">
                  <ErrorBoundary>
                    {isPost ? (
                      <TranslatedNotionRenderer
                        recordMap={detail.recordMap}
                        lang={detail.lang}
                      />
                    ) : (
                      <NotionRenderer recordMap={detail.recordMap} />
                    )}
                  </ErrorBoundary>
                </Body>
              </AboutDrawerMainCol>

              {outline.length > 0 ? (
                <AboutDrawerAsideCol>
                  <AsideOutlineMount>
                    <PostOutlineNav
                      items={outline}
                      scrollRef={scrollRootRef ?? { current: null }}
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

/* ── Banner ── */

const AboutBanner = styled.div`
  position: relative;
  height: 200px;
  overflow: hidden;
  line-height: 0;
  border-bottom: 1px solid ${({ theme }) => theme.brand.borderSoft};

  @media (max-width: 640px) {
    height: 130px;
  }
`

/* ── Layout ── */

const Shell = styled.div`
  min-width: 0;
  padding: 0 0 3rem;
  container-type: inline-size;
  container-name: about-drawer;
  position: relative;
  isolation: isolate;
`

/* ── Notion body ── */

const Body = styled.div`
  min-width: 0;
  font-family: ${({ theme }) => theme.brand.fontProse};
  padding: 1.5rem 1.5rem 0;

  @media (max-width: 640px) {
    padding: 1rem 1rem 0;
  }

  /* Hide the Notion cover if it's in the content (we show it above) */
  &.about-prose .notion-page-cover-wrapper {
    display: none !important;
  }

  /* ── Body text ── */
  &.about-prose .post-prose .notion-page-content {
    font-size: 15px;
    line-height: 1.68;
    color: ${({ theme }) => theme.brand.text};
  }

  /* ── Paragraph spacing ── */
  &.about-prose .post-prose .notion-page-content .notion-text {
    margin-top: 0;
    margin-bottom: 0.4em;
  }

  /* ── H1: large display title ── */
  &.about-prose .post-prose .notion-page-content h1.notion-h1 {
    font-family: ${({ theme }) => theme.brand.fontDisplay};
    font-size: 1.6rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.2;
    color: ${({ theme }) => theme.brand.text};
    margin: 2.25rem 0 0.4rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid ${({ theme }) => theme.brand.accentSoft};
  }

  /* ── H2: section header with accent pill ── */
  &.about-prose .post-prose .notion-page-content h2.notion-h2,
  &.about-prose .post-prose .notion-page-content div.notion-h2:not(:has(h2.notion-h2)) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.0625rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: ${({ theme }) => theme.brand.text};
    margin: 2rem 0 0.6rem;
    padding: 0.45rem 0.75rem;
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.brand.accentSoft} 0%,
      transparent 80%
    );
    border-left: 3px solid ${({ theme }) => theme.brand.accent};
    border-radius: 0 var(--radius-md) var(--radius-md) 0;
  }

  /* Hide the default ::before counter on h2 */
  &.about-prose .post-prose .notion-page-content h2.notion-h2::before,
  &.about-prose .post-prose .notion-page-content div.notion-h2:not(:has(h2.notion-h2))::before {
    display: none;
  }

  /* ── H3: sub-label ── */
  &.about-prose .post-prose .notion-page-content h3.notion-h3 {
    font-size: 0.8125rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.brand.textMuted};
    margin: 1.5rem 0 0.25rem;
  }

  /* ── Bullet lists ── */
  &.about-prose .post-prose .notion-page-content .notion-list {
    margin: 0.25rem 0;
  }

  &.about-prose .post-prose .notion-page-content .notion-list-item {
    padding-top: 0.1rem;
    padding-bottom: 0.1rem;
    font-size: 14.5px;
    color: ${({ theme }) => theme.brand.textMuted};
  }

  /* ── Callout / quote as pull-quote ── */
  &.about-prose .notion-quote {
    margin: 1.25rem 0;
    padding: 0.9rem 1.1rem;
    background: ${({ theme }) =>
      theme.scheme === "dark"
        ? "oklch(0.28 0.06 22 / 0.45)"
        : "oklch(0.95 0.04 22 / 0.45)"};
    border-top: 3px solid ${({ theme }) => theme.brand.accent};
    border-left: none;
    border-right: none;
    border-bottom: none;
    border-radius: var(--radius-md);
    font-size: 14.5px;
    line-height: 1.6;
    color: ${({ theme }) => theme.brand.text};
    font-weight: 500;
  }

  /* ── Callout blocks ── */
  &.about-prose .notion-callout {
    border-radius: var(--radius-lg);
    border: 1px solid ${({ theme }) => theme.brand.borderSoft};
    background: ${({ theme }) => theme.brand.surface2};
    padding: 0.75rem 1rem;
    margin: 1rem 0;
    font-size: 14.5px;
    line-height: 1.6;
  }

  /* ── Inline code ── */
  &.about-prose .notion-inline-code {
    font-size: 0.85em;
    padding: 0.1em 0.35em;
    border-radius: 4px;
    background: ${({ theme }) => theme.brand.codeBg};
    color: ${({ theme }) => theme.brand.codeText};
    font-family: ${({ theme }) => theme.brand.fontMono};
  }

  /* ── Bold / strong emphasis ── */
  &.about-prose .notion-bold {
    color: ${({ theme }) => theme.brand.text};
    font-weight: 700;
  }
`
