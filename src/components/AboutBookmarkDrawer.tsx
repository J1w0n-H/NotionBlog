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
  gap: 0.45rem;
  width: var(${FEED_ABOUT_TAB_WIDTH_VAR}, 88px);
  min-height: 2.5rem;
  padding: 0 0.6rem 0 0.65rem;
  border: 1px solid ${({ theme }) => theme.brand.border};
  border-left: none;
  border-radius: 0 0.65rem 0.65rem 0;
  background: ${({ theme }) => theme.brand.surface};
  color: ${({ theme }) => theme.brand.textMuted};
  box-shadow: 4px 0 14px oklch(0 0 0 / 0.05);
  cursor: pointer;
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

  &:hover {
    color: ${({ theme }) => theme.brand.text};
    background: ${({ theme }) => theme.brand.surface2};
    border-color: ${({ theme }) => theme.brand.borderStrong};
    box-shadow: 6px 0 16px oklch(0 0 0 / 0.07);
    transform: translateX(1px);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.brand.accentRing};
    outline-offset: 2px;
  }

  &[data-active="true"] {
    color: ${({ theme }) => theme.brand.accent};
    background: ${({ theme }) => theme.brand.accentSoft};
    border-color: ${({ theme }) => theme.brand.accent};
    box-shadow: 6px 0 18px oklch(0 0 0 / 0.07);
    transform: translateX(2px);
  }

  &[data-active="true"] ${TabChevron} {
    color: ${({ theme }) => theme.brand.accent};
  }
`
