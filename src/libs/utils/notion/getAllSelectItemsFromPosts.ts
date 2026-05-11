import {
  dedupeTagsForPost,
  normalizeTagKey,
  tagFamilyKey,
} from "src/libs/utils/normalizeTag"
import { TPosts } from "src/types"

export function getAllSelectItemsFromPosts(
  key: "tags" | "category",
  posts: TPosts
) {
  if (key === "tags") {
    const buckets = new Map<string, { count: number; label: string }>()
    const withTags = posts.filter((p) => p.tags && p.tags.length > 0)

    for (const post of withTags) {
      const uniq = dedupeTagsForPost(post.tags ?? [])
      for (const lbl of uniq) {
        const fk = tagFamilyKey(lbl)
        const b = buckets.get(fk)
        if (!b) {
          buckets.set(fk, { count: 1, label: lbl })
          continue
        }
        b.count += 1
        if (lbl.length > b.label.length) {
          b.label = lbl
        }
      }
    }

    const itemObj: { [itemName: string]: number } = {}
    for (const b of buckets.values()) {
      itemObj[b.label] = b.count
    }
    return itemObj
  }

  const selectedPosts = posts.filter((post) => post?.[key])
  const items = [...selectedPosts.map((p) => p[key]).flat()]
  const itemObj: { [itemName: string]: number } = {}
  items.forEach((item) => {
    if (item == null || typeof item !== "string") return
    const label = item.trim().normalize("NFKC")
    if (!label) return
    if (label in itemObj) {
      itemObj[label]++
    } else {
      itemObj[label] = 1
    }
  })
  return itemObj
}
