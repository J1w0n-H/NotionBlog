const CONFIG = {
  // profile setting (required)
  profile: {
    name: "Jiwon Hwang",
    image: "/profile.jpg", // If you want to create your own notion avatar, check out https://notion-avatar.vercel.app
    role: "Security Engineer",
    bio: "Infrastructure-grounded. Cloud-native. Security-focused",
    email: "jiwon.h.sec@gmail.com",
    linkedin: "j1w0n",
    blog: "jiwoney97",
    github: "j1w0n-h",
    instagram: "",
  },
  /** Resume blocks on the home feed (plain text, not post cards). `logo` is optional. */
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
      institution: "Seoul Women\u2019s University",
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
  projects: [
    {
      name: `Hacking`,
      href: "https://github.com/J1w0n-H/Hacking",
    },
    {
      name: `RTOS meets TLS`,
      href: "https://github.com/J1w0n-H/iot-sensor-tls-experiment",
    },
    { name: "ABLE", href: "https://github.com/J1w0n-H/ABLE" },
    { name: "ATTRIB", href: "https://github.com/J1w0n-H/ATTRIB" },
    { name: "Hacking", href: "https://github.com/J1w0n-H/Hacking" },
    { name: "RTOS meets TLS", href: "https://github.com/J1w0n-H/iot-sensor-tls-experiment" },
  ],
  // blog setting (required)
  blog: {
    title: "Jiwon Hwang",
    description: "Cybersecurity Specialist",
    scheme: "dark", // 'light' | 'dark' | 'system'
  },

  // CONFIG configration (required)
  link: "https://j1w0n-log.vercel.app",
  since: 2025, // If leave this empty, current year will be used.
  lang: "en-US", // ['en-US', 'zh-CN', 'zh-HK', 'zh-TW', 'ja-JP', 'es-ES', 'ko-KR']
  ogImageGenerateURL: "https://og-image-korean.vercel.app/J1w0n.png?theme=light&md=1&fontSize=100px&images=https%3A%2F%2Fmorethan-log.vercel.app%2Favatar.svg", // The link to generate OG image, don't end with a slash

  // notion configuration (required)
  notionConfig: {
    pageId: process.env.NOTION_PAGE_ID,
  },

  // plugin configuration (optional)
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
    enable: true,
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
      appid: "bd2297e3-9940-40a0-867a-82b6be1f4320", // Embed Code -> data-app-id value
    },
  },
  // 번역 기능 설정
  translation: {
    enable: true,
    defaultLanguage: "en", // Default
    supportedLanguages: ["ko", "en"], // Supported
    autoTranslate: true, // Translate Function Enabled
  },
  isProd: process.env.VERCEL_ENV === "production", // distinguish between development and production environment (ref: https://vercel.com/docs/environment-variables#system-environment-variables)
  revalidateTime: 30, // revalidate time for [slug], index
}

module.exports = { CONFIG }
