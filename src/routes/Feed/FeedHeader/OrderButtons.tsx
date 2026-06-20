import styled from "@emotion/styled"
import { useRouter } from "next/router"
import React from "react"

type TOrder = "asc" | "desc"

type Props = {
  className?: string
}

const OrderButtons: React.FC<Props> = ({ className }) => {
  const router = useRouter()
  const currentOrder = `${router.query.order || ""}` || ("desc" as TOrder)

  const handleClickOrderBy = (value: TOrder) => {
    router.push({
      query: {
        ...router.query,
        order: value,
      },
    })
  }

  return (
    <StyledWrapper
      className={className}
      role="group"
      aria-label="Sort order"
    >
      <button
        type="button"
        data-active={currentOrder === "desc" ? "true" : "false"}
        aria-pressed={currentOrder === "desc" ? "true" : "false"}
        onClick={() => handleClickOrderBy("desc")}
      >
        ↓
      </button>
      <button
        type="button"
        data-active={currentOrder === "asc" ? "true" : "false"}
        aria-pressed={currentOrder === "asc" ? "true" : "false"}
        onClick={() => handleClickOrderBy("asc")}
      >
        ↑
      </button>
    </StyledWrapper>
  )
}

export default OrderButtons

const StyledWrapper = styled.div`
  display: inline-flex;
  gap: 2px;
  padding: 2px;
  background: ${({ theme }) => theme.brand.surface2};
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  border-radius: 8px;

  button {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.625rem;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: ${({ theme }) => theme.brand.textFaint};
    font-family: ${({ theme }) => theme.brand.fontMono};
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    cursor: pointer;
    transition:
      background 0.15s ease,
      color 0.15s ease,
      box-shadow 0.15s ease;

    .arrow {
      font-family: ${({ theme }) => theme.brand.fontMono};
      opacity: 0.6;
      transition: opacity 0.15s ease, color 0.15s ease;
    }

    &:hover {
      color: ${({ theme }) => theme.brand.text};
    }

    &[data-active="true"] {
      background: ${({ theme }) => theme.brand.surface};
      color: ${({ theme }) => theme.brand.text};
      box-shadow: ${({ theme }) => theme.brand.shadowSm};

      .arrow {
        opacity: 1;
        color: ${({ theme }) => theme.brand.accent};
      }
    }

    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.brand.accentRing};
      outline-offset: 2px;
    }
  }
`
