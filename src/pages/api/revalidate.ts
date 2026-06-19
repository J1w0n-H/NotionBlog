import { NextApiRequest, NextApiResponse } from "next"
import { fetchPublishedPosts } from "src/libs/notion/fetchPublishedPosts"

// for all path revalidate, https://<your-site.com>/api/revalidate?secret=<token>
// for specific path revalidate, https://<your-site.com>/api/revalidate?secret=<token>&path=<path>
// example, https://<your-site.com>/api/revalidate?secret=이것은_키&path=feed
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
      await res.revalidate(path)
    } else {
      const posts = await fetchPublishedPosts("detail")
      const revalidateRequests = [
        res.revalidate("/"),
        ...posts.map((row) => res.revalidate(`/${row.slug}`)),
      ]
      await Promise.all(revalidateRequests)
    }

    res.json({ revalidated: true })
  } catch (err) {
    return res.status(500).send("Error revalidating")
  }
}
