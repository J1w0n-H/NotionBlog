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
    <StyledWrapper className={className} aria-label="Sort posts">
      <button
        type="button"
        data-active={currentOrder === "desc" ? "true" : "false"}
        aria-pressed={currentOrder === "desc" ? "true" : "false"}
        onClick={() => handleClickOrderBy("desc")}
      >
        Desc
      </button>
      <button
        type="button"
        data-active={currentOrder === "asc" ? "true" : "false"}
        aria-pressed={currentOrder === "asc" ? "true" : "false"}
        onClick={() => handleClickOrderBy("asc")}
      >
        Asc
      </button>
    </StyledWrapper>
  )
}

export default OrderButtons

const StyledWrapper = styled.div`
  display: inline-flex;
  gap: 0.125rem;
  padding: 0.125rem;
  border-radius: var(--radius-pill);
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  background: ${({ theme }) => theme.brand.surface2};

  button {
    padding: 0.25rem 0.625rem;
    border: 0;
    border-radius: var(--radius-pill);
    background: transparent;
    color: ${({ theme }) => theme.brand.textMuted};
    font-family: ${({ theme }) => theme.brand.fontSans};
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    cursor: pointer;
    transition:
      background 0.12s ease,
      color 0.12s ease;

    &[data-active="true"] {
      background: ${({ theme }) => theme.brand.surface};
      color: ${({ theme }) => theme.brand.text};
      box-shadow: ${({ theme }) => theme.brand.shadowSm};
    }

    &:hover {
      color: ${({ theme }) => theme.brand.text};
    }

    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.brand.accentRing};
      outline-offset: 2px;
    }
  }
`
