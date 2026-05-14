import styled from "@emotion/styled"
import React from "react"
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi"
import useScheme from "src/hooks/useScheme"

type Props = {}

const ThemeToggle: React.FC<Props> = () => {
  const [scheme, setScheme] = useScheme()

  const handleClick = () => {
    setScheme(scheme === "light" ? "dark" : "light")
  }

  return (
    <StyledButton
      type="button"
      onClick={handleClick}
      aria-label={
        scheme === "light" ? "Switch to dark mode" : "Switch to light mode"
      }
    >
      {scheme === "light" ? <HiOutlineSun /> : <HiOutlineMoon />}
    </StyledButton>
  )
}

export default ThemeToggle

const StyledButton = styled.button`
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  padding: 0;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  background: ${({ theme }) => theme.brand.surface};
  color: ${({ theme }) => theme.brand.textMuted};
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease},
    color ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease},
    border-color ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease};

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    background: ${({ theme }) => theme.brand.surface2};
    color: ${({ theme }) => theme.brand.text};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.brand.accentRing};
    outline-offset: 2px;
  }
`
