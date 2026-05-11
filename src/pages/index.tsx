import Feed from "src/routes/Feed"
import { CONFIG } from "../../site.config"
import { NextPageWithLayout } from "../types"
import MetaConfig from "src/components/MetaConfig"
import { createQueryClient } from "src/libs/react-query"
import { prefetchFeedStaticProps } from "src/libs/notion/prefetchFeedStaticProps"
import { GetStaticProps } from "next"
import { dehydrate } from "@tanstack/react-query"

export const getStaticProps: GetStaticProps = async () => {
  const client = createQueryClient()
  await prefetchFeedStaticProps(client)

  return {
    props: {
      dehydratedState: dehydrate(client),
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
