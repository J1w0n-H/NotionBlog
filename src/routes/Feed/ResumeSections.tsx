import React, { useCallback, useState } from "react"
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
  researchAreas?: string[]
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
  /** e.g. "Contract" — appended to the date line. */
  employmentType?: string
  note?: string
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
  // Ongoing roles ("– Present") always sort above finished ones.
  const end = isOngoingPeriod(period)
    ? Number.MAX_SAFE_INTEGER
    : years[years.length - 1] ?? start
  return [end, start]
}

function isOngoingPeriod(period: string): boolean {
  return /present|current|현재/i.test(period)
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
    const courses = entry.researchAreas ?? []
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
  const [openRows, setOpenRows] = useState<Set<string>>(() => new Set())
  const toggleRow = useCallback((key: string) => {
    setOpenRows((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  if (bgEntries.length === 0) return null

  return (
    <Wrapper>
      <Section id={RESUME_SECTION_IDS.background}>
        <SecH>
          <Bar aria-hidden="true" />
          <h2>Background</h2>
        </SecH>
        <Timeline>
          {bgEntries.map((entry) => {
            const orgTitle =
              entry._type === "edu" ? tr(entry.degree) : tr(entry.role)
            const orgSub =
              entry._type === "edu"
                ? (entry.institution ? tr(entry.institution) : "")
                : (entry.organization ? tr(entry.organization) : "")
            const dateText = [
              tr(entry.period),
              entry._type === "work" && entry.employmentType
                ? tr(entry.employmentType)
                : null,
              entry._type === "work" && entry.note ? tr(entry.note) : null,
            ]
              .filter(Boolean)
              .join(" · ")
            const chips = getChips(entry, tr)
            const featuredAffs = getFeaturedAffs(entry, tr)
            // Detail text used to live in hover-only tooltips (unreachable on
            // touch). It is now an explicit, keyboard-accessible disclosure.
            const details: Chip[] = [
              ...featuredAffs
                .filter((a) => a.summary)
                .map((a) => ({
                  keyword: a.role + (a.group ? ` · ${a.group}` : ""),
                  detail: a.summary!,
                })),
              ...chips.filter((c) => c.detail),
            ]
            const rowKey =
              entry._type === "edu"
                ? `edu-${entry.institution || entry.degree}-${entry.period}`
                : `work-${entry.organization || entry.role}-${entry.period}`
            const isOpen = openRows.has(rowKey)
            const detailsId = `bg-details-${rowKey.replace(/[^A-Za-z0-9_-]+/g, "-")}`

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
                        <GraBadge key={aff.role}>
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
                        <MiniTag key={keyword}>{keyword}</MiniTag>
                      ))}
                    </CredTags>
                  )}
                  {details.length > 0 && (
                    <>
                      <DetailsToggle
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={detailsId}
                        onClick={() => toggleRow(rowKey)}
                      >
                        {isOpen ? tr("Hide details") : tr("Details")}
                        <span aria-hidden="true">{isOpen ? "▴" : "▾"}</span>
                      </DetailsToggle>
                      {isOpen && (
                        <DetailList id={detailsId}>
                          {details.map(({ keyword, detail }) => (
                            <li key={keyword}>
                              <strong>{keyword}</strong> — {detail}
                            </li>
                          ))}
                        </DetailList>
                      )}
                    </>
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
  border-radius: var(--radius-md);
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
  border-radius: var(--radius-sm);
  padding: 2px 8px;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  cursor: default;
  transition: color 0.15s, border-color 0.15s, box-shadow 0.15s;
  line-height: 1.4;

`

const DetailsToggle = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  padding: 4px 0;
  border: 0;
  background: transparent;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 11px;
  color: var(--link);
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
  &:focus-visible {
    outline: 2px solid var(--link);
    outline-offset: 2px;
    border-radius: 4px;
  }
`

const DetailList = styled.ul`
  margin: 8px 0 0;
  padding-left: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  line-height: 1.55;
  color: ${({ theme }) => theme.brand.textMuted};

  strong {
    color: ${({ theme }) => theme.brand.text};
    font-weight: 600;
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
  border-radius: var(--radius-sm);
  border: 1px solid color-mix(in srgb, var(--link) 35%, transparent);
  background: color-mix(in srgb, var(--link) 7%, transparent);
  cursor: default;
  transition: border-color 0.15s, box-shadow 0.15s;

`

const GraLabel = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--link);
`
