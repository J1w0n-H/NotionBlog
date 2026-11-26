import React, { useEffect, useRef } from "react"
import styled from "@emotion/styled"
import { HiX } from "react-icons/hi"
import SearchInput from "./SearchInput"
import { useSectionNavData } from "./SectionNav/useSectionNavData"
import { useEscapeKey } from "src/hooks/useEscapeKey"

type Props = {
  isOpen: boolean
  onClose: () => void
  q: string
  onChangeQuery: (next: string) => void
}

const MobileMenuDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  q,
  onChangeQuery,
}) => {
  const { tr } = useSectionNavData(q)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      const timer = window.setTimeout(() => inputRef.current?.focus(), 120)
      return () => window.clearTimeout(timer)
    }
  }, [isOpen])

  useEffect(() => {
    const isMobile =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches
    if (isOpen && isMobile) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  useEscapeKey(onClose, isOpen)

  return (
    <Overlay
      $isOpen={isOpen}
      onClick={onClose}
      aria-hidden={!isOpen}
    >
      <Panel
        $isOpen={isOpen}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <PanelHead>
          <PanelTitle>Menu</PanelTitle>
          <CloseBtn type="button" aria-label="Close menu" onClick={onClose}>
            <HiX size={18} />
          </CloseBtn>
        </PanelHead>

        <SearchRow>
          <SearchInput
            ref={inputRef}
            value={q}
            onChange={(e) => onChangeQuery(e.target.value)}
            placeholder={tr("Search posts…")}
          />
        </SearchRow>

      </Panel>
    </Overlay>
  )
}

export default MobileMenuDrawer

const Overlay = styled.div<{ $isOpen: boolean }>`
  display: none;

  @media (max-width: 767px) {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 200;
    background: rgba(4, 3, 12, 0.62);
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
    opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
    pointer-events: ${({ $isOpen }) => ($isOpen ? "auto" : "none")};
    transition: opacity 240ms ease;
  }
`

const Panel = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: min(330px, 88vw);
  z-index: 201;
  background: color-mix(in srgb, var(--bg, #080611) 95%, transparent);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  border-right: 1px solid color-mix(in srgb, white 8%, transparent);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  transform: ${({ $isOpen }) =>
    $isOpen ? "translateX(0)" : "translateX(-100%)"};
  transition: transform 260ms cubic-bezier(0.2, 0, 0, 1);

  /* Hide scrollbar */
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`

const PanelHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.125rem 1rem 0.875rem;
  border-bottom: 1px solid color-mix(in srgb, white 7%, transparent);
  flex-shrink: 0;
`

const PanelTitle = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--link, #2fe6ff);
`

const CloseBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  background: transparent;
  color: ${({ theme }) => theme.brand.textFaint};
  cursor: pointer;
  transition: background 0.12s ease, color 0.12s ease, border-color 0.12s ease;

  &:hover {
    background: ${({ theme }) => theme.brand.surface2};
    color: ${({ theme }) => theme.brand.text};
    border-color: ${({ theme }) => theme.brand.border};
  }
`

const SearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid color-mix(in srgb, white 6%, transparent);
  flex-shrink: 0;
`

