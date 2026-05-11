import { fetchPublishedPosts } from "src/libs/notion/fetchPublishedPosts"
import { effectivePublishedAt } from "src/libs/notion/postDate"
import { CONFIG } from "site.config"
import { getServerSideSitemap, ISitemapField } from "next-sitemap"
import { GetServerSideProps } from "next"

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const posts = await fetchPublishedPosts("detail")

  const fields: ISitemapField[] = posts.map((post) => ({
    loc: `${CONFIG.link}/${post.slug}`,
    lastmod: effectivePublishedAt(post).toISOString(),
    priority: 0.7,
    changefreq: "daily",
  }))

  // Include the site root separately
  fields.unshift({
    loc: CONFIG.link,
    lastmod: new Date().toISOString(),
    priority: 1.0,
    changefreq: "daily",
  })

  return getServerSideSitemap(ctx, fields)
}

// Default export to prevent next.js errors
export default () => {}
