import type React from "react"
import {
  accentForFeedCategory,
  canonicalFeedCategory,
} from "src/constants/feedSections"

/**
 * Notion `category` (select) display name → CSS token suffix.
 * Unlisted names use token `other`. Add a row here when you add a category.
 */
export const CATEGORY_TOKENS: Record<string, string> = {
  Projects: "systems",
  "💻Projects": "systems",
  "Infrastructure Engineering": "systems",
  "Cloud Security": "crypto",
  "Detection & Response (Observability)": "systems",
  "Security Research (AI Security)": "research",
  "Cryptography & TLS": "crypto",
  "Reverse Engineering": "reverse",
  "CTF Writeups": "ctf",
  "Systems & RTOS": "systems",
  "Research Notes": "research",
  Conferences: "research",
  Conference: "research",
  "Career / Talks / Community": "research",
  Activities: "research",
  "Personal Life": "ctf",
  Personal: "ctf",
  Other: "other",
}

export type CategoryToken =
  | "crypto"
  | "reverse"
  | "ctf"
  | "systems"
  | "research"
  | "other"

export const tokenForCategory = (label?: string): CategoryToken => {
  if (!label) return "other"
  const canonical = canonicalFeedCategory(label)
  const accent = accentForFeedCategory(canonical)
  if (accent !== "other") return accent

  const key = label.trim().normalize("NFKC")
  const exact = CATEGORY_TOKENS[key] ?? CATEGORY_TOKENS[label.trim()]
  if (exact) return exact as CategoryToken
  return "other"
}

export const catVars = (token: CategoryToken) =>
  ({
    ["--cat-color" as any]: `var(--cat-${token}-solid)`,
    ["--cat-soft" as any]: `var(--cat-${token}-soft)`,
    ["--cat-ring" as any]: `var(--cat-${token}-ring)`,
  }) as React.CSSProperties
