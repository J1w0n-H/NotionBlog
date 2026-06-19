# 리팩토링 계획서

> **원칙:** 동작하는 것은 건드리지 않는다. 정적 번역(`i18n.ts`, `aboutContent.ts`) 유지.  
> **순서:** 즉각 수정 → 구조 통합 → 컴포넌트 분리 → 디자인 정리  
> **표기:** ✅ 완료 기준 명시 / 📁 대상 파일 명시

---

## Phase 0 — 즉각 수정 (30분, 위험 없음)

코드 한 줄~몇 줄 수정. 기능 변경 없음.

---

### P0-1. GitHub 링크 수정

📁 `src/routes/Feed/BuildRibbon.tsx:20`

```diff
- href="https://github.com/jiwon-lieb/notion-blog"
+ href={`https://github.com/${CONFIG.profile.github}`}
```

`site.config.js`의 `profile.github` 값을 쓰도록 변경. 앞으로 링크가 config를 따라 자동 동기화.

✅ 배너 "view source ↗" 클릭 시 올바른 GitHub 주소로 이동

---

### P0-2. 중복 import 제거

📁 `src/layouts/RootLayout/index.tsx:44`

```diff
- import "prismjs/components/prism-go.js"   // ← 24번째 줄에 이미 있음
```

✅ 파일에 `prism-go` import가 1개만 존재

---

### P0-3. 개발 산출물 파일 삭제

```
삭제: /NOTION_SDK_MIGRATION.md
삭제: /notion_relabel_plan.csv
확인: /profile.jpg (루트) — public/profile.jpg와 동일 파일이면 삭제, 다르면 public/으로 이동
```

✅ 프로젝트 루트에 소스 코드 외 잡파일 없음

---

### P0-4. 댓글 시스템 정리

📁 `site.config.js:157-170`

Cusdis만 사용 중이므로 Utterances를 명시적으로 비활성화.

```diff
  utterances: {
-   enable: true,
+   enable: false,
    config: { ... }
  },
```

Cusdis `appid`는 환경변수로 이동 예정 (P1-3에서 처리).

✅ `CommentBox/index.tsx`의 `resolveCommentProvider()`가 항상 `"cusdis"` 반환

---

## Phase 1 — 핵심 버그 + 타입 정리 (반나절~하루)

한 파일(`getPosts.ts`)이 문제의 중심. 이걸 고치면 pagination, 중복 코드, `any` 타입 3개가 한꺼번에 해결됨.

---

### P1-1. getPosts.ts — 전면 교체

**현재 문제:**
- `queryAllDatabasePages`를 안 씀 → 100개 제한
- `extractPropertyValue` 로직을 직접 인라인 → `mapNotionDatabasePage.ts`와 중복
- 변수 전체가 `any` 타입

**수정 방향:**  
`getPosts.ts` 내부 구현을 버리고, 이미 만들어진 두 함수를 조립만 한다.

📁 `src/apis/notion-client/getPosts.ts`

```typescript
// 수정 후 — 전체 파일
import { Client } from "@notionhq/client"
import { CONFIG } from "site.config"
import { queryAllDatabasePages } from "src/libs/notion/queryAllDatabasePages"
import { mapNotionDatabasePage, buildSchemaByPropId } from "src/libs/notion/mapNotionDatabasePage"
import type { TPosts } from "src/types"

export async function getPosts(): Promise<TPosts> {
  const token = process.env.NOTION_API_KEY
  const databaseId = CONFIG.notionConfig.pageId as string

  if (!token) return []
  if (!databaseId) throw new Error("NOTION_PAGE_ID not configured")

  const notion = new Client({ auth: token })
  const pages = await queryAllDatabasePages(notion, databaseId)
  const schema = buildSchemaByPropId(pages)

  return pages.map((page) => mapNotionDatabasePage(page, schema))
}
```

이를 위해 `mapNotionDatabasePage.ts`에 `buildSchemaByPropId` 헬퍼 하나 추출.

✅ 포스트 100개 초과 시 전부 표시  
✅ `any` 타입 0개  
✅ `extractPropertyValue` 로직이 `mapNotionDatabasePage.ts` 한 곳에만 존재  
✅ TODO 주석 제거

---

### P1-2. site.config.js → site.config.ts 통합

**현재 문제:**  
`site.config.js`(구현) + `site.config.d.ts`(타입) 이중 관리.

**수정 방향:**  
파일 하나로 합친다. `education`, `workExperience` 타입을 `unknown[]` 대신 실제 타입으로 명시.

📁 `site.config.js` → `site.config.ts`  
📁 `site.config.d.ts` → 삭제  

```typescript
// site.config.ts
export type EducationAffiliation = { ... }
export type EducationEntry = { ... }
export type WorkHighlight = { category: string; detail: string }
export type WorkEntry = { ... }

export const CONFIG = {
  profile: { ... },
  education: [ ... ] satisfies EducationEntry[],
  workExperience: [ ... ] satisfies WorkEntry[],
  ...
} as const
```

`satisfies` 키워드로 타입 체크는 하되 `as const` 추론 유지.  
기존 `ResumeSections.tsx`의 `SiteResumeConfig` 캐스팅 제거 가능.

📁 수정 필요 파일 (import 경로):
- `src/pages/index.tsx`
- `src/pages/[slug].tsx`
- `src/routes/Feed/ResumeSections.tsx`
- `src/routes/Feed/FeedProfileCard.tsx`
- 기타 `import { CONFIG } from "site.config"` 사용 파일 전체

✅ 타입 선언 파일 1개 삭제  
✅ `education: unknown[]` → 실제 타입으로 추론

---

### P1-3. Cusdis appid 환경변수 이동

📁 `site.config.js`

```diff
  cusdis: {
    enable: true,
    config: {
      host: "https://cusdis.com",
-     appid: "bd2297e3-9940-40a0-867a-82b6be1f4320",
+     appid: process.env.NEXT_PUBLIC_CUSDIS_APP_ID || "",
    },
  },
```

Vercel 환경변수에 `NEXT_PUBLIC_CUSDIS_APP_ID` 추가.

✅ 소스 코드에 서비스 키 평문 노출 없음

---

### P1-4. 번역 API rate limiting 추가

📁 `src/pages/api/translate.ts`

요청 헤더의 IP를 키로 인메모리 카운터 사용. 분당 20회 초과 시 429 반환.

```typescript
// translate.ts 상단에 추가
const rateLimitMap = new Map<string, { count: number; reset: number }>()
const RATE_LIMIT = 20
const WINDOW_MS = 60_000

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.reset) {
    rateLimitMap.set(ip, { count: 1, reset: now + WINDOW_MS })
    return true
  }
  if (entry.count >= RATE_LIMIT) return false
  entry.count++
  return true
}

// handler 내 첫 줄
const ip = req.headers["x-forwarded-for"]?.toString().split(",")[0] ?? "unknown"
if (!checkRateLimit(ip)) {
  return res.status(429).json({ error: "rate limit exceeded" })
}
```

✅ 분당 20회 초과 시 429 응답  
✅ 서버 재시작 시 카운터 초기화 (허용 가능한 단순 구현)

---

## Phase 2 — 컴포넌트 분리 (이틀)

---

### P2-1. SectionNav.tsx 분리 (780줄 → 4개 파일)

**현재:** 데이터 계산 + 두 가지 모드 렌더링 + 스타일이 780줄 한 파일에 혼재

**목표 구조:**

```
src/routes/Feed/SectionNav/
  index.tsx              ← 외부 진입점 (기존 import 경로 유지)
  useSectionNavData.ts   ← 훅: 카테고리 목록, 포스트 수, 활성 상태 계산
  SectionNavExpanded.tsx ← 일반 모드 렌더러
  SectionNavDocked.tsx   ← 도크 모드 렌더러 (아이콘 레일)
  sectionNav.styles.ts   ← Emotion styled-components 전부
```

**분리 기준:**

`useSectionNavData` 훅이 반환하는 것:
```typescript
type SectionNavData = {
  navCategories: string[]
  resumeNavItems: typeof RESUME_NAV_SECTIONS
  backgroundCount: number
  hasPinnedPosts: boolean
  activeSection: string | null
  scrollToSection: (id: string) => void
}
```

`index.tsx`는 훅 호출 + 모드에 따라 Expanded/Docked 중 하나 렌더.

✅ 최대 파일이 200줄 이하  
✅ `SectionNavDocked`와 `SectionNavExpanded`가 독립적으로 테스트 가능  
✅ 기존 `<SectionNav>` import 경로 변경 없음

---

### P2-2. FeedProfileCard — CONFIG에서 동적으로

📁 `src/routes/Feed/FeedProfileCard.tsx`

**현재:**
```tsx
// 하드코딩
const KSTATS = [
  { val: "4 yrs", lbl: "Infra / ops" },
  { val: "200+", lbl: "HPC nodes" },
  { val: "ISMS-P", lbl: "Certified" },
]

<Description>
  Ran a <strong>200-node cluster</strong> for four years...
</Description>
```

**수정 방향:**  
`site.config.ts`에 `hero` 블록 추가. 프로필 카드 텍스트를 거기서 읽음.

```typescript
// site.config.ts에 추가
hero: {
  tagline: ["Built it.", "Broke it.", "Mastered why."],
  description: "Ran a **200-node cluster** for four years, then came to Maryland to learn the attacker's side — now researching **cloud, LLM & GitOps security**.",
  stats: [
    { val: "4 yrs",  lbl: "Infra / ops" },
    { val: "200+",   lbl: "HPC nodes"   },
    { val: "ISMS-P", lbl: "Certified"   },
  ],
},
```

`FeedProfileCard`는 `CONFIG.hero`를 읽어서 렌더.
description의 `**텍스트**` → `<strong>` 변환은 간단한 파서 함수 1개로 처리.

✅ 텍스트 수정 시 `site.config.ts` 한 곳만 수정  
✅ 컴포넌트 파일에 콘텐츠 없음

---

### P2-3. 번역 UX — 실패 알림 + 레이아웃 안정화

📁 `src/routes/Detail/components/TranslatedNotionRenderer/index.tsx`

**현재 문제 1 — 실패 무음:**  
번역 실패 시 `translatedBlocks = []`로 설정하고 조용히 넘어감.

```diff
  .catch(() => {
-   if (!cancelled) setTranslatedBlocks([])
+   if (!cancelled) { setTranslatedError(true); setTranslatedBlocks([]) }
  })

// JSX
+ {translatedError && (
+   <StyledError>
+     {currentLanguage === "ko" ? "번역을 불러올 수 없습니다" : "Translation unavailable"}
+   </StyledError>
+ )}
```

**현재 문제 2 — 레이아웃 shift:**  
번역 컬럼이 번역 시작 시점에 갑자기 나타남.

수정: 번역 모드 진입 즉시 컬럼 공간을 예약해두고, 내용만 교체.

```diff
- if (!needsTranslation) return <StyledWrapper>...</StyledWrapper>
+ // 번역 필요 여부와 무관하게 항상 SideBySide 구조 렌더
+ // 번역 불필요 시 우측 컬럼을 display:none으로 처리 (공간은 차지 안 함)
```

✅ 번역 실패 시 "번역을 불러올 수 없습니다" 메시지 표시  
✅ 번역 켤 때 기존 본문 위치 유지

---

### P2-4. 모바일 툴팁 → 탭 토글

📁 `src/routes/Feed/ResumeSections.tsx`

Background 섹션의 `MiniTag`에 터치 이벤트 추가.

```tsx
// MiniTag를 div → button으로 교체, 탭 시 active 상태 토글
const [activeTooltip, setActiveTooltip] = useState<string | null>(null)

<MiniTagButton
  key={keyword}
  data-desc={detail || undefined}
  data-active={activeTooltip === keyword ? "true" : undefined}
  onClick={() => detail ? setActiveTooltip(p => p === keyword ? null : keyword) : undefined}
>
  {keyword}
</MiniTagButton>
```

CSS: `&[data-active]::after { opacity: 1; transform: translateY(0); }`  
데스크톱은 기존 hover 동작 유지, 모바일은 탭으로 토글.

✅ 모바일에서 키워드 탭 시 툴팁 표시  
✅ 다른 곳 탭 시 툴팁 닫힘

---

## Phase 3 — 디자인 정리 (하루)

---

### P3-1. 라이트 모드 카테고리 색상 복원

📁 `src/styles/sentinel-theme.css:517–542`

현재 OS 다크모드 감지 블록에서 모든 카테고리가 보라 단일색:

```css
/* 현재 — 모두 같은 값 */
--cat-reverse-solid: #9b6cff;
--cat-systems-solid: #9b6cff;
...
```

라이트 모드의 카테고리 토큰(파일 상단 `[data-theme="default"]` 블록)이 이미 올바르게 정의되어 있음.  
문제는 `@media (prefers-color-scheme: dark)` 블록이 라이트 모드용 카테고리 값을 덮어쓰는 것.

수정: OS 다크모드 감지 블록에서 카테고리 토큰 오버라이드를 제거하거나, 다크 팔레트 값으로 교체.

```css
/* 수정 후 — 다크 팔레트 각자의 색상 */
--cat-reverse-solid: oklch(0.65 0.22 22);    /* crimson */
--cat-systems-solid: oklch(0.70 0.18 195);   /* teal */
--cat-ctf-solid:     oklch(0.78 0.20 75);    /* amber */
--cat-crypto-solid:  oklch(0.62 0.22 252);   /* indigo */
--cat-lime-solid:    oklch(0.72 0.20 138);   /* lime */
--cat-research-solid:oklch(0.68 0.22 295);   /* violet */
--cat-rose-solid:    oklch(0.68 0.22 355);   /* rose */
--cat-cyan-solid:    oklch(0.72 0.18 220);   /* cyan */
```

✅ OS 라이트/다크 어느 쪽이든 카테고리 8색 구분 유지

---

### P3-2. 하드코딩 색상 → CSS 변수 치환 (92건)

단계적으로 진행. 우선순위: About > Feed 컴포넌트 > 기타

**치환 매핑:**

| 하드코딩 값 | CSS 변수 |
|------------|---------|
| `#9b6cff`, `rgba(155,108,255,*)` | `var(--accent)`, `var(--accent-soft)` 등 |
| `#2fe6ff`, `rgba(47,230,255,*)` | `var(--link)`, `var(--link-soft)` 등 |
| `#ff5cd0`, `rgba(255,92,208,*)` | `var(--signal)`, `var(--signal-soft)` 등 |
| `rgba(8,6,17,*)` | `var(--bg)` 또는 `oklch(from var(--bg) l c h / alpha)` |

📁 주요 대상 파일:
- `src/components/AboutDrawerContent.tsx` (가장 많음)
- `src/routes/Feed/index.tsx` (DetailCol 배경)
- `src/routes/Feed/FeedProfileCard.tsx`
- `src/routes/Feed/ResumeSections.tsx`

✅ 브랜드 색상 변경 시 `sentinel-theme.css` 한 파일만 수정하면 전체 반영

---

## 파일별 변경 요약

| 파일 | 변경 유형 | Phase |
|------|----------|-------|
| `src/routes/Feed/BuildRibbon.tsx` | 1줄 수정 | P0-1 |
| `src/layouts/RootLayout/index.tsx` | 1줄 삭제 | P0-2 |
| `NOTION_SDK_MIGRATION.md` | 삭제 | P0-3 |
| `notion_relabel_plan.csv` | 삭제 | P0-3 |
| `site.config.js` | 삭제 후 `site.config.ts`로 재생성 | P1-2 |
| `site.config.d.ts` | 삭제 | P1-2 |
| `src/apis/notion-client/getPosts.ts` | 전면 교체 (200줄 → 25줄) | P1-1 |
| `src/libs/notion/mapNotionDatabasePage.ts` | `buildSchemaByPropId` 추출 추가 | P1-1 |
| `src/pages/api/translate.ts` | rate limit 추가 (~30줄) | P1-4 |
| `src/routes/Feed/SectionNav.tsx` | 삭제 후 `SectionNav/` 폴더로 분리 | P2-1 |
| `src/routes/Feed/FeedProfileCard.tsx` | CONFIG.hero 읽도록 수정 | P2-2 |
| `src/routes/Detail/components/TranslatedNotionRenderer/index.tsx` | 에러 상태 + 레이아웃 수정 | P2-3 |
| `src/routes/Feed/ResumeSections.tsx` | 모바일 툴팁 토글 추가 | P2-4 |
| `src/styles/sentinel-theme.css` | 카테고리 색상 수정 (~24줄) | P3-1 |
| `src/components/AboutDrawerContent.tsx` | 하드코딩 색상 → CSS 변수 | P3-2 |

---

## 건드리지 않는 것

| 파일 | 이유 |
|------|------|
| `src/constants/i18n.ts` | 정적 번역 유지 |
| `src/constants/aboutContent.ts` | 정적 번역 유지 |
| `src/constants/translation.ts` | 정적 번역 유지 |
| `src/apis/notion-client/getRecordMap.ts` | 글 렌더링 핵심. 동작 중. 건드릴 이유 없음 |
| `src/libs/notion/queryAllDatabasePages.ts` | 이미 올바른 구현. P1-1에서 사용만 함 |
| `src/hooks/` 전체 | 잘 분리된 상태 |
| `src/styles/feedBreakpoints.ts` | 잘 추상화된 상태 |

---

## 실행 순서 (권장)

```
Day 1 오전:  P0 전체 (30분) → 커밋
Day 1 오후:  P1-1 getPosts.ts 교체 → 로컬 빌드 검증 → 커밋
             P1-2 site.config.ts 통합 → 커밋
Day 2 오전:  P1-3, P1-4 (보안) → 커밋
Day 2 오후:  P3-1 라이트 모드 색상 (빠르고 임팩트 큼) → 커밋
Day 3~4:     P2-1 SectionNav 분리 (가장 오래 걸림)
Day 5:       P2-2, P2-3, P2-4
Day 6~7:     P3-2 하드코딩 색상 치환
```

P3-1(라이트 모드)을 P2보다 먼저 하는 이유: CSS 몇 줄이라 빠르고, 시각적 임팩트가 즉각적.
