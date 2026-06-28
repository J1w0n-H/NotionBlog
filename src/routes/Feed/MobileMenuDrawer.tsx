import React, { useEffect, useRef } from "react"
import styled from "@emotion/styled"
import { useRouter } from "next/router"
import { HiSearch, HiX } from "react-icons/hi"
import { DEFAULT_CATEGORY } from "src/constants"
import { catVars, tokenForCategory } from "src/constants/categoryColors"
import { tokenForTagIndex } from "src/constants/tagPalette"
import { useFeedRouterFilters } from "src/hooks/useFeedRouterFilters"
import { useSectionNavData } from "./SectionNav/useSectionNavData"
import { useFeedTagChips } from "./useFeedTagChips"
import { TagChipButton, TagChipClearButton } from "./tagChipStyles"

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
  const router = useRouter()
  const { navCategories, tr } = useSectionNavData(q)
  const {
    topTags,
    onClick: onTagClick,
    isActive: isTagActive,
    clearTag,
    hasActiveTag,
    indexFor,
  } = useFeedTagChips(20)
  const { category: activeCategory } = useFeedRouterFilters()
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

  const onCategoryClick = (cat: string) => {
    const query = { ...router.query }
    if (cat === DEFAULT_CATEGORY) {
      delete query.category
    } else {
      query.category = cat
    }
    void router.push({ pathname: router.pathname, query }, undefined, {
      shallow: true,
      scroll: false,
    })
    onClose()
  }

  const handleTagClick = (tag: string) => {
    onTagClick(tag)
    onClose()
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
          <PanelTitle>$ menu</PanelTitle>
          <CloseBtn type="button" aria-label="Close menu" onClick={onClose}>
            <HiX size={18} />
          </CloseBtn>
        </PanelHead>

        <SearchRow>
          <SearchIconWrap aria-hidden="true">
            <HiSearch size={15} />
          </SearchIconWrap>
          <DrawerSearchInput
            ref={inputRef}
            value={q}
            onChange={(e) => onChangeQuery(e.target.value)}
            placeholder={tr("Search posts…")}
            aria-label="Search posts"
          />
        </SearchRow>

        <DrawerSection>
          <SectionLabel>CATEGORIES</SectionLabel>
          <CatList>
            <CatItem
              type="button"
              data-active={activeCategory === DEFAULT_CATEGORY ? "true" : "false"}
              onClick={() => onCategoryClick(DEFAULT_CATEGORY)}
            >
              All
            </CatItem>
            {navCategories.map((cat) => (
              <CatItem
                key={cat}
                type="button"
                data-active={activeCategory === cat ? "true" : "false"}
                style={catVars(tokenForCategory(cat))}
                onClick={() => onCategoryClick(cat)}
              >
                {tr(cat)}
              </CatItem>
            ))}
          </CatList>
        </DrawerSection>

        {topTags.length > 0 && (
          <DrawerSection>
            <SectionLabel>FILTER BY TAG</SectionLabel>
            <TagsWrap>
              {topTags.map(([tag]) => (
                <TagChipButton
                  key={tag}
                  type="button"
                  style={catVars(tokenForTagIndex(indexFor(tag)))}
                  aria-pressed={isTagActive(tag) ? "true" : "false"}
                  data-active={isTagActive(tag) ? "true" : "false"}
                  onClick={() => handleTagClick(tag)}
                >
                  <span className="label">{tag}</span>
                </TagChipButton>
              ))}
              {hasActiveTag && (
                <TagChipClearButton
                  type="button"
                  onClick={() => {
                    clearTag()
                    onClose()
                  }}
                >
                  Clear
                </TagChipClearButton>
              )}
            </TagsWrap>
          </DrawerSection>
        )}
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
  border-radius: 8px;
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

const SearchIconWrap = styled.span`
  color: ${({ theme }) => theme.brand.textFaint};
  flex-shrink: 0;
  display: flex;
`

const DrawerSearchInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 0.45rem 0.6rem;
  border-radius: 0.6rem;
  border: 1px solid ${({ theme }) => theme.brand.border};
  background: ${({ theme }) => theme.brand.surfaceSunk};
  color: ${({ theme }) => theme.brand.text};
  font-size: 0.8125rem;
  outline: none;
  transition: border-color 0.12s ease, box-shadow 0.12s ease;

  &::placeholder {
    color: ${({ theme }) => theme.brand.textFaint};
  }
  &:focus {
    border-color: var(--accent, #9b6cff);
    box-shadow: 0 0 0 3px ${({ theme }) => theme.brand.accentSoft};
  }
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
  padding: 0.45rem 0.625rem;
  border-radius: 7px;
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

const TagsWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
`
