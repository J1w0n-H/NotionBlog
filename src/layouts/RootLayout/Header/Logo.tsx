import Link from "next/link"
import { CONFIG } from "site.config"
import styled from "@emotion/styled"
import { getInitials } from "src/libs/utils/getInitials"

const Logo = () => {
  const mark = getInitials(CONFIG.blog.title || CONFIG.profile.name)
  return (
    <StyledWrapper href="/" aria-label={CONFIG.blog.title}>
      <span className="mark" aria-hidden="true">
        {mark}
      </span>
    </StyledWrapper>
  )
}

export default Logo

const StyledWrapper = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  background: ${({ theme }) => theme.brand.surface};
  color: ${({ theme }) => theme.brand.text};
  text-decoration: none;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.brand.surface2};
  }

  .mark {
    font-family: ${({ theme }) => theme.brand.fontMono};
    font-weight: 900;
    letter-spacing: -0.02em;
  }
`
