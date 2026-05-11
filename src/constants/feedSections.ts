import type { CategoryToken } from "src/constants/categoryColors"
import { RESUME_SECTION_IDS } from "src/constants/resumeSections"

/** Post category groups after resume + pinned. */
export const FEED_POST_CATEGORY_ORDER = [
  "Projects",
  "Conferences",
  "Personal Life",
] as const

const CATEGORY_ORDER_ALIASES: Record<string, string> = {
  Projects: "Projects",
  "💻Projects": "Projects",
  "Infrastructure Engineering": "Projects",
  "Cloud Security": "Projects",
  "Detection & Response (Observability)": "Projects",
  "Security Research (AI Security)": "Projects",
  Conferences: "Conferences",
  Conference: "Conferences",
  "Career / Talks / Community": "Conferences",
  Activities: "Conferences",
  "Personal Life": "Personal Life",
  Personal: "Personal Life",
  Other: "Personal Life",
}

export function canonicalFeedCategory(title: string): string {
  const normalized = title.trim().normalize("NFKC")
  return CATEGORY_ORDER_ALIASES[normalized] ?? normalized
}

export function rankFeedCategory(title: string): number {
  const canonical = canonicalFeedCategory(title)
  const index = FEED_POST_CATEGORY_ORDER.indexOf(
    canonical as (typeof FEED_POST_CATEGORY_ORDER)[number]
  )
  return index === -1 ? FEED_POST_CATEGORY_ORDER.length + 1 : index
}

export const RESUME_SECTION_ACCENTS: Record<string, CategoryToken> = {
  [RESUME_SECTION_IDS.education]: "reverse",
  [RESUME_SECTION_IDS.work]: "crypto",
}

export const PINNED_SECTION_ACCENT: CategoryToken = "systems"

export const FEED_CATEGORY_ACCENTS: Record<string, CategoryToken> = {
  Projects: "systems",
  Conferences: "research",
  "Personal Life": "ctf",
}

export function accentForFeedCategory(title: string): CategoryToken {
  const canonical = canonicalFeedCategory(title)
  return FEED_CATEGORY_ACCENTS[canonical] ?? "other"
}
