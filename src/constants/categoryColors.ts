import type React from "react"

export const CATEGORY_TOKENS: Record<string, string> = {
  // sample mappings (edit to your actual Notion categories)
  "Cryptography & TLS": "crypto",
  "Reverse Engineering": "reverse",
  "CTF Writeups": "ctf",
  "Systems & RTOS": "systems",
  "Research Notes": "research",

  // current site examples (seen in UI)
  Conferences: "research",
  "Personal Life": "other",
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
  const exact = CATEGORY_TOKENS[label]
  if (exact) return exact as CategoryToken

  const l = label.toLowerCase()
  if (/(rtos|systems|kernel|os)/.test(l)) return "systems"
  if (/(ctf|writeup|flag)/.test(l)) return "ctf"
  if (/(reverse|re|pwn|exploit)/.test(l)) return "reverse"
  if (/(crypto|tls|x\.509|certificate)/.test(l)) return "crypto"
  if (/(research|paper|notes|llm|ai)/.test(l)) return "research"

  return "other"
}

export const catVars = (token: CategoryToken) =>
  ({
    ["--cat-color" as any]: `var(--cat-${token}-solid)`,
    ["--cat-soft" as any]: `var(--cat-${token}-soft)`,
    ["--cat-ring" as any]: `var(--cat-${token}-ring)`,
  }) as React.CSSProperties

