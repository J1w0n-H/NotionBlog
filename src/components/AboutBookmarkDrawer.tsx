import React, { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { useRouter } from "next/router"
import styled from "@emotion/styled"
import { ABOUT_SLUG } from "src/constants"
import AboutDrawerContent from "./AboutDrawerContent"

const TAB_WIDTH_PX = 44
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
      <Shell data-open={isOpen ? "true" : "false"}>
        <BookmarkTab
          type="button"
          data-active={isOpen ? "true" : "false"}
          onClick={toggle}
          aria-expanded={isOpen}
          aria-controls="about-drawer-panel"
        >
          About
        </BookmarkTab>
        <Panel id="about-drawer-panel" aria-hidden={!isOpen}>
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
      </Shell>
    </>,
    document.body
  )
}

export default AboutBookmarkDrawer

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

const Shell = styled.div`
  position: fixed;
  left: 0;
  top: 5.75rem;
  bottom: 0;
  z-index: 41;
  display: flex;
  align-items: stretch;
  width: ${DRAWER_WIDTH_PX + TAB_WIDTH_PX}px;
  max-width: min(${DRAWER_WIDTH_PX + TAB_WIDTH_PX}px, calc(100vw - 0.5rem));
  transform: translateX(calc(-100% + ${TAB_WIDTH_PX}px));
  pointer-events: none;

  &[data-open="true"] {
    transform: translateX(0);
  }

  @media (prefers-reduced-motion: no-preference) {
    transition: transform 0.28s ease;
  }

  @media (max-width: 1023px) {
    width: min(22rem, calc(100vw - 0.75rem));
    max-width: min(22rem, calc(100vw - 0.75rem));
  }
`

const BookmarkTab = styled.button`
  pointer-events: auto;
  flex: 0 0 ${TAB_WIDTH_PX}px;
  width: ${TAB_WIDTH_PX}px;
  border: 1px solid ${({ theme }) => theme.brand.borderStrong};
  border-left: none;
  border-radius: 0 0.75rem 0.75rem 0;
  background: ${({ theme }) => theme.brand.surface};
  color: ${({ theme }) => theme.brand.link};
  box-shadow: 4px 0 18px oklch(0 0 0 / 0.12);
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.12s ease, color 0.12s ease, border-color 0.12s ease;

  &:hover {
    background: ${({ theme }) => theme.brand.surface2};
    color: ${({ theme }) => theme.brand.text};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.brand.accent};
    outline-offset: 2px;
  }

  &[data-active="true"] {
    background: ${({ theme }) => theme.brand.surface2};
    color: ${({ theme }) => theme.brand.text};
    border-color: ${({ theme }) => theme.brand.accent};
  }
`

const Panel = styled.aside`
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  width: ${DRAWER_WIDTH_PX}px;
  min-width: 0;
  flex: 1;
  border: 1px solid ${({ theme }) => theme.brand.border};
  border-left: none;
  border-radius: 0 1rem 1rem 0;
  background: ${({ theme }) => theme.brand.surface};
  box-shadow: 12px 0 32px oklch(0 0 0 / 0.12);
  overflow: hidden;

  @media (max-width: 1023px) {
    width: auto;
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
