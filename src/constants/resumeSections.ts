export const RESUME_SECTION_IDS = {
  education: "section-background",
  work: "section-background",
  background: "section-background",
} as const

export const RESUME_NAV_SECTIONS = [
  { id: "section-background", label: "Background" },
] as const

/** Notion post categories that ResumeSections owns — excluded from GroupedPostList. */
export const RESUME_OWNED_CATEGORIES = new Set([
  "Education",
  "Work Experience",
])
