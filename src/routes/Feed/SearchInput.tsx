import styled from "@emotion/styled"
import React, { InputHTMLAttributes, ReactNode } from "react"
import { Emoji } from "src/components/Emoji"

interface Props extends InputHTMLAttributes<HTMLInputElement> {}

const SearchInput: React.FC<Props> = ({ ...props }) => {
  return (
    <StyledWrapper>
      <div className="top">
        <Emoji>🔎</Emoji> Search
      </div>
      <input
        className="mid"
        type="text"
        placeholder="Search Keyword..."
        {...props}
      />
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
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.brand.textMuted};
  }
  > .mid {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    padding-left: 1.25rem;
    padding-right: 1.25rem;
    border-radius: 1rem;
    outline-style: none;
    width: 100%;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.brand.text};
    background-color: ${({ theme }) => theme.brand.surfaceSunk};
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
      box-shadow: 0 0 0 3px ${({ theme }) => theme.brand.accentSoft};
    }
  }
`
