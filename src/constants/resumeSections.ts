export const RESUME_SECTION_IDS = {
  education: "section-education",
  work: "section-work-experience",
} as const

export const RESUME_NAV_SECTIONS = [
  { id: RESUME_SECTION_IDS.education, label: "Education" },
  { id: RESUME_SECTION_IDS.work, label: "Work Experience" },
] as const
