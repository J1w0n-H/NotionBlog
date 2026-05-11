import Detail from "src/routes/Detail"
import { applyNotionPublicationGate } from "src/libs/postFilters"
import { CONFIG } from "site.config"
import { NextPageWithLayout } from "../types"
import CustomError from "src/routes/Error"
import { getRecordMap, getPosts } from "src/apis"
import MetaConfig from "src/components/MetaConfig"
import { GetStaticProps } from "next"
import { queryClient } from "src/libs/react-query"
import { queryKey } from "src/constants/queryKey"
import { dehydrate } from "@tanstack/react-query"
import usePostQuery from "src/hooks/usePostQuery"
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
  const post = usePostQuery()

  if (!post) return <CustomError />

  const image =
    post.thumbnail ??
    CONFIG.ogImageGenerateURL ??
    `${CONFIG.ogImageGenerateURL}/${encodeURIComponent(post.title)}.png`

  const date = post.date?.start_date || post.createdTime || null

  const meta = {
    title: post.title,
    date: date && !isNaN(new Date(date).getTime()) ? new Date(date).toISOString() : new Date().toISOString(),
    image: image,
    description: post.summary || "",
    type: post.type[0],
    url: `${CONFIG.link}/${post.slug}`,
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
