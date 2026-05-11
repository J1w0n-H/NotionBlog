import { CONFIG } from "site.config"
import Image from "next/image"
import React from "react"
import styled from "@emotion/styled"
import ProfileMetaCopy from "src/components/ProfileMetaCopy"

type Props = {
  className?: string
}

const MobileProfileCard: React.FC<Props> = () => {
  return (
    <StyledWrapper>
      <div className="sectionLabel">Profile</div>
      <div className="card">
        <div className="row">
          <div className="avatar">
            <Image
              src={CONFIG.profile.image}
              width={88}
              height={88}
              alt={CONFIG.profile.name}
              css={{ borderRadius: "999px", objectFit: "cover" }}
            />
          </div>
          <div className="stack">
            <div className="name">{CONFIG.profile.name}</div>
            <div className="role">{CONFIG.profile.role}</div>
            <ProfileMetaCopy compact />
          </div>
        </div>
      </div>
    </StyledWrapper>
  )
}

export default MobileProfileCard

const StyledWrapper = styled.div`
  display: block;

  @media (min-width: 1024px) {
    display: none;
  }

  .sectionLabel {
    padding: 0.25rem;
    margin-bottom: 0.5rem;
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.brand.textMuted};
  }

  .card {
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 1rem;
    background: ${({ theme }) => theme.brand.surface};
    border: 1px solid ${({ theme }) => theme.brand.border};
    box-shadow: 0 1px 2px oklch(0 0 0 / 0.05);
  }

  .row {
    display: flex;
    gap: 0.875rem;
    align-items: flex-start;
  }

  .avatar {
    flex-shrink: 0;
  }

  .stack {
    min-width: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .name {
    font-size: 1.25rem;
    line-height: 1.35;
    font-weight: 700;
    color: ${({ theme }) => theme.brand.text};
  }

  .role {
    font-size: 0.8125rem;
    line-height: 1.35;
    color: ${({ theme }) => theme.brand.textMuted};
    margin-bottom: 0.125rem;
  }
`
