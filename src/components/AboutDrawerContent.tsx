import Image from "next/image"
import React from "react"
import styled from "@emotion/styled"
import { CONFIG } from "site.config"
import ErrorBoundary from "src/components/ErrorBoundary"
import PostDetailQueryView from "src/components/PostDetailQueryView"
import useAboutPostQuery from "src/hooks/useAboutPostQuery"
import NotionRenderer from "src/routes/Detail/components/NotionRenderer"
import TranslatedNotionRenderer from "src/routes/Detail/components/TranslatedNotionRenderer"

const AboutDrawerContent: React.FC = () => {
  const state = useAboutPostQuery()

  return (
    <PostDetailQueryView
      state={state}
      statusScope="panel"
      statusSubject="about"
    >
      {(detail) => {
        const isPost = detail.type[0] === "Post"

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
  padding: 32px 32px 64px;
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
  margin-bottom: 32px;
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
