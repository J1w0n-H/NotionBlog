import { NextApiRequest, NextApiResponse } from "next"
import {
  RUNTIME_COLLECTIONS_TTL_MS,
  loadPublicPostCollections,
} from "src/libs/notion/fetchPublishedPosts"

// for all path revalidate, https://<your-site.com>/api/revalidate?secret=<token>
// for specific path revalidate, https://<your-site.com>/api/revalidate?secret=<token>&path=<path>
// example, https://<your-site.com>/api/revalidate?secret=이것은_키&path=feed
/**
 * Every row slug, including Private ones. Revalidating a now-Private slug
 * makes getStaticProps return notFound, which evicts the cached public copy —
 * without it a post switched Public → Private stayed in the ISR cache.
 */
export async function collectRevalidatePaths(): Promise<string[]> {
  const { raw } = await loadPublicPostCollections({ fresh: true })
  const slugs = new Set(raw.map((post) => post.slug).filter(Boolean))
  return ["/", ...Array.from(slugs, (slug) => `/${encodeURIComponent(slug)}`)]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = process.env.TOKEN_FOR_REVALIDATE
  const { secret, path } = req.query
  if (!token || secret !== token) {
    return res.status(401).json({ message: "Invalid token" })
  }

  try {
    if (path && typeof path === "string") {
      await res.revalidate(path.startsWith("/") ? path : `/${path}`)
      return res.json({ revalidated: true, paths: 1 })
    }

    const paths = await collectRevalidatePaths()
    // Regeneration may run on other warm instances whose short-lived cache
    // predates the Notion edit; wait until any such snapshot has expired.
    await new Promise((r) => setTimeout(r, RUNTIME_COLLECTIONS_TTL_MS))
    const results = await Promise.allSettled(paths.map((p) => res.revalidate(p)))
    // A never-generated path (e.g. a Private slug) may reject; that's expected.
    const failed = results.filter((r) => r.status === "rejected").length
    return res.json({ revalidated: true, paths: paths.length, failed })
  } catch (err) {
    console.error("revalidate failed:", err)
    return res.status(500).send("Error revalidating")
  }
}
