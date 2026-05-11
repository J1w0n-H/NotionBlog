import Link from "next/link"
import React from "react"
import styled from "@emotion/styled"
import Feed from "src/routes/Feed"
import PageDetail from "./PageDetail"
import PostDetail from "./PostDetail"

type Props = {
  isPage: boolean
}

const AboutDesktopSplit: React.FC<Props> = ({ isPage }) => {
  return (
    <SplitRoot aria-label="About and posts">
      <AboutColumn>
        <AboutToolbar>
          <Link href="/" className="close">
            ← Back to feed
          </Link>
        </AboutToolbar>
        {isPage ? (
          <PageScroll>
            <PageDetail />
          </PageScroll>
        ) : (
          <PostDetail variant="side" />
        )}
      </AboutColumn>
      <FeedColumn>
        <Feed />
      </FeedColumn>
    </SplitRoot>
  )
}

export default AboutDesktopSplit

const SplitRoot = styled.div`
  display: none;

  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: minmax(300px, 0.95fr) minmax(0, 1.35fr);
    gap: 1.5rem;
    align-items: start;
    width: 100vw;
    max-width: 100vw;
    margin-left: calc(50% - 50vw);
    margin-right: calc(50% - 50vw);
    padding: 0 clamp(1rem, 2.5vw, 2rem) 2rem;
  }

  @media (prefers-reduced-motion: no-preference) {
    @media (min-width: 1024px) {
      animation: feedSplitIn 0.28s ease-out;
    }
  }

  @keyframes feedSplitIn {
    from {
      opacity: 0.92;
      transform: translateX(12px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`

const AboutColumn = styled.aside`
  display: none;

  @media (min-width: 1024px) {
    display: flex;
    flex-direction: column;
    min-width: 0;
    position: sticky;
    top: 5.75rem;
    max-height: calc(100vh - 6.25rem);
    overflow: hidden;
    border: 1px solid ${({ theme }) => theme.brand.border};
    border-radius: 1rem;
    background: ${({ theme }) => theme.brand.surface};
    box-shadow: 0 8px 24px oklch(0 0 0 / 0.06);
  }

  @media (prefers-reduced-motion: no-preference) {
    @media (min-width: 1024px) {
      animation: aboutPaneIn 0.3s ease-out;
    }
  }

  @keyframes aboutPaneIn {
    from {
      opacity: 0;
      transform: translateX(-18px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`

const AboutToolbar = styled.div`
  flex-shrink: 0;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.brand.borderSoft};

  .close {
    font-size: 0.8125rem;
    font-weight: 600;
    color: ${({ theme }) => theme.brand.link};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`

const FeedColumn = styled.div`
  display: none;

  @media (min-width: 1024px) {
    display: block;
    min-width: 0;
  }
`

const PageScroll = styled.div`
  flex: 1;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 1rem 1.25rem 1.5rem;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) =>
    `${theme.brand.border} transparent`};
`
