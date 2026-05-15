import { keyframes } from "@emotion/react"
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
import { FEED_SIDE_PANEL_UNFOLD_MS } from "src/routes/Feed/FeedSidePanel"
import {
  AboutDrawerAsideCol,
  AboutDrawerBodyGrid,
  AboutDrawerMainCol,
  AsideOutlineMount,
} from "src/routes/Detail/PostDetail/PostDetailLayout"

type Props = {
  scrollRootRef: RefObject<HTMLDivElement | null>
}

function splitProfileName(full: string): { first: string; last: string } {
  const parts = full.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return { first: "", last: "" }
  if (parts.length === 1) return { first: parts[0]!, last: "" }
  const last = parts[parts.length - 1]!
  const first = parts.slice(0, -1).join(" ")
  return { first, last }
}

function parseBioTagline(bio: string): string[] {
  return bio
    .split("·")
    .map((s) => s.trim())
    .filter(Boolean)
}

const unfoldEase = "cubic-bezier(0.22, 1, 0.36, 1)"

/** Opening: drift left + scale up — reads as header profile “landing” in the panel. */
const aboutProfileEnter = keyframes`
  from {
    opacity: 0;
    transform: translateX(1.35rem) scale(0.82);
    transform-origin: 0% 28%;
  }
  52% {
    opacity: 1;
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
    transform-origin: 0% 28%;
  }
`

const cursorBlink = keyframes`
  0%,
  45% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
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
        const { first: firstName, last: lastName } = splitProfileName(
          CONFIG.profile.name
        )
        const taglineParts = CONFIG.profile.bio?.trim()
          ? parseBioTagline(CONFIG.profile.bio)
          : []

        return (
          <Shell>
            <AboutHero>
              <HeroLabel>
                <span>ABOUT · {firstName?.toUpperCase() || "PROFILE"}</span>
              </HeroLabel>
              <HeroStage>
                <HeroStageMain>
                  <HeroPrompt aria-hidden="true">
                    <HeroPromptSig>$</HeroPromptSig> whoami
                    <HeroPromptCursor> _</HeroPromptCursor>
                  </HeroPrompt>
                  <HeroId>
                    <HeroAvatarWrap>
                      <HeroAvatar
                        src={CONFIG.profile.image}
                        width={96}
                        height={96}
                        alt=""
                      />
                    </HeroAvatarWrap>
                    <HeroMeta>
                      <HeroName>
                        {lastName ? (
                          <>
                            <HeroNameFirst>{firstName}</HeroNameFirst>{" "}
                            <HeroNameLast>{lastName}</HeroNameLast>
                          </>
                        ) : (
                          firstName
                        )}
                      </HeroName>
                      <HeroRole>{CONFIG.profile.role}</HeroRole>
                    </HeroMeta>
                  </HeroId>
                  {taglineParts.length > 0 ? (
                    <HeroTagline>
                      {taglineParts.map((part, i) => (
                        <React.Fragment key={`${i}-${part}`}>
                          {i > 0 ? (
                            <HeroTaglineSep aria-hidden="true">
                              ·
                            </HeroTaglineSep>
                          ) : null}
                          <HeroTaglinePart $tone={i % 4}>{part}</HeroTaglinePart>
                        </React.Fragment>
                      ))}
                    </HeroTagline>
                  ) : null}
                </HeroStageMain>
                <HeroStageVisual aria-hidden="true">
                  <HeroDotGrid />
                  <HeroIsometricMark
                    viewBox="0 0 120 96"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M60 6 94 24 60 42 26 24Z" className="iso-top" />
                    <path d="M26 24 60 42 60 74 26 56Z" className="iso-left" />
                    <path d="M60 42 94 24 94 56 60 74Z" className="iso-right" />
                  </HeroIsometricMark>
                  <HeroVisualCaptions>
                    <span>CLOUD</span>
                    <span>OPS</span>
                    <span>INFRA</span>
                  </HeroVisualCaptions>
                </HeroStageVisual>
              </HeroStage>
            </AboutHero>
            <QuickFactsBlock />
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
  padding: 1.5rem 1.15rem 3.25rem;
  container-type: inline-size;
  container-name: about-drawer;
  isolation: isolate;
  overflow: hidden;
  background: ${({ theme }) => theme.brand.bg};

  /* Edgy backdrop: diagonal brand wash (Sentinel accent, not Wix palette). */
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

  &::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 5px;
    background: linear-gradient(
      180deg,
      ${({ theme }) => theme.brand.accent} 0%,
      ${({ theme }) => theme.brand.link} 55%,
      ${({ theme }) => theme.brand.signal} 100%
    );
    pointer-events: none;
    z-index: 0;
    border-radius: 0 2px 2px 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }
`

const AboutHero = styled.header`
  margin-bottom: 24px;

  @media (prefers-reduced-motion: no-preference) {
    animation: ${aboutProfileEnter} ${FEED_SIDE_PANEL_UNFOLD_MS}ms ${unfoldEase}
      both;
  }
`

const HeroLabel = styled.div`
  display: inline-flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 0.32rem 0.72rem;
  border-radius: var(--radius-sm);
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  background: ${({ theme }) => theme.brand.surface};
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.625rem;
  font-weight: 650;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.textMuted};
  box-shadow: ${({ theme }) => theme.brand.shadowSm};
`

const HeroStage = styled.div`
  display: grid;
  gap: 1rem;
  padding: 1.05rem 1rem 1rem;
  border-radius: var(--radius-lg);
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  border-top: 4px solid ${({ theme }) => theme.brand.accent};
  background: ${({ theme }) => theme.brand.surface};
  box-shadow: ${({ theme }) => theme.brand.shadowLg};
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 38%;
    max-width: 140px;
    height: 3px;
    background: ${({ theme }) => theme.brand.link};
    border-radius: 0 var(--radius-lg) 0 var(--radius-sm);
    opacity: 0.88;
    pointer-events: none;
  }

  @container about-drawer (min-width: 520px) {
    grid-template-columns: minmax(0, 1fr) minmax(104px, 32%);
    gap: 1.15rem;
    align-items: center;
  }
`

const HeroStageMain = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  min-width: 0;
`

const HeroStageVisual = styled.div`
  position: relative;
  min-height: 108px;
  border-radius: var(--radius-md);
  border: 1px dashed ${({ theme }) => theme.brand.borderSoft};
  background: ${({ theme }) => theme.brand.surfaceSunk};
  overflow: hidden;

  @container about-drawer (min-width: 520px) {
    min-height: 132px;
  }
`

const HeroDotGrid = styled.div`
  position: absolute;
  inset: 0;
  opacity: ${({ theme }) => (theme.scheme === "dark" ? 0.12 : 0.45)};
  background-image: radial-gradient(
    ${({ theme }) => theme.brand.border} 0.55px,
    transparent 0.6px
  );
  background-size: 9px 9px;
`

const HeroIsometricMark = styled.svg`
  position: absolute;
  inset: 0;
  margin: auto;
  width: min(78%, 120px);
  height: auto;
  pointer-events: none;
  filter: drop-shadow(0 2px 10px ${({ theme }) => theme.brand.accentSoft});

  .iso-top {
    fill: ${({ theme }) => theme.brand.link};
    opacity: 0.92;
  }
  .iso-left {
    fill: ${({ theme }) => theme.brand.signal};
    opacity: 0.88;
  }
  .iso-right {
    fill: ${({ theme }) => theme.brand.accent};
    opacity: 0.9;
  }
`

const HeroVisualCaptions = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 6px;
  display: none;
  justify-content: space-between;
  padding: 0 10px;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.5rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  color: ${({ theme }) => theme.brand.textFaint};

  @container about-drawer (min-width: 520px) {
    display: flex;
  }
`

const HeroPrompt = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.brand.textMuted};
`

const HeroPromptSig = styled.span`
  margin-right: 0.35rem;
  color: ${({ theme }) => theme.brand.signal};
  font-weight: 700;
`

const HeroPromptCursor = styled.span`
  animation: ${cursorBlink} 1.2s step-end infinite;
`

const HeroId = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const HeroAvatarWrap = styled.div`
  flex-shrink: 0;
  padding: 3px;
  border-radius: 1rem;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.brand.accent} 0%,
    ${({ theme }) => theme.brand.link} 100%
  );
  box-shadow: ${({ theme }) => theme.brand.shadowMd};
  transform: rotate(-2.5deg);
`

const HeroAvatar = styled(Image)`
  display: block;
  border-radius: calc(1rem - 3px);
  border: 2px solid ${({ theme }) => theme.brand.surface};
`

const HeroMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
`

const HeroName = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.brand.fontDisplay};
  font-size: clamp(1.5rem, 5.5cqi, 2.05rem);
  font-weight: 750;
  line-height: 1.08;
  letter-spacing: -0.04em;
`

const HeroNameFirst = styled.span`
  color: ${({ theme }) => theme.brand.text};
`

const HeroNameLast = styled.span`
  color: ${({ theme }) => theme.brand.accent};
`

const HeroRole = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.brand.fontSans};
  font-size: 0.9375rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.brand.text};
`

const HeroTagline = styled.p`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.35rem 0.45rem;
  margin: 0;
  line-height: 1.45;
`

const HeroTaglineSep = styled.span`
  color: ${({ theme }) => theme.brand.textFaint};
  font-weight: 500;
`

const HeroTaglinePart = styled.span<{ $tone: number }>`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.68rem;
  font-weight: 650;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme, $tone }) =>
    $tone === 0
      ? theme.brand.text
      : $tone === 1
        ? theme.brand.accent
        : $tone === 2
          ? theme.brand.link
          : theme.brand.signal};
`

const QuickFacts = styled.section`
  margin: 0 0 28px;
  padding: 16px 18px;
  border-radius: var(--radius-lg);
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  border-left: 4px solid ${({ theme }) => theme.brand.link};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.brand.surfaceSunk} 0%,
    ${({ theme }) => theme.brand.surface} 58%
  );
  box-shadow: ${({ theme }) => theme.brand.shadowMd};
`

const QuickFactsLabel = styled.p`
  margin: 0 0 10px;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.accent};
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
    background: ${({ theme }) => theme.brand.accentSoft};
    border-color: ${({ theme }) => theme.brand.accent};
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
  font-family: ${({ theme }) => theme.brand.fontProse};

  &.about-edgy-prose .post-prose .notion-page-content h1.notion-h1 {
    font-family: ${({ theme }) => theme.brand.fontDisplay};
    letter-spacing: -0.03em;
  }

  &.about-edgy-prose .post-prose .notion-page-content h2.notion-h2,
  &.about-edgy-prose
    .post-prose
    .notion-page-content
    div.notion-h2:not(:has(h2.notion-h2)) {
    padding: 0.45rem 0 0.55rem 0.55rem;
    border-left: 3px solid ${({ theme }) => theme.brand.link};
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.brand.accentSoft},
      transparent 72%
    );
    border-radius: 0 var(--radius-md) var(--radius-md) 0;
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
