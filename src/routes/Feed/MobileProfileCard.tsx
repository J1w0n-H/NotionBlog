import { CONFIG } from "site.config"
import Image from "next/image"
import React from "react"
import styled from "@emotion/styled"
import { Emoji } from "src/components/Emoji"
import { FeedInlineHeading } from "src/routes/Feed/FeedInlineHeading"
import { feedHeaderProfileMinMedia } from "src/styles/feedBreakpoints"

const MobileProfileCard: React.FC = () => {
  return (
    <StyledWrapper>
      <FeedInlineHeading>
        <Emoji>💻</Emoji> Profile
      </FeedInlineHeading>
      <Card>
        <Avatar
          src={CONFIG.profile.image}
          width={90}
          height={90}
          alt={CONFIG.profile.name}
        />
        <Meta>
          <Name>{CONFIG.profile.name}</Name>
          <Role>{CONFIG.profile.role}</Role>
          <Bio>{CONFIG.profile.bio}</Bio>
        </Meta>
      </Card>
    </StyledWrapper>
  )
}

export default MobileProfileCard

const StyledWrapper = styled.div`
  display: block;

  ${feedHeaderProfileMinMedia} {
    display: none;
  }
`

const Card = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.75rem;
  border-radius: var(--radius-lg);
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  background-color: ${({ theme }) => theme.brand.surface};
`

const Avatar = styled(Image)`
  position: relative;
  flex: 0 0 auto;
  border-radius: var(--radius-pill);
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
`

const Meta = styled.div`
  min-width: 0;
`

const Name = styled.div`
  font-size: 1.125rem;
  line-height: 1.35;
  font-weight: 700;
  color: ${({ theme }) => theme.brand.text};
`

const Role = styled.div`
  margin-top: 0.125rem;
  margin-bottom: 0.375rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${({ theme }) => theme.brand.textMuted};
`

const Bio = styled.div`
  font-size: 0.875rem;
  line-height: 1.45;
  color: ${({ theme }) => theme.brand.textFaint};
`
