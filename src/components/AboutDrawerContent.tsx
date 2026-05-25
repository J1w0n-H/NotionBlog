import React, { type RefObject } from "react"
import styled from "@emotion/styled"
import useLanguage from "src/hooks/useLanguage"
import AboutHeroViz from "src/components/AboutHeroViz"
import { HiCode, HiMail, HiExternalLink } from "react-icons/hi"
import { CONFIG } from "site.config"
import { catVars, type CategoryToken } from "src/constants/categoryColors"
import {
  ABOUT_SECTIONS,
  ABOUT_METRICS,
  ABOUT_TIMELINE,
  type AboutSection,
  type NarrativeBlock,
} from "src/constants/aboutContent"

const KO_ABOUT: Record<string, string> = {
  "— PATH": "— 경로",
  "ON THIS PAGE": "이 페이지",
  TIMELINE: "타임라인",
  "KEY METRICS": "주요 지표",
  "QUICK NAV": "빠른 이동",
  BUILT: "구축",
  PROTECTED: "보호",
  BROKE: "해킹",
  "DESIGNS WHAT COMES NEXT": "다음을 설계하다",
  "OUTSIDE OF WORK": "업무 외",
  "WHAT I AM LOOKING FOR": "찾고 있는 것",
  "servers managed": "서버 관리",
  "faster provisioning": "프로비저닝 단축",
  "users migrated": "사용자 마이그레이션",
  "services separated": "서비스 분리",
  "ops experience": "운영 경험",
  graduating: "졸업 예정",
  "M.Eng. Cybersecurity": "사이버보안 공학 석사",
  "University of Maryland": "메릴랜드 대학교",
  "Aug 2024 – May 2026": "2024년 8월 – 2026년 5월",
  "Graduate Research Assistant": "대학원 연구 조교",
  "SEED Lab · UMD": "SEED Lab · UMD",
  "Mar – May 2026": "2026년 3월 – 2026년 5월",
  "System Administrator": "시스템 관리자",
  "Theragen Bio": "테라젠바이오",
  "Dec 2020 – Aug 2024": "2020년 12월 – 2024년 8월",
  "Security Consultant": "보안 컨설턴트",
  KISMI: "한국정보보호경영연구소",
  "May – Nov 2020": "2020년 5월 – 2020년 11월",
  "B.S. Math & B.E. InfoSec": "수학 이학사 · 정보보안 공학사",
  "Seoul Women's University": "서울여자대학교",
  "Mar 2015 – Aug 2020": "2015년 3월 – 2020년 8월",
}

const LI_ARTICLES = [
  {
    num: "P01",
    en: "Fake It Till You Make It — My Crash Course in Security Consulting",
    ko: "배우면서 따라가기 — 보안 컨설팅 속성 과정",
    views: "1,236",
    href: "https://www.linkedin.com/pulse/e1-p01-fake-till-you-make-my-crash-course-security-consulting-hwang-h1zge/",
  },
  {
    num: "P02",
    en: "Trading the Checklist for Command Line — Why I Switched to Systems",
    ko: "체크리스트에서 커맨드라인으로 — 시스템으로 전환한 이유",
    views: "613",
    href: "https://www.linkedin.com/pulse/e1-p02-trading-checklist-command-linewhy-i-switched-system-hwang-jatne",
  },
  {
    num: "P03",
    en: "Bridging Two Worlds — Security Meets Systems",
    ko: "두 세계를 잇다 — 보안과 시스템의 만남",
    views: "2,244",
    href: "https://www.linkedin.com/pulse/e1-p03-bridging-two-worlds-security-meets-systems-jiwon-hwang-ynaxe/",
  },
]

type Props = {
  scrollRootRef?: RefObject<HTMLDivElement | null>
}

const AboutDrawerContent: React.FC<Props> = ({ scrollRootRef }) => {
  const { profile } = CONFIG
  const [language] = useLanguage()
  const isKo = language === "ko"
  const tr = isKo ? (t: string) => KO_ABOUT[t] ?? t : (t: string) => t

  const handleNavClick = (id: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const target = document.getElementById(id)
    if (!target || !scrollRootRef?.current) return
    const container = scrollRootRef.current
    const offsetTop =
      target.getBoundingClientRect().top -
      container.getBoundingClientRect().top +
      container.scrollTop
    container.scrollTo({ top: offsetTop - 12, behavior: "smooth" })
  }

  return (
    <Shell>
      <AboutHeroViz />

      {/* PATH */}
      <NarrativeSection>
        <PathHero>
          <div>
            <NarrativeHeader>{tr("— PATH")}</NarrativeHeader>
            <LedeLine>
              {isKo
                ? "만들고, 부수고, 다음을 설계하는 사람"
                : "Someone Who Builds, Breaks, and Designs What Comes Next"}
            </LedeLine>
            <NarrativeParagraph>
              {isKo ? (
                <>
                  인문학에서 수학으로, 수학에서 보안 컨설팅으로, 컨설팅에서
                  시스템 관리로, 그리고 지금은 UMD 사이버보안 대학원생으로. 2025년 초
                  LinkedIn에 3부작 글을 썼고, 1년도 채 안 되어{" "}
                  <strong>4,000회 이상의 조회수</strong>를 기록했습니다.
                </>
              ) : (
                <>
                  From liberal arts to mathematics, then mathematics to security
                  consulting, consulting to systems administration, and now a graduate
                  student in cybersecurity at UMD. In early 2025 I wrote about this path
                  in a three-part LinkedIn series; the response (
                  <strong>4,000+ impressions in under a year</strong>) suggested others
                  had wrestled with similar questions.
                </>
              )}
            </NarrativeParagraph>
          </div>
          <ProfilePhotoWrap>
            <ProfilePhotoImg src="/about/DCprofile.jpg" alt="Jiwon Hwang" />
          </ProfilePhotoWrap>
        </PathHero>

        <SeriesList>
          {LI_ARTICLES.map((a) => (
            <SeriesItem key={a.num} href={a.href} target="_blank" rel="noopener noreferrer">
              <SeriesNum>{a.num}</SeriesNum>
              <SeriesTitle>{isKo ? a.ko : a.en}</SeriesTitle>
              <SeriesViews>{a.views}</SeriesViews>
            </SeriesItem>
          ))}
        </SeriesList>

        {isKo ? (
          <>
            <NarrativeParagraph>
              대학 졸업 직후 보안 컨설팅 인턴으로 시작했습니다. SK텔레콤 ISMS 감사에서
              팀원 세 명 중{" "}
              <strong>유일하게 인턴십 기간 동안 감사 후 개선 과정에 남겨달라는 요청을 받았습니다</strong>
              . 6개월 계약이 끝날 무렵 대학원 지원이 포함된 정규직 제안을 받았지만 거절했습니다.
              올바른 판단에는 직접적인 경험이 필요하다고 생각했고, 그 시점의 저는 아직 그
              경험이 부족했습니다.
            </NarrativeParagraph>
            <NarrativeParagraph>
              그래서 시스템 관리자가 되었습니다. 3년 8개월 동안{" "}
              <strong>200노드 규모의 인프라</strong>를 설계·운영하고, 자동화를 구축하고,
              감사를 통과하고, 장애에서 회복했습니다. 운영을 통해 공격자의 시각이 내 이해에
              빠져 있다는 게 분명해졌고, 대학원은 그 공백을 메우기 위한 선택이었습니다.
            </NarrativeParagraph>
            <NarrativeParagraph>
              UMD에서 클라우드 보안, LLM 보안, GitOps를 연구하며 특정한 질문에 집중하고
              있습니다: 인프라가 계속 변화할 때 방어는 어디에 있어야 효과적인가. 이
              포트폴리오는 그 과정에서 구축하고, 부수고, 설계한 것들의 기록입니다.
            </NarrativeParagraph>
          </>
        ) : (
          <>
            <NarrativeParagraph>
              I started as a security consulting intern straight out of undergrad. On the
              SK Telecom ISMS audit, I was one of three on the team and{" "}
              <strong>
                the only one asked to stay on for post-audit remediation during the
                internship
              </strong>
              . At the end of the six-month role, a full-time offer came with graduate
              school sponsorship included. I turned it down. I had come to believe that
              sound judgment requires direct experience, and I did not yet have it.
            </NarrativeParagraph>
            <NarrativeParagraph>
              So I became a systems administrator. Over three years and eight months, I
              designed and operated <strong>200-node infrastructure</strong>, built
              automation, passed audits, and recovered from production failures. Operations
              made clear that an attacker&apos;s perspective was missing from my
              understanding, and graduate school was where I decided to fill that gap.
            </NarrativeParagraph>
            <NarrativeParagraph>
              At UMD, working across cloud security, LLM security, and GitOps, I&apos;ve
              been focused on a specific question: where does defense need to live to stay
              effective when the infrastructure underneath it keeps changing. This portfolio
              is a record of what I built, broke, and designed along the way.
            </NarrativeParagraph>
          </>
        )}
      </NarrativeSection>

      <BodyGrid>
        <MainCol>
          {ABOUT_SECTIONS.map((section, idx) => (
            <React.Fragment key={section.id}>
              {idx > 0 && <SectionDividerEl num={section.number} />}
              <SectionBlock
                id={section.id}
                style={catVars(section.catToken as CategoryToken)}
              >
                <SectionHead>
                  {section.ghost && <SectionGhost>{section.ghost}</SectionGhost>}
                  <SectionHeadRow>
                    <SectionNumber>{section.number}</SectionNumber>
                    <SectionTitle>{tr(section.title)}</SectionTitle>
                    {section.subtitle && (
                      <SectionSub>
                        {isKo && section.subtitleKo ? section.subtitleKo : section.subtitle}
                      </SectionSub>
                    )}
                  </SectionHeadRow>
                </SectionHead>
                <SectionBody section={section} tr={tr} isKo={isKo} />
              </SectionBlock>
            </React.Fragment>
          ))}
        </MainCol>

        <Sidebar>
          <SidebarPart>
            <SidebarLabel>{tr("ON THIS PAGE")}</SidebarLabel>
            {ABOUT_SECTIONS.map((s) => (
              <SidebarNavItem
                key={s.id}
                href={`#${s.id}`}
                onClick={(e) => handleNavClick(s.id, e)}
              >
                <NavNum>{s.number}</NavNum>
                <NavText>{tr(s.title)}</NavText>
              </SidebarNavItem>
            ))}
          </SidebarPart>

          <SidebarPart>
            <SidebarLabel>{tr("TIMELINE")}</SidebarLabel>
            <TimelineList>
              {ABOUT_TIMELINE.map((item) => (
                <TimelineItem key={`${item.label}-${item.period}`} data-type={item.type}>
                  <TimelineDot />
                  <TimelineContent>
                    <TimelineTitle>{tr(item.label)}</TimelineTitle>
                    <TimelineOrg>{tr(item.org)}</TimelineOrg>
                    <TimelinePeriod>{tr(item.period)}</TimelinePeriod>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </TimelineList>
          </SidebarPart>

          <SidebarPart>
            <SidebarLabel>{tr("KEY METRICS")}</SidebarLabel>
            <MetricsGrid>
              {ABOUT_METRICS.map((m) => (
                <MetricCell key={m.label}>
                  <MetricValue>{m.value}</MetricValue>
                  <MetricLabel>{tr(m.label)}</MetricLabel>
                </MetricCell>
              ))}
            </MetricsGrid>
          </SidebarPart>

          <SidebarPart>
            <SidebarLabel>{tr("QUICK NAV")}</SidebarLabel>
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

/* ── Section divider ── */

const SectionDividerEl: React.FC<{ num: string }> = ({ num }) => (
  <SectionDivider>
    <span>{num}</span>
  </SectionDivider>
)

/* ── Section body dispatcher ── */

const SectionBody: React.FC<{
  section: AboutSection
  tr: (t: string) => string
  isKo: boolean
}> = ({ section, tr, isKo }) => {
  if (section.narrative) {
    return <NarrativeBlockList blocks={section.narrative} isKo={isKo} />
  }
  if (section.cols) {
    return (
      <SectionCols>
        {section.cols.map((col, i) => (
          <SectionCol key={i}>{tr(col)}</SectionCol>
        ))}
      </SectionCols>
    )
  }
  return null
}

/* ── Narrative block renderer ── */

const NarrativeBlockList: React.FC<{ blocks: NarrativeBlock[]; isKo: boolean }> = ({
  blocks,
  isKo,
}) => (
  <NarrativeBody>
    {blocks.map((block, i) => {
      if (block.type === "p") {
        const html = isKo && block.ko ? block.ko : block.en
        return <NarrP key={i} dangerouslySetInnerHTML={{ __html: html }} />
      }
      if (block.type === "sub") {
        const text = isKo && block.ko ? block.ko : block.en
        return <SubHead key={i}>{text}</SubHead>
      }
      if (block.type === "quote") {
        const text = isKo && block.ko ? block.ko : block.en
        return <FullPullQuote key={i}><p>{text}</p></FullPullQuote>
      }
      if (block.type === "metrics") {
        return (
          <InlineMetrics key={i}>
            {block.items.map((m, j) => (
              <IMCell key={j}>
                <IMVal>{m.val}</IMVal>
                <IMLbl>{isKo && m.ko ? m.ko : m.en}</IMLbl>
              </IMCell>
            ))}
          </InlineMetrics>
        )
      }
      if (block.type === "photos") {
        return (
          <PhotoGrid key={i} $count={block.items.length}>
            {block.items.map((photo, j) => (
              <PhotoHalf key={j}>
                <PhotoImg
                  src={photo.src}
                  alt={isKo && photo.captionKo ? photo.captionKo : photo.captionEn}
                />
              </PhotoHalf>
            ))}
          </PhotoGrid>
        )
      }
      if (block.type === "photo-wide") {
        return (
          <PhotoWide key={i}>
            <PhotoImg
              src={block.src}
              alt={isKo && block.altKo ? block.altKo : block.altEn}
            />
          </PhotoWide>
        )
      }
      if (block.type === "ref") {
        return (
          <RefRow key={i}>
            <a href={block.href} target="_blank" rel="noopener noreferrer">
              {block.label}
            </a>
          </RefRow>
        )
      }
      return null
    })}
  </NarrativeBody>
)

export default AboutDrawerContent

/* ─── Shell ─── */

const Shell = styled.div`
  min-width: 0;
  padding-bottom: 3rem;
  container-type: inline-size;
  container-name: about-drawer;
  position: relative;
`

/* ─── PATH section ─── */

const NarrativeSection = styled.div`
  padding: 0 0 1.75rem;
`

const PathHero = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px;
  gap: 1.25rem;
  align-items: start;
  margin-bottom: 1.1rem;
`

const NarrativeHeader = styled.p`
  margin: 0 0 0.65rem;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.6875rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.accent};
`

const LedeLine = styled.p`
  margin: 0 0 0.75rem;
  font-family: "Source Serif 4", "Lora", Georgia, serif;
  font-size: clamp(15px, 2vw, 18px);
  font-style: italic;
  font-weight: 400;
  line-height: 1.4;
  color: ${({ theme }) => theme.brand.text};
`

const NarrativeParagraph = styled.p`
  margin: 0 0 0.8rem;
  font-size: 0.9rem;
  line-height: 1.75;
  color: ${({ theme }) => theme.brand.textMuted};

  &:last-child { margin-bottom: 0; }

  strong {
    font-weight: 600;
    color: ${({ theme }) => theme.brand.text};
  }
`

const ProfilePhotoWrap = styled.div`
  width: 120px;
  height: 152px;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  flex-shrink: 0;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: ${({ theme }) => theme.brand.accent};
    z-index: 1;
  }
`

const ProfilePhotoImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  display: block;
`

/* ─── LinkedIn series list ─── */

const SeriesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0.75rem 0 1rem;
`

const SeriesItem = styled.a`
  display: grid;
  grid-template-columns: 22px 1fr auto;
  gap: 8px;
  align-items: start;
  padding: 7px 10px;
  background: ${({ theme }) => theme.brand.surface};
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: border-color 0.15s ease, background 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.brand.accent}44;
    background: ${({ theme }) => theme.brand.surface2};
  }
`

const SeriesNum = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.5625rem;
  color: ${({ theme }) => theme.brand.accent};
  font-weight: 700;
  letter-spacing: 0.06em;
  padding-top: 1px;
`

const SeriesTitle = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.brand.textMuted};
  line-height: 1.45;
`

const SeriesViews = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.5625rem;
  color: ${({ theme }) => theme.brand.textFaint};
  padding-top: 1px;
  white-space: nowrap;
`

/* ─── Body grid ─── */

const BodyGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  align-items: start;

  @container about-drawer (min-width: 580px) {
    grid-template-columns: 1fr 200px;
    column-gap: 1.5rem;
  }
`

const MainCol = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
`

/* ─── Section divider ─── */

const SectionDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 2.5rem 0;

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.brand.borderSoft};
  }

  span {
    font-family: ${({ theme }) => theme.brand.fontMono};
    font-size: 0.5rem;
    color: ${({ theme }) => theme.brand.textFaint};
    letter-spacing: 0.2em;
  }
`

/* ─── Section block ─── */

const SectionBlock = styled.section`
  min-width: 0;
`

const SectionHead = styled.div`
  position: relative;
  margin-bottom: 1.25rem;
  padding-top: 0.25rem;
`

const SectionGhost = styled.span`
  position: absolute;
  top: -14px;
  left: -2px;
  font-family: ${({ theme }) => theme.brand.fontDisplay};
  font-size: 72px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.022);
  line-height: 1;
  pointer-events: none;
  user-select: none;
  letter-spacing: -0.04em;
  z-index: 0;
`

const SectionHeadRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  position: relative;
  z-index: 1;
  flex-wrap: wrap;
`

const SectionNumber = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: ${({ theme }) => theme.brand.accent};
`

const SectionTitle = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.brand.fontDisplay};
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.text};
`

const SectionSub = styled.span`
  font-size: 0.6875rem;
  font-weight: 300;
  color: ${({ theme }) => theme.brand.textFaint};
`

/* ─── Narrative body ─── */

const NarrativeBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
`

const NarrP = styled.p`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.8;
  color: ${({ theme }) => theme.brand.textMuted};

  strong { font-weight: 600; color: ${({ theme }) => theme.brand.text}; }
  em { font-style: italic; }
  code {
    font-family: ${({ theme }) => theme.brand.fontMono};
    font-size: 0.75rem;
    background: ${({ theme }) => theme.brand.surface2};
    border: 1px solid ${({ theme }) => theme.brand.borderSoft};
    padding: 1px 5px;
    border-radius: 3px;
    color: ${({ theme }) => theme.brand.text};
  }
`

const SubHead = styled.p`
  margin: 0.6rem 0 0.1rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.brand.text};
  display: flex;
  align-items: center;
  gap: 7px;

  &::before {
    content: '';
    display: block;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: ${({ theme }) => theme.brand.accent};
    flex-shrink: 0;
  }
`

const FullPullQuote = styled.blockquote`
  margin: 0.5rem -1.25rem;
  padding: 1.25rem 1.75rem;
  background: ${({ theme }) => theme.brand.surface};
  border-top: 1px solid ${({ theme }) => theme.brand.borderSoft};
  border-bottom: 1px solid ${({ theme }) => theme.brand.borderSoft};
  position: relative;

  &::before {
    content: '"';
    font-family: "Source Serif 4", "Lora", Georgia, serif;
    font-size: 56px;
    line-height: 0.8;
    color: ${({ theme }) => theme.brand.accent}18;
    position: absolute;
    top: 1rem;
    left: 1.4rem;
    pointer-events: none;
  }

  p {
    font-family: "Source Serif 4", "Lora", Georgia, serif;
    font-size: 0.9375rem;
    font-style: italic;
    color: ${({ theme }) => theme.brand.textMuted};
    line-height: 1.7;
    position: relative;
  }
`

const InlineMetrics = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
  margin: 0.25rem 0;

  @container about-drawer (max-width: 420px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const IMCell = styled.div`
  background: ${({ theme }) => theme.brand.surface};
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  border-radius: var(--radius-md);
  padding: 10px 10px 9px;
`

const IMVal = styled.div`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 1.125rem;
  color: ${({ theme }) => theme.brand.text};
  line-height: 1;
  margin-bottom: 5px;
  font-weight: 500;
`

const IMLbl = styled.div`
  font-size: 0.5625rem;
  color: ${({ theme }) => theme.brand.textFaint};
  line-height: 1.3;
`

const PhotoGrid = styled.div<{ $count: number }>`
  display: grid;
  grid-template-columns: ${({ $count }) => `repeat(${$count}, 1fr)`};
  gap: 8px;
  margin: 0.25rem 0;
`

const PhotoHalf = styled.div`
  border-radius: var(--radius-md);
  overflow: hidden;
  height: 180px;
  position: relative;
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(13, 13, 18, 0.45) 0%, transparent 55%);
    pointer-events: none;
  }
`

const PhotoWide = styled.div`
  border-radius: var(--radius-md);
  overflow: hidden;
  height: 200px;
  position: relative;
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  margin: 0.25rem 0;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(13, 13, 18, 0.5) 0%, transparent 55%);
    pointer-events: none;
  }
`

const PhotoImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`

const RefRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0.1rem 0 0.3rem;

  &::before {
    content: '↗';
    font-size: 0.5625rem;
    color: ${({ theme }) => theme.brand.accent};
  }

  a {
    font-family: ${({ theme }) => theme.brand.fontMono};
    font-size: 0.625rem;
    color: ${({ theme }) => theme.brand.textFaint};
    text-decoration: none;
    transition: color 0.15s ease;

    &:hover {
      color: ${({ theme }) => theme.brand.accent};
    }
  }
`

/* ─── Section cols (fallback) ─── */

const SectionCols = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
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
    &::-webkit-scrollbar { display: none; }
  }
`

const SidebarPart = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`

const SidebarLabel = styled.p`
  margin: 0 0 0.4rem;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.5rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.textFaint};
  display: flex;
  align-items: center;
  gap: 8px;

  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.brand.borderSoft};
  }
`

const SidebarNavItem = styled.a`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.2rem 0.3rem;
  border-radius: 4px;
  text-decoration: none;
  transition: background 0.12s ease;

  &:hover { background: ${({ theme }) => theme.brand.surface2}; }
`

const NavNum = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.5rem;
  color: ${({ theme }) => theme.brand.accent};
  flex-shrink: 0;
  width: 1.2rem;
`

const NavText = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.5625rem;
  color: ${({ theme }) => theme.brand.textFaint};
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.12s ease;

  ${SidebarNavItem}:hover & { color: ${({ theme }) => theme.brand.text}; }
`

/* ─── Timeline ─── */

const TimelineList = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 3px;
`

const TimelineItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0 0 1rem 12px;
  border-left: 1px solid ${({ theme }) => theme.brand.borderSoft};
  position: relative;

  &:last-child { border-left-color: transparent; }
`

const TimelineDot = styled.div`
  position: absolute;
  left: -4px;
  top: 5px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ theme }) => theme.brand.bg};
  border: 1.5px solid ${({ theme }) => theme.brand.accent};
  opacity: 0.7;

  ${TimelineItem}[data-type="edu"] & {
    border-color: ${({ theme }) => theme.brand.textFaint};
    opacity: 0.5;
  }
`

const TimelineContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
`

const TimelineTitle = styled.span`
  font-size: 0.625rem;
  font-weight: 500;
  color: ${({ theme }) => theme.brand.text};
  line-height: 1.4;
`

const TimelineOrg = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.5rem;
  color: ${({ theme }) => theme.brand.textFaint};
  line-height: 1.2;
`

const TimelinePeriod = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.5rem;
  color: ${({ theme }) => theme.brand.textFaint};
  line-height: 1.2;
  opacity: 0.7;
`

/* ─── Metrics ─── */

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
`

const MetricCell = styled.div`
  padding: 7px 8px;
  background: ${({ theme }) => theme.brand.surface};
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const MetricValue = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.brand.text};
  line-height: 1;
`

const MetricLabel = styled.span`
  font-size: 0.5rem;
  color: ${({ theme }) => theme.brand.textFaint};
  line-height: 1.3;
`

/* ─── Quick nav ─── */

const QuickNavList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`

const QuickNavLink = styled.a`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 4px;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.5625rem;
  color: ${({ theme }) => theme.brand.textFaint};
  text-decoration: none;
  transition: color 0.12s ease;

  &::before {
    content: '</';
    color: ${({ theme }) => theme.brand.accent};
    font-size: 0.5rem;
  }

  svg { display: none; }

  &:hover { color: ${({ theme }) => theme.brand.text}; }
`
