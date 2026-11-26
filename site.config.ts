export type SiteProfile = {
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

export type EducationAffiliation = {
  role: string
  group: string
  period: string
  featured?: boolean
  summary?: string
}

export type EducationEntry = {
  institution: string
  href: string
  location: string
  degree: string
  /** Canonical range — used for sorting. */
  period: string
  logo?: string
  /** Research / focus areas shown as keywords (replaces coursework). */
  researchAreas?: string[]
  affiliations?: EducationAffiliation[]
}

export type WorkHighlight = {
  category: string
  detail: string
}

export type WorkEntry = {
  organization: string
  href: string
  location: string
  role: string
  /** e.g. "Contract" — shown after the date. */
  employmentType?: string
  /** Canonical range — used for sorting. */
  period: string
  logo?: string
  highlights: WorkHighlight[]
}

export type HeroStat = {
  val: string
  lbl: string
}

export type HeroConfig = {
  tagline: string[]
  description: string
  stats: HeroStat[]
}

export type SiteConfig = {
  profile: SiteProfile
  hero: HeroConfig
  education: EducationEntry[]
  workExperience: WorkEntry[]
  blog:{ title: string; description: string; scheme: string }
  link: string
  since: number
  lang: string
  ogImageGenerateURL: string
  notionConfig: { pageId?: string }
  googleAnalytics: { enable: boolean; config: { measurementId: string } }
  googleSearchConsole: { enable: boolean; config: { siteVerification: string } }
  naverSearchAdvisor: { enable: boolean; config: { siteVerification: string } }
  utterances: { enable: boolean; config: Record<string, string> }
  cusdis: { enable: boolean; config: { host: string; appid: string } }
  translation: {
    enable: boolean
    defaultLanguage: string
    supportedLanguages: string[]
    autoTranslate?: boolean
  }
  isProd: boolean
  revalidateTime: number
}

export const CONFIG: SiteConfig = {
  profile: {
    name: "Jiwon Hwang",
    image: "/profile.jpg",
    role: "Security Engineer",
    bio: "Ran 200+ nodes, now break them—mastering exactly why modern cloud, GitOps, and AI pipelines fail at an architectural level.",
    email: "jiwon.h.sec@gmail.com",
    linkedin: "j1w0n",
    blog: "jiwoney97",
    github: "j1w0n-h",
    instagram: "",
  },

  hero: {
    tagline: ["Built it.", "Broke it.", "Mastered why."],
    description:
      "From Linux and HPC infrastructure to enterprise security. Currently a **Security Engineer at MTCA**.",
    stats: [
      { val: "200+", lbl: "HPC nodes" },
    ],
  },

  education: [
    {
      institution: "University of Maryland, College Park",
      href: "https://www.umd.edu/",
      location: "MD, USA",
      degree: "M.Eng. in Cybersecurity",
      period: "Aug 2024 – May 2026",
      logo: "/logos/umd.png",
      researchAreas: ["LLM Security", "Software Supply Chain Security", "Cloud Security"],
      affiliations: [
        {
          role: "Graduate Research Assistant",
          group: "SEED Lab",
          period: "Mar 2026 – May 2026",
          featured: true,
          summary:
            "Studied Kubernetes configuration drift when GitOps reconciliation overwrites emergency patches, widening gaps between live cluster state and audit reporting; validated across scenarios with production risk implications.",
        },
      ],
    },
    {
      institution: "Seoul Women's University",
      href: "",
      location: "Seoul, Korea",
      degree: "B.S. in Mathematics & B.E. in Information Security",
      period: "Mar 2015 – Aug 2020",
    },
  ],

  workExperience: [
    {
      organization: "Hyundai Mobis · Technical Center of America (MTCA)",
      href: "",
      location: "Canton, Michigan, United States",
      role: "Security Engineer",
      employmentType: "Contract",
      period: "Sep 2026 – Present",
      highlights: [
        { category: "Enterprise Security Engineering & Governance", detail: "" },
        { category: "Security Policy Development & Compliance", detail: "" },
        { category: "Risk Management & Workflow Automation", detail: "" },
        { category: "AI-Enabled GRC", detail: "" },
        { category: "TISAX Assessment Readiness", detail: "" },
      ],
    },
    {
      organization: "Theragen Bio",
      href: "https://www.theragenbio.com/eng/",
      location: "Pangyo, Korea",
      role: "System Administrator",
      period: "Dec 2020 – Mar 2024",
      logo: "/logos/theragen-bio.png",
      highlights: [
        {
          category: "Infrastructure & Automation",
          detail:
            "Administered 200+ Linux servers; developed a 4,000-line Bash script that automated deployment and slashed provisioning time by 85%.",
        },
        {
          category: "Cloud Migration",
          detail:
            "Led the enterprise migration to Microsoft 365 and Azure AD for 100+ users, enforcing security policies via Intune.",
        },
        {
          category: "Subsidiary Spin-off",
          detail:
            "Directed the zero-downtime infrastructure separation of 13 services and 200+ servers for a subsidiary spin-off.",
        },
        {
          category: "Security & Compliance",
          detail:
            "Hardened infrastructure against ISO 27001 and GCLP standards using vulnerability assessments, MFA, and encryption; achieved 85% engagement in phishing simulations.",
        },
        {
          category: "Operations & Networking",
          detail:
            "Monitored system health using Grafana/Prometheus, authored a 300+ page IT knowledge base, and managed core network functions (DNS, DHCP, VLANs, VPNs, firewalls).",
        },
      ],
    },
    {
      organization: "KISMI",
      href: "",
      location: "Seoul, Korea",
      role: "Security Consultant (Intern)",
      period: "May 2020 – Nov 2020",
      highlights: [
        {
          category: "Security Audits",
          detail:
            "IT security audits for enterprise clients including KAKAO VX, InBody, and SK Telecom; cloud security policies aligned with ISO 27017/27018.",
        },
        {
          category: "Penetration Testing",
          detail: "",
        },
        {
          category: "Remediation",
          detail:
            "Remediated IAM, encryption, and network misconfigurations under ISO 27001/27017/27018 and ISMS-P.",
        },
      ],
    },
  ],

  blog: {
    title: "Jiwon Hwang",
    description: "Security Engineer — security engineering, automation, and governance",
    scheme: "dark",
  },

  link: "https://j1w0n.vercel.app", // j1w0n-log.vercel.app is dead (404)
  since: 2025,
  lang: "en-US",
  ogImageGenerateURL:
    "https://og-image-korean.vercel.app/J1w0n.png?theme=light&md=1&fontSize=100px&images=https%3A%2F%2Fmorethan-log.vercel.app%2Favatar.svg",

  notionConfig: {
    pageId: process.env.NOTION_PAGE_ID,
  },

  googleAnalytics: {
    enable: true,
    config: {
      measurementId: process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID || "",
    },
  },
  googleSearchConsole: {
    enable: true,
    config: {
      siteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    },
  },
  naverSearchAdvisor: {
    enable: true,
    config: {
      siteVerification: process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION || "",
    },
  },
  utterances: {
    enable: false,
    config: {
      repo: process.env.NEXT_PUBLIC_UTTERANCES_REPO || "",
      "issue-term": "og:title",
      label: "💬 Utterances",
    },
  },
  cusdis: {
    enable: true,
    config: {
      host: "https://cusdis.com",
      appid: process.env.NEXT_PUBLIC_CUSDIS_APP_ID || "bd2297e3-9940-40a0-867a-82b6be1f4320",
    },
  },
  translation: {
    enable: true,
    defaultLanguage: "en",
    supportedLanguages: ["ko", "en"],
    autoTranslate: true,
  },
  isProd: process.env.VERCEL_ENV === "production",
  revalidateTime: 30,
}
