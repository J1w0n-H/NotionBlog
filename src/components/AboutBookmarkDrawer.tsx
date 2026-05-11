import React, { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { useRouter } from "next/router"
import styled from "@emotion/styled"
import { ABOUT_SLUG } from "src/constants"
import { HiChevronRight, HiChevronLeft } from "react-icons/hi"
import { variables } from "src/styles/variables"

const AboutBookmarkDrawer: React.FC = () => {
  const router = useRouter()
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
    void router.push(isOpen ? "/" : `/${ABOUT_SLUG}`, undefined, {
      scroll: false,
    })
  }

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        void router.push("/", undefined, { scroll: false })
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isOpen, router])

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
      <TabLabel>About</TabLabel>
      <TabChevron aria-hidden="true">
        {isOpen ? <HiChevronLeft /> : <HiChevronRight />}
      </TabChevron>
    </BookmarkTab>,
    document.body
  )
}

export default AboutBookmarkDrawer

const TabLabel = styled.span`
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-size: 0.6875rem;
  font-weight: 750;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  line-height: 1;
`

const TabChevron = styled.span`
  display: grid;
  place-items: center;
  width: 1.35rem;
  height: 1.35rem;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  background: ${({ theme }) => theme.brand.surface2};
  color: ${({ theme }) => theme.brand.textMuted};

  svg {
    width: 0.85rem;
    height: 0.85rem;
  }
`

const BookmarkTab = styled.button`
  position: fixed;
  left: 0;
  top: 8.25rem;
  z-index: 45;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: ${variables.feedAboutTabWidth}px;
  min-height: 6.5rem;
  padding: 0.85rem 0.35rem 0.9rem;
  border: 1px solid ${({ theme }) => theme.brand.border};
  border-left: none;
  border-radius: 0 0.85rem 0.85rem 0;
  background: ${({ theme }) => theme.brand.surface};
  color: ${({ theme }) => theme.brand.textMuted};
  box-shadow: 4px 0 18px oklch(0 0 0 / 0.06);
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.15s ease;

  &::after {
    content: "";
    position: absolute;
    top: 0.85rem;
    right: 0;
    bottom: 0.85rem;
    width: 2px;
    border-radius: 999px;
    background: transparent;
    transition: background 0.15s ease;
  }

  &:hover {
    color: ${({ theme }) => theme.brand.text};
    background: ${({ theme }) => theme.brand.surface2};
    border-color: ${({ theme }) => theme.brand.borderStrong};
    box-shadow: 6px 0 20px oklch(0 0 0 / 0.08);
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
    box-shadow: 6px 0 22px oklch(0 0 0 / 0.08);
    transform: translateX(2px);
  }

  &[data-active="true"]::after {
    background: ${({ theme }) => theme.brand.accent};
  }

  &[data-active="true"] ${TabChevron} {
    border-color: ${({ theme }) => theme.brand.accentRing};
    background: ${({ theme }) => theme.brand.surface};
    color: ${({ theme }) => theme.brand.accent};
  }
`
