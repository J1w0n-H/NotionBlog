import Feed from "src/routes/Feed"
import { CONFIG } from "../../site.config"
import { NextPageWithLayout } from "../types"
import { getPosts, getRecordMap } from "../apis"
import { ABOUT_SLUG } from "src/constants"
import MetaConfig from "src/components/MetaConfig"
import { queryClient } from "src/libs/react-query"
import { queryKey } from "src/constants/queryKey"
import { GetStaticProps } from "next"
import { dehydrate } from "@tanstack/react-query"
import { applyNotionPublicationGate } from "src/libs/postFilters"

export const getStaticProps: GetStaticProps = async () => {
  const rawPosts = await getPosts()
  const posts = applyNotionPublicationGate(rawPosts, "feed")
  await queryClient.prefetchQuery(queryKey.posts(), () => posts)

  const aboutPost = applyNotionPublicationGate(rawPosts, "detail").find(
    (post) => post.slug === ABOUT_SLUG
  )
  if (aboutPost) {
    const recordMap = await getRecordMap(aboutPost.id)
    await queryClient.prefetchQuery(queryKey.post(ABOUT_SLUG), () => ({
      ...aboutPost,
      recordMap,
    }))
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: CONFIG.revalidateTime,
  }
}

const FeedPage: NextPageWithLayout = () => {
  const meta = {
    title: CONFIG.blog.title,
    description: CONFIG.blog.description,
    type: "website",
    url: CONFIG.link,
  }

  return (
    <>
      <MetaConfig {...meta} />
      <Feed />
    </>
  )
}

export default FeedPage
