import React, { useCallback, useState, type ReactNode } from "react"
import styled from "@emotion/styled"
import { keyframes } from "@emotion/react"
import { CONFIG } from "site.config"
import { RESUME_SECTION_IDS } from "src/constants/resumeSections"
import useLanguage, { type LanguageType } from "src/hooks/useLanguage"
import { KO_RESUME } from "src/constants/i18n"

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

function useResumeTranslations(language: LanguageType): (text: string) => string {
  return language === "ko" ? (text) => KO_RESUME[text] ?? text : (text) => text
}

/* ── Tag extraction helpers ─────────────────────────────────────────────── */

function educationTags(entry: EducationEntry): string[] {
  const courses = Array.isArray(entry.coreCourses)
    ? entry.coreCourses
    : entry.coreCourses?.trim()
    ? entry.coreCourses.split(",").map((s) => s.trim()).filter(Boolean)
    : []
  const affTags =
    entry.affiliations?.map((a) =>
      [a.role, a.group].filter(Boolean).join(", ")
    ) ?? []
  return [...courses.slice(0, 3), ...affTags].filter(Boolean)
}

function workTags(entry: WorkEntry): string[] {
  if (!entry.highlights || entry.highlights.length === 0) return []
  return entry.highlights.slice(0, 4).map((h) =>
    typeof h === "string" ? h.split(/\s*[–—:\-]\s/)[0].trim() : h.category
  )
}

/* ── Detail body renderer ────────────────────────────────────────────────── */

function renderRichDetail(text: string): ReactNode {
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

/* ── Single credential row ───────────────────────────────────────────────── */

type CredRowProps = {
  org: string
  role: string
  period: string
  tags: string[]
  isEdu?: boolean
  detail?: ReactNode
}

const CredRow: React.FC<CredRowProps> = ({ org, role, period, tags, isEdu, detail }) => {
  const [open, setOpen] = useState(false)
  const toggle = useCallback(() => setOpen((o) => !o), [])

  return (
    <CredRowWrapper data-edu={isEdu ? "true" : undefined} data-open={open ? "true" : undefined}>
      <CredHead type="button" onClick={toggle} aria-expanded={open}>
        <CredTop>
          <CredOrg>{org}</CredOrg>
          <CredDate>{period}</CredDate>
        </CredTop>
        <CredMeta>
          <CredRole>{role}</CredRole>
          {tags.map((t, i) => <MiniTag key={i}>{t}</MiniTag>)}
          <Chev aria-hidden="true">
            <ChevArrow data-open={open ? "true" : undefined}>▸</ChevArrow>
          </Chev>
        </CredMeta>
      </CredHead>
      {detail && (
        <CredDetail aria-hidden={!open}>
          <CredDetailInner data-open={open ? "true" : undefined}>
            {detail}
          </CredDetailInner>
        </CredDetail>
      )}
    </CredRowWrapper>
  )
}

/* ── Main component ──────────────────────────────────────────────────────── */

const ResumeSections: React.FC = () => {
  const [language] = useLanguage()
  const tr = useResumeTranslations(language)

  if (educationEntries.length === 0 && workEntries.length === 0) return null

  const allEntries: CredRowProps[] = [
    ...educationEntries.map((e) => ({
      org: tr(e.institution),
      role: tr(e.degree),
      period: tr(e.period),
      tags: educationTags(e).map(tr),
      isEdu: true,
      detail: e.affiliations?.length ? (
        <>
          {e.affiliations.map((a, i) => (
            <p key={i}>
              <strong>{tr(a.role)}{a.group ? `, ${tr(a.group)}` : ""}</strong>
              {a.summary ? ` — ${tr(a.summary)}` : ""}
            </p>
          ))}
        </>
      ) : undefined,
    })),
    ...workEntries.map((e) => ({
      org: tr(e.organization),
      role: tr(e.role),
      period: tr(e.period),
      tags: workTags(e).map(tr),
      isEdu: false,
      detail: e.highlights?.length ? (
        <>
          {e.highlights.map((h, i) => {
            const label = typeof h === "string"
              ? h.split(/\s*[–—:\-]\s/)[0].trim()
              : h.category
            const body = typeof h === "string"
              ? h.split(/\s*[–—:\-]\s/).slice(1).join(" — ").trim()
              : h.detail
            return (
              <p key={i}>
                <HighlightLabel>{tr(label)}</HighlightLabel>
                {body ? ` — ${renderRichDetail(tr(body))}` : null}
              </p>
            )
          })}
        </>
      ) : e.summary ? <p>{renderRichDetail(tr(e.summary))}</p> : undefined,
    })),
  ]

  return (
    <Wrapper id={RESUME_SECTION_IDS.background}>
      <SecHeader>
        <SecBar aria-hidden="true" />
        <SecTitle>{tr("Background")}</SecTitle>
        <SecHint>{tr("click any to expand")}</SecHint>
      </SecHeader>
      <Timeline>
        {allEntries.map((entry, i) => (
          <CredRow key={`${entry.org}-${i}`} {...entry} />
        ))}
      </Timeline>
    </Wrapper>
  )
}

export default ResumeSections

export function getResumeNavSectionIds(): string[] {
  if (educationEntries.length > 0 || workEntries.length > 0)
    return [RESUME_SECTION_IDS.background]
  return []
}

/* ── Keyframes ───────────────────────────────────────────────────────────── */

const expandDown = keyframes`
  from { max-height: 0; opacity: 0; }
  to { max-height: 600px; opacity: 1; }
`

/* ── Styles ──────────────────────────────────────────────────────────────── */

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  scroll-margin-top: var(--feed-scroll-offset, 7rem);
`

const SecHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6875rem;
  margin-bottom: 0.25rem;
`

const SecBar = styled.span`
  width: 3px;
  height: 19px;
  border-radius: 2px;
  flex-shrink: 0;
  background: linear-gradient(var(--link, #2fe6ff), var(--accent, #9b6cff));
`

const SecTitle = styled.h2`
  color: ${({ theme }) => theme.brand.text};
  font-size: 1.1875rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin: 0;
`

const SecHint = styled.span`
  margin-left: auto;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.625rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.textFaint};
`

/* ── Timeline ────────────────────────────────────────────────────────────── */

const Timeline = styled.div`
  position: relative;
  padding-left: 1.25rem;

  &::before {
    content: "";
    position: absolute;
    left: 5px;
    top: 6px;
    bottom: 6px;
    width: 1px;
    background: linear-gradient(var(--link, #2fe6ff), var(--accent, #9b6cff), var(--signal, #ff5cd0));
    opacity: 0.45;
  }
`

/* ── Credential row ──────────────────────────────────────────────────────── */

const CredRowWrapper = styled.div`
  position: relative;
  border-bottom: 1px solid ${({ theme }) => theme.brand.borderSoft};

  &:last-child {
    border-bottom: 0;
  }

  /* timeline dot */
  &::before {
    content: "";
    position: absolute;
    left: -19px;
    top: 18px;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: ${({ theme }) => theme.brand.bg};
    border: 1.5px solid var(--accent, ${({ theme }) => theme.brand.accent});
    box-shadow: var(--glow-sm, 0 0 10px rgba(155, 108, 255, 0.35));
    z-index: 1;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  &[data-edu="true"]::before {
    border-color: var(--link, ${({ theme }) => theme.brand.link});
    box-shadow: var(--glow-cy, 0 0 10px rgba(47, 230, 255, 0.4));
  }

  &[data-open="true"]::before {
    background: var(--accent, ${({ theme }) => theme.brand.accent});
  }

  &[data-edu="true"][data-open="true"]::before {
    background: var(--link, ${({ theme }) => theme.brand.link});
  }
`

const CredHead = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  background: transparent;
  border: 0;
  cursor: pointer;
  padding: 0.75rem 0.5rem 0.75rem 0;
  border-radius: 9px;
  transition: background 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.025);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.brand.accentRing};
    outline-offset: 2px;
  }
`

const CredTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.875rem;
  align-items: baseline;
  margin-bottom: 0.2rem;
`

const CredOrg = styled.span`
  color: ${({ theme }) => theme.brand.text};
  font-weight: 600;
  font-size: 0.9375rem;
  min-width: 0;
`

const CredDate = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.6875rem;
  color: ${({ theme }) => theme.brand.textFaint};
  white-space: nowrap;
  flex-shrink: 0;
`

const CredMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  align-items: center;
`

const CredRole = styled.span`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.brand.textMuted};
  font-style: italic;
  flex-shrink: 0;
`

const MiniTag = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.625rem;
  color: ${({ theme }) => theme.brand.textFaint};
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  border-radius: 5px;
  padding: 1px 6px;
  letter-spacing: 0.03em;
  text-transform: uppercase;
`

const Chev = styled.span`
  margin-left: auto;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.6875rem;
  color: var(--link, ${({ theme }) => theme.brand.link});
  display: inline-flex;
  align-items: center;
  gap: 6px;
`

const ChevArrow = styled.span<{ "data-open"?: string }>`
  display: inline-block;
  transition: transform 0.22s ease;

  &[data-open="true"] {
    transform: rotate(90deg);
  }
`

/* ── Expand/collapse detail ──────────────────────────────────────────────── */

const CredDetail = styled.div`
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.3s ease, opacity 0.3s ease;
  opacity: 0;

  &[aria-hidden="false"] {
    max-height: 600px;
    opacity: 1;
  }
`

const CredDetailInner = styled.div<{ "data-open"?: string }>`
  padding: 0 0.5rem 0.9375rem 0;
  font-size: 0.84375rem;
  line-height: 1.62;
  color: ${({ theme }) => theme.brand.textMuted};
  display: none;

  &[data-open="true"] {
    display: block;
  }

  p {
    margin: 0 0 0.5rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  strong {
    color: ${({ theme }) => theme.brand.text};
    font-weight: 600;
  }
`

const HighlightLabel = styled.strong`
  color: var(--link, ${({ theme }) => theme.brand.link});
  font-weight: 500;
`

const MetricSpan = styled.strong`
  font-style: normal;
  font-weight: 750;
  color: var(--link, ${({ theme }) => theme.brand.link});
`

const AcronymSpan = styled.em`
  font-style: normal;
  font-weight: 600;
  color: var(--accent, ${({ theme }) => theme.brand.accent});
  opacity: 0.88;
`
