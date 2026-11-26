import { CONFIG } from "site.config"
import React from "react"
import styled from "@emotion/styled"
import Link from "next/link"

/** Blog-engineering write-up (replaces the old top-of-page "I built this" ribbon). */
const BUILD_POST_SLUG = "JW-285"

const d = new Date()
const y = d.getFullYear()
const from = +CONFIG.since

type Props = {
  className?: string
}

const Footer: React.FC<Props> = ({ className }) => {
  return (
    <StyledWrapper className={className}>
      <a
        href={`https://github.com/${CONFIG.profile.github}`}
        target="_blank"
        rel="noreferrer"
      >
        © {CONFIG.profile.name} {from === y || !from ? y : `${from} - ${y}`}
      </a>
      <span aria-hidden="true"> · </span>
      <Link href={`/${BUILD_POST_SLUG}`}>How this site is built</Link>
    </StyledWrapper>
  )
}

export default Footer

const StyledWrapper = styled.div`
  margin-top: 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${({ theme }) => theme.brand.textMuted};

  a {
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: ${({ theme }) => theme.brand.textMuted};
  }
`
