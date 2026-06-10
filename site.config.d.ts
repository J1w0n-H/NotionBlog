import type { EducationEntry, WorkEntry } from "src/types/resume"

/**
 * Typings for root `site.config.js` (CommonJS). Keep in sync when adding fields.
 */
export interface SiteProfile {
  name: string
  image: string
  role: string
  bio: string
  email?: string
  linkedin?: string
  blog?: string
  github?: string
  instagram?: string
}

export interface SiteConfig {
  profile: SiteProfile
  blog: { title: string; description: string; scheme: string }
  link: string
  since: number
  lang: string
  ogImageGenerateURL: string
  isProd: boolean
  revalidateTime: number
  notionConfig: { pageId?: string }
  education: EducationEntry[]
  workExperience: WorkEntry[]
  projects: { name: string; href: string }[]
  translation: {
    enable: boolean
    defaultLanguage: string
    supportedLanguages: string[]
    autoTranslate?: boolean
  }
  googleAnalytics: { enable: boolean; config: { measurementId: string } }
  googleSearchConsole: { enable: boolean; config: { siteVerification: string } }
  naverSearchAdvisor: { enable: boolean; config: { siteVerification: string } }
  utterances: { enable: boolean; config: Record<string, string> }
  cusdis: { enable: boolean; config: { host: string; appid: string } }
}

export const CONFIG: SiteConfig
