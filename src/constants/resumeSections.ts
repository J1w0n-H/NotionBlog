export const RESUME_SECTION_IDS = {
  education: "section-education",
  work: "section-work-experience",
  projects: "section-projects",
} as const

export const RESUME_NAV_SECTIONS = [
  { id: RESUME_SECTION_IDS.education, label: "Education" },
  { id: RESUME_SECTION_IDS.work, label: "Work Experience" },
  { id: RESUME_SECTION_IDS.projects, label: "Projects" },
] as const

/** Notion post categories that ResumeSections owns — excluded from GroupedPostList. */
export const RESUME_OWNED_CATEGORIES = new Set([
  "Education",
  "Work Experience",
  "Projects",
])
