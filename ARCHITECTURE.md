# Architecture

## Tech Stack

| Layer | Library | Version |
|---|---|---|
| Framework | Next.js | ^13.4.9 |
| UI | React | ^18.2.0 |
| Language | TypeScript | ^4.9.4 |
| Styling | Emotion (styled + css) | ^11.11 |
| Server state | TanStack React Query | ^4.29.19 |
| Notion DB | @notionhq/client (official) | ^2.2.3 |
| Notion renderer | notion-client + react-notion-x | ^6.16.0 |
| Comments | react-cusdis | ^2.1.3 |
| Diagrams | mermaid | ^10.9.1 |
| Syntax highlight | prismjs | ^1.29.0 |
| Cookie | cookies-next | ^2.1.2 |
| Testing | Vitest | ^3.2.4 |

---

## Folder Structure

```
src/
├── apis/notion-client/       # Notion API wrappers (getPosts, getRecordMap)
├── assets/fonts/             # Font stubs + Pretendard woff2 files
├── components/               # Leaf UI components (MetaConfig, Emoji, Tag, …)
├── constants/                # Static config: i18n, colors, queryKey, resumeSections
├── contexts/                 # React contexts (AboutPanelMotionContext)
├── hooks/                    # Client-side state hooks
├── layouts/RootLayout/       # Header, ThemeProvider, Scripts
├── libs/
│   ├── notion/               # Data pipeline (query, map, filter, prefetch)
│   ├── postFilters.ts        # Publication gate presets
│   ├── react-query/          # QueryClient factory + dehydration helpers
│   └── utils/                # Pure utilities (feed layout, date, translation, …)
├── pages/                    # Next.js routes
│   ├── index.tsx             # Home feed (ISR 30s)
│   ├── [slug].tsx            # Post/page detail (ISR 30s)
│   ├── _app.tsx              # App wrapper (React Query + Theme)
│   ├── _document.tsx         # HTML shell (fonts, blocking scheme script)
│   └── api/                  # revalidate, translate, notion/record-map
├── routes/
│   ├── Feed/                 # Home page UI (nav, tag chips, post list, resume)
│   └── Detail/               # Detail page UI (post, page, about)
├── styles/                   # sentinel-theme.css, Emotion theme, breakpoints
└── types/                    # TPost, TPosts, SchemeType, …
```

---

## Data Flow

### Build-time (SSG)

```
Notion DB
    │
    ▼
@notionhq/client                          (NOTION_API_KEY)
    │  queryAllDatabasePages()            paginated cursor loop
    │  mapNotionDatabasePage()            DB row → TPost
    │  applyNotionPublicationGate()       feed/detail presets
    ▼
React Query prefetchQuery()
    │  dehydrateServerQueries()           serialize to JSON
    ▼
getStaticProps → { props: { dehydratedState }, revalidate: 30 }
```

**Publication gate presets** (`src/libs/postFilters.ts`):
- `feed` — `status: Public`, `type: Post`
- `detail` — `status: Public | PublicOnDetail`, `type: Post | Paper | Page`

### Page content (Notion blocks)

```
@notionhq/client blocks.children.list()
    │  recursive walk
    │  convert new API format → legacy ExtendedRecordMap
    │      { block[id]: { value: { type, properties, content, format } } }
    ▼
react-notion-x NotionRenderer
    │  customMapImageUrl()    Notion CDN → proxy
    │  prismjs               code highlighting
    │  mermaid               diagram rendering
    ▼
HTML
```

### Client-side hydration

```
<Hydrate state={dehydratedState}>   restore from server props
    │
    ▼
usePostsQuery() / usePostQuery()    read from React Query cache
    │  staleTime: Infinity          never refetch
    │  refetchOnMount: false
    ▼
Feed / Detail render
```

### On-demand revalidation

```
External event (Notion webhook / manual)
    ↓
GET /api/revalidate?secret=TOKEN&path=/slug
    ↓
res.revalidate(path)   triggers Next.js ISR rebuild
```

---

## Page Routes

| Page | Mode | Revalidate | Role |
|---|---|---|---|
| `/` | SSG + ISR | 30s | Prefetches all public posts |
| `/[slug]` | SSG + ISR | 30s | Prefetches single post + record map |
| `/404` | Static | — | Returned when `notFound: true` |
| `/sitemap.xml` | SSR | — | XML sitemap of all detail posts |
| `/api/revalidate` | API | — | On-demand ISR (token-authenticated) |
| `/api/translate` | API | 1h CDN | Translation proxy (Google → MyMemory → Lingva) |

---

## Feed Route (`src/routes/Feed/`)

**Layout**: 3-column grid on desktop (nav | list | detail), collapses to single column on mobile.

```
Feed/index.tsx
├── NavBand
│   ├── SectionNav/         category list + search, scroll spy
│   └── TagChipPanel        desktop tag panel
├── MidCol
│   ├── FeedProfileCard     avatar + bio + hero stats
│   ├── TagChips            sticky mobile tag row
│   ├── FeedHeader          category/order controls
│   ├── ResumeSections      education + work timeline (Background section)
│   ├── PinnedPosts         posts with #Pinned tag
│   └── GroupedPostList     posts grouped by category
└── DetailCol               right panel (appears on slug navigation)
```

**Client filter pipeline** (`feedFilter.ts`):
```
posts
  → search match (title + summary + tags)
  → tag family match (normalizeTag groups variants)
  → category exact match
  → sort by date asc/desc
  → groupPostsByCategoryTitle()
```

**State sources**:
- URL query params — `tag`, `category`, `order`, `q` (shareable/bookmarkable)
- localStorage — column widths, layout preferences
- cookies — scheme, language

---

## Detail Route (`src/routes/Detail/`)

```
Detail/index.tsx
    │  reads type from post (Post | Page | About)
    ├── PostDetail/            Post + Paper
    │   ├── PostHeader         title, date, category
    │   ├── PostOutlineNav     H2/H3 TOC sidebar
    │   ├── PostReadingProgress  progress bar
    │   ├── TranslatedNotionRenderer  (if lang ≠ currentLanguage)
    │   └── CommentBox         Cusdis embed
    ├── PageDetail.tsx         Page type (no header/comments)
    │   └── NotionRenderer
    ├── AboutDesktopFeed       About (desktop layout)
    └── AboutMobileDetail      About (mobile)
```

**Translation flow** (`TranslatedNotionRenderer`):
1. Post has `lang` field (`"ko"` or `"en"`)
2. Detect mismatch with `useLanguage()` → current preference
3. Extract text blocks from record map
4. `POST /api/translate` in batches → returns translated strings
5. Render 2-column: original left, translated right
6. In-memory LRU cache (500 entries)

---

## Theme System

### CSS custom properties (`sentinel-theme.css`)

Four named themes via `data-theme` attribute on `<html>`:

| Theme | Mood | Background |
|---|---|---|
| `default` | Daily reading | Hanji cream (`oklch(0.985 0.008 85)`) |
| `hanji` | Long-form | Beige paper |
| `signal` | Presentation | Clean white |
| `ops` | CTF / terminal | Dark purple (`#080611`) |

Each theme has a dark scheme variant (`data-scheme="dark"`) with glassmorphic surfaces and neon accents (cyan `#2fe6ff`, magenta `#ff5cd0`).

**Semantic token layer** (what components reference):
```css
--bg, --surface, --surface-2      /* layered backgrounds */
--text, --text-muted, --text-faint
--accent, --link
--code-bg, --code-text
--shadow-sm/md/lg, --glow-sm/cy
--font-sans, --font-display, --font-prose, --font-mono
```

**Color scale** (OKLch identity palette):
- Crimson `oklch(0.52 0.19 22)` — primary accent
- Indigo `oklch(0.42 0.14 252)` — secondary
- Magenta `oklch(0.62 0.24 320)` — highlights
- Green `oklch(0.72 0.16 148)` — signal/success

### Emotion integration

- `ThemeProvider` injects theme object (all values are `var(--token)` references)
- `Global/index.tsx` sets `:root` font-family and CSS reset
- Components use `styled()` or `css` — no hardcoded colors

### Scheme initialization (FOUC prevention)

`_document.tsx` injects a blocking `<script>` before React hydrates:
```js
// reads cookie → sets data-scheme on <html> synchronously
(function(){
  var m = document.cookie.match(/scheme=([^;]+)/);
  document.documentElement.dataset.scheme = m ? m[1] : (prefers-dark ? 'dark' : 'light');
})()
```

---

## Font Stack

All fonts loaded from Google Fonts CDN at runtime (`_document.tsx`). Pretendard is self-hosted via `next/font/local`.

| Role | Stack |
|---|---|
| UI (`--font-sans`) | Inter Tight → Inter → Pretendard → system-ui |
| Display (`--font-display`) | Inter Tight → Inter → Pretendard → system-ui |
| Prose (`--font-prose`) | Source Serif 4 → Pretendard → Georgia |
| Mono (`--font-mono`) | JetBrains Mono → IBM Plex Mono → ui-monospace |
| Emoji | Noto Color Emoji → Apple Color Emoji → Segoe UI Emoji |

---

## State Management

No Redux or Zustand. State is distributed by scope:

| State | Storage | Hook |
|---|---|---|
| All posts | React Query cache | `usePostsQuery()` |
| Single post | React Query cache | `usePostQuery()` |
| Color scheme | cookie | `useScheme()` |
| Language | cookie | `useLanguage()` |
| Motion level | localStorage | `useMotionPreference()` |
| Column widths | localStorage | `useFeedLayoutPreferences()` |
| Active tag/category/order | URL query params | `useFeedRouterFilters()` |
| Search text | URL query param `q` | `useFeedSearchQuery()` |
| About panel open/close | React context | `AboutPanelMotionContext` |

React Query config:
- `staleTime: Infinity` — treat server data as authoritative
- `refetchOnMount: false`
- `retry: false`

---

## i18n / Translation

**Static strings** (`src/constants/i18n.ts`):
- `KO_NAV` — sidebar/nav labels
- `KO_RESUME` — Background section labels
- `KO_ABOUT` — About page labels
- Used with `tr(text)` pattern: `language === "ko" ? KO_MAP[text] ?? text : text`

**Dynamic content** (`/api/translate`):
- Provider fallback chain: Google Translate → MyMemory → Lingva instances
- Batch mode: send all text blocks at once
- Server response cached with `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`

---

## Configuration (`site.config.ts`)

Everything in one typed export `CONFIG`:

```
profile       name, role, bio, social links
hero          tagline[], description, stats[]
education     institution, degree, period, coreCourses[], affiliations[]
workExperience  organization, role, period, highlights[]
blog          title, description, scheme
link          canonical URL
notionConfig  pageId (= NOTION_PAGE_ID env var)
googleAnalytics / googleSearchConsole / naverSearchAdvisor
utterances / cusdis   comment providers
translation   enable, defaultLanguage, supportedLanguages
revalidateTime  ISR interval (seconds)
isProd        process.env.VERCEL_ENV === "production"
```

**Environment variables**:
```
NOTION_API_KEY                    Notion integration token
NOTION_PAGE_ID                    Notion database ID
TOKEN_FOR_REVALIDATE              /api/revalidate secret
NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID  GA4
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
NEXT_PUBLIC_NAVER_SITE_VERIFICATION
NEXT_PUBLIC_CUSDIS_APP_ID
```

---

## Build Pipeline

```
next build
    ├── TypeScript type check
    ├── SSG all pages (getPosts → mapNotionDatabasePage → dehydrate)
    │   └── staticPageGenerationTimeout: 300s (deep Notion pages)
    └── next-sitemap  →  public/sitemap.xml
```

`next.config.js` notable options:
- `images.unoptimized: true` — Notion CDN URLs bypass Next.js image optimizer
- `images.domains` — Notion S3, Google Drive, Unsplash whitelisted
