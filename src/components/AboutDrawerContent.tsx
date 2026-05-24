import React, { type RefObject } from "react"
import styled from "@emotion/styled"
import useLanguage from "src/hooks/useLanguage"
import AboutHeroViz from "src/components/AboutHeroViz"
import {
  HiChip,
  HiBeaker,
  HiCode,
  HiMail,
  HiExternalLink,
} from "react-icons/hi"
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
  // Designs cards (still card format)
  "Secure IoT Protocols": "안전한 IoT 프로토콜",
  "Implemented TLS on RTOS to validate mutual auth and latency tradeoffs on resource-constrained sensor nodes.":
    "자원 제한 센서 노드에서 상호 인증 및 지연 시간 트레이드오프를 검증하기 위해 RTOS에 TLS를 구현했습니다.",
  "AI & LLM Security": "AI & LLM 보안",
  "Researching how language models expand the threat surface — coursework in LLMs, Security, and Privacy at UMD.":
    "언어 모델이 위협 표면을 어떻게 확장하는지 연구 중이며, UMD에서 LLM, 보안, 개인정보 과목을 수강하고 있습니다.",
  "Cloud-Native Controls": "클라우드 네이티브 제어",
  "Designing cloud-native security controls and observability pipelines for production Kubernetes environments.":
    "운영 환경의 쿠버네티스를 위한 클라우드 네이티브 보안 제어 및 관측 파이프라인을 설계하고 있습니다.",
  // Metrics labels
  "servers managed": "서버 관리",
  "faster provisioning": "프로비저닝 단축",
  "users migrated": "사용자 마이그레이션",
  "services separated": "서비스 분리",
  "ops experience": "운영 경험",
  graduating: "졸업 예정",
  // Timeline
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

const DESIGNS_ICONS = [HiChip, HiBeaker, HiCode]

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

      <NarrativeSection>
        <NarrativeHeader>{tr("— PATH")}</NarrativeHeader>
        {isKo ? (
          <>
            <NarrativeParagraph className="drop-cap">
              인문학에서 수학으로, 수학에서 보안 컨설팅으로, 컨설팅에서 시스템
              관리로, 그리고 지금은 UMD 사이버보안 대학원생으로. 2025년 초
              LinkedIn에 3부작 글을 썼고, 1년도 채 안 되어{" "}
              <strong>4,000회 이상의 조회수</strong>를 기록했습니다.
            </NarrativeParagraph>
            <LinkedInArticles>
              {LI_ARTICLES.map((a) => (
                <LIItem key={a.num} href={a.href} target="_blank" rel="noopener noreferrer">
                  <LINum>{a.num}</LINum>
                  <span>{a.ko} · {a.views} views</span>
                </LIItem>
              ))}
            </LinkedInArticles>
            <NarrativeParagraph>
              대학 졸업 직후 보안 컨설팅 인턴으로 시작했습니다. SK텔레콤 ISMS
              감사에서 팀원 세 명 중{" "}
              <strong>유일하게 감사 후 개선 과정에 남겨달라는 요청을 받았습니다</strong>
              . 6개월 계약이 끝날 무렵 대학원 지원이 포함된 정규직 제안을 받았지만
              거절했습니다.
            </NarrativeParagraph>
            <PathPullQuote>
              올바른 판단에는 직접적인 경험이 필요합니다. 그 시점의 저는 아직 그
              경험이 부족했습니다.
            </PathPullQuote>
            <NarrativeParagraph>
              그래서 시스템 관리자가 되었습니다. 3년 8개월 동안{" "}
              <strong>200노드 규모의 인프라</strong>를 설계·운영하고, 자동화를
              구축하고, 감사를 통과하고, 장애에서 회복했습니다. 이 블로그의 글들은
              그 과정에서 생긴 질문을 풀어가는 공간입니다.
            </NarrativeParagraph>
          </>
        ) : (
          <>
            <NarrativeParagraph className="drop-cap">
              From liberal arts to mathematics, then mathematics to security
              consulting, consulting to systems administration, and now a graduate
              student in cybersecurity at UMD. In early 2025 I wrote about this path
              in a three-part LinkedIn series —{" "}
              <strong>4,000+ impressions in under a year</strong>.
            </NarrativeParagraph>
            <LinkedInArticles>
              {LI_ARTICLES.map((a) => (
                <LIItem key={a.num} href={a.href} target="_blank" rel="noopener noreferrer">
                  <LINum>{a.num}</LINum>
                  <span>{a.en} · {a.views} views</span>
                </LIItem>
              ))}
            </LinkedInArticles>
            <NarrativeParagraph>
              I started as a security consulting intern straight out of undergrad. On
              the SK Telecom ISMS audit I was one of three on the team —{" "}
              <strong>the only one asked to stay for post-audit remediation</strong>.
              A full-time offer came with graduate-school sponsorship. I turned it
              down.
            </NarrativeParagraph>
            <PathPullQuote>
              Sound judgment requires direct experience. I did not yet have it.
            </PathPullQuote>
            <NarrativeParagraph>
              So I became a systems administrator. Over three years and eight months I
              designed and operated <strong>200-node infrastructure</strong>, built
              automation, passed audits, and recovered from production failures. The
              posts here are where I work out the questions that came next.
            </NarrativeParagraph>
          </>
        )}
      </NarrativeSection>

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
                <SectionTitle>{tr(section.title)}</SectionTitle>
              </SectionHead>
              <SectionBody section={section} tr={tr} isKo={isKo} />
            </SectionBlock>
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

/* ── Section body dispatcher ── */

const SectionBody: React.FC<{
  section: AboutSection
  tr: (t: string) => string
  isKo: boolean
}> = ({ section, tr, isKo }) => {
  if (section.narrative) {
    return <NarrativeBlockList blocks={section.narrative} isKo={isKo} />
  }
  if (section.cards) {
    const icons = section.id === "designs" ? DESIGNS_ICONS : []
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
              <CardTitle>{tr(card.title)}</CardTitle>
              <CardBody>{tr(card.body)}</CardBody>
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
      if (block.type === "quote") {
        const text = isKo && block.ko ? block.ko : block.en
        return <PullQuote key={i}>{text}</PullQuote>
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
              <PhotoSlot key={j}>
                <PhotoImg src={photo.src} alt={isKo && photo.captionKo ? photo.captionKo : photo.captionEn} />
                <PhotoCaption>{isKo && photo.captionKo ? photo.captionKo : photo.captionEn}</PhotoCaption>
              </PhotoSlot>
            ))}
          </PhotoGrid>
        )
      }
      return null
    })}
  </NarrativeBody>
)

export default AboutDrawerContent

/* ─── Layout shell ─── */

const Shell = styled.div`
  min-width: 0;
  padding-bottom: 3rem;
  container-type: inline-size;
  container-name: about-drawer;
  position: relative;
`

/* ─── PATH Narrative ─── */

const NarrativeSection = styled.div`
  padding: 0.25rem 0 1.75rem 1rem;
  border-left: 2px solid ${({ theme }) => theme.brand.accent};
`

const NarrativeHeader = styled.p`
  margin: 0 0 0.85rem;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.6875rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.accent};
`

const NarrativeParagraph = styled.p`
  margin: 0 0 0.85rem;
  font-size: 0.9375rem;
  line-height: 1.65;
  color: ${({ theme }) => theme.brand.textMuted};

  &:last-child {
    margin-bottom: 0;
  }

  strong {
    font-weight: 700;
    color: ${({ theme }) => theme.brand.text};
  }

  &.drop-cap::first-letter {
    font-family: ${({ theme }) => theme.brand.fontDisplay};
    font-size: 3.2rem;
    font-weight: 800;
    line-height: 0.85;
    float: left;
    margin-right: 0.08em;
    color: ${({ theme }) => theme.brand.text};
  }
`

const PathPullQuote = styled.blockquote`
  margin: 0.6rem 0 0.85rem;
  padding: 0.35rem 0 0.35rem 0.875rem;
  border-left: 2px solid ${({ theme }) => theme.brand.borderSoft};
  font-size: 0.9375rem;
  font-style: italic;
  line-height: 1.6;
  color: ${({ theme }) => theme.brand.textMuted};
  opacity: 0.85;
`

/* ─── LinkedIn article links ─── */

const LinkedInArticles = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin: 0.6rem 0 0.85rem;
`

const LIItem = styled.a`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  text-decoration: none;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.625rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.brand.textFaint};
  transition: color 0.12s ease;

  &:hover {
    color: ${({ theme }) => theme.brand.textMuted};
  }

  span {
    flex: 1;
  }
`

const LINum = styled.span`
  color: ${({ theme }) => theme.brand.accent};
  flex-shrink: 0;
  font-weight: 700;
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

/* ─── Narrative section body ─── */

const NarrativeBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const NarrP = styled.p`
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.brand.textMuted};

  strong {
    font-weight: 700;
    color: ${({ theme }) => theme.brand.text};
  }

  em {
    font-style: italic;
  }
`

const PullQuote = styled.blockquote`
  margin: 0;
  padding: 0.35rem 0 0.35rem 0.875rem;
  border-left: 2px solid var(--cat-ring);
  font-size: 0.875rem;
  font-style: italic;
  line-height: 1.6;
  color: ${({ theme }) => theme.brand.textMuted};
  opacity: 0.85;
`

const InlineMetrics = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.brand.surface};
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  border-radius: var(--radius-md);
`

const IMCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const IMVal = styled.span`
  font-family: ${({ theme }) => theme.brand.fontDisplay};
  font-size: 1.125rem;
  font-weight: 800;
  color: ${({ theme }) => theme.brand.text};
  line-height: 1;
  letter-spacing: -0.02em;
`

const IMLbl = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.5625rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.brand.textFaint};
  text-transform: uppercase;
`

const PhotoGrid = styled.div<{ $count: number }>`
  display: grid;
  grid-template-columns: ${({ $count }) => `repeat(${$count}, 1fr)`};
  gap: 0.5rem;
`

const PhotoSlot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`

const PhotoImg = styled.img`
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: var(--radius-md);
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  display: block;
`

const PhotoCaption = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.5625rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.brand.textFaint};
  text-align: center;
  text-transform: uppercase;
`

/* ─── Section cards (Designs) ─── */

const SectionCards = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.6rem;

  @container about-drawer (min-width: 400px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @container about-drawer (min-width: 500px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @container about-drawer (min-width: 580px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @container about-drawer (min-width: 760px) {
    grid-template-columns: repeat(3, 1fr);
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

/* ─── Section columns (unused but kept for future) ─── */

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
