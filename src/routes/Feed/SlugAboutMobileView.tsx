import { useState } from "react"
import styled from "@emotion/styled"
import AboutDrawerContent from "src/components/AboutDrawerContent"
import MobileTopBar from "src/routes/Feed/MobileTopBar"
import MobileTabBar from "src/routes/Feed/MobileTabBar"
import MobileMenuDrawer from "src/routes/Feed/MobileMenuDrawer"
import { useFeedSearchQuery } from "src/hooks/useFeedSearchQuery"

const SlugAboutMobileView = () => {
  const router = useRouter()
  const { draft, onChangeQuery } = useFeedSearchQuery()
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <Outer>
      <MobileTopBar />
      <MobileMenuDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        q={draft}
        onChangeQuery={onChangeQuery}
      />
      <MobileWrapper>
        <AboutDrawerContent />
      </MobileWrapper>
      <MobileTabBar
        onMenuClick={() => setDrawerOpen(true)}
        isMenuOpen={drawerOpen}
      />
    </Outer>
  )
}

export default SlugAboutMobileView

const Outer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
`

const MobileWrapper = styled.div`
  flex: 1;
  padding: 1rem 1rem max(calc(72px + env(safe-area-inset-bottom, 0px)), 3rem);
`
