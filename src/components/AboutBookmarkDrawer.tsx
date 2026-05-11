import React, { useEffect } from "react"
import { useRouter } from "next/router"
import styled from "@emotion/styled"
import { ABOUT_SLUG } from "src/constants"
import { zIndexes } from "src/styles/zIndexes"
import AboutDrawerContent from "./AboutDrawerContent"

const TAB_WIDTH_PX = 40
const DRAWER_WIDTH_PX = 380

const AboutBookmarkDrawer: React.FC = () => {
  const router = useRouter()
  const slug = `${router.query.slug ?? ""}`
  const isOpen =
    router.isReady &&
    router.pathname === "/[slug]" &&
    slug === ABOUT_SLUG

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

  return (
    <DesktopOnly>
      <Backdrop
        data-open={isOpen ? "true" : "false"}
        onClick={close}
        aria-hidden="true"
      />
      <Shell
        data-open={isOpen ? "true" : "false"}
        style={{
          width: `${DRAWER_WIDTH_PX + TAB_WIDTH_PX}px`,
          transform: isOpen
            ? "translateX(0)"
            : `translateX(calc(-100% + ${TAB_WIDTH_PX}px))`,
        }}
      >
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
    </DesktopOnly>
  )
}

export default AboutBookmarkDrawer

const DesktopOnly = styled.div`
  display: none;

  @media (min-width: 1024px) {
    display: block;
  }
`

const Backdrop = styled.div`
  display: none;
  position: fixed;
  top: 5.75rem;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${zIndexes.header - 1};
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
  z-index: ${zIndexes.header + 1};
  display: flex;
  align-items: stretch;
  pointer-events: none;

  @media (prefers-reduced-motion: no-preference) {
    transition: transform 0.28s ease;
  }
`

const BookmarkTab = styled.button`
  pointer-events: auto;
  flex: 0 0 ${TAB_WIDTH_PX}px;
  width: ${TAB_WIDTH_PX}px;
  border: 1px solid ${({ theme }) => theme.brand.border};
  border-left: none;
  border-radius: 0 0.75rem 0.75rem 0;
  background: ${({ theme }) => theme.brand.surface};
  color: ${({ theme }) => theme.brand.link};
  box-shadow: 4px 0 16px oklch(0 0 0 / 0.08);
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
    border-color: ${({ theme }) => theme.brand.borderStrong};
  }
`

const Panel = styled.aside`
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  width: ${DRAWER_WIDTH_PX}px;
  min-width: 0;
  border: 1px solid ${({ theme }) => theme.brand.border};
  border-left: none;
  border-radius: 0 1rem 1rem 0;
  background: ${({ theme }) => theme.brand.surface};
  box-shadow: 12px 0 32px oklch(0 0 0 / 0.12);
  overflow: hidden;
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
