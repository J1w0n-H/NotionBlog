import Image from "next/image"
import React, { useCallback, useRef, useState, type ReactNode } from "react"
import styled from "@emotion/styled"
import { CONFIG } from "site.config"
import { catVars, tokenForCategory } from "src/constants/categoryColors"
import { RESUME_SECTION_IDS } from "src/constants/resumeSections"
import useLanguage, { type LanguageType } from "src/hooks/useLanguage"

type EducationAffiliation = {
  role: string
  group?: string
  period?: string
  summary?: string
  featured?: boolean
}

type EducationEntry = {
  institution: string
  href?: string
  location?: string
  degree: string
  period: string
  logo?: string
  coreCourses?: string | string[]
  affiliations?: EducationAffiliation[]
}

type WorkHighlightItem =
  | string
  | {
      category: string
      detail: string
    }

type WorkEntry = {
  organization: string
  href?: string
  location?: string
  role: string
  period: string
  logo?: string
  summary?: string
  highlights?: WorkHighlightItem[]
}

type EntryNameProps = {
  name: string
  href?: string
}

const EntryName: React.FC<EntryNameProps> = ({ name, href }) => {
  if (href) {
    return (
      <InstitutionLink href={href} target="_blank" rel="noreferrer">
        {name}
      </InstitutionLink>
    )
  }
  return <Institution>{name}</Institution>
}

type LogoMarkProps = {
  logo?: string
}

const LogoMark: React.FC<LogoMarkProps> = ({ logo }) => {
  if (!logo) return <LogoPlaceholder aria-hidden="true" />
  return (
    <LogoSlot>
      <Image
        src={logo}
        alt=""
        fill
        sizes="40px"
        style={{ objectFit: "contain" }}
      />
    </LogoSlot>
  )
}

/**
 * Highlight metric numbers (200+, 85%, 4,000) and acronyms (MFA, ISO, GCLP)
 * inside a popover detail string. Returns the same string when no matches.
 */
function renderRichDetail(text: string): ReactNode {
  // Group 1: numbers with %, + or x suffix; or comma-grouped numbers (4,000)
  // Group 2: 3+-char ALL-CAPS acronyms, optional trailing s, optional hyphen-suffix (ISMS-P)
  const re =
    /(\b\d[\d,]*[%+x]\b|\b\d{1,3}(?:,\d{3})+\b|\b[A-Z]{3,}[a-z]?(?:[/-][A-Z\d]+)*\b)/g
  const nodes: ReactNode[] = []
  let last = 0
  let m: RegExpExecArray | null
  re.lastIndex = 0
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index))
    const isNumeric = /^\d/.test(m[0])
    nodes.push(
      isNumeric ? (
        <MetricSpan key={m.index}>{m[0]}</MetricSpan>
      ) : (
        <AcronymSpan key={m.index}>{m[0]}</AcronymSpan>
      )
    )
    last = re.lastIndex
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes.length > 1 ? <>{nodes}</> : text
}

/** Map each highlight to a short surface label + longer body for hover. */
function workHighlightParts(item: WorkHighlightItem): {
  keyword: string
  detail: string
} {
  if (typeof item === "string") {
    const t = item.trim()
    if (!t) return { keyword: "", detail: "" }
    const split = t.split(/\s*[–—:\-]\s/).filter(Boolean)
    if (split.length >= 2) {
      return {
        keyword: split[0].trim(),
        detail: split.slice(1).join(" — ").trim(),
      }
    }
    const firstLine = t.split("\n")[0].trim()
    if (firstLine.length <= 44) return { keyword: firstLine, detail: t }
    return { keyword: `${firstLine.slice(0, 40)}…`, detail: t }
  }
  return {
    keyword: item.category.trim(),
    detail: item.detail.trim(),
  }
}

type KeywordChipItemProps = {
  chipKey: string
  keyword: string
  detail: string
}

const KeywordChipItem: React.FC<KeywordChipItemProps> = ({ keyword, detail }) => {
  const [open, setOpen] = useState(false)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    setOpen(true)
  }, [])

  const hide = useCallback(() => {
    hideTimer.current = setTimeout(() => setOpen(false), 80)
  }, [])

  const toggle = useCallback(() => setOpen((o) => !o), [])

  return (
    <KeywordChip>
      <KeywordTrigger
        type="button"
        aria-label={`${keyword}: ${detail}`}
        aria-expanded={open}
        onMouseEnter={show}
        onMouseLeave={hide}
        onClick={toggle}
      >
        {keyword}
      </KeywordTrigger>
      {open && (
        <KeywordPopover
          role="tooltip"
          onMouseEnter={show}
          onMouseLeave={hide}
        >
          <PopoverLabel>{keyword}</PopoverLabel>
          {renderRichDetail(detail)}
        </KeywordPopover>
      )}
    </KeywordChip>
  )
}

type SiteResumeConfig = {
  education?: EducationEntry[]
  workExperience?: WorkEntry[]
}

const cfg = CONFIG as typeof CONFIG & SiteResumeConfig

const educationEntries: EducationEntry[] = Array.isArray(cfg.education)
  ? (cfg.education as EducationEntry[])
  : []
const workEntries: WorkEntry[] = Array.isArray(cfg.workExperience)
  ? (cfg.workExperience as WorkEntry[])
  : []

const KO: Record<string, string> = {
  // Section titles
  "Education": "학력",
  "Work Experience": "경력",

  // — Education —
  "University of Maryland, College Park": "메릴랜드 대학교 칼리지파크",
  "MD, USA": "미국 메릴랜드",
  "Master of Engineering (M.Eng.) in Cybersecurity": "사이버보안 공학 석사 (M.Eng.)",
  "Aug 2024 – May 2026": "2024년 8월 – 2026년 5월",
  "Hacking C & Unix Binaries": "C 해킹 및 유닉스 바이너리",
  "LLMs, Security, and Privacy": "대규모 언어 모델, 보안 및 개인정보",
  "Fundamentals of AI and Deep Learning": "AI 및 딥러닝 기초",
  "Cloud Computing": "클라우드 컴퓨팅",
  "Graduate Research Assistant": "대학원 연구 조교",
  "Mar 2026 – May 2026": "2026년 3월 – 2026년 5월",
  "Studied Kubernetes configuration drift when GitOps reconciliation overwrites emergency patches, widening gaps between live cluster state and audit reporting; validated across scenarios with production risk implications.":
    "GitOps 조정 시 긴급 패치가 덮어쓰이면서 발생하는 쿠버네티스 설정 드리프트를 연구하고, 실제 클러스터 상태와 감사 보고 간의 불일치 심화 현상을 분석했습니다. 운영 리스크가 수반되는 다양한 시나리오를 대상으로 검증을 수행했습니다.",

  "Seoul Women’s University": "서울여자대학교",
  "Seoul, Korea": "한국 서울",
  "B.S. in Mathematics & B.E. in Information Security": "수학 이학사 · 정보보안 공학사",
  "Mar 2015 – Aug 2020": "2015년 3월 – 2020년 8월",
  "Linear Algebra": "선형대수학",
  "Java Programming": "자바 프로그래밍",
  "Windows Programming": "윈도우 프로그래밍",
  "Applied Cryptology": "응용 암호학",

  // — Work Experience —
  "Theragen Bio": "테라젠바이오",
  "Pangyo, Korea": "경기도 판교",
  "System Administrator": "시스템 관리자",
  "Dec 2020 – Aug 2024": "2020년 12월 – 2024년 8월",
  "Infrastructure & Automation": "인프라 및 자동화",
  "Administered 200+ Linux servers; developed a 4,000-line Bash script that automated deployment and slashed provisioning time by 85%.":
    "리눅스 서버 200대 이상을 관리하고, 배포를 자동화하여 프로비저닝 시간을 85% 단축한 4,000줄 규모의 Bash 스크립트를 개발했습니다.",
  "Cloud Migration": "클라우드 마이그레이션",
  "Led the enterprise migration to Microsoft 365 and Azure AD for 100+ users, enforcing security policies via Intune.":
    "100명 이상의 사용자를 대상으로 Microsoft 365 및 Azure AD 기업 마이그레이션을 주도하고, Intune을 통한 보안 정책을 시행했습니다.",
  "Subsidiary Spin-off": "자회사 분리",
  "Directed the zero-downtime infrastructure separation of 13 services and 200+ servers for a subsidiary spin-off.":
    "자회사 분리를 위해 13개 서비스 및 200대 이상의 서버에 대한 무중단 인프라 분리를 지휘했습니다.",
  "Security & Compliance": "보안 및 컴플라이언스",
  "Hardened infrastructure against ISO 27001 and GCLP standards using vulnerability assessments, MFA, and encryption; achieved 85% engagement in phishing simulations.":
    "취약점 평가, MFA 및 암호화를 통해 ISO 27001·GCLP 기준으로 인프라를 강화하고, 피싱 시뮬레이션에서 85% 참여율을 달성했습니다.",
  "Operations & Networking": "운영 및 네트워킹",
  "Monitored system health using Grafana/Prometheus, authored a 300+ page IT knowledge base, and managed core network functions (DNS, DHCP, VLANs, VPNs, firewalls).":
    "Grafana/Prometheus로 시스템 상태를 모니터링하고, 300페이지 이상의 IT 지식베이스를 작성하며, 핵심 네트워크 기능(DNS, DHCP, VLAN, VPN, 방화벽)을 관리했습니다.",

  "Korean Information Security Management Institute": "한국정보보호경영연구소",
  "Security Audit & Penetration Testing Consultant": "보안 감사 및 침투 테스트 컨설턴트",
  "May 2020 – Nov 2020": "2020년 5월 – 2020년 11월",
  "Security Audits & Pentesting": "보안 인증 감사 및 모의 해킹",
  "Conducted comprehensive IT security audits and penetration testing for major enterprise clients, including KAKAO VX, InBody, and SK Telecom.":
    "KAKAO VX, 인바디, SK텔레콤 등 주요 기업 고객을 대상으로 종합적인 IT 보안 감사 및 침투 테스트를 수행했습니다.",
  "Cloud Policy Development": "클라우드 정책 개발",
  "Authored and aligned cloud security policies with ISO 27017/27018 standards to support client certifications.":
    "고객사 인증 취득을 지원하기 위해 ISO 27017/27018 기준에 맞는 클라우드 보안 정책을 수립하고 정합성을 검토했습니다.",
  "Defensive Hardening": "방어적 강화",
  "Evaluated and remediated security misconfigurations to strengthen identity and access management (IAM), encryption, and network defenses under ISO 27001/27017/27018 and ISMS-P frameworks.":
    "ISO 27001/27017/27018 및 ISMS-P 프레임워크에 따라 보안 취약 설정을 평가·개선하여 IAM, 암호화, 네트워크 방어를 강화했습니다.",
}

function useResumeTranslations(language: LanguageType): (text: string) => string {
  return language === "ko" ? (text) => KO[text] ?? text : (text) => text
}

const ResumeSections: React.FC = () => {
  const [language] = useLanguage()
  const tr = useResumeTranslations(language)

  if (educationEntries.length === 0 && workEntries.length === 0) return null

  return (
    <Wrapper>
      {educationEntries.length > 0 && (
        <Section
          id={RESUME_SECTION_IDS.education}
          style={catVars(tokenForCategory("Education"))}
        >
          <SectionTitle>{tr("Education")}</SectionTitle>
          {educationEntries.map((entry) => (
            <Entry key={`${entry.institution}-${entry.period}`}>
              <EntryHead>
                <LogoMark logo={entry.logo} />
                <HeadText>
                  <Row>
                    <EntryName name={tr(entry.institution)} href={entry.href} />
                    {entry.location ? (
                      <MetaRight>{tr(entry.location)}</MetaRight>
                    ) : null}
                  </Row>
                  <Row>
                    <Degree>{tr(entry.degree)}</Degree>
                    <MetaRight>{tr(entry.period)}</MetaRight>
                  </Row>
                </HeadText>
              </EntryHead>
              {(() => {
                const courses = Array.isArray(entry.coreCourses)
                  ? entry.coreCourses
                  : entry.coreCourses?.trim()
                  ? entry.coreCourses.split(",").map((s) => s.trim()).filter(Boolean)
                  : []
                return courses.length > 0 ? (
                  <CourseDeck>
                    {courses.map((course) => (
                      <CourseChip key={course}>{tr(course)}</CourseChip>
                    ))}
                  </CourseDeck>
                ) : null
              })()}
              {entry.affiliations?.map((affiliation) => (
                <AffiliationBlock
                  key={`${affiliation.role}-${affiliation.group || ""}-${affiliation.period || ""}`}
                  $featured={Boolean(affiliation.featured)}
                >
                  <AffiliationRow>
                    <AffiliationTitle>
                      {tr(affiliation.role)}
                      {affiliation.group ? `, ${tr(affiliation.group)}` : ""}
                    </AffiliationTitle>
                    {affiliation.period ? (
                      <MetaRight>{tr(affiliation.period)}</MetaRight>
                    ) : null}
                  </AffiliationRow>
                  {affiliation.summary?.trim() ? (
                    <AffiliationSummary>
                      {tr(affiliation.summary.trim())}
                    </AffiliationSummary>
                  ) : null}
                </AffiliationBlock>
              ))}
            </Entry>
          ))}
        </Section>
      )}

      {workEntries.length > 0 && (
        <Section
          id={RESUME_SECTION_IDS.work}
          style={catVars(tokenForCategory("Work Experience"))}
        >
          <SectionTitle>{tr("Work Experience")}</SectionTitle>
          {workEntries.map((entry) => (
            <Entry key={`${entry.organization}-${entry.period}`}>
              <EntryHead>
                <LogoMark logo={entry.logo} />
                <HeadText>
                  <Row>
                    <EntryName name={tr(entry.organization)} href={entry.href} />
                    {entry.location ? (
                      <MetaRight>{tr(entry.location)}</MetaRight>
                    ) : null}
                  </Row>
                  <Row>
                    <Degree>{tr(entry.role)}</Degree>
                    <MetaRight>{tr(entry.period)}</MetaRight>
                  </Row>
                </HeadText>
              </EntryHead>
              {entry.summary?.trim() ? (
                <BodyLine>{tr(entry.summary.trim())}</BodyLine>
              ) : null}
              {entry.highlights && entry.highlights.length > 0 ? (
                <KeywordDeck>
                  {entry.highlights.map((item, idx) => {
                    const origKeyword = typeof item === "string"
                      ? workHighlightParts(item).keyword
                      : item.category
                    const translatedItem: WorkHighlightItem =
                      typeof item === "string"
                        ? tr(item)
                        : { category: tr(item.category), detail: tr(item.detail) }
                    const { keyword, detail } = workHighlightParts(translatedItem)
                    if (!keyword) return null
                    const hasDetail = detail.length > 0 && detail !== keyword
                    if (!hasDetail) return (
                      <KeywordChip key={typeof item === "string" ? `w-${idx}-${origKeyword.slice(0, 32)}` : `${origKeyword}-${idx}`}>
                        <KeywordTrigger type="button" aria-label={keyword}>{keyword}</KeywordTrigger>
                      </KeywordChip>
                    )
                    const key =
                      typeof item === "string"
                        ? `w-${idx}-${origKeyword.slice(0, 32)}`
                        : `${origKeyword}-${idx}`
                    return (
                      <KeywordChipItem key={key} chipKey={key} keyword={keyword} detail={detail} />
                    )
                  })}
                </KeywordDeck>
              ) : null}
            </Entry>
          ))}
        </Section>
      )}

    </Wrapper>
  )
}

export default ResumeSections

export function getResumeNavSectionIds(): string[] {
  const ids: string[] = []
  if (educationEntries.length > 0) ids.push(RESUME_SECTION_IDS.education)
  if (workEntries.length > 0) ids.push(RESUME_SECTION_IDS.work)
  return ids
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.25rem;
  margin-bottom: 2.25rem;
`

const Section = styled.section`
  scroll-margin-top: var(--feed-scroll-offset, 7rem);
`

const SectionTitle = styled.h2`
  position: relative;
  margin: 0 0 1rem;
  padding-left: 0.75rem;
  font-family: ${({ theme }) => theme.brand.fontDisplay};
  font-size: 1.5rem;
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.brand.text};

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0.18em;
    bottom: 0.18em;
    width: 3px;
    border-radius: 2px;
    background: var(--cat-color);
  }
`

const Entry = styled.div`
  &:not(:last-child) {
    margin-bottom: 1.5rem;
  }
`

const EntryHead = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.75rem;
  align-items: start;
`

const LogoSlot = styled.div`
  position: relative;
  width: 2.5rem;
  height: 2.5rem;
  flex-shrink: 0;
  border-radius: 0.375rem;
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  background: ${({ theme }) => theme.brand.surface};
  overflow: hidden;
`

const LogoPlaceholder = styled.span`
  width: 2.5rem;
  height: 2.5rem;
  flex-shrink: 0;
`

const HeadText = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`

const Row = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.35rem 1rem;
  flex-wrap: wrap;
`

const Institution = styled.div`
  min-width: 0;
  font-size: 0.9375rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.text};
`

const InstitutionLink = styled.a`
  min-width: 0;
  font-size: 0.9375rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.text};
  text-decoration: none;
  &:hover {
    color: ${({ theme }) => theme.brand.link};
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`

const Degree = styled.div`
  min-width: 0;
  font-size: 0.875rem;
  font-style: italic;
  color: ${({ theme }) => theme.brand.text};
`

const MetaRight = styled.div`
  flex-shrink: 0;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.brand.textMuted};
  text-align: right;
  white-space: nowrap;
`

const AffiliationRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.35rem 1rem;
  flex-wrap: wrap;
`

const AffiliationTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 700;
  color: ${({ theme }) => theme.brand.text};
`

const AffiliationSummary = styled.p`
  margin: 0.45rem 0 0;
  font-size: 0.875rem;
  line-height: 1.55;
  color: ${({ theme }) => theme.brand.text};
`

const BodyLine = styled.p`
  margin: 0.65rem 0 0;
  padding-left: 3.25rem;
  font-size: 0.875rem;
  line-height: 1.55;
  color: ${({ theme }) => theme.brand.text};
  strong {
    display: inline-block;
    margin-right: 0.45rem;
    font-family: ${({ theme }) => theme.brand.fontMono};
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.brand.textMuted};
    font-style: normal;
  }

  @media (max-width: 640px) {
    padding-left: 0;
  }
`

const CourseDeck = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.6rem;
  padding-left: 3.25rem;

  @media (max-width: 640px) {
    padding-left: 0;
  }
`

const CourseChip = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.22rem 0.5rem;
  border-radius: var(--radius-pill);
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  background: ${({ theme }) => theme.brand.surface2};
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.textMuted};
  line-height: 1.2;
`

const KeywordDeck = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-top: 0.65rem;
  padding-left: 3.25rem;

  @media (max-width: 640px) {
    padding-left: 0;
  }
`

const KeywordPopover = styled.span`
  position: absolute;
  z-index: 6;
  left: 0;
  top: calc(100% + 10px);
  min-width: 17rem;
  max-width: min(30rem, 90vw);
  padding: 0.85rem 1.05rem 0.9rem;
  border-radius: var(--radius-md);
  border: 1px solid ${({ theme }) => theme.brand.borderStrong};
  border-top: 3px solid var(--cat-color, ${({ theme }) => theme.brand.accent});
  background: ${({ theme }) => theme.brand.surface};
  box-shadow:
    0 4px 12px oklch(0 0 0 / 0.18),
    0 16px 36px -6px oklch(0 0 0 / 0.28),
    0 0 0 1px ${({ theme }) => theme.brand.borderSoft};
  font-size: 0.9rem;
  font-weight: 400;
  font-family: ${({ theme }) => theme.brand.fontSans};
  letter-spacing: 0;
  text-transform: none;
  line-height: 1.65;
  color: ${({ theme }) => theme.brand.text};
  animation: popoverIn 140ms ease forwards;

  @keyframes popoverIn {
    from { opacity: 0; transform: translateY(-5px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 1;
    transform: none;
  }

  &::before {
    content: "";
    position: absolute;
    top: -6px;
    left: 0.85rem;
    width: 9px;
    height: 9px;
    background: ${({ theme }) => theme.brand.surface};
    border-top: 1.5px solid var(--cat-color, ${({ theme }) => theme.brand.accent});
    border-left: 1.5px solid var(--cat-color, ${({ theme }) => theme.brand.accent});
    transform: rotate(45deg);
  }
`

const PopoverLabel = styled.span`
  display: block;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--cat-color, ${({ theme }) => theme.brand.accent});
  margin-bottom: 0.45rem;
  padding-bottom: 0.45rem;
  border-bottom: 1px solid ${({ theme }) => theme.brand.borderSoft};
`

const MetricSpan = styled.strong`
  font-style: normal;
  font-weight: 750;
  color: var(--cat-color, ${({ theme }) => theme.brand.accent});
`

const AcronymSpan = styled.em`
  font-style: normal;
  font-weight: 600;
  color: var(--cat-color, ${({ theme }) => theme.brand.accent});
  opacity: 0.88;
`

const KeywordTrigger = styled.button`
  appearance: none;
  margin: 0;
  max-width: 100%;
  border: 1px solid ${({ theme }) => theme.brand.border};
  background: ${({ theme }) => theme.brand.surface2};
  border-radius: var(--radius-pill);
  padding: 0.28rem 0.55rem;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.65rem;
  font-weight: 650;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--cat-color, ${({ theme }) => theme.brand.accent});
  /* help cursor signals this chip has a tooltip on hover. */
  cursor: help;
  line-height: 1.2;
  text-align: left;
  transition:
    border-color ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease},
    background ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease};

  &:hover,
  &:focus-visible {
    border-color: var(--cat-color, ${({ theme }) => theme.brand.accent});
    background: ${({ theme }) => theme.brand.surface};
    outline: none;
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px ${({ theme }) => theme.brand.accentSoft};
  }
`

const KeywordChip = styled.span`
  position: relative;
  display: inline-flex;
  max-width: 100%;
  vertical-align: top;
`

const AffiliationBlock = styled.div<{ $featured?: boolean }>`
  margin-top: 0.85rem;
  padding-left: 3.25rem;

  ${({ $featured, theme }) =>
    $featured
      ? `
    margin-top: 1rem;
    margin-left: 3.25rem;
    padding: 0.7rem 0.9rem 0.75rem 0.85rem;
    border-radius: var(--radius-md);
    border-left: 4px solid ${theme.brand.accent};
    background: ${theme.brand.accentSoft};
  `
      : ""}

  @media (max-width: 640px) {
    padding-left: ${({ $featured }) => ($featured ? "0.85rem" : "0")};
    margin-left: ${({ $featured }) => ($featured ? "0" : "0")};
  }
`
