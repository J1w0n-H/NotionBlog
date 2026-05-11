import Detail from "src/routes/Detail"
import AboutDesktopFeed from "src/routes/Detail/AboutDesktopFeed"
import { applyNotionPublicationGate } from "src/libs/postFilters"
import { CONFIG } from "site.config"
import { NextPageWithLayout } from "../types"
import CustomError from "src/routes/Error"
import { getRecordMap, getPosts } from "src/apis"
import MetaConfig from "src/components/MetaConfig"
import { GetStaticProps } from "next"
import { useRouter } from "next/router"
import { queryClient } from "src/libs/react-query"
import { queryKey } from "src/constants/queryKey"
import { dehydrate, useQuery } from "@tanstack/react-query"
import usePostQuery from "src/hooks/usePostQuery"
import { ABOUT_SLUG } from "src/constants"
import { PostDetail } from "src/types"

export const getStaticPaths = async () => {
  const posts = await getPosts()
  const filteredPost = applyNotionPublicationGate(posts, "detail")

  return {
    paths: filteredPost.map((row) => `/${row.slug}`),
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context.params?.slug

  const posts = await getPosts()
  const feedPosts = applyNotionPublicationGate(posts, "feed")
  await queryClient.prefetchQuery(queryKey.posts(), () => feedPosts)

  const detailPosts = applyNotionPublicationGate(posts, "detail")
  const postDetail = detailPosts.find((t: any) => t.slug === slug)

  if (!postDetail) {
    return { notFound: true }
  }

  const recordMap = await getRecordMap(postDetail.id)

  await queryClient.prefetchQuery(queryKey.post(`${slug}`), () => ({
    ...postDetail,
    recordMap,
  }))

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: CONFIG.revalidateTime,
  }
}

const DetailPage: NextPageWithLayout = () => {
  const router = useRouter()
  const post = usePostQuery()
  const slug = `${router.query.slug ?? ""}`
  const { data: aboutPost } = useQuery<PostDetail>({
    queryKey: queryKey.post(ABOUT_SLUG),
    enabled: false,
  })
  const resolved = post ?? (slug === ABOUT_SLUG ? aboutPost : undefined)

  if (!router.isReady) return null

  if (!resolved) {
    if (slug === ABOUT_SLUG) {
      const meta = {
        title: `${CONFIG.blog.title} — About`,
        description: CONFIG.blog.description,
        type: "website",
        url: `${CONFIG.link}/${ABOUT_SLUG}`,
      }

      return (
        <>
          <MetaConfig {...meta} />
          <AboutDesktopFeed />
        </>
      )
    }

    return <CustomError />
  }

  const image =
    resolved.thumbnail ??
    CONFIG.ogImageGenerateURL ??
    `${CONFIG.ogImageGenerateURL}/${encodeURIComponent(resolved.title)}.png`

  const date = resolved.date?.start_date || resolved.createdTime || null

  const meta = {
    title: resolved.title,
    date: date && !isNaN(new Date(date).getTime()) ? new Date(date).toISOString() : new Date().toISOString(),
    image: image,
    description: resolved.summary || "",
    type: resolved.type[0],
    url: `${CONFIG.link}/${resolved.slug}`,
  }

  return (
    <>
      <MetaConfig {...meta} />
      <Detail />
    </>
  )
}

DetailPage.getLayout = (page) => {
  return <>{page}</>
}

export default DetailPage
