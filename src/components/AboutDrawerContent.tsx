import Image from "next/image"
import React, { type RefObject } from "react"
import {
  AiFillEdit,
  AiFillLinkedin,
  AiOutlineGithub,
  AiOutlineMail,
} from "react-icons/ai"
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
  scrollRootRef: RefObject<HTMLDivElement | null>
}

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

        return (
          <Shell>
            <AboutHero>
              <HeroLabel>
                <span>ABOUT · {CONFIG.profile.name.split(" ")[0]}</span>
              </HeroLabel>
              <HeroId>
                <HeroAvatar
                  src={CONFIG.profile.image}
                  width={88}
                  height={88}
                  alt=""
                />
                <HeroMeta>
                  <HeroName>{CONFIG.profile.name}</HeroName>
                  <HeroRole>{CONFIG.profile.role}</HeroRole>
                </HeroMeta>
              </HeroId>
            </AboutHero>
            <QuickFactsBlock />
            <AboutDrawerBodyGrid $hasAside={outline.length > 0}>
              <AboutDrawerMainCol>
                <Body>
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
  padding: 1.75rem 1.25rem 3.5rem;
  container-type: inline-size;
  container-name: about-drawer;
  /* Light = warm hanji-cream identity surface; dark = neutral surface tones.
     Drive off theme.scheme so explicit user toggle wins over OS preference
     (matches the rest of sentinel-theme.css cascade rules). */
  background: ${({ theme }) =>
    theme.scheme === "dark"
      ? `linear-gradient(180deg, ${theme.brand.surface2} 0%, ${theme.brand.surface} 240px)`
      : `linear-gradient(180deg, oklch(0.97 0.012 60) 0%, ${theme.brand.surface} 240px)`};
  border-left: 4px solid ${({ theme }) => theme.brand.accent};
`

const AboutHero = styled.header`
  margin-bottom: 28px;
`

const HeroLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.textFaint};

  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.brand.border};
  }
`

const HeroId = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`

const HeroAvatar = styled(Image)`
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.brand.surface};
  box-shadow: ${({ theme }) => theme.brand.shadowMd};
  flex-shrink: 0;
`

const HeroMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`

const HeroName = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.015em;
  color: ${({ theme }) => theme.brand.text};
`

const HeroRole = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.brand.textMuted};
`

const QuickFacts = styled.section`
  margin: 0 0 28px;
  padding: 14px 16px;
  border-radius: 0.65rem;
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  background: ${({ theme }) => theme.brand.surface};
`

const QuickFactsLabel = styled.p`
  margin: 0 0 10px;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.textFaint};
`

const QuickLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 0.65rem;
  align-items: center;
`

const QuickLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.5rem;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  font-size: 0.8125rem;
  line-height: 1.2;
  color: ${({ theme }) => theme.brand.textMuted};
  text-decoration: none;
  transition:
    color ${({ theme }) => theme.brand.durationFast} ${({ theme }) =>
      theme.brand.ease},
    background ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease},
    border-color ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease};

  &:hover {
    color: ${({ theme }) => theme.brand.text};
    background: ${({ theme }) => theme.brand.surface2};
    border-color: ${({ theme }) => theme.brand.borderSoft};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.brand.accentRing};
    outline-offset: 2px;
  }

  svg {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
    opacity: 0.85;
  }

  span {
    min-width: 0;
    word-break: break-word;
  }
`

/**
 * Notion `quote` blocks become pull-quote boxes inside About.
 * Style only — author triggers a pull quote by inserting a quote block.
 */
const Body = styled.div`
  min-width: 0;

  .notion-quote {
    margin: 28px 0;
    padding: 16px 20px 16px 24px;
    background: ${({ theme }) =>
      theme.scheme === "dark"
        ? "oklch(0.3 0.07 22 / 0.5)"
        : "oklch(0.95 0.05 22 / 0.4)"};
    border-left: 3px solid ${({ theme }) => theme.brand.accent};
    border-radius: 0 8px 8px 0;
    font-size: 17px;
    line-height: 1.5;
    color: ${({ theme }) => theme.brand.text};
    font-weight: 500;

    /* Reset react-notion-x's default 1.5em hanging left border on quotes. */
    border-top: 0;
    border-right: 0;
    border-bottom: 0;
  }
`

function QuickFactsBlock() {
  const { email, blog, github, linkedin } = CONFIG.profile
  const hasAny = Boolean(email || blog || github || linkedin)
  if (!hasAny) return null

  return (
    <QuickFacts aria-label="Quick facts">
      <QuickFactsLabel>Quick facts</QuickFactsLabel>
      <QuickLinks>
        {email ? (
          <QuickLink href={`mailto:${email}`}>
            <AiOutlineMail aria-hidden="true" />
            <span>{email}</span>
          </QuickLink>
        ) : null}
        {github ? (
          <QuickLink
            href={`https://github.com/${github}`}
            target="_blank"
            rel="noreferrer"
          >
            <AiOutlineGithub aria-hidden="true" />
            <span>GitHub</span>
          </QuickLink>
        ) : null}
        {linkedin ? (
          <QuickLink
            href={`https://www.linkedin.com/in/${linkedin}`}
            target="_blank"
            rel="noreferrer"
          >
            <AiFillLinkedin aria-hidden="true" />
            <span>LinkedIn</span>
          </QuickLink>
        ) : null}
        {blog ? (
          <QuickLink
            href={`https://blog.naver.com/${blog}`}
            target="_blank"
            rel="noreferrer"
          >
            <AiFillEdit aria-hidden="true" />
            <span>Blog</span>
          </QuickLink>
        ) : null}
      </QuickLinks>
    </QuickFacts>
  )
}
