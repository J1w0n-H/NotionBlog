import Image from "next/image"
import React from "react"
import styled from "@emotion/styled"
import { CONFIG } from "site.config"
import { catVars, tokenForCategory } from "src/constants/categoryColors"
import { RESUME_SECTION_IDS } from "src/constants/resumeSections"

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
  coreCourses?: string
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

const ResumeSections: React.FC = () => {
  if (educationEntries.length === 0 && workEntries.length === 0) return null

  return (
    <Wrapper>
      {educationEntries.length > 0 && (
        <Section
          id={RESUME_SECTION_IDS.education}
          style={catVars(tokenForCategory("Education"))}
        >
          <SectionTitle>Education</SectionTitle>
          {educationEntries.map((entry) => (
            <Entry key={`${entry.institution}-${entry.period}`}>
              <EntryHead>
                <LogoMark logo={entry.logo} />
                <HeadText>
                  <Row>
                    <EntryName name={entry.institution} href={entry.href} />
                    {entry.location ? (
                      <MetaRight>{entry.location}</MetaRight>
                    ) : null}
                  </Row>
                  <Row>
                    <Degree>{entry.degree}</Degree>
                    <MetaRight>{entry.period}</MetaRight>
                  </Row>
                </HeadText>
              </EntryHead>
              {entry.coreCourses?.trim() ? (
                <BodyLine>
                  <strong>Core Courses:</strong> {entry.coreCourses.trim()}
                </BodyLine>
              ) : null}
              {entry.affiliations?.map((affiliation) => (
                <AffiliationBlock
                  key={`${affiliation.role}-${affiliation.group || ""}-${affiliation.period || ""}`}
                  $featured={Boolean(affiliation.featured)}
                >
                  <AffiliationRow>
                    <AffiliationTitle>
                      {affiliation.role}
                      {affiliation.group ? `, ${affiliation.group}` : ""}
                    </AffiliationTitle>
                    {affiliation.period ? (
                      <MetaRight>{affiliation.period}</MetaRight>
                    ) : null}
                  </AffiliationRow>
                  {affiliation.summary?.trim() ? (
                    <AffiliationSummary>
                      {affiliation.summary.trim()}
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
          <SectionTitle>Work Experience</SectionTitle>
          {workEntries.map((entry) => (
            <Entry key={`${entry.organization}-${entry.period}`}>
              <EntryHead>
                <LogoMark logo={entry.logo} />
                <HeadText>
                  <Row>
                    <EntryName name={entry.organization} href={entry.href} />
                    {entry.location ? (
                      <MetaRight>{entry.location}</MetaRight>
                    ) : null}
                  </Row>
                  <Row>
                    <Degree>{entry.role}</Degree>
                    <MetaRight>{entry.period}</MetaRight>
                  </Row>
                </HeadText>
              </EntryHead>
              {entry.summary?.trim() ? (
                <BodyLine>{entry.summary.trim()}</BodyLine>
              ) : null}
              {entry.highlights && entry.highlights.length > 0 ? (
                <KeywordDeck>
                  {entry.highlights.map((item, idx) => {
                    const { keyword, detail } = workHighlightParts(item)
                    if (!keyword) return null
                    const showPop = detail.length > 0 && detail !== keyword
                    const key =
                      typeof item === "string"
                        ? `w-${idx}-${keyword.slice(0, 32)}`
                        : `${item.category}-${idx}`
                    return (
                      <KeywordChip key={key}>
                        <KeywordTrigger
                          type="button"
                          title={showPop ? detail : detail || undefined}
                          aria-label={
                            showPop ? `${keyword}. ${detail}` : keyword
                          }
                        >
                          {keyword}
                        </KeywordTrigger>
                        {showPop ? (
                          <KeywordPopover>{detail}</KeywordPopover>
                        ) : null}
                      </KeywordChip>
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
  border-radius: 0.375rem;
  border: 1px dashed ${({ theme }) => theme.brand.border};
  background: ${({ theme }) => theme.brand.surface2};
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
  gap: 1rem;
`

const Institution = styled.div`
  font-size: 0.9375rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.text};
`

const InstitutionLink = styled.a`
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
  gap: 1rem;
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
  top: calc(100% + 6px);
  min-width: 12rem;
  max-width: min(22rem, 85vw);
  padding: 0.55rem 0.7rem;
  border-radius: var(--radius-md);
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  background: ${({ theme }) => theme.brand.surface};
  box-shadow: ${({ theme }) => theme.brand.shadowLg};
  font-size: 0.8125rem;
  font-weight: 400;
  font-family: ${({ theme }) => theme.brand.fontSans};
  letter-spacing: 0;
  text-transform: none;
  line-height: 1.5;
  color: ${({ theme }) => theme.brand.text};
  opacity: 0;
  visibility: hidden;
  transform: translateY(-4px);
  transition:
    opacity ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease},
    transform ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease};
  pointer-events: none;
`

const KeywordTrigger = styled.button`
  appearance: none;
  margin: 0;
  max-width: 100%;
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  background: ${({ theme }) => theme.brand.surface2};
  border-radius: var(--radius-pill);
  padding: 0.28rem 0.55rem;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.65rem;
  font-weight: 650;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--cat-color, ${({ theme }) => theme.brand.accent});
  cursor: default;
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

  @media (hover: hover) and (pointer: fine) {
    &:hover ${KeywordPopover},
    &:focus-within ${KeywordPopover} {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
      pointer-events: auto;
    }
  }

  @media (hover: none), (pointer: coarse) {
    ${KeywordPopover} {
      display: none;
    }
  }
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
