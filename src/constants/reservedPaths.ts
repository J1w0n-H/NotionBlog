/** App Router pages that must not share a slug with Notion `getStaticPaths`. */
export const RESERVED_PAGE_SLUGS = ["about"] as const

export type ReservedPageSlug = (typeof RESERVED_PAGE_SLUGS)[number]

export function isReservedPageSlug(slug: string): slug is ReservedPageSlug {
  return (RESERVED_PAGE_SLUGS as readonly string[]).includes(slug)
}
