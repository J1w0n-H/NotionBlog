import React, { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { useRouter } from "next/router"
import styled from "@emotion/styled"
import { ABOUT_SLUG } from "src/constants"
import { HiChevronRight, HiChevronLeft, HiOutlineUser } from "react-icons/hi"
import { FEED_ABOUT_TAB_WIDTH_VAR } from "src/libs/utils/feedLayoutVars"
import { FEED_HEADER_HEIGHT_VAR } from "src/libs/utils/feedScrollOffset"
import { useReturnToFeed } from "src/hooks/useReturnToFeed"
import { pickFeedListQuery } from "src/libs/utils/returnToFeed"

const AboutBookmarkDrawer: React.FC = () => {
  const router = useRouter()
  const returnToFeed = useReturnToFeed()
  const [mounted, setMounted] = useState(false)
  const slug = `${router.query.slug ?? ""}`
  const isOpen =
    router.isReady &&
    router.pathname === "/[slug]" &&
    slug === ABOUT_SLUG

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggle = () => {
    if (isOpen) {
      returnToFeed({ scroll: false })
      return
    }

    void router.push(
      {
        pathname: `/${ABOUT_SLUG}`,
        query: pickFeedListQuery(router.query),
      },
      undefined,
      { scroll: false }
    )
  }

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        returnToFeed({ scroll: false })
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isOpen, returnToFeed])

  if (!mounted) return null

  return createPortal(
    <BookmarkTab
      type="button"
      data-active={isOpen ? "true" : "false"}
      onClick={toggle}
      aria-expanded={isOpen}
      aria-label={isOpen ? "Close About" : "Open About"}
      title={isOpen ? "Close About" : "Open About"}
    >
      <TabIcon aria-hidden="true">
        <HiOutlineUser />
      </TabIcon>
      <TabLabel>About</TabLabel>
      <TabChevron aria-hidden="true">
        {isOpen ? <HiChevronLeft /> : <HiChevronRight />}
      </TabChevron>
    </BookmarkTab>,
    document.body
  )
}

export default AboutBookmarkDrawer

const TabIcon = styled.span`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 1.65rem;
  height: 1.65rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.brand.surface2};
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  color: inherit;

  svg {
    width: 1rem;
    height: 1rem;
  }
`

const TabLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  line-height: 1;
`

const TabChevron = styled.span`
  display: grid;
  place-items: center;
  color: ${({ theme }) => theme.brand.textFaint};

  svg {
    width: 0.85rem;
    height: 0.85rem;
  }
`

const BookmarkTab = styled.button`
  position: fixed;
  left: 0;
  top: calc(var(${FEED_HEADER_HEIGHT_VAR}, 4.5rem) + 1rem);
  z-index: 45;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem;
  width: var(${FEED_ABOUT_TAB_WIDTH_VAR}, 88px);
  min-height: 2.65rem;
  padding: 0.2rem 0.55rem 0.2rem 0.5rem;
  border: 1px solid ${({ theme }) => theme.brand.border};
  border-left: none;
  border-radius: 0 0.85rem 0.85rem 0;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.brand.surface} 0%,
    ${({ theme }) => theme.brand.surface2} 100%
  );
  color: ${({ theme }) => theme.brand.textMuted};
  box-shadow:
    4px 0 18px oklch(0 0 0 / 0.08),
    0 0 0 1px oklch(0 0 0 / 0.04);
  cursor: pointer;
  overflow: hidden;
  isolation: isolate;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 12%;
    bottom: 12%;
    width: 3px;
    border-radius: 0 3px 3px 0;
    background: linear-gradient(
      180deg,
      ${({ theme }) => theme.brand.accent} 0%,
      ${({ theme }) => theme.brand.accent} 55%,
      ${({ theme }) => theme.brand.borderStrong} 100%
    );
    opacity: 0.95;
    pointer-events: none;
  }

  transition:
    background ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease},
    border-color ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease},
    color ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease},
    box-shadow ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease},
    transform ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease};

  @media (prefers-reduced-motion: no-preference) {
    &[data-active="false"] {
      animation: aboutTabPeek 5s ease-in-out infinite;
    }
  }

  &:hover {
    animation: none;
    color: ${({ theme }) => theme.brand.text};
    background: ${({ theme }) => theme.brand.surface};
    border-color: ${({ theme }) => theme.brand.borderStrong};
    box-shadow:
      6px 0 22px oklch(0 0 0 / 0.1),
      0 0 0 1px ${({ theme }) => theme.brand.accentSoft};
    transform: translateX(2px);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.brand.accentRing};
    outline-offset: 3px;
  }

  &[data-active="true"] {
    animation: none;
    color: ${({ theme }) => theme.brand.accent};
    background: linear-gradient(
      135deg,
      ${({ theme }) => theme.brand.accentSoft} 0%,
      ${({ theme }) => theme.brand.surface} 100%
    );
    border-color: ${({ theme }) => theme.brand.accent};
    box-shadow:
      6px 0 20px oklch(0 0 0 / 0.12),
      0 0 18px ${({ theme }) => theme.brand.accentSoft},
      0 0 0 1px ${({ theme }) => theme.brand.borderSoft};
    transform: translateX(3px);
  }

  &[data-active="true"] ${TabIcon} {
    background: ${({ theme }) => theme.brand.surface};
    border-color: ${({ theme }) => theme.brand.accent};
    color: ${({ theme }) => theme.brand.accent};
  }

  &[data-active="true"] ${TabChevron} {
    color: ${({ theme }) => theme.brand.accent};
  }

  @keyframes aboutTabPeek {
    0%,
    86%,
    100% {
      transform: translateX(0);
    }
    88% {
      transform: translateX(4px) rotate(0.4deg);
    }
    91% {
      transform: translateX(-2px) rotate(-0.35deg);
    }
    94% {
      transform: translateX(3px) rotate(0.25deg);
    }
    97% {
      transform: translateX(0);
    }
  }
`
