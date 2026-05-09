import { normalizeTagKey } from "src/libs/utils/normalizeTag"
import { TPosts } from "src/types"

export function getAllSelectItemsFromPosts(
  key: "tags" | "category",
  posts: TPosts
) {
  const selectedPosts = posts.filter((post) => post?.[key])
  const items = [...selectedPosts.map((p) => p[key]).flat()]
  const itemObj: { [itemName: string]: number } = {}
  items.forEach((item) => {
    if (item == null || typeof item !== "string") return
    const label =
      key === "tags" ? normalizeTagKey(item) : item.trim().normalize("NFKC")
    if (!label) return
    if (label in itemObj) {
      itemObj[label]++
    } else {
      itemObj[label] = 1
    }
  })
  return itemObj
}
