import React from "react"
import styled from "@emotion/styled"
import { CONFIG } from "site.config"

const MobileTopBar: React.FC = () => {
  const { profile } = CONFIG

  return (
    <Bar data-mobile-topbar>
      <TopRow>
        <Avatar>
          <AvatarInner>JH</AvatarInner>
        </Avatar>
        <Identity>
          <IdentName>{profile.name}</IdentName>
          <IdentRole>{profile.role}</IdentRole>
        </Identity>
      </TopRow>
    </Bar>
  )
}

export default MobileTopBar

const Bar = styled.div`
  display: none;

  @media (max-width: 767px) {
    display: block;
    position: sticky;
    top: 0;
    z-index: 50;
    background: color-mix(in srgb, var(--bg, #080611) 88%, transparent);
    backdrop-filter: blur(14px) saturate(160%);
    -webkit-backdrop-filter: blur(14px) saturate(160%);
    border-bottom: 1px solid color-mix(in srgb, white 8%, transparent);
    margin-left: -0.75rem;
    margin-right: -0.75rem;
    width: calc(100% + 1.5rem);
    box-sizing: border-box;
  }
`

const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 1rem;
`

const Avatar = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  flex-shrink: 0;
  padding: 1.5px;
  background: conic-gradient(
    from 200deg,
    var(--link, #2fe6ff),
    var(--accent, #9b6cff),
    var(--signal, #ff5cd0),
    var(--link, #2fe6ff)
  );
`

const AvatarInner = styled.span`
  display: flex;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--bg, #080611);
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-weight: 700;
  font-size: 11px;
  color: ${({ theme }) => theme.brand.text};
  letter-spacing: 0.02em;
`

const Identity = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
`

const IdentName = styled.span`
  font-family: ${({ theme }) => theme.brand.fontDisplay};
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.brand.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const IdentRole = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.59rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--link, #2fe6ff);
`
