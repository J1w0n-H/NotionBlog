import styled from "@emotion/styled"
import AboutDrawerContent from "src/components/AboutDrawerContent"

const SlugAboutMobileView = () => {
  return (
    <MobileWrapper>
      <AboutDrawerContent />
    </MobileWrapper>
  )
}

export default SlugAboutMobileView

const MobileWrapper = styled.div`
  padding: 1rem 1rem 3rem;
`
