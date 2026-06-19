import React from "react"
import Image from "next/image"
import styled from "@emotion/styled"
import { CONFIG } from "site.config"
import { useAboutPanelToggle } from "src/hooks/useAboutPanelToggle"

const AboutProfileTrigger: React.FC = () => {
  const { toggle } = useAboutPanelToggle()

  return (
    <HeaderProfile
      type="button"
      onClick={toggle}
      aria-label="Open About"
    >
      <Avatar aria-hidden="true">
        <Image
          src={CONFIG.profile.image}
          alt=""
          fill
          sizes="32px"
          priority
          style={{ objectFit: "cover" }}
        />
      </Avatar>
      <NameBlock>
        <ProfileName>{CONFIG.blog.title}</ProfileName>
        <ProfileRole>{CONFIG.profile.role}</ProfileRole>
      </NameBlock>
    </HeaderProfile>
  )
}

export default AboutProfileTrigger

const Avatar = styled.span`
  position: relative;
  flex: 0 0 32px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  background: ${({ theme }) => theme.brand.surface2};
  box-shadow:
    0 0 0 1.5px var(--link),
    0 0 0 3px var(--accent);
`

const NameBlock = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 2px;

  @media (max-width: 767px) {
    display: none;
  }
`

const ProfileName = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.brand.text};
  white-space: nowrap;
  transition: color 0.15s ease;
`

const ProfileRole = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 10px;
  font-weight: 400;
  color: ${({ theme }) => theme.brand.textMuted};
  white-space: nowrap;
`

const HeaderProfile = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;

  &:hover ${ProfileName} {
    color: ${({ theme }) => theme.brand.accent};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.brand.accentRing};
    outline-offset: 3px;
    border-radius: 4px;
  }
`
