import styled from "@emotion/styled"
import Link from "next/link"

const NavBar: React.FC = () => {
  const links = [{ id: 1, name: "About", to: "/about" }]
  return (
    <StyledWrapper className="">
      <ul>
        {links.map((link) => (
          <li key={link.id}>
            <Link href={link.to}>{link.name}</Link>
          </li>
        ))}
      </ul>
    </StyledWrapper>
  )
}

export default NavBar

const StyledWrapper = styled.div`
  flex-shrink: 0;
  ul {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.25rem;
    li {
      display: block;
      margin-left: 0;
      a {
        font-size: 0.875rem;
        font-weight: 600;
        color: ${({ theme }) => theme.brand.textMuted};
        text-decoration: none;
        padding: 0.35rem 0.5rem;
        border-radius: 0.5rem;
        transition: background 0.12s ease, color 0.12s ease;
        &:hover {
          color: ${({ theme }) => theme.brand.text};
          background: ${({ theme }) => theme.brand.surface2};
        }
      }
    }
  }
`
