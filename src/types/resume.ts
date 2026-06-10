export type EducationAffiliation = {
  role: string
  group?: string
  period?: string
  summary?: string
  featured?: boolean
}

export type EducationEntry = {
  institution: string
  href?: string
  location?: string
  degree: string
  period: string
  logo?: string
  coreCourses?: string | string[]
  affiliations?: EducationAffiliation[]
}

export type WorkHighlightItem =
  | string
  | {
      category: string
      detail: string
    }

export type WorkEntry = {
  organization: string
  href?: string
  location?: string
  role: string
  period: string
  logo?: string
  summary?: string
  highlights?: WorkHighlightItem[]
}
