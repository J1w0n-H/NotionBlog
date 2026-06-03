import React from "react"
import styled from "@emotion/styled"
import Link from "next/link"
import { CONFIG } from "site.config"
import { ABOUT_SLUG } from "src/constants"

const STATS = [
  { val: "4", lbl: "yrs exp" },
  { val: "200+", lbl: "HPC/GPU nodes" },
  { val: "4×", lbl: "audits, 0 failures" },
]

const FeedProfileCard: React.FC = () => {
  const { profile } = CONFIG
  const [firstName, ...rest] = profile.name.split(" ")
  const lastName = rest.join(" ")
  const initials = `${firstName[0]}${lastName[0] ?? ""}`.toUpperCase()

  return (
    <Card>
      <Top>
        <Avatar aria-hidden="true">{initials}</Avatar>
        <Identity>
          <Name>{profile.name}</Name>
          <Role>{profile.role}</Role>
        </Identity>
      </Top>

      <Stats>
        {STATS.map((s) => (
          <StatCell key={s.lbl}>
            <StatVal>{s.val}</StatVal>
            <StatLbl>{s.lbl}</StatLbl>
          </StatCell>
        ))}
      </Stats>

      <ReadLink href={`/${ABOUT_SLUG}`} scroll={false}>
        read full story <Arrow aria-hidden="true">→</Arrow>
      </ReadLink>
    </Card>
  )
}

export default FeedProfileCard

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  padding: 1rem 1.125rem 1rem;
  background: var(--glass-1, ${({ theme }) => theme.brand.surface});
  backdrop-filter: var(--glass-blur, none);
  -webkit-backdrop-filter: var(--glass-blur, none);
  border: 1px solid ${({ theme }) => theme.brand.border};
  border-radius: var(--radius-lg);
  box-shadow: var(--glass-edge, none), var(--glass-shadow, ${({ theme }) => theme.brand.shadowSm});
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.18), transparent);
    pointer-events: none;
  }
`

const Top = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const Avatar = styled.div`
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${({ theme }) => theme.brand.accent}, ${({ theme }) => theme.brand.link});
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #fff;
  box-shadow: var(--glow-sm, none);
`

const Identity = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`

const Name = styled.span`
  font-family: ${({ theme }) => theme.brand.fontDisplay};
  font-size: 0.9375rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.brand.text};
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Role = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.625rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.textFaint};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  border-top: 1px solid ${({ theme }) => theme.brand.borderSoft};
  padding-top: 0.75rem;
`

const StatCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 0.5rem 0.25rem;
  background: rgba(8, 6, 17, 0.25);
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  border-radius: var(--radius-md);
`

const StatVal = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.875rem;
  font-weight: 700;
  color: ${({ theme }) => theme.brand.text};
  line-height: 1;
`

const StatLbl = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.5rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.textFaint};
  text-align: center;
  line-height: 1.3;
`

const ReadLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md);
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.brand.link};
  text-decoration: none;
  transition:
    border-color 0.12s ease,
    background 0.12s ease,
    box-shadow 0.12s ease;

  &:hover {
    border-color: ${({ theme }) => theme.brand.link};
    background: ${({ theme }) => theme.brand.surface2};
    box-shadow: var(--glow-cy, 0 0 10px rgba(47,230,255,.25));
  }
`

const Arrow = styled.span`
  transition: transform 0.15s ease;
  ${ReadLink}:hover & {
    transform: translateX(3px);
  }
`
