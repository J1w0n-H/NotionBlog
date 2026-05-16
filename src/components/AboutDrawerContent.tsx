import Image from "next/image"
import React, { type RefObject } from "react"
import styled from "@emotion/styled"
import {
  HiServer,
  HiCog,
  HiDesktopComputer,
  HiShieldCheck,
  HiLockClosed,
  HiCloud,
  HiTerminal,
  HiGlobe,
  HiFingerPrint,
  HiChip,
  HiBeaker,
  HiCode,
  HiLightningBolt,
  HiViewGrid,
  HiAcademicCap,
  HiMail,
  HiExternalLink,
} from "react-icons/hi"
import { CONFIG } from "site.config"
import useAboutPostQuery from "src/hooks/useAboutPostQuery"
import { resolvePostBannerImageUrl } from "src/libs/utils/notion/resolvePostBannerImageUrl"
import { catVars, type CategoryToken } from "src/constants/categoryColors"
import {
  ABOUT_SECTIONS,
  ABOUT_METRICS,
  ABOUT_TIMELINE,
  type AboutSection,
} from "src/constants/aboutContent"

type Props = {
  scrollRootRef?: RefObject<HTMLDivElement | null>
}

const SECTION_ICONS: Record<string, React.ElementType[]> = {
  built: [HiServer, HiCog, HiDesktopComputer],
  protected: [HiShieldCheck, HiLockClosed, HiCloud],
  broke: [HiTerminal, HiGlobe, HiFingerPrint],
  designs: [HiChip, HiBeaker, HiCode],
  outside: [HiLightningBolt, HiViewGrid, HiAcademicCap],
}

const AboutDrawerContent: React.FC<Props> = ({ scrollRootRef }) => {
  const { profile } = CONFIG
  const state = useAboutPostQuery()
  const bannerUrl = state.detail ? resolvePostBannerImageUrl(state.detail) : null

  const handleNavClick = (id: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const target = document.getElementById(id)
    if (!target || !scrollRootRef?.current) return
    const container = scrollRootRef.current
    const offsetTop = target.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop
    container.scrollTo({ top: offsetTop - 12, behavior: "smooth" })
  }

  return (
    <Shell>
      {bannerUrl ? (
        <AboutBanner>
          <Image
            src={bannerUrl}
            alt={`${profile.name} · ${profile.role}`}
            width={0}
            height={0}
            sizes="(max-width: 640px) 100vw, min(100vw, 72rem)"
            style={{ width: "100%", height: "auto", display: "block" }}
            priority
          />
        </AboutBanner>
      ) : null}

      <HeroSection>
        <HeroName>{profile.name}</HeroName>
        <HeroRole>{profile.role}</HeroRole>
        <HeroTagline>
          Infrastructure-grounded.{" "}
          <span style={{ fontWeight: 600, color: "var(--cat-systems-solid)" }}>
            Cloud-native.
          </span>{" "}
          <span style={{ fontWeight: 600, color: "var(--cat-reverse-solid)" }}>
            Security-focused.
          </span>
        </HeroTagline>
      </HeroSection>

      <BodyGrid>
        <MainCol>
          {ABOUT_SECTIONS.map((section) => (
            <SectionBlock
              key={section.id}
              id={section.id}
              style={catVars(section.catToken as CategoryToken)}
            >
              <SectionHead>
                <SectionNumber>{section.number}</SectionNumber>
                <SectionTitle>{section.title}</SectionTitle>
              </SectionHead>
              <SectionBody section={section} />
            </SectionBlock>
          ))}
        </MainCol>

        <Sidebar>
          <SidebarPart>
            <SidebarLabel>ON THIS PAGE</SidebarLabel>
            {ABOUT_SECTIONS.map((s) => (
              <SidebarNavItem
                key={s.id}
                href={`#${s.id}`}
                onClick={(e) => handleNavClick(s.id, e)}
              >
                <NavNum>{s.number}</NavNum>
                <NavText>{s.title}</NavText>
              </SidebarNavItem>
            ))}
          </SidebarPart>

          <SidebarPart>
            <SidebarLabel>TIMELINE</SidebarLabel>
            <TimelineList>
              {ABOUT_TIMELINE.map((item) => (
                <TimelineItem key={`${item.label}-${item.period}`} data-type={item.type}>
                  <TimelineDot />
                  <TimelineContent>
                    <TimelineTitle>{item.label}</TimelineTitle>
                    <TimelineOrg>{item.org}</TimelineOrg>
                    <TimelinePeriod>{item.period}</TimelinePeriod>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </TimelineList>
          </SidebarPart>

          <SidebarPart>
            <SidebarLabel>KEY METRICS</SidebarLabel>
            <MetricsGrid>
              {ABOUT_METRICS.map((m) => (
                <MetricCell key={m.label}>
                  <MetricValue>{m.value}</MetricValue>
                  <MetricLabel>{m.label}</MetricLabel>
                </MetricCell>
              ))}
            </MetricsGrid>
          </SidebarPart>

          <SidebarPart>
            <SidebarLabel>QUICK NAV</SidebarLabel>
            <QuickNavList>
              <QuickNavLink
                href={`https://github.com/${profile.github}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <HiCode aria-hidden="true" />
                <span>GitHub</span>
              </QuickNavLink>
              <QuickNavLink
                href={`https://linkedin.com/in/${profile.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <HiExternalLink aria-hidden="true" />
                <span>LinkedIn</span>
              </QuickNavLink>
              <QuickNavLink href={`mailto:${profile.email}`}>
                <HiMail aria-hidden="true" />
                <span>Email</span>
              </QuickNavLink>
            </QuickNavList>
          </SidebarPart>
        </Sidebar>
      </BodyGrid>
    </Shell>
  )
}

const SectionBody: React.FC<{ section: AboutSection }> = ({ section }) => {
  if (section.cards) {
    const icons = SECTION_ICONS[section.id] ?? []
    return (
      <SectionCards>
        {section.cards.map((card, i) => {
          const Icon = icons[i]
          return (
            <SectionCard key={i}>
              {Icon ? (
                <CardIconWrap>
                  <Icon aria-hidden="true" />
                </CardIconWrap>
              ) : null}
              <CardTitle>{card.title}</CardTitle>
              <CardBody>{card.body}</CardBody>
            </SectionCard>
          )
        })}
      </SectionCards>
    )
  }
  if (section.cols) {
    return (
      <SectionCols>
        {section.cols.map((col, i) => (
          <SectionCol key={i}>{col}</SectionCol>
        ))}
      </SectionCols>
    )
  }
  return null
}

export default AboutDrawerContent

/* ─── Layout shell ─── */

const Shell = styled.div`
  min-width: 0;
  padding-bottom: 3rem;
  container-type: inline-size;
  container-name: about-drawer;
  position: relative;
`

/* ─── Banner ─── */

const AboutBanner = styled.div`
  overflow: hidden;
  line-height: 0;
  border-radius: var(--radius-lg);
  margin-bottom: 1.25rem;
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
`

/* ─── Hero ─── */

const HeroSection = styled.div`
  padding: 0.25rem 0 1.75rem;
`

const HeroName = styled.h1`
  margin: 0 0 0.15rem;
  font-family: ${({ theme }) => theme.brand.fontDisplay};
  font-size: 1.9rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.1;
  color: ${({ theme }) => theme.brand.text};
`

const HeroRole = styled.p`
  margin: 0 0 0.75rem;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.accent};
`

const HeroTagline = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.brand.textMuted};
`

/* ─── Body grid: main + sidebar ─── */

const BodyGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  align-items: start;

  @container about-drawer (min-width: 580px) {
    grid-template-columns: 1fr 210px;
    column-gap: 1.5rem;
  }
`

/* ─── Main column ─── */

const MainCol = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

/* ─── Section block ─── */

const SectionBlock = styled.section`
  min-width: 0;
`

const SectionHead = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  margin-bottom: 0.85rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--cat-soft);
`

const SectionNumber = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.625rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  color: var(--cat-color);
  opacity: 0.72;
`

const SectionTitle = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.brand.fontDisplay};
  font-size: 0.9375rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.text};
`

/* ─── Section cards ─── */

const SectionCards = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.6rem;

  @container about-drawer (min-width: 400px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @container about-drawer (min-width: 580px) {
    grid-template-columns: 1fr;
  }

  @container about-drawer (min-width: 760px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const SectionCard = styled.div`
  padding: 0.75rem 0.875rem 0.8rem;
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  border-radius: var(--radius-md);
  background: ${({ theme }) => theme.brand.surface};
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    border-color: var(--cat-ring);
    box-shadow: 0 0 0 1px var(--cat-soft);
  }
`

const CardIconWrap = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.1rem;
  color: var(--cat-color);

  svg {
    width: 1.1rem;
    height: 1.1rem;
  }
`

const CardTitle = styled.h3`
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 700;
  color: ${({ theme }) => theme.brand.text};
  line-height: 1.3;
`

const CardBody = styled.p`
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.55;
  color: ${({ theme }) => theme.brand.textMuted};
`

/* ─── Section columns (looking-for) ─── */

const SectionCols = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;

  @container about-drawer (min-width: 360px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @container about-drawer (min-width: 580px) {
    grid-template-columns: 1fr;
  }

  @container about-drawer (min-width: 760px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const SectionCol = styled.p`
  margin: 0;
  padding: 0.8rem 1rem;
  background: ${({ theme }) => theme.brand.surface};
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.brand.textMuted};
`

/* ─── Sidebar ─── */

const Sidebar = styled.aside`
  display: none;

  @container about-drawer (min-width: 580px) {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    position: sticky;
    top: 0;
    align-self: start;
    max-height: 90vh;
    overflow-y: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`

const SidebarPart = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`

const SidebarLabel = styled.p`
  margin: 0 0 0.3rem;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.5625rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.textFaint};
`

const SidebarNavItem = styled.a`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.2rem 0.3rem;
  border-radius: 4px;
  text-decoration: none;
  transition: background 0.12s ease;

  &:hover {
    background: ${({ theme }) => theme.brand.surface2};
  }
`

const NavNum = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.5625rem;
  font-weight: 700;
  color: ${({ theme }) => theme.brand.textFaint};
  flex-shrink: 0;
  width: 1.4rem;
`

const NavText = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.brand.textMuted};
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

/* ─── Timeline ─── */

const TimelineList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  padding-left: 0.5rem;
  border-left: 2px solid ${({ theme }) => theme.brand.borderSoft};
`

const TimelineItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.45rem;
  padding: 0.3rem 0 0.3rem 0.5rem;
  margin-left: -0.6rem;
  position: relative;
`

const TimelineDot = styled.div`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${({ theme }) => theme.brand.accent};
  flex-shrink: 0;
  margin-top: 0.3rem;
  box-shadow: 0 0 0 2px ${({ theme }) => theme.brand.bg};

  ${TimelineItem}[data-type="edu"] & {
    background: ${({ theme }) => theme.brand.textFaint};
  }
`

const TimelineContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.05rem;
  min-width: 0;
`

const TimelineTitle = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.brand.text};
  line-height: 1.3;
`

const TimelineOrg = styled.span`
  font-size: 0.6875rem;
  color: ${({ theme }) => theme.brand.textMuted};
  line-height: 1.2;
`

const TimelinePeriod = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.625rem;
  color: ${({ theme }) => theme.brand.textFaint};
  line-height: 1.2;
`

/* ─── Metrics ─── */

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.4rem;
`

const MetricCell = styled.div`
  padding: 0.45rem 0.5rem;
  background: ${({ theme }) => theme.brand.surface};
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
`

const MetricValue = styled.span`
  font-family: ${({ theme }) => theme.brand.fontDisplay};
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.brand.accent};
  line-height: 1.1;
`

const MetricLabel = styled.span`
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.brand.textFaint};
  line-height: 1.2;
`

/* ─── Quick nav ─── */

const QuickNavList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
`

const QuickNavLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.25rem 0.35rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.brand.textMuted};
  text-decoration: none;
  transition: background 0.12s ease, color 0.12s ease;

  svg {
    width: 0.85rem;
    height: 0.85rem;
    flex-shrink: 0;
    color: ${({ theme }) => theme.brand.textFaint};
  }

  &:hover {
    background: ${({ theme }) => theme.brand.surface2};
    color: ${({ theme }) => theme.brand.text};

    svg {
      color: ${({ theme }) => theme.brand.accent};
    }
  }
`
