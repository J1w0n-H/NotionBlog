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
  period: string
  logo?: string
  coreCourses?: string[]
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
  projects: { name: string; href: string }[]
  blog: { title: string; description: string; scheme: string }
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
    bio: "Built it. Broke it. Mastered why.",
    email: "jiwon.h.sec@gmail.com",
    linkedin: "j1w0n",
    blog: "jiwoney97",
    github: "j1w0n-h",
    instagram: "",
  },

  hero: {
    tagline: ["Built it.", "Broke it.", "Mastered why."],
    description:
      "Ran a **200-node cluster** for four years, then came to Maryland to learn the attacker’s side — now researching **cloud, LLM & GitOps security**.",
    stats: [
      { val: "4 yrs", lbl: "Infra / ops" },
      { val: "200+", lbl: "HPC nodes" },
      { val: "ISMS-P", lbl: "Certified" },
    ],
  },

  education: [
    {
      institution: "University of Maryland, College Park",
      href: "https://www.umd.edu/",
      location: "MD, USA",
      degree: "Master of Engineering (M.Eng.) in Cybersecurity",
      period: "Aug 2024 – May 2026 (Expected)",
      logo: "/logos/umd.png",
      coreCourses: [
        "Hacking C & Unix Binaries",
        "LLMs, Security, and Privacy",
        "Fundamentals of AI and Deep Learning",
        "Cloud Computing",
      ],
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
      institution: "Seoul Women’s University",
      href: "https://www.swu.ac.kr/",
      location: "Seoul, Korea",
      degree: "B.S. in Mathematics & B.E. in Information Security",
      period: "Mar 2015 – Aug 2020",
      logo: "/logos/swu.png",
      coreCourses: [
        "Linear Algebra",
        "Java Programming",
        "Windows Programming",
        "Applied Cryptology",
      ],
    },
  ],

  workExperience: [
    {
      organization: "Theragen Bio",
      href: "https://www.theragenbio.com/eng/",
      location: "Pangyo, Korea",
      role: "System Administrator",
      period: "Dec 2020 – Aug 2024",
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
      organization: "Korean Information Security Management Institute",
      href: "https://www.kismi.kr/",
      location: "Seoul, Korea",
      role: "Security Audit & Penetration Testing Consultant",
      period: "May 2020 – Nov 2020",
      logo: "/logos/kismi.png",
      highlights: [
        {
          category: "Security Audits & Pentesting",
          detail:
            "Conducted comprehensive IT security audits and penetration testing for major enterprise clients, including KAKAO VX, InBody, and SK Telecom.",
        },
        {
          category: "Cloud Policy Development",
          detail:
            "Authored and aligned cloud security policies with ISO 27017/27018 standards to support client certifications.",
        },
        {
          category: "Defensive Hardening",
          detail:
            "Evaluated and remediated security misconfigurations to strengthen identity and access management (IAM), encryption, and network defenses under ISO 27001/27017/27018 and ISMS-P frameworks.",
        },
      ],
    },
  ],

  projects: [],

  blog: {
    title: "Jiwon Hwang",
    description: "Cybersecurity Specialist",
    scheme: "dark",
  },

  link: "https://j1w0n-log.vercel.app",
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
