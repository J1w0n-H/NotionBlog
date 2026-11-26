import React, { useEffect, useRef } from "react"
import styled from "@emotion/styled"
import { HiX } from "react-icons/hi"
import SearchInput from "./SearchInput"
import { useSectionNavData } from "./SectionNav/useSectionNavData"
import { RESUME_SECTION_IDS } from "src/constants/resumeSections"
import { WRITING_SECTION_ID } from "./WritingFilterBar"

const JUMP_TARGETS = [
  { id: RESUME_SECTION_IDS.background, label: "Background" },
  { id: WRITING_SECTION_ID, label: "Writing" },
] as const

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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [isOpen, onClose])

  // Category and tag filters live in the Writing bar; the drawer only
  // searches and jumps.
  const jumpTo = (id: string) => {
    onClose()
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 0)
  }

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

        <DrawerSection>
          <SectionLabel>{tr("Jump to")}</SectionLabel>
          <CatList>
            {JUMP_TARGETS.map(({ id, label }) => (
              <CatItem key={id} type="button" onClick={() => jumpTo(id)}>
                {tr(label)}
              </CatItem>
            ))}
          </CatList>
        </DrawerSection>
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

const DrawerSection = styled.div`
  padding: 1rem 1rem 0.5rem;
  flex-shrink: 0;

  & + & {
    border-top: 1px solid color-mix(in srgb, white 6%, transparent);
  }
`

const SectionLabel = styled.div`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.5625rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.textFaint};
  margin-bottom: 0.625rem;
`

const CatList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const CatItem = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 44px;
  padding: 0 0.625rem;
  border-radius: var(--radius-sm);
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.brand.textMuted};
  font-size: 0.875rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: background 0.1s ease, color 0.1s ease, box-shadow 0.1s ease;

  &:hover {
    background: ${({ theme }) => theme.brand.surface2};
    color: ${({ theme }) => theme.brand.text};
  }

  &[data-active="true"] {
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--accent, #9b6cff) 18%, transparent),
      transparent
    );
    box-shadow: inset 2px 0 0 var(--accent, #9b6cff);
    color: ${({ theme }) => theme.brand.text};
    font-weight: 600;
  }
`

