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
                <HighlightList>
                  {entry.highlights.map((item) => {
                    if (typeof item === "string") {
                      return <li key={item}>{item}</li>
                    }
                    return (
                      <li
                        key={`${item.category}-${item.detail.slice(0, 40)}`}
                      >
                        <HighlightCategory>{item.category}</HighlightCategory>
                        {": "}
                        <HighlightDetail>{item.detail}</HighlightDetail>
                      </li>
                    )
                  })}
                </HighlightList>
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

/* v2: display-weight section title with a per-category stripe on the left.
 * Color comes from `--cat-color`, set on the parent Section via
 * `catVars(tokenForCategory(...))`. Same stripe treatment as
 * FeedGroupHeading, so Resume sections and post-group sections share a
 * single visual language with no hard-coded accent. */
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
  /* Hairline border so brand logos with a dominant warm hue (e.g. UMD red)
   * don't visually bleed into the page background. */
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
  /* "Core Courses:" label gets the spec-sheet mono treatment so it reads as
   * a category prefix rather than emphasized prose. */
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

const HighlightCategory = styled.strong`
  font-weight: 700;
  font-size: 0.8125rem;
  letter-spacing: 0.01em;
  color: var(--cat-color, ${({ theme }) => theme.brand.accent});
`

const HighlightDetail = styled.span`
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.55;
  color: ${({ theme }) => theme.brand.textMuted};
`

/* v2: achievement bullets use a "›" chevron tinted with the section stripe
 * color (`--cat-color` from the parent `Section`); falls back to brand accent. */
const HighlightList = styled.ul`
  margin: 0.65rem 0 0;
  padding: 0 0 0 3.25rem;
  list-style: none;
  font-size: 0.875rem;
  line-height: 1.55;
  color: ${({ theme }) => theme.brand.text};

  li {
    position: relative;
    padding-left: 1rem;
  }

  li::before {
    content: "›";
    position: absolute;
    left: 0;
    top: 0;
    font-weight: 700;
    color: var(--cat-color, ${({ theme }) => theme.brand.accent});
  }

  li + li {
    margin-top: 0.45rem;
  }

  @media (max-width: 640px) {
    padding-left: 1.25rem;
  }
`

/* v2 Affiliation box — featured affiliations (SEED Lab, etc.) sit in a
 * 4px crimson left bar over an accent-soft tint. Non-featured affiliations
 * remain flush with the parent entry's indent. */
const AffiliationBlock = styled.div<{ $featured?: boolean }>`
  margin-top: 0.85rem;
  padding-left: 3.25rem;

  ${HighlightList} {
    padding-left: 1.1rem;
  }

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

    ${HighlightList} {
      padding-left: 1.25rem;
    }
  }
`
