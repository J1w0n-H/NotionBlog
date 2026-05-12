import AboutMobileDetail from "src/routes/Detail/AboutMobileDetail"
import PostDetailQueryView from "src/components/PostDetailQueryView"
import useAboutPostQuery from "src/hooks/useAboutPostQuery"

const SlugAboutMobileView = () => {
  const state = useAboutPostQuery()

  return (
    <PostDetailQueryView
      state={state}
      statusScope="page"
      statusSubject="about"
    >
      {(detail) => <AboutMobileDetail isPage={detail.type[0] === "Page"} />}
    </PostDetailQueryView>
  )
}

export default SlugAboutMobileView
