import React from "react"
import { useRouter } from "next/router"
import styled from "@emotion/styled"
import { ABOUT_SLUG } from "src/constants"

const AboutSidebarTrigger: React.FC = () => {
  const router = useRouter()
  const slug = `${router.query.slug ?? ""}`
  const isAboutRoute =
    router.isReady &&
    router.pathname === "/[slug]" &&
    slug === ABOUT_SLUG

  const toggle = () => {
    void router.push(isAboutRoute ? "/" : `/${ABOUT_SLUG}`)
  }

  return (
    <Trigger
      type="button"
      data-active={isAboutRoute ? "true" : "false"}
      onClick={toggle}
      aria-expanded={isAboutRoute}
    >
      About
    </Trigger>
  )
}

export default AboutSidebarTrigger

const Trigger = styled.button`
  display: none;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
  padding: 0.65rem 0.9rem;
  border: 1px solid ${({ theme }) => theme.brand.borderStrong};
  border-radius: 0.85rem;
  background: ${({ theme }) => theme.brand.surface};
  color: ${({ theme }) => theme.brand.link};
  font-size: 0.8125rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 1px 2px oklch(0 0 0 / 0.06);

  &[data-active="true"] {
    background: ${({ theme }) => theme.brand.surface2};
    color: ${({ theme }) => theme.brand.text};
    border-color: ${({ theme }) => theme.brand.accent};
  }

  @media (min-width: 1024px) {
    display: flex;
  }
`
