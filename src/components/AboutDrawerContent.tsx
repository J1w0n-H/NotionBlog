import Image from "next/image"
import React, { type RefObject } from "react"
import styled from "@emotion/styled"
import { CONFIG } from "site.config"
import ErrorBoundary from "src/components/ErrorBoundary"
import PostDetailQueryView from "src/components/PostDetailQueryView"
import useAboutPostQuery from "src/hooks/useAboutPostQuery"
import { extractOutlineFromRecordMap } from "src/libs/notion/extractOutlineFromRecordMap"
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

        return (
          <Shell>
            {/* ── Profile header: identity at a glance ── */}
            <ProfileBar>
              <AvatarRing>
                <Image
                  src={profile.image}
                  alt={profile.name}
                  width={52}
                  height={52}
                  priority
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              </AvatarRing>
              <ProfileInfo>
                <ProfileName>{profile.name}</ProfileName>
                <ProfileRole>{profile.role}</ProfileRole>
              </ProfileInfo>
              <SocialLinks>
                {profile.email && (
                  <SocialPill href={`mailto:${profile.email}`} title="Email">
                    <MailIcon />
                  </SocialPill>
                )}
                {profile.linkedin && (
                  <SocialPill
                    href={`https://linkedin.com/in/${profile.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="LinkedIn"
                  >
                    <LinkedInIcon />
                  </SocialPill>
                )}
                {profile.github && (
                  <SocialPill
                    href={`https://github.com/${profile.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="GitHub"
                  >
                    <GitHubIcon />
                  </SocialPill>
                )}
              </SocialLinks>
            </ProfileBar>


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

/* ── Tiny SVG icons ── */
const MailIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
  </svg>
)
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)
const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
)

/* ── Layout ── */

const Shell = styled.div`
  min-width: 0;
  padding: 0 0 3rem;
  container-type: inline-size;
  container-name: about-drawer;
  position: relative;
  isolation: isolate;
`

/* ── Profile bar ── */

const ProfileBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem 0.875rem;
  border-bottom: 1px solid ${({ theme }) => theme.brand.borderSoft};
  background: ${({ theme }) => theme.brand.surface};
  position: sticky;
  top: 0;
  z-index: 4;
`

const AvatarRing = styled.div`
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid ${({ theme }) => theme.brand.border};
  box-shadow: 0 0 0 3px ${({ theme }) => theme.brand.accentSoft};
`

const ProfileInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const ProfileName = styled.div`
  font-family: ${({ theme }) => theme.brand.fontDisplay};
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.brand.text};
  line-height: 1.25;
`

const ProfileRole = styled.div`
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.accent};
  margin-top: 0.1rem;
`

const SocialLinks = styled.div`
  display: flex;
  gap: 0.3rem;
  flex-shrink: 0;
`

const SocialPill = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: var(--radius-md);
  border: 1px solid ${({ theme }) => theme.brand.border};
  background: ${({ theme }) => theme.brand.surface2};
  color: ${({ theme }) => theme.brand.textMuted};
  text-decoration: none;
  transition:
    background 0.12s ease,
    border-color 0.12s ease,
    color 0.12s ease;

  &:hover {
    background: ${({ theme }) => theme.brand.accentSoft};
    border-color: ${({ theme }) => theme.brand.accent};
    color: ${({ theme }) => theme.brand.accent};
  }
`

/* ── Notion body ── */

const Body = styled.div`
  min-width: 0;
  font-family: ${({ theme }) => theme.brand.fontProse};
  padding: 1.5rem 1.5rem 0;

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
