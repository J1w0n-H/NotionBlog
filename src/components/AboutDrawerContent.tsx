import Image from "next/image"
import React from "react"
import styled from "@emotion/styled"
import { CONFIG } from "site.config"

type Highlight = { category: string; detail: string }
type Affiliation = {
  role: string
  group: string
  period: string
  featured?: boolean
  summary?: string
}
type WorkEntry = {
  organization: string
  href: string
  location: string
  role: string
  period: string
  logo?: string
  highlights?: Highlight[]
}
type EduEntry = {
  institution: string
  href: string
  location: string
  degree: string
  period: string
  logo?: string
  coreCourses?: string
  affiliations?: Affiliation[]
}

type Props = {
  scrollRootRef?: React.RefObject<HTMLDivElement | null>
}

const AboutDrawerContent: React.FC<Props> = () => {
  const { profile } = CONFIG
  const workExperience = CONFIG.workExperience as WorkEntry[]
  const education = CONFIG.education as EduEntry[]
  const rawProjects = (CONFIG.projects || []) as { name: string; href: string }[]
  const projects = [...new Map(rawProjects.map((p) => [p.name, p])).values()]

  return (
    <Shell>
      {/* ── PROFILE HEADER ── */}
      <ProfileSection>
        <AvatarRing>
          <Image
            src={profile.image}
            alt={profile.name}
            width={72}
            height={72}
            priority
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
        </AvatarRing>
        <ProfileBody>
          <ProfileName>{profile.name}</ProfileName>
          <ProfileRole>{profile.role}</ProfileRole>
          <ProfileBio>{profile.bio}</ProfileBio>
          <SocialRow>
            {profile.email && (
              <SocialPill href={`mailto:${profile.email}`}>
                <MailIcon />
                Email
              </SocialPill>
            )}
            {profile.linkedin && (
              <SocialPill
                href={`https://linkedin.com/in/${profile.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedInIcon />
                LinkedIn
              </SocialPill>
            )}
            {profile.github && (
              <SocialPill
                href={`https://github.com/${profile.github}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHubIcon />
                GitHub
              </SocialPill>
            )}
          </SocialRow>
        </ProfileBody>
      </ProfileSection>

      {/* ── WORK EXPERIENCE ── */}
      <Section>
        <SectionLabel>Work Experience</SectionLabel>
        {workExperience.map((job, i) => (
          <EntryCard key={i}>
            <EntryHead>
              <LogoBox>
                {job.logo ? (
                  <Image
                    src={job.logo}
                    alt={job.organization}
                    width={32}
                    height={32}
                    style={{ objectFit: "contain", width: "100%", height: "100%" }}
                  />
                ) : (
                  <LogoInitial>{job.organization[0]}</LogoInitial>
                )}
              </LogoBox>
              <EntryMeta>
                <EntryOrg
                  href={job.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {job.organization}
                </EntryOrg>
                <EntryRole>{job.role}</EntryRole>
                <EntryTags>
                  <EntryPeriod>{job.period}</EntryPeriod>
                  <TagDot aria-hidden>·</TagDot>
                  <EntryLocation>{job.location}</EntryLocation>
                </EntryTags>
              </EntryMeta>
            </EntryHead>

            {job.highlights && job.highlights.length > 0 && (
              <HighlightList>
                {job.highlights.map((h, j) => (
                  <HighlightRow key={j}>
                    <Badge>{h.category}</Badge>
                    <HighlightText>{h.detail}</HighlightText>
                  </HighlightRow>
                ))}
              </HighlightList>
            )}
          </EntryCard>
        ))}
      </Section>

      {/* ── EDUCATION ── */}
      <Section>
        <SectionLabel>Education</SectionLabel>
        {education.map((edu, i) => (
          <EntryCard key={i}>
            <EntryHead>
              <LogoBox>
                {edu.logo ? (
                  <Image
                    src={edu.logo}
                    alt={edu.institution}
                    width={32}
                    height={32}
                    style={{ objectFit: "contain", width: "100%", height: "100%" }}
                  />
                ) : (
                  <LogoInitial>{edu.institution[0]}</LogoInitial>
                )}
              </LogoBox>
              <EntryMeta>
                <EntryOrg
                  href={edu.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {edu.institution}
                </EntryOrg>
                <EntryRole>{edu.degree}</EntryRole>
                <EntryTags>
                  <EntryPeriod>{edu.period}</EntryPeriod>
                  <TagDot aria-hidden>·</TagDot>
                  <EntryLocation>{edu.location}</EntryLocation>
                </EntryTags>
              </EntryMeta>
            </EntryHead>

            {edu.coreCourses && (
              <CourseRow>
                <CourseLabel>Courses</CourseLabel>
                <CourseText>{edu.coreCourses}</CourseText>
              </CourseRow>
            )}

            {edu.affiliations?.map((aff, j) => (
              <AffCard key={j}>
                <AffRow>
                  <AffRole>{aff.role}</AffRole>
                  <AffDot>·</AffDot>
                  <AffGroup>{aff.group}</AffGroup>
                  <AffPeriod>{aff.period}</AffPeriod>
                </AffRow>
                {aff.summary && <AffSummary>{aff.summary}</AffSummary>}
              </AffCard>
            ))}
          </EntryCard>
        ))}
      </Section>

      {/* ── PROJECTS ── */}
      {projects.length > 0 && (
        <Section>
          <SectionLabel>Projects</SectionLabel>
          <ProjectGrid>
            {projects.map((p, i) => (
              <ProjectPill
                key={i}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {p.name}
                <ExternalLinkIcon />
              </ProjectPill>
            ))}
          </ProjectGrid>
        </Section>
      )}
    </Shell>
  )
}

export default AboutDrawerContent

/* ── Icon components ── */
const MailIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12">
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
  </svg>
)
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)
const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
)
const ExternalLinkIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width="11" height="11">
    <path
      fillRule="evenodd"
      d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
      clipRule="evenodd"
    />
    <path
      fillRule="evenodd"
      d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
      clipRule="evenodd"
    />
  </svg>
)

/* ── Styled components ── */

const Shell = styled.div`
  min-width: 0;
  padding: 1.5rem 1.25rem 3rem;
  container-type: inline-size;
  container-name: about-drawer;
  position: relative;
  isolation: isolate;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse 80% 40% at 50% -10%,
      ${({ theme }) => theme.brand.accentSoft} 0%,
      transparent 70%
    );
    opacity: ${({ theme }) => (theme.scheme === "dark" ? 0.5 : 0.7)};
    pointer-events: none;
    z-index: -1;
  }
`

/* ── Profile ── */

const ProfileSection = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.brand.borderSoft};
`

const AvatarRing = styled.div`
  flex-shrink: 0;
  width: 68px;
  height: 68px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid ${({ theme }) => theme.brand.border};
  box-shadow:
    0 0 0 3px ${({ theme }) => theme.brand.accentSoft},
    ${({ theme }) => theme.brand.shadowMd};
`

const ProfileBody = styled.div`
  flex: 1;
  min-width: 0;
`

const ProfileName = styled.h1`
  font-family: ${({ theme }) => theme.brand.fontDisplay};
  font-size: 1.375rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: ${({ theme }) => theme.brand.text};
  margin: 0 0 0.1rem;
  line-height: 1.2;
`

const ProfileRole = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.accent};
  margin-bottom: 0.4rem;
`

const ProfileBio = styled.p`
  font-size: 0.8125rem;
  line-height: 1.55;
  color: ${({ theme }) => theme.brand.textMuted};
  margin: 0 0 0.65rem;
`

const SocialRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
`

const SocialPill = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.55rem;
  font-size: 0.7375rem;
  font-weight: 500;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.brand.border};
  background: ${({ theme }) => theme.brand.surface2};
  color: ${({ theme }) => theme.brand.textMuted};
  text-decoration: none;
  transition:
    background 0.12s ease,
    border-color 0.12s ease,
    color 0.12s ease;

  &:hover {
    background: ${({ theme }) => theme.brand.accentSoft};
    border-color: ${({ theme }) => theme.brand.accent};
    color: ${({ theme }) => theme.brand.accent};
  }
`

/* ── Section ── */

const Section = styled.div`
  margin-bottom: 1.75rem;
`

const SectionLabel = styled.div`
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.textMuted};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;

  &::before {
    content: "";
    display: inline-block;
    width: 3px;
    height: 0.85em;
    border-radius: 2px;
    background: ${({ theme }) => theme.brand.accent};
    flex-shrink: 0;
  }

  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.brand.borderSoft};
  }
`

/* ── Entry card (shared by work + edu) ── */

const EntryCard = styled.div`
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  border-radius: var(--radius-lg);
  background: ${({ theme }) => theme.brand.surface};
  padding: 0.875rem 1rem;
  margin-bottom: 0.55rem;
  transition: border-color 0.15s ease;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    border-color: ${({ theme }) => theme.brand.border};
  }
`

const EntryHead = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
`

const LogoBox = styled.div`
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  background: ${({ theme }) => theme.brand.surface2};
  overflow: hidden;
  padding: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const LogoInitial = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 800;
  color: ${({ theme }) => theme.brand.accent};
  background: ${({ theme }) => theme.brand.accentSoft};
  border-radius: calc(var(--radius-md) - 3px);
`

const EntryMeta = styled.div`
  flex: 1;
  min-width: 0;
`

const EntryOrg = styled.a`
  font-size: 0.9375rem;
  font-weight: 700;
  color: ${({ theme }) => theme.brand.text};
  text-decoration: none;
  display: block;
  line-height: 1.25;

  &:hover {
    color: ${({ theme }) => theme.brand.link};
  }
`

const EntryRole = styled.div`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.brand.textMuted};
  margin-top: 0.1rem;
  line-height: 1.35;
`

const EntryTags = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  flex-wrap: wrap;
  margin-top: 0.25rem;
`

const EntryPeriod = styled.span`
  font-size: 0.725rem;
  color: ${({ theme }) => theme.brand.textFaint};
  font-variant-numeric: tabular-nums;
`

const TagDot = styled.span`
  font-size: 0.725rem;
  color: ${({ theme }) => theme.brand.borderStrong};
`

const EntryLocation = styled.span`
  font-size: 0.725rem;
  color: ${({ theme }) => theme.brand.textFaint};
`

/* ── Highlights ── */

const HighlightList = styled.ul`
  margin: 0.7rem 0 0;
  padding: 0.65rem 0 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  border-top: 1px solid ${({ theme }) => theme.brand.borderSoft};
`

const HighlightRow = styled.li`
  display: flex;
  gap: 0.5rem;
  align-items: baseline;
`

const Badge = styled.span`
  flex-shrink: 0;
  display: inline-block;
  padding: 0.1rem 0.42rem;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  border-radius: 999px;
  background: ${({ theme }) => theme.brand.accentSoft};
  color: ${({ theme }) => theme.brand.accent};
  white-space: nowrap;
  line-height: 1.6;
`

const HighlightText = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.brand.textMuted};
  line-height: 1.58;
`

/* ── Courses ── */

const CourseRow = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: baseline;
  flex-wrap: wrap;
  margin-top: 0.7rem;
  padding-top: 0.65rem;
  border-top: 1px solid ${({ theme }) => theme.brand.borderSoft};
`

const CourseLabel = styled.span`
  flex-shrink: 0;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.textFaint};
  padding: 0.1rem 0.42rem;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
`

const CourseText = styled.span`
  font-size: 0.7875rem;
  color: ${({ theme }) => theme.brand.textMuted};
  line-height: 1.5;
`

/* ── Affiliation ── */

const AffCard = styled.div`
  margin-top: 0.65rem;
  padding: 0.55rem 0.7rem;
  border-radius: var(--radius-md);
  background: ${({ theme }) => theme.brand.accentSoft};
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
`

const AffRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  flex-wrap: wrap;
  margin-bottom: 0.3rem;
`

const AffRole = styled.span`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.brand.text};
`

const AffDot = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.brand.borderStrong};
`

const AffGroup = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.brand.textMuted};
  flex: 1;
`

const AffPeriod = styled.span`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.brand.textFaint};
  font-variant-numeric: tabular-nums;
`

const AffSummary = styled.p`
  margin: 0;
  font-size: 0.775rem;
  line-height: 1.58;
  color: ${({ theme }) => theme.brand.textMuted};
`

/* ── Projects ── */

const ProjectGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`

const ProjectPill = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.7rem;
  font-size: 0.8125rem;
  font-weight: 500;
  border-radius: var(--radius-md);
  border: 1px solid ${({ theme }) => theme.brand.border};
  background: ${({ theme }) => theme.brand.surface2};
  color: ${({ theme }) => theme.brand.text};
  text-decoration: none;
  transition:
    background 0.12s ease,
    border-color 0.12s ease,
    color 0.12s ease;

  &:hover {
    background: ${({ theme }) => theme.brand.accentSoft};
    border-color: ${({ theme }) => theme.brand.accent};
    color: ${({ theme }) => theme.brand.link};
  }
`
