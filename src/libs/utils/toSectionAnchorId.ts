/**
 * DOM id for feed category anchors (Unicode-safe — Korean/etc. preserved).
 */
export function toSectionAnchorId(label: string): string {
  const slug = label
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{M}\p{N}_-]+/gu, "-")
    .replace(/-+/g, "-")
    .replace(/^-+/g, "")
    .replace(/-+$/g, "")

  return `section-${slug || "uncategorized"}`
}
