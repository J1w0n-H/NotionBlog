import React from "react"
import styled from "@emotion/styled"
import { useRouter } from "next/router"

type Props = {
  onMenuClick: () => void
  isMenuOpen?: boolean
}

const MobileTabBar: React.FC<Props> = ({ onMenuClick, isMenuOpen }) => {
  const router = useRouter()
  const isFeed = router.pathname === "/"
  const isAbout =
    typeof router.query.slug === "string"
      ? router.query.slug === "about"
      : Array.isArray(router.query.slug)
      ? router.query.slug[0] === "about"
      : false

  return (
    <Bar role="tablist" aria-label="Main navigation">
      <Tab
        type="button"
        role="tab"
        aria-selected={isMenuOpen ? "true" : "false"}
        data-active={isMenuOpen ? "true" : "false"}
        aria-label="Open navigation menu"
        onClick={onMenuClick}
      >
        <TabIcon aria-hidden="true">
          <BLine />
          <BLine />
          <BLine />
        </TabIcon>
        <TabLabel>Menu</TabLabel>
      </Tab>

      <Tab
        type="button"
        role="tab"
        aria-selected={isFeed ? "true" : "false"}
        data-active={isFeed && !isMenuOpen ? "true" : "false"}
        aria-label="Feed"
        onClick={() => void router.push("/")}
      >
        <TabIcon aria-hidden="true">
          <FeedIcon />
        </TabIcon>
        <TabLabel>Feed</TabLabel>
      </Tab>

      <Tab
        type="button"
        role="tab"
        aria-selected={isAbout ? "true" : "false"}
        data-active={isAbout && !isMenuOpen ? "true" : "false"}
        aria-label="About"
        onClick={() => void router.push("/about")}
      >
        <TabIcon aria-hidden="true">
          <AboutIcon />
        </TabIcon>
        <TabLabel>About</TabLabel>
      </Tab>
    </Bar>
  )
}

export default MobileTabBar

/* Small inline SVG icons */
const FeedIcon: React.FC = () => (
  <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
    <rect x="0" y="0" width="18" height="2.5" rx="1.25" fill="currentColor" />
    <rect x="0" y="5.75" width="14" height="2.5" rx="1.25" fill="currentColor" />
    <rect x="0" y="11.5" width="10" height="2.5" rx="1.25" fill="currentColor" />
  </svg>
)

const AboutIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
)

const Bar = styled.nav`
  display: none;

  @media (max-width: 767px) {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: rgba(10, 8, 20, 0.82);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    border-top: 1px solid color-mix(in srgb, white 8%, transparent);
    padding: 9px 0 calc(18px + env(safe-area-inset-bottom, 8px));
    padding-bottom: max(
      calc(18px + env(safe-area-inset-bottom, 0px)),
      18px
    );
  }
`

const Tab = styled.button`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-height: 44px;
  padding: 4px 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: ${({ theme }) => theme.brand.textFaint};
  transition: color 0.12s ease;

  &[data-active="true"] {
    color: var(--link, #2fe6ff);
    filter: drop-shadow(0 0 6px color-mix(in srgb, var(--link, #2fe6ff) 55%, transparent));
  }
  &:hover:not([data-active="true"]) {
    color: ${({ theme }) => theme.brand.textMuted};
  }
`

const TabIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 18px;
`

const TabLabel = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.59rem;
  font-weight: 600;
  letter-spacing: 0.07em;
  line-height: 1;
`

/* Burger-style lines for the Menu icon */
const BLine = styled.span`
  display: block;
  width: 18px;
  height: 2px;
  border-radius: 1px;
  background: currentColor;
  margin: 2px 0;

  &:first-of-type { margin-top: 0; }
  &:last-of-type { margin-bottom: 0; }
`
