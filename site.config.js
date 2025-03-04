const CONFIG = {
  // profile setting (required)
  profile: {
    name: "J1w0n",
    image: "/profile.jpg", // If you want to create your own notion avatar, check out https://notion-avatar.vercel.app
    role: "System Admin",
    bio: "Cause it's fun. Isn't it?\n My favorite lines from the books\n📕1. Don't look back in anger",
    email: "jhwang97@terpmail.umd.edu",
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
  ],
  // blog setting (required)
  blog: {
    title: "별걸 다 기록하는 블로그",
    description: "Wecome to my world",
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
  isProd: process.env.VERCEL_ENV === "production", // distinguish between development and production environment (ref: https://vercel.com/docs/environment-variables#system-environment-variables)
  revalidateTime: 30, // revalidate time for [slug], index
}

module.exports = { CONFIG }
