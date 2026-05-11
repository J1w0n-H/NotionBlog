import Detail from "src/routes/Detail"
import AboutDesktopFeed from "src/routes/Detail/AboutDesktopFeed"
import Feed from "src/routes/Feed"
import FeedPostPanel from "src/routes/Feed/FeedPostPanel"
import {
  DesktopSlugLayout,
  MobileSlugLayout,
} from "src/routes/Feed/SlugFeedLayouts"
import { CONFIG } from "site.config"
import { NextPageWithLayout } from "../types"
import CustomError from "src/routes/Error"
import MetaConfig from "src/components/MetaConfig"
import { GetStaticProps } from "next"
import PostDetailLoading from "src/components/PostDetailLoading"
import { prepareStaticPageProps } from "src/libs/react-query"
import { getDetailStaticPaths } from "src/libs/notion/getDetailStaticPaths"
import { prefetchSlugStaticProps } from "src/libs/notion/prefetchSlugStaticProps"
import { usePostPageState } from "src/hooks/usePostPageState"
import { ABOUT_SLUG } from "src/constants"

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
  const {
    slug,
    meta,
    detail,
    isPreparing,
    isMissingMeta,
    isLoadingContent,
    isRecordMapError,
  } = usePostPageState()

  if (slug === ABOUT_SLUG) {
    if (isPreparing) return null

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

  const pageMeta = detail
    ? {
        title: detail.title,
        date:
          detail.date?.start_date || detail.createdTime
            ? new Date(
                detail.date?.start_date || detail.createdTime
              ).toISOString()
            : new Date().toISOString(),
        image:
          detail.thumbnail ??
          CONFIG.ogImageGenerateURL ??
          `${CONFIG.ogImageGenerateURL}/${encodeURIComponent(detail.title)}.png`,
        description: detail.summary || "",
        type: detail.type[0],
        url: `${CONFIG.link}/${detail.slug}`,
      }
    : meta
      ? {
          title: meta.title,
          description: meta.summary || CONFIG.blog.description,
          type: meta.type[0],
          url: `${CONFIG.link}/${meta.slug}`,
        }
      : null

  return (
    <>
      {pageMeta ? <MetaConfig {...pageMeta} /> : null}
      <DesktopSlugLayout>
        <Feed rightPanel={<FeedPostPanel />} />
      </DesktopSlugLayout>
      <MobileSlugLayout>
        {isPreparing || isLoadingContent ? (
          <PostDetailLoading />
        ) : isMissingMeta || isRecordMapError || !detail || !meta ? (
          <CustomError />
        ) : (
          <Detail />
        )}
      </MobileSlugLayout>
    </>
  )
}

DetailPage.getLayout = (page) => {
  return <>{page}</>
}

export default DetailPage
