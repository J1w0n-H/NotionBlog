export const RESUME_SECTION_IDS = {
  background: "section-background",
} as const

export const RESUME_NAV_SECTIONS = [
  { id: RESUME_SECTION_IDS.background, label: "Background" },
] as const

/** Notion post categories that ResumeSections owns — excluded from GroupedPostList. */
export const RESUME_OWNED_CATEGORIES = new Set([
  "Education",
  "Work Experience",
])
