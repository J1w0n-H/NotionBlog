import React from "react"
import styled from "@emotion/styled"
import { CONFIG } from "site.config"
import { RESUME_SECTION_IDS } from "src/constants/resumeSections"
import useLanguage, { type LanguageType } from "src/hooks/useLanguage"
import { KO_RESUME } from "src/constants/i18n"

/* ── Data types ──────────────────────────────────────────────────────────── */

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
  | { category: string; detail: string }

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

/* ── Sort helpers ────────────────────────────────────────────────────────── */

function parsePeriodForSort(period: string): [endYear: number, startYear: number] {
  const years = (period.match(/\d{4}/g) ?? []).map(Number)
  const start = years[0] ?? 2000
  const end = years[years.length - 1] ?? start
  return [end, start]
}

/* ── Date formatting ─────────────────────────────────────────────────────── */

const MONTH_SHORT: Record<string, number> = {
  Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
  Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
}

function parseMonthYear(s: string): { year: number; month: number } | null {
  const m = s.trim().match(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})/)
  if (!m) return null
  return { year: Number(m[2]), month: MONTH_SHORT[m[1]] }
}

/** "Dec 2020 – Aug 2024" → "3 yrs 8 mos" */
function formatWorkDuration(period: string): string {
  const [startStr, endStr] = period.split(/\s*[–—]\s*/)
  if (!startStr || !endStr) return period
  const start = parseMonthYear(startStr)
  const end = parseMonthYear(endStr.replace(/\s*\(.*\)/, ""))
  if (!start || !end) return period
  const totalMonths = (end.year - start.year) * 12 + (end.month - start.month)
  if (totalMonths < 0) return period
  const yrs = Math.floor(totalMonths / 12)
  const mos = totalMonths % 12
  if (yrs > 0 && mos > 0) return `${yrs} yr${yrs > 1 ? "s" : ""} ${mos} mo${mos > 1 ? "s" : ""}`
  if (yrs > 0) return `${yrs} yr${yrs > 1 ? "s" : ""}`
  return `${mos} mo${mos > 1 ? "s" : ""}`
}

/** "Aug 2024 – May 2026 (Expected)" → "May 2026" */
function formatEduEndDate(period: string): string {
  const parts = period.split(/\s*[–—]\s*/)
  const last = parts[parts.length - 1]?.trim().replace(/\s*\(.*\)/, "").trim()
  return last ?? period
}

/* ── Chip extraction ─────────────────────────────────────────────────────── */

type Chip = { keyword: string; detail: string }
type FeaturedAff = { role: string; group?: string; summary?: string }

function workHighlightParts(item: WorkHighlightItem): Chip {
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
  return { keyword: item.category.trim(), detail: item.detail.trim() }
}

function getChips(
  entry: EducationEntry | WorkEntry,
  tr: (s: string) => string
): Chip[] {
  if ("institution" in entry) {
    const chips: Chip[] = []
    const courses = Array.isArray(entry.coreCourses)
      ? entry.coreCourses
      : entry.coreCourses?.trim()
      ? entry.coreCourses.split(",").map((s) => s.trim()).filter(Boolean)
      : []
    chips.push(...courses.map((c) => ({ keyword: tr(c), detail: "" })))
    // non-featured affiliations only (featured ones rendered separately as GRA row)
    entry.affiliations
      ?.filter((a) => !a.featured)
      .forEach((aff) => {
        const label = tr(aff.role) + (aff.group ? `, ${tr(aff.group)}` : "")
        chips.push({ keyword: label, detail: aff.summary ? tr(aff.summary.trim()) : "" })
      })
    return chips
  }
  return (entry.highlights ?? [])
    .map((item) => {
      const translated: WorkHighlightItem =
        typeof item === "string"
          ? tr(item)
          : { category: tr(item.category), detail: tr(item.detail) }
      return workHighlightParts(translated)
    })
    .filter((p) => p.keyword)
}

function getFeaturedAffs(
  entry: EducationEntry | WorkEntry,
  tr: (s: string) => string
): FeaturedAff[] {
  if (!("institution" in entry)) return []
  return (entry.affiliations ?? [])
    .filter((a) => a.featured)
    .map((a) => ({
      role: tr(a.role),
      group: a.group ? tr(a.group) : undefined,
      summary: a.summary ? tr(a.summary.trim()) : undefined,
    }))
}

/* ── i18n ────────────────────────────────────────────────────────────────── */

function useResumeTranslations(language: LanguageType): (text: string) => string {
  return language === "ko" ? (text) => KO_RESUME[text] ?? text : (text) => text
}

/* ── Merged + sorted background entries ─────────────────────────────────── */

type BgEntry =
  | (EducationEntry & { _type: "edu" })
  | (WorkEntry & { _type: "work" })

const bgEntries: BgEntry[] = [
  ...educationEntries.map((e) => ({ ...e, _type: "edu" as const })),
  ...workEntries.map((e) => ({ ...e, _type: "work" as const })),
].sort((a, b) => {
  const [aEnd, aStart] = parsePeriodForSort(a.period)
  const [bEnd, bStart] = parsePeriodForSort(b.period)
  if (bEnd !== aEnd) return bEnd - aEnd
  return bStart - aStart
})

/* ── Component ───────────────────────────────────────────────────────────── */

const ResumeSections: React.FC = () => {
  const [language] = useLanguage()
  const tr = useResumeTranslations(language)

  if (bgEntries.length === 0) return null

  return (
    <Wrapper>
      <Section id={RESUME_SECTION_IDS.background}>
        <SecH>
          <Bar aria-hidden="true" />
          <h2>Background</h2>
          <HintLabel>hover a keyword for detail</HintLabel>
        </SecH>
        <Timeline>
          {bgEntries.map((entry) => {
            const orgTitle =
              entry._type === "edu" ? tr(entry.degree) : tr(entry.role)
            const orgSub =
              entry._type === "edu"
                ? (entry.institution ? tr(entry.institution) : "")
                : (entry.organization ? tr(entry.organization) : "")
            const dateText =
              entry._type === "edu"
                ? formatEduEndDate(entry.period)
                : formatWorkDuration(entry.period)
            const chips = getChips(entry, tr)
            const featuredAffs = getFeaturedAffs(entry, tr)
            const rowKey =
              entry._type === "edu"
                ? `edu-${entry.institution || entry.degree}-${entry.period}`
                : `work-${entry.organization || entry.role}-${entry.period}`

            return (
              <CredRow
                key={rowKey}
                data-edu={entry._type === "edu" ? "true" : undefined}
              >
                <CredHead>
                  <CredTop>
                    <CredOrg>
                      {orgTitle}
                      {orgSub && <CredOrgSub>{orgSub}</CredOrgSub>}
                    </CredOrg>
                    <CredDate>{dateText}</CredDate>
                  </CredTop>
                  {featuredAffs.length > 0 && (
                    <GraRow>
                      {featuredAffs.map((aff) => (
                        <GraBadge
                          key={aff.role}
                          {...(aff.summary ? { "data-desc": aff.summary } : {})}
                        >
                          <GraLabel>
                            {aff.role}{aff.group ? ` · ${aff.group}` : ""}
                          </GraLabel>
                        </GraBadge>
                      ))}
                    </GraRow>
                  )}
                  {chips.length > 0 && (
                    <CredTags>
                      {chips.map(({ keyword, detail }) => (
                        <MiniTag
                          key={keyword}
                          {...(detail ? { "data-desc": detail } : {})}
                        >
                          {keyword}
                        </MiniTag>
                      ))}
                    </CredTags>
                  )}
                </CredHead>
              </CredRow>
            )
          })}
        </Timeline>
      </Section>
    </Wrapper>
  )
}

export default ResumeSections

export function getResumeNavSectionIds(): string[] {
  if (bgEntries.length > 0) return [RESUME_SECTION_IDS.background]
  return []
}

export function getBackgroundEntryCount(): number {
  return bgEntries.length
}

/* ── Styled components ───────────────────────────────────────────────────── */

const Wrapper = styled.div`
  margin-bottom: 2rem;
`

const Section = styled.section`
  scroll-margin-top: var(--feed-scroll-offset, 7rem);
  margin-top: 1rem;
`

const SecH = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  margin: 0 0 13px;

  h2 {
    margin: 0;
    padding: 0;
    color: ${({ theme }) => theme.brand.text};
    font-size: 19px;
    font-weight: 700;
    letter-spacing: -0.01em;
    line-height: 1.2;
  }
`

const Bar = styled.span`
  width: 3px;
  height: 19px;
  border-radius: 2px;
  flex: none;
  background: linear-gradient(
    var(--link),
    var(--accent)
  );
`

const HintLabel = styled.span`
  margin-left: auto;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--link);
  opacity: 0.85;
`

/* ── Timeline ────────────────────────────────────────────────────────────── */

const Timeline = styled.div`
  position: relative;
  padding-left: 20px;

  &::before {
    content: "";
    position: absolute;
    left: 5px;
    top: 6px;
    bottom: 6px;
    width: 1px;
    background: linear-gradient(
      var(--link),
      var(--accent),
      var(--signal)
    );
    opacity: 0.6;
  }
`

const CredRow = styled.div`
  position: relative;
  border-bottom: 1px solid ${({ theme }) => theme.brand.borderSoft};

  &:last-child {
    border-bottom: 0;
  }

  &::before {
    content: "";
    position: absolute;
    left: -19px;
    top: 18px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${({ theme }) => theme.brand.bg};
    border: 2px solid var(--accent);
    box-shadow: var(--glow-sm, 0 0 12px color-mix(in srgb, var(--accent) 50%, transparent));
    z-index: 1;
  }

  &[data-edu="true"]::before {
    border-color: var(--link);
    box-shadow: var(--glow-cy, 0 0 12px color-mix(in srgb, var(--link) 55%, transparent));
  }
`

const CredHead = styled.div`
  display: block;
  width: 100%;
  background: transparent;
  border: 0;
  padding: 12px 8px 12px 0;
  border-radius: 9px;
`

const CredTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: baseline;
`

const CredOrg = styled.span`
  color: ${({ theme }) => theme.brand.text};
  font-weight: 600;
  font-size: 15px;
  min-width: 0;
`

const CredOrgSub = styled.span`
  display: block;
  font-style: italic;
  font-weight: 400;
  font-size: 13px;
  color: ${({ theme }) => theme.brand.textMuted};
  margin-top: 2px;
`

const CredDate = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 11.5px;
  font-weight: 600;
  color: var(--link);
  white-space: nowrap;
  flex: none;
  opacity: 0.85;
`

const CredTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  margin-top: 8px;
`

const MiniTag = styled.span`
  position: relative;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 10px;
  color: ${({ theme }) => theme.brand.textFaint};
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  border-radius: 5px;
  padding: 2px 8px;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  cursor: default;
  transition: color 0.15s, border-color 0.15s, box-shadow 0.15s;
  line-height: 1.4;

  &[data-desc] {
    cursor: help;
  }

  &[data-desc]:hover {
    color: ${({ theme }) => theme.brand.text};
    border-color: var(--accent);
    box-shadow: var(--glow-sm, 0 0 10px color-mix(in srgb, var(--accent) 35%, transparent));
  }

  &[data-desc]::after {
    content: attr(data-desc);
    position: absolute;
    left: 0;
    top: calc(100% + 8px);
    z-index: 30;
    width: max-content;
    max-width: 280px;
    font-family: ${({ theme }) => theme.brand.fontSans};
    font-size: 11.5px;
    font-weight: 400;
    text-transform: none;
    letter-spacing: 0;
    line-height: 1.5;
    color: ${({ theme }) => theme.brand.textMuted};
    background: var(--surface2, color-mix(in srgb, var(--bg) 97%, transparent));
    border: 1px solid ${({ theme }) => theme.brand.borderStrong};
    border-radius: 9px;
    padding: 9px 11px;
    box-shadow: 0 12px 30px oklch(0 0 0 / 0.65);
    opacity: 0;
    transform: translateY(-3px);
    pointer-events: none;
    transition: opacity 0.15s, transform 0.15s;
    white-space: normal;
  }

  &[data-desc]:hover::after {
    opacity: 1;
    transform: translateY(0);
  }
`

/* ── GRA / featured affiliation row ─────────────────────────────────────── */

const GraRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 7px;
`

const GraBadge = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px 3px 8px;
  border-radius: 6px;
  border: 1px solid color-mix(in srgb, var(--link) 35%, transparent);
  background: color-mix(in srgb, var(--link) 7%, transparent);
  cursor: default;
  transition: border-color 0.15s, box-shadow 0.15s;

  &[data-desc] { cursor: help; }

  &[data-desc]:hover {
    border-color: color-mix(in srgb, var(--link) 60%, transparent);
    box-shadow: var(--glow-cy, 0 0 10px color-mix(in srgb, var(--link) 30%, transparent));
  }

  &[data-desc]::after {
    content: attr(data-desc);
    position: absolute;
    left: 0;
    top: calc(100% + 8px);
    z-index: 30;
    width: max-content;
    max-width: 300px;
    font-family: ${({ theme }) => theme.brand.fontSans};
    font-size: 11.5px;
    font-weight: 400;
    text-transform: none;
    letter-spacing: 0;
    line-height: 1.5;
    color: ${({ theme }) => theme.brand.textMuted};
    background: var(--surface2, color-mix(in srgb, var(--bg) 97%, transparent));
    border: 1px solid ${({ theme }) => theme.brand.borderStrong};
    border-radius: 9px;
    padding: 9px 11px;
    box-shadow: 0 12px 30px oklch(0 0 0 / 0.65);
    opacity: 0;
    transform: translateY(-3px);
    pointer-events: none;
    transition: opacity 0.15s, transform 0.15s;
    white-space: normal;
  }

  &[data-desc]:hover::after {
    opacity: 1;
    transform: translateY(0);
  }
`

const GraLabel = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--link);
`
