import styled from "@emotion/styled"
import React, { InputHTMLAttributes } from "react"
import { HiSearch } from "react-icons/hi"

interface Props extends InputHTMLAttributes<HTMLInputElement> {}

const SearchInput: React.FC<Props> = ({ className, ...props }) => {
  return (
    <StyledWrapper className={className}>
      <div className="top">Search</div>
      <div className="input-wrap">
        <SearchIconWrap aria-hidden="true">
          <HiSearch size={13} />
        </SearchIconWrap>
        <input
          className="field"
          type="text"
          placeholder={props.placeholder ?? "search posts..."}
          {...props}
        />
        <KbdBadge aria-hidden="true">⌘K</KbdBadge>
      </div>
    </StyledWrapper>
  )
}

export default SearchInput

const StyledWrapper = styled.div`
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    margin-bottom: 1.25rem;
  }

  > .top {
    padding: 0.25rem;
    margin-bottom: 0.5rem;
    font-size: 0.6875rem;
    font-weight: 750;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.brand.textMuted};
  }

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
