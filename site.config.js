const CONFIG = {
  // profile setting (required)
  profile: {
    name: "Jiwon Hwang",
    image: "/profile.jpg", // If you want to create your own notion avatar, check out https://notion-avatar.vercel.app
    role: "One-Time Struggle Specialist",
    bio: "수동은 귀찮고, 비효율은 죄악 (Manual is annoying, and inefficiency is a sin)",
    email: "jhwang97@.umd.edu",
    linkedin: "j1w0n",
    blog: "jiwoney97",
    github: "j1w0n-h",
    instagram: "",
  },
  projects: [
    {
      name: `Hacking`,
      href: "https://github.com/J1w0n-H/Hacking",
    },
    {
      name: `RTOS meets TLS`,
      href: "https://github.com/J1w0n-H/iot-sensor-tls-experiment",
    },
  ],
  // blog setting (required)
  blog: {
    title: "Jiwon Hwang",
    description: "Cybersecurity Specialist",
    scheme: "system", // 'light' | 'dark' | 'system'
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
    defaultLanguage: "ko", // 기본 언어
    supportedLanguages: ["ko", "en"], // 지원 언어
    autoTranslate: true, // 자동 번역 활성화
  },
  isProd: process.env.VERCEL_ENV === "production", // distinguish between development and production environment (ref: https://vercel.com/docs/environment-variables#system-environment-variables)
  revalidateTime: 30, // revalidate time for [slug], index
}

module.exports = { CONFIG }
