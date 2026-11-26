import styled from "@emotion/styled"
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type InputHTMLAttributes,
} from "react"
import { HiSearch } from "react-icons/hi"

type Props = InputHTMLAttributes<HTMLInputElement> & {
  /** Register ⌘K / Ctrl+K to focus this field and show the badge. */
  shortcut?: boolean
  /** Bare field without icon or badge (narrow containers). */
  compact?: boolean
}

/**
 * The one search field used everywhere (side nav, collapsed nav dock, mobile
 * drawer). All instances edit the same `?q=` state via useFeedSearchQuery.
 */
const SearchInput = forwardRef<HTMLInputElement, Props>(function SearchInput(
  { className, shortcut = false, compact = false, ...props },
  ref
) {
  const inputRef = useRef<HTMLInputElement>(null)
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

  // Decide the label after mount so SSR and client markup match.
  const [shortcutLabel, setShortcutLabel] = useState("⌘K")
  useEffect(() => {
    if (!shortcut) return
    if (!/mac|iphone|ipad/i.test(navigator.platform || navigator.userAgent)) {
      setShortcutLabel("Ctrl K")
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [shortcut])

  return (
    <StyledWrapper
      className={className}
      data-compact={compact ? "true" : undefined}
      data-shortcut={shortcut ? "true" : "false"}
    >
      <div className="input-wrap">
        {!compact && (
          <SearchIconWrap aria-hidden="true">
            <HiSearch size={14} />
          </SearchIconWrap>
        )}
        <input
          ref={inputRef}
          className="field"
          type="text"
          aria-label={props["aria-label"] ?? "Search posts"}
          placeholder={props.placeholder ?? "Search posts…"}
          {...props}
        />
        {shortcut && !compact && (
          <KbdBadge aria-hidden="true">{shortcutLabel}</KbdBadge>
        )}
      </div>
    </StyledWrapper>
  )
})

export default SearchInput

const StyledWrapper = styled.div`
  width: 100%;

  > .input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  > .input-wrap > .field {
    width: 100%;
    padding: 0.4375rem 2.75rem 0.4375rem 2rem;
    border-radius: 0.75rem;
    outline: none;
    font-size: 0.8125rem;
    color: ${({ theme }) => theme.brand.text};
    background: ${({ theme }) => theme.brand.surfaceSunk};
    border: 1px solid ${({ theme }) => theme.brand.border};
    transition: border-color 0.12s ease, box-shadow 0.12s ease;

    &::placeholder {
      color: ${({ theme }) => theme.brand.textFaint};
    }
    &:hover {
      border-color: ${({ theme }) => theme.brand.borderStrong};
    }
    &:focus {
      border-color: ${({ theme }) => theme.brand.accent};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.brand.accentSoft},
        var(--glow-sm, none);
    }
  }

  /* No icon / shortcut badge — e.g. the collapsed nav dock */
  &[data-compact="true"] > .input-wrap > .field {
    padding: 0.45rem 0.55rem;
  }
  &[data-shortcut="false"]:not([data-compact="true"]) > .input-wrap > .field {
    padding-right: 0.75rem;
  }
`

const SearchIconWrap = styled.span`
  position: absolute;
  left: 0.625rem;
  display: inline-flex;
  align-items: center;
  pointer-events: none;
  color: ${({ theme }) => theme.brand.textFaint};
`

const KbdBadge = styled.kbd`
  position: absolute;
  right: 0.5rem;
  display: inline-flex;
  align-items: center;
  padding: 0.1875rem 0.3125rem;
  border-radius: 0.3125rem;
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  background: ${({ theme }) => theme.brand.surface2};
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.5625rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.brand.textFaint};
  pointer-events: none;
  line-height: 1;
`
