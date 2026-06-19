import AboutDesktopFeed from "src/routes/Detail/AboutDesktopFeed"
import SlugFeedSplitPage from "src/routes/Feed/SlugFeedSplitPage"
import SlugPostMobileView from "src/routes/Feed/SlugPostMobileView"
import { CONFIG } from "site.config"
import { NextPageWithLayout } from "../types"
import MetaConfig from "src/components/MetaConfig"
import { GetStaticProps } from "next"
import { prepareStaticPageProps } from "src/libs/react-query"
import { getDetailStaticPaths } from "src/libs/notion/getDetailStaticPaths"
import { prefetchSlugStaticProps } from "src/libs/notion/prefetchSlugStaticProps"
import { usePostPageState } from "src/hooks/usePostPageState"
import { ABOUT_SLUG } from "src/constants"
import { resolvePostOgImage } from "src/libs/utils/resolvePostOgImage"

export const getStaticPaths = getDetailStaticPaths

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = `${context.params?.slug ?? ""}`
  let postDetail: Awaited<ReturnType<typeof prefetchSlugStaticProps>> = null

  const props = await prepareStaticPageProps(async (client) => {
    postDetail = await prefetchSlugStaticProps(client, slug)
  })

  if (!postDetail) {
    return { notFound: true }
  }

  return {
    props,
    revalidate: CONFIG.revalidateTime,
  }
}

const DetailPage: NextPageWithLayout = () => {
  const { slug, meta, detail, isPreparing } = usePostPageState()

  // router.isReady is false on the first render during client-side navigation,
  // so slug is "" and the wrong layout would flash before the route resolves.
  if (isPreparing) return null

  if (slug === ABOUT_SLUG) {
    const aboutMeta = {
      title: `${CONFIG.blog.title} — About`,
      description: CONFIG.blog.description,
      type: "website",
      url: `${CONFIG.link}/${ABOUT_SLUG}`,
    }

    return (
      <>
        <MetaConfig {...aboutMeta} />
        <AboutDesktopFeed />
      </>
    )
  }

  const toOgType = (t: string) =>
    t === "Post" || t === "Paper" ? "article" : "website"

  const pageMeta = detail
    ? {
        title: detail.title,
        date:
          detail.date?.start_date || detail.createdTime
            ? new Date(
                detail.date?.start_date || detail.createdTime
              ).toISOString()
            : new Date().toISOString(),
        image: resolvePostOgImage(detail.thumbnail, detail.title),
        description: detail.summary || "",
        type: toOgType(detail.type[0]),
        url: `${CONFIG.link}/${detail.slug}`,
      }
    : meta
      ? {
          title: meta.title,
          description: meta.summary || CONFIG.blog.description,
          type: toOgType(meta.type[0]),
          url: `${CONFIG.link}/${meta.slug}`,
        }
      : null

  return (
    <>
      {pageMeta ? <MetaConfig {...pageMeta} /> : null}
      <SlugFeedSplitPage panel="post" mobile={<SlugPostMobileView />} />
    </>
  )
}

DetailPage.getLayout = (page) => {
  return <>{page}</>
}

export default DetailPage
