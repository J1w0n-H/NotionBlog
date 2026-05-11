import React, { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { useRouter } from "next/router"
import styled from "@emotion/styled"
import { ABOUT_SLUG } from "src/constants"
import { AiOutlineUser } from "react-icons/ai"
import { HiChevronRight, HiChevronLeft } from "react-icons/hi"

const TAB_WIDTH_PX = 52

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
      <TabIcon aria-hidden="true">
        <AiOutlineUser />
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
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 999px;
  background: oklch(1 0 0 / 0.16);
  color: inherit;

  svg {
    width: 1.05rem;
    height: 1.05rem;
  }
`

const TabLabel = styled.span`
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`

const TabChevron = styled.span`
  display: grid;
  place-items: center;
  color: inherit;

  svg {
    width: 0.95rem;
    height: 0.95rem;
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
  gap: 0.35rem;
  width: ${TAB_WIDTH_PX}px;
  min-height: 7.25rem;
  padding: 0.75rem 0.35rem 0.95rem;
  border: 1px solid ${({ theme }) => theme.brand.accent};
  border-left: none;
  border-radius: 0 0.9rem 0.9rem 0;
  background: ${({ theme }) => theme.brand.accent};
  color: ${({ theme }) => theme.brand.textOnAccent};
  box-shadow: 6px 0 22px oklch(0 0 0 / 0.18);
  cursor: pointer;
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 12px), 50% 100%, 0 calc(100% - 12px));
  transition: background 0.12s ease, border-color 0.12s ease,
    box-shadow 0.12s ease, transform 0.12s ease;

  &:hover {
    background: ${({ theme }) => theme.brand.accentHover};
    border-color: ${({ theme }) => theme.brand.accentHover};
    box-shadow: 8px 0 26px oklch(0 0 0 / 0.22);
    transform: translateX(2px);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.brand.text};
    outline-offset: 2px;
  }

  &[data-active="true"] {
    background: ${({ theme }) => theme.brand.surface};
    color: ${({ theme }) => theme.brand.text};
    border-color: ${({ theme }) => theme.brand.accent};
    box-shadow: 8px 0 28px oklch(0 0 0 / 0.16);
  }

  &[data-active="true"] ${TabIcon} {
    background: ${({ theme }) => theme.brand.surface2};
    color: ${({ theme }) => theme.brand.accent};
  }

  &[data-active="true"] ${TabChevron} {
    color: ${({ theme }) => theme.brand.accent};
  }
`
