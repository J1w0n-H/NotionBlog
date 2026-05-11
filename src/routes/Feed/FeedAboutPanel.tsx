import styled from "@emotion/styled"
import AboutDrawerContent from "src/components/AboutDrawerContent"
import FeedSidePanel from "src/routes/Feed/FeedSidePanel"

const FeedAboutPanel = () => {
  return (
    <FeedSidePanel closeAriaLabel="Close About" edge="left">
      <SideScroll>
        <AboutDrawerContent />
      </SideScroll>
    </FeedSidePanel>
  )
}

export default FeedAboutPanel

const SideScroll = styled.div`
  flex: 1;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 1rem 1.25rem 1.5rem;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) =>
    `${theme.brand.border} transparent`};

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.brand.border};
    border-radius: 999px;
  }
`
