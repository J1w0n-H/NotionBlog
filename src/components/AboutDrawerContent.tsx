import React, { type RefObject } from "react"
import styled from "@emotion/styled"
import useLanguage from "src/hooks/useLanguage"
import AboutHeroViz from "src/components/AboutHeroViz"
import { CONFIG } from "site.config"
import { catVars, type CategoryToken } from "src/constants/categoryColors"
import {
  ABOUT_SECTIONS,
  ABOUT_METRICS,
  ABOUT_TIMELINE,
  LI_ARTICLES,
  type AboutSection,
  type NarrativeBlock,
} from "src/constants/aboutContent"

const KO_ABOUT: Record<string, string> = {
  "— PATH": "— 경로",
  "ON THIS PAGE": "이 페이지",
  TIMELINE: "타임라인",
  "KEY METRICS": "주요 지표",
  "QUICK NAV": "빠른 이동",
  "nodes managed": "노드 관리",
  "provisioning time": "프로비저닝 시간",
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

type Props = {
  scrollRootRef?: RefObject<HTMLDivElement | null>
}

const AboutDrawerContent: React.FC<Props> = ({ scrollRootRef }) => {
  const { profile } = CONFIG
  const [language] = useLanguage()
  const isKo = language === "ko"
  const tr = isKo ? (t: string) => KO_ABOUT[t] ?? t : (t: string) => t

  const navSections = ABOUT_SECTIONS.filter((s) => s.id !== "path")
  const [activeId, setActiveId] = React.useState<string>(navSections[0]?.id ?? "")

  React.useEffect(() => {
    const elements = navSections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null)
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      {
        root: scrollRootRef?.current ?? null,
        threshold: 0.15,
        rootMargin: "0px 0px -60% 0px",
      }
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [scrollRootRef])

  const handleNavClick = (id: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const target = document.getElementById(id)
    if (!target) return
    if (!scrollRootRef?.current) {
      target.scrollIntoView({ behavior: "smooth", block: "start" })
      return
    }
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
      <NarrativeSection id="path">
        <PathHero>
          <div>
            <NarrativeHeader>{tr("— PATH")}</NarrativeHeader>
            <LedeLine>
              {lang(
                "Bridging Mathematics, Infrastructure Operations, and the Attacker’s Perspective",
                "수학에서 시작해 인프라 운영과 공격자 시각을 모두 갖춘 엔지니어로",
                isKo
              )}
            </LedeLine>
            <NarrativeParagraph
              dangerouslySetInnerHTML={{
                __html: lang(
                  "From mathematics to security consulting, then to systems administration, and now research at UMD’s cybersecurity graduate program. I didn’t follow a set track; I got here by filling the gaps I kept running into myself. In early 2025 I wrote about this transition in a three-part LinkedIn series — connecting with engineers wrestling with similar questions and reaching over <strong>4,000 impressions within the year</strong>.",
                  "수학 전공자에서 보안 컨설턴트로, 다시 시스템 관리자를 거쳐 지금은 UMD 사이버보안 대학원에서 연구 중입니다. 정해진 경로를 따른 게 아니라 직접 맞닥뜨린 공백을 하나씩 채우며 여기까지 왔습니다. 2025년 초 LinkedIn에 이 전환 과정을 3부작으로 썼고, 비슷한 질문을 가진 엔지니어들과 공감하며 1년 안에 <strong>4,000회 이상의 조회수</strong>를 기록했습니다.",
                  isKo
                ),
              }}
            />
          </div>
          <ProfilePhotoWrap>
            <ProfilePhotoImg src="/about/DCprofile.jpg" alt="Jiwon Hwang" />
          </ProfilePhotoWrap>
        </PathHero>

        <SeriesList>
          {LI_ARTICLES.map((a) => (
            <SeriesItem key={a.num} href={a.href} target="_blank" rel="noopener noreferrer">
              <SeriesNum>{a.num}</SeriesNum>
              <SeriesTitle>{lang(a.en, a.ko, isKo)}</SeriesTitle>
              <SeriesViews>{a.views}</SeriesViews>
            </SeriesItem>
          ))}
        </SeriesList>

        <NarrativeParagraph
          dangerouslySetInnerHTML={{
            __html: lang(
              "<strong>Operations over consulting:</strong> On a major telecom ISMS audit project, I handled the post-audit remediation as an intern, and when a full-time offer came with graduate tuition attached, I turned it down. I wanted to build and run infrastructure and own the outcome, not just diagnose it and hand over a report.",
              "<strong>컨설팅보다 운영:</strong> 대형 통신사 ISMS 진단 프로젝트에서 인턴 신분으로 사후 개선 공정까지 맡았고, 학비 지원이 포함된 정규직 제안을 받았지만 사양했습니다. 문제를 진단하고 보고서만 넘기는 역할보다, 인프라를 직접 만들고 운영하며 결과까지 책임지고 싶었기 때문입니다.",
              isKo
            ),
          }}
        />
        <NarrativeParagraph
          dangerouslySetInnerHTML={{
            __html: lang(
              "<strong>Operations to research:</strong> I spent the next three years and eight months running a <strong>200-node cluster</strong>. It became clear that a defender’s view alone wasn’t enough without an attacker’s, so I came to UMD to fill that gap.",
              "<strong>운영에서 연구로:</strong> 그 길로 3년 8개월간 <strong>200노드 규모 클러스터</strong>를 운영했습니다. 방어자의 시각만으로는 부족하고 공격자의 관점이 필요하다는 게 분명해져, 그 공백을 메우려 UMD에 진학했습니다.",
              isKo
            ),
          }}
        />
        <NarrativeParagraph
          dangerouslySetInnerHTML={{
            __html: lang(
              "<strong>One question:</strong> My research across cloud, LLM, and GitOps security comes down to one thing: where does defense need to live to stay effective when the infrastructure underneath keeps changing.",
              "<strong>하나의 질문:</strong> 지금은 클라우드, LLM, GitOps 보안을 연구하며 한 가지에 집중하고 있습니다. ‘인프라가 끊임없이 바뀌는 환경에서 방어는 어디에 있어야 효과를 유지하는가.’",
              isKo
            ),
          }}
        />
      </NarrativeSection>

      <BodyGrid>
        <MainCol>
          {ABOUT_SECTIONS.filter((s) => s.id !== "path").map((section, idx) => (
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
                    <SectionTitle>
                      {isKo && section.titleKo ? section.titleKo : section.title}
                    </SectionTitle>
                    {section.subtitle && (
                      <SectionSub>
                        {isKo && section.subtitleKo ? section.subtitleKo : section.subtitle}
                      </SectionSub>
                    )}
                  </SectionHeadRow>
                </SectionHead>
                <SectionBody section={section} isKo={isKo} />
              </SectionBlock>
            </React.Fragment>
          ))}
        </MainCol>

        <Sidebar>
          <SidebarPart>
            <SidebarLabel>{tr("ON THIS PAGE")}</SidebarLabel>
            {navSections.map((s) => (
              <SidebarNavItem
                key={s.id}
                href={`#${s.id}`}
                onClick={(e) => handleNavClick(s.id, e)}
                data-active={activeId === s.id ? "true" : "false"}
              >
                <NavNum>{s.number}</NavNum>
                <NavText>{isKo && s.titleKo ? s.titleKo : s.title}</NavText>
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
                <span>GitHub</span>
              </QuickNavLink>
              <QuickNavLink
                href={`https://linkedin.com/in/${profile.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>LinkedIn</span>
              </QuickNavLink>
              <QuickNavLink href={`mailto:${profile.email}`}>
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
  isKo: boolean
}> = ({ section, isKo }) => {
  if (section.narrative) {
    return <NarrativeBlockList blocks={section.narrative} isKo={isKo} />
  }
  if (section.cards) {
    return (
      <CardSectionWrap>
        <CardGrid>
          {section.cards.map((card, i) => {
            const title = isKo && card.titleKo ? card.titleKo : card.title
            const body = isKo && card.bodyKo ? card.bodyKo : card.body
            return (
              <CardItem key={i}>
                <CardTitle>{title}</CardTitle>
                <CardBody dangerouslySetInnerHTML={{ __html: body }} />
                {card.refs?.map((ref, j) => (
                  <RefRow key={j}>
                    <a href={ref.href} target="_blank" rel="noopener noreferrer">{ref.label}</a>
                  </RefRow>
                ))}
              </CardItem>
            )
          })}
        </CardGrid>
        {section.footer && <NarrativeBlockList blocks={section.footer} isKo={isKo} />}
      </CardSectionWrap>
    )
  }
  return null
}

/* ── Narrative block renderer ── */

const lang = (en: string, ko: string | undefined, isKo: boolean): string =>
  isKo && ko ? ko : en

const NarrativeBlockList: React.FC<{ blocks: NarrativeBlock[]; isKo: boolean }> = ({
  blocks,
  isKo,
}) => (
  <NarrativeBody>
    {blocks.map((block, i) => {
      if (block.type === "p")
        return <NarrP key={i} dangerouslySetInnerHTML={{ __html: lang(block.en, block.ko, isKo) }} />
      if (block.type === "sub")
        return <SubHead key={i}>{lang(block.en, block.ko, isKo)}</SubHead>
      if (block.type === "quote")
        return <FullPullQuote key={i}><p>{lang(block.en, block.ko, isKo)}</p></FullPullQuote>
      if (block.type === "metrics")
        return (
          <InlineMetrics key={i}>
            {block.items.map((m, j) => (
              <IMCell key={j}>
                <IMVal>{m.val}</IMVal>
                <IMLbl>{lang(m.en, m.ko, isKo)}</IMLbl>
              </IMCell>
            ))}
          </InlineMetrics>
        )
      if (block.type === "group")
        return (
          <GroupBlock key={i}>
            <GroupPhotoRow $count={block.photos.length}>
              {block.photos.map((photo, j) => (
                <GroupPhoto key={j} $shape={block.shape}>
                  <PhotoImg src={photo.src} alt={lang(photo.altEn, photo.altKo, isKo)} />
                </GroupPhoto>
              ))}
            </GroupPhotoRow>
            <GroupText dangerouslySetInnerHTML={{ __html: lang(block.en, block.ko, isKo) }} />
          </GroupBlock>
        )
      if (block.type === "ref")
        return (
          <RefRow key={i}>
            <a href={block.href} target="_blank" rel="noopener noreferrer">
              {block.label}
            </a>
          </RefRow>
        )
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
  position: relative;
  padding: 1.5rem 1.625rem;
  background: var(--glass-1, ${({ theme }) => theme.brand.surface});
  backdrop-filter: var(--glass-blur, none);
  -webkit-backdrop-filter: var(--glass-blur, none);
  border: 1px solid ${({ theme }) => theme.brand.border};
  border-radius: var(--radius-lg);
  box-shadow: var(--glass-edge, none), var(--glass-shadow, ${({ theme }) => theme.brand.shadowLg});
  overflow: hidden;
  margin-bottom: 1.5rem;

  &::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.22), transparent);
    opacity: 0.75;
    pointer-events: none;
  }
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
  overflow: hidden;
`

const SectionGhost = styled.span`
  position: absolute;
  top: -14px;
  left: -2px;
  font-family: ${({ theme }) => theme.brand.fontDisplay};
  font-size: 72px;
  font-weight: 800;
  color: ${({ theme }) => theme.brand.text};
  opacity: 0.03;
  line-height: 1;
  pointer-events: none;
  user-select: none;
  letter-spacing: -0.04em;
  z-index: 0;
`

const SectionHeadRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  z-index: 1;
  flex-wrap: wrap;
`

const SectionNumber = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.brand.accent};
  border: 1px solid rgba(155, 108, 255, 0.4);
  border-radius: 8px;
  padding: 3px 9px;
  line-height: 1;
  flex-shrink: 0;
  text-shadow: var(--glow-sm, none);
`

const SectionTitle = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.brand.fontDisplay};
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.brand.text};
  line-height: 1.1;
`

const SectionSub = styled.span`
  margin-left: auto;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.625rem;
  font-weight: 400;
  letter-spacing: 0.12em;
  text-transform: uppercase;
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
  font-size: 0.9375rem;
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
  margin: 1.375rem 0 0.5rem;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: ${({ theme }) => theme.brand.text};
`

const FullPullQuote = styled.div`
  margin: 0.5rem 0;
  padding: 1rem 1.25rem;
  border-radius: var(--radius-lg);
  background: var(--glass-2, ${({ theme }) => theme.brand.surface});
  backdrop-filter: var(--glass-blur, none);
  -webkit-backdrop-filter: var(--glass-blur, none);
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  border-left: 3px solid ${({ theme }) => theme.brand.signal};
  box-shadow: var(--glass-edge, none), inset 0 0 40px rgba(255,92,208,.06);
  position: relative;

  p {
    font-family: "Source Serif 4", "Lora", Georgia, serif;
    font-size: 0.9375rem;
    font-style: italic;
    color: ${({ theme }) => theme.brand.text};
    line-height: 1.65;
    margin: 0;
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
  font-size: 1.25rem;
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

const PhotoImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`

/* ─── Group block (keyword → photos → text) ─── */

const GroupBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`

const GroupPhotoRow = styled.div<{ $count: number }>`
  display: grid;
  grid-template-columns: ${({ $count }) =>
    $count === 1 ? "minmax(0, 220px)" : `repeat(${$count}, 1fr)`};
  gap: 6px;
`

const GroupPhoto = styled.div<{ $shape?: "portrait" | "rect" }>`
  border-radius: var(--radius-md);
  overflow: hidden;
  aspect-ratio: ${({ $shape }) => $shape === "rect" ? "4 / 3" : "3 / 4"};
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(13, 13, 18, 0.35) 0%, transparent 50%);
    pointer-events: none;
  }
`

const GroupText = styled.div`
  font-size: 0.875rem;
  line-height: 1.8;
  color: ${({ theme }) => theme.brand.textMuted};
  display: flex;
  flex-direction: column;
  gap: 0.65rem;

  p { margin: 0; }
  strong { font-weight: 600; color: ${({ theme }) => theme.brand.text}; }
`

const RefRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0.1rem 0 0.3rem;

  &::before {
    content: '↗';
    font-size: 0.5625rem;
    color: ${({ theme }) => theme.brand.link};
  }

  a {
    font-family: ${({ theme }) => theme.brand.fontMono};
    font-size: 0.625rem;
    color: ${({ theme }) => theme.brand.link};
    text-decoration: none;
    border-bottom: 1px solid ${({ theme }) => theme.brand.linkSoft};
    transition: color 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;

    &:hover {
      color: ${({ theme }) => theme.brand.linkHover};
      border-color: ${({ theme }) => theme.brand.link};
      box-shadow: var(--glow-cy, none);
    }
  }
`

/* ─── Cards (Designs section) ─── */

const CardSectionWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
`

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.6rem;

  @container about-drawer (min-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @container about-drawer (min-width: 700px) {
    grid-template-columns: repeat(3, 1fr);
  }
`

const CardItem = styled.div`
  padding: 0.9rem 1rem;
  background: ${({ theme }) => theme.brand.surface};
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  transition: border-color 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.brand.accent}33;
  }
`

const CardTitle = styled.p`
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.brand.text};
`

const CardBody = styled.div`
  font-size: 0.8125rem;
  line-height: 1.75;
  color: ${({ theme }) => theme.brand.textMuted};
  display: flex;
  flex-direction: column;
  gap: 0.55rem;

  p { margin: 0; }
  strong { font-weight: 600; color: ${({ theme }) => theme.brand.text}; }
  code {
    font-family: ${({ theme }) => theme.brand.fontMono};
    font-size: 0.6875rem;
    background: ${({ theme }) => theme.brand.surface2};
    border: 1px solid ${({ theme }) => theme.brand.borderSoft};
    padding: 1px 4px;
    border-radius: 3px;
    color: ${({ theme }) => theme.brand.text};
  }
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
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  background: var(--glass-1, ${({ theme }) => theme.brand.surface});
  backdrop-filter: var(--glass-blur, none);
  -webkit-backdrop-filter: var(--glass-blur, none);
  border: 1px solid ${({ theme }) => theme.brand.border};
  border-radius: var(--radius-lg);
  padding: 0.9375rem;
  box-shadow: var(--glass-edge, none), var(--glass-shadow, ${({ theme }) => theme.brand.shadowLg});
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.22), transparent);
    opacity: 0.75;
    pointer-events: none;
  }
`

const SidebarLabel = styled.p`
  margin: 0 0 0.6875rem;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.65625rem;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.textFaint};
`

const SidebarNavItem = styled.a`
  display: flex;
  gap: 9px;
  padding: 7px 9px;
  border-radius: 8px;
  font-size: 0.78125rem;
  color: ${({ theme }) => theme.brand.textMuted};
  line-height: 1.35;
  text-decoration: none;
  transition: background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.brand.surface2};
    color: ${({ theme }) => theme.brand.text};
  }

  &[data-active="true"] {
    color: ${({ theme }) => theme.brand.text};
    background: linear-gradient(90deg, rgba(155, 108, 255, 0.16), transparent);
    box-shadow: inset 2px 0 0 ${({ theme }) => theme.brand.accent};
  }
`

const NavNum = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.65625rem;
  color: ${({ theme }) => theme.brand.textFaint};
  padding-top: 1px;
  flex-shrink: 0;

  ${SidebarNavItem}[data-active="true"] & {
    color: ${({ theme }) => theme.brand.accent};
  }
`

const NavText = styled.span`
  font-size: inherit;
  color: inherit;
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

/* ─── Timeline ─── */

const TimelineList = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  padding-left: 1rem;

  &::before {
    content: '';
    position: absolute;
    left: 4px;
    top: 4px;
    bottom: 4px;
    width: 1px;
    background: linear-gradient(
      ${({ theme }) => theme.brand.link},
      ${({ theme }) => theme.brand.accent},
      ${({ theme }) => theme.brand.signal}
    );
    opacity: 0.5;
  }
`

const TimelineItem = styled.div`
  position: relative;
  padding: 0 0 0.875rem 0;

  &:last-child { padding-bottom: 0; }
`

const TimelineDot = styled.div`
  position: absolute;
  left: -0.9375rem;
  top: 4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme }) => theme.brand.bg};
  border: 1.5px solid ${({ theme }) => theme.brand.accent};
  box-shadow: var(--glow-sm, none);

  ${TimelineItem}[data-type="edu"] & {
    border-color: ${({ theme }) => theme.brand.link};
    box-shadow: var(--glow-cy, none);
  }
`

const TimelineContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
`

const TimelineTitle = styled.span`
  display: block;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.brand.text};
  line-height: 1.4;
`

const TimelineOrg = styled.span`
  display: block;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.brand.textMuted};
  line-height: 1.3;
`

const TimelinePeriod = styled.span`
  display: block;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.625rem;
  color: ${({ theme }) => theme.brand.textFaint};
  line-height: 1.2;
  margin-top: 2px;
`

/* ─── Metrics ─── */

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
`

const MetricCell = styled.div`
  padding: 10px 11px;
  background: rgba(8, 6, 17, 0.3);
  border: 1px solid ${({ theme }) => theme.brand.border};
  border-radius: 10px;
  box-shadow: var(--glass-edge, none);
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const MetricValue = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.brand.text};
  line-height: 1;
  text-shadow: var(--glow-sm, none);
`

const MetricLabel = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.59375rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.textFaint};
  margin-top: 2px;
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

  &:hover { color: ${({ theme }) => theme.brand.text}; }
`
