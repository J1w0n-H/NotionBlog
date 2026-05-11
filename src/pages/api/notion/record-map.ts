import type { NextApiRequest, NextApiResponse } from "next"
import { getRecordMap } from "src/apis"
import { fetchPublishedPosts } from "src/libs/notion/fetchPublishedPosts"
import { isUsableRecordMap } from "src/libs/notion/isUsableRecordMap"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET")
    return res.status(405).json({ message: "Method not allowed" })
  }

  const pageId = typeof req.query.pageId === "string" ? req.query.pageId : ""
  if (!pageId) {
    return res.status(400).json({ message: "pageId is required" })
  }

  const posts = await fetchPublishedPosts("detail")
  if (!posts.some((post) => post.id === pageId)) {
    return res.status(404).json({ message: "Post not found" })
  }

  const recordMap = await getRecordMap(pageId)
  if (!isUsableRecordMap(pageId, recordMap)) {
    return res.status(503).json({ message: "Post content is unavailable" })
  }

  res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate")
  return res.status(200).json(recordMap)
}
