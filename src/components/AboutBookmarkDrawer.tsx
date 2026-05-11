import React, { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { useRouter } from "next/router"
import styled from "@emotion/styled"
import { ABOUT_SLUG } from "src/constants"
import AboutDrawerContent from "./AboutDrawerContent"
import { AiOutlineUser } from "react-icons/ai"
import { HiChevronRight, HiChevronLeft } from "react-icons/hi"

const TAB_WIDTH_PX = 52
const DRAWER_WIDTH_PX = 400

const AboutBookmarkDrawer: React.FC = () => {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const slug = `${router.query.slug ?? ""}`
  const isAboutRoute =
    router.isReady &&
    router.pathname === "/[slug]" &&
    slug === ABOUT_SLUG
  const isOpen = isAboutRoute

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggle = () => {
    void router.push(isOpen ? "/" : `/${ABOUT_SLUG}`)
  }

  const close = () => {
    if (isOpen) void router.push("/")
  }

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") void router.push("/")
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isOpen, router])

  if (!mounted) return null

  return createPortal(
    <>
      <Backdrop
        data-open={isOpen ? "true" : "false"}
        onClick={close}
        aria-hidden="true"
      />
      <BookmarkTab
        type="button"
        data-active={isOpen ? "true" : "false"}
        onClick={toggle}
        aria-expanded={isOpen}
        aria-controls="about-drawer-panel"
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
      </BookmarkTab>
      <Panel
        id="about-drawer-panel"
        data-open={isOpen ? "true" : "false"}
        aria-hidden={!isOpen}
      >
        <PanelHeader>
          <PanelTitle>About</PanelTitle>
          <CloseButton type="button" onClick={close} aria-label="Close About">
            ×
          </CloseButton>
        </PanelHeader>
        <PanelBody>
          {isOpen ? <AboutDrawerContent /> : null}
        </PanelBody>
      </Panel>
    </>,
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

const Backdrop = styled.div`
  display: none;
  position: fixed;
  top: 5.75rem;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 40;
  background: oklch(0 0 0 / 0.22);

  &[data-open="true"] {
    display: block;
  }

  @media (prefers-reduced-motion: no-preference) {
    &[data-open="true"] {
      animation: aboutBackdropIn 0.2s ease-out;
    }
  }

  @keyframes aboutBackdropIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
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

const Panel = styled.aside`
  position: fixed;
  left: ${TAB_WIDTH_PX}px;
  top: 5.75rem;
  bottom: 0;
  z-index: 44;
  display: flex;
  flex-direction: column;
  width: min(${DRAWER_WIDTH_PX}px, calc(100vw - ${TAB_WIDTH_PX}px - 0.75rem));
  border: 1px solid ${({ theme }) => theme.brand.border};
  border-left: none;
  border-radius: 0 1rem 1rem 0;
  background: ${({ theme }) => theme.brand.surface};
  box-shadow: 12px 0 32px oklch(0 0 0 / 0.12);
  overflow: hidden;
  transform: translateX(calc(-100% - ${TAB_WIDTH_PX}px));
  pointer-events: none;

  &[data-open="true"] {
    transform: translateX(0);
    pointer-events: auto;
  }

  @media (prefers-reduced-motion: no-preference) {
    transition: transform 0.28s ease;
  }

  @media (max-width: 1023px) {
    left: ${TAB_WIDTH_PX}px;
    width: min(22rem, calc(100vw - ${TAB_WIDTH_PX}px - 0.75rem));
    transform: translateX(calc(-100% - ${TAB_WIDTH_PX}px));

    &[data-open="true"] {
      transform: translateX(0);
    }
  }
`

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.brand.borderSoft};
`

const PanelTitle = styled.h2`
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.textMuted};
`

const CloseButton = styled.button`
  width: 2rem;
  height: 2rem;
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.brand.surface};
  color: ${({ theme }) => theme.brand.textMuted};
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.brand.surface2};
    color: ${({ theme }) => theme.brand.text};
  }
`

const PanelBody = styled.div`
  flex: 1;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 1rem 1.1rem 1.5rem;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) =>
    `${theme.brand.border} transparent`};
`
