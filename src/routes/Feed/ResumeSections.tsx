import Image from "next/image"
import React from "react"
import styled from "@emotion/styled"
import { CONFIG } from "site.config"
import { RESUME_SECTION_IDS } from "src/constants/resumeSections"

type EducationEntry = {
  institution: string
  href?: string
  location?: string
  degree: string
  period: string
  logo?: string
  coreCourses?: string
}

type WorkEntry = {
  organization: string
  href?: string
  location?: string
  role: string
  period: string
  logo?: string
  summary?: string
  highlights?: string[]
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
        <Section id={RESUME_SECTION_IDS.education}>
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
            </Entry>
          ))}
        </Section>
      )}

      {workEntries.length > 0 && (
        <Section id={RESUME_SECTION_IDS.work}>
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
                  {entry.highlights.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
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

const SectionTitle = styled.h2`
  margin: 0 0 1.25rem;
  padding-bottom: 0.35rem;
  border-bottom: 2px solid ${({ theme }) => theme.brand.text};
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.text};
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
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.brand.textMuted};
  text-align: right;
  white-space: nowrap;
`

const BodyLine = styled.p`
  margin: 0.65rem 0 0;
  padding-left: 3.25rem;
  font-size: 0.875rem;
  line-height: 1.55;
  color: ${({ theme }) => theme.brand.text};
  strong {
    font-weight: 700;
    font-style: normal;
  }

  @media (max-width: 640px) {
    padding-left: 0;
  }
`

const HighlightList = styled.ul`
  margin: 0.65rem 0 0;
  padding: 0 0 0 3.25rem;
  list-style: disc;
  font-size: 0.875rem;
  line-height: 1.55;
  color: ${({ theme }) => theme.brand.text};

  li + li {
    margin-top: 0.35rem;
  }

  @media (max-width: 640px) {
    padding-left: 1.25rem;
  }
`
