# Notion CMS 블로그, 풀스택으로 직접 설계한 이야기

> 오픈소스 포크에서 시작했지만 데이터 레이어부터 디자인 시스템까지 전부 새로 썼다

---

## 배경: 무엇을 가져왔고 무엇을 새로 썼나

시작점은 [morethan-log](https://github.com/morethanmin/morethan-log)라는 오픈소스다. Next.js + Notion CMS 조합의 블로그 보일러플레이트인데, 실제로 내가 가져온 건 세 가지뿐이다.

- Next.js 13 Pages Router 기반 구조
- `react-notion-x` — Notion 블록을 React로 렌더링하는 라이브러리
- Emotion CSS-in-JS 설정

나머지는 전부 새로 설계하거나 완전히 재작성했다. 데이터 레이어, 레이아웃 시스템, 디자인 토큰, 번역 엔진, 캐싱 파이프라인 모두 포함해서.

---

## 1. Notion API 호환성 레이어 (가장 핵심)

### 문제

2026년 3월, Notion이 API를 `2026-03-11` 버전으로 업데이트하면서 원본이 사용하던 비공식 SDK `notion-client`가 완전히 작동 불능이 됐다. 비공식 SDK는 Notion 내부 엔드포인트를 크롤링하는 방식이라 API 변경에 속수무책이다.

문제는 공식 SDK로 그냥 교체할 수 없다는 것이다. `react-notion-x`는 Notion 구형 내부 포맷인 `ExtendedRecordMap`만 소비할 수 있는데, 공식 SDK는 완전히 다른 포맷을 반환한다.

```typescript
// 공식 SDK가 반환하는 포맷
{
  "type": "paragraph",
  "paragraph": {
    "rich_text": [{ "type": "text", "text": { "content": "..." }, "annotations": {...} }]
  }
}

// react-notion-x가 요구하는 레거시 포맷
{
  "value": {
    "type": "text",
    "properties": { "title": [["...", [["b"], ["i"]]]] }  // 이중 배열 구조
  }
}
```

### 해결: 포맷 변환 레이어 직접 구현

`getRecordMap.ts` (281줄)를 처음부터 다시 작성했다. 공식 SDK로 블록을 페치하고, 신형 포맷을 레거시 `ExtendedRecordMap`으로 변환하는 레이어다.

```typescript
// src/apis/notion-client/getRecordMap.ts

// 블록 타입 매핑
const TYPE_MAP: Record<string, string> = {
  paragraph:           "text",
  heading_1:           "header",
  heading_2:           "sub_header",
  heading_3:           "sub_sub_header",
  bulleted_list_item:  "bulleted_list",
  numbered_list_item:  "numbered_list",
  code:                "code",
  quote:               "quote",
  callout:             "callout",
  image:               "image",
  table:               "table",
  column_list:         "column_list",
  toggle:              "toggle",
  divider:             "divider",
  // ...
}

// 공식 RichText[] → 레거시 InlineToken[][] 변환
function convertRichText(richTexts: RichTextItem[]): unknown[][] {
  return richTexts.map((rt) => {
    const text = rt.plain_text ?? rt.text?.content ?? ""
    const ann = rt.annotations ?? {}
    const marks: [string, ...string[]][] = []

    if (ann.bold)          marks.push(["b"])
    if (ann.italic)        marks.push(["i"])
    if (ann.strikethrough) marks.push(["s"])
    if (ann.code)          marks.push(["c"])
    if (ann.color && ann.color !== "default")
      marks.push(["h", ann.color])
    if (rt.href)           marks.push(["a", rt.href])

    return marks.length > 0 ? [text, marks] : [text]
  })
}
```

재귀적으로 전체 페이지 트리를 순회하면서 `ExtendedRecordMap`을 조립한다. `react-notion-x`는 이 포맷만 보기 때문에 렌더러 쪽은 건드릴 필요가 없다.

### DB 쿼리: 100개 상한 문제도 같이 해결

원본 `getPosts`는 단일 API 요청만 보냈다. Notion API는 기본적으로 최대 100개까지만 반환하므로 조용히 잘렸다. 커서 기반 페이지네이션으로 교체했다.

```typescript
// src/apis/notion-client/getPosts.ts
async function queryAllDatabasePages(notion: Client, databaseId: string) {
  const results: PageObjectResponse[] = []
  let cursor: string | undefined

  do {
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: cursor,
    })
    results.push(...response.results.filter((r): r is PageObjectResponse =>
      "properties" in r
    ))
    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined
  } while (cursor)

  return results
}
```

동시에 인라인으로 200줄이 펼쳐져 있던 프로퍼티 추출 로직을 `mapNotionDatabasePage` + `buildSchemaByPropId`로 분리하고, `any` 타입을 전부 제거했다.

---

## 2. ISR + React Query 캐싱 파이프라인

### 설계

Next.js SSG만으로는 글을 새로 올려도 재빌드 없이 반영이 안 된다. 두 레이어를 조합했다.

```
Notion DB에 글 업로드
       │
       ▼
Next.js ISR (revalidate: 30s)
  ← 30초마다 백그라운드 재생성, stale 페이지는 즉시 서빙
       │
       ▼
React Query dehydration (SSG에서 직렬화)
  ← 서버에서 QueryClient에 prefetch → JSON으로 HTML에 삽입
       │
       ▼
클라이언트 hydration (staleTime: Infinity)
  ← 복원 후 재요청 없음, 클라이언트 측 API 호출 0
```

```typescript
// src/libs/react-query/index.ts
export async function prepareStaticPageProps(
  prepare: (client: QueryClient) => Promise<void>
): Promise<{ dehydratedState: DehydratedState }> {
  const client = createQueryClient()
  await prepare(client)
  return { dehydratedState: dehydrateServerQueries(client) }
}

// 피드 페이지
export const getStaticProps: GetStaticProps = async () => ({
  props: await prepareStaticPageProps(prefetchFeedStaticProps),
  revalidate: 30,
})
```

### 수동 갱신 API

특정 포스트를 즉시 갱신하거나 전체를 갱신할 수 있는 엔드포인트를 추가했다.

```typescript
// src/pages/api/revalidate.ts
export default async function handler(req, res) {
  if (req.query.secret !== process.env.TOKEN_FOR_REVALIDATE)
    return res.status(401).json({ message: "Unauthorized" })

  if (req.query.path) {
    await res.revalidate(String(req.query.path))
    return res.json({ revalidated: true, path: req.query.path })
  }

  // 전체 갱신: 인덱스 + 발행된 모든 글
  const posts = await fetchPublishedPosts("detail")
  await Promise.all([
    res.revalidate("/"),
    ...posts.map((p) => res.revalidate(`/${p.slug}`))
  ])
  return res.json({ revalidated: true, count: posts.length + 1 })
}
```

### 출판 게이트

Notion DB의 `status` × `type` 조합으로 노출 범위를 제어한다.

```typescript
// src/libs/postFilters.ts
export const NOTION_PRESET_FEED: FilterPostsOptions = {
  acceptStatus: ["Public"],
  acceptType: ["Post"],
}

export const NOTION_PRESET_DETAIL: FilterPostsOptions = {
  acceptStatus: ["Public", "PublicOnDetail"],
  acceptType: ["Paper", "Post", "Page"],
}
```

`PublicOnDetail`은 피드 목록에 안 뜨지만 URL을 알면 접근 가능한 상태다. `getStaticPaths`의 `fallback: true`와 조합해서, Detail 프리셋 포스트는 최초 접근 시 빌드된다.

---

## 3. Sentinel 디자인 시스템

### 구조

하드코딩된 색상을 전부 제거하고 CSS 커스텀 프로퍼티 기반의 시맨틱 토큰 레이어를 설계했다. 현재 `sentinel-theme.css`는 415줄이다.

```css
/* ── Layer 1: 정체성 팔레트 (불변) ── */
:root {
  /* OKLCH: 색상 연산이 지각적으로 균일함 */
  --crimson-500: oklch(0.52 0.19 22);   /* 보안 alert */
  --indigo-500:  oklch(0.42 0.14 252);  /* 터미널 신뢰감 */
  --cyan-500:    oklch(0.84 0.14 197);  /* 정보 링크 */
}

/* ── Layer 2: 시맨틱 토큰 (테마별로 다름) ── */
[data-theme="default"] {
  --bg:     oklch(0.985 0.008 85);   /* 한지 크림 */
  --accent: var(--crimson-500);
  --link:   var(--indigo-500);
  --signal: oklch(0.72 0.16 148);   /* 온라인 그린 */
}

/* ── Dark mode ── */
[data-scheme="dark"][data-theme="default"] {
  --bg:     #080611;     /* 딥 네이비 */
  --accent: #9b6cff;     /* 바이올렛 */
  --link:   #2fe6ff;     /* 사이언 */
  --signal: #ff5cd0;     /* 마젠타 */
}
```

컴포넌트는 시맨틱 토큰만 참조하고, 투명도 합성도 `color-mix`로 처리한다.

```typescript
// 컴포넌트에 하드코딩 없음
const ActiveItem = styled.button`
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--accent) 16%, transparent),
    transparent
  );
  box-shadow: inset 2px 0 0 0 var(--accent);
  color: var(--text);
`
```

### FOUC 방지

Next.js SSR에서 다크모드를 구현할 때 React hydration 전에 라이트 모드로 한 프레임 렌더링되는 문제가 있다. `_document.tsx`에 블로킹 인라인 스크립트를 추가해서 HTML 파싱 단계에서 스킴을 적용한다.

```tsx
// src/pages/_document.tsx
<script dangerouslySetInnerHTML={{ __html: `
  (function(){
    try {
      var m = document.cookie.match(/scheme=([^;]+)/);
      var s = m ? m[1] : (
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      );
      document.documentElement.dataset.scheme = s;
    } catch(e) {}
  })()
` }} />
```

이 스크립트 이전에는 다크모드 설정 사용자에게 흰 배경이 순간 노출됐다.

### 카테고리 색상 시스템

포스트 카테고리마다 다른 색상을 CSS 변수로 주입한다. 8가지 색상 슬롯을 OKLCH로 정의하고, 카테고리 인덱스로 매핑한다.

```typescript
// src/constants/categoryColors.ts
export const CATEGORY_HUES = [257, 197, 332, 148, 27, 86, 225, 300]

export function catVars(token: CategoryToken): React.CSSProperties {
  return {
    "--cat-hue": String(token.hue),
    "--cat-chroma": String(token.chroma),
  } as React.CSSProperties
}

// 카드에서 사용
<PostCard style={catVars(categoryColor(post.category))} />
```

---

## 4. 3컬럼 레이아웃 + 패널 시스템

### 레이아웃 모드

피드 단독 / 포스트 패널 열림 / 모바일 세 가지 모드를 CSS Grid 단일 컨테이너로 처리한다.

```typescript
// src/routes/Feed/index.tsx

// 포스트 패널 열림 여부 + 화면 크기로 레이아웃 결정
const dockNav = !isDesktopFeed || (isDesktopFeed && sideOpen)

const StyledWrapper = styled.div`
  ${feedDesktopMinMedia} {
    display: grid;
    transition: grid-template-columns 300ms cubic-bezier(0.2, 0, 0, 1);

    // 피드 단독 — 2컬럼
    &[data-feed-layout="index"] {
      grid-template-columns:
        var(${FEED_NAV_WIDTH_VAR}, 220px)
        minmax(0, 1fr);
    }

    // 포스트 패널 열림 — 3컬럼
    &[data-feed-layout="post"] {
      grid-template-columns:
        var(${FEED_NAV_WIDTH_VAR}, 220px)                          // nav (dock 모드)
        minmax(0, var(${FEED_LIST_WIDTH_VAR}, 420px))              // feed (draggable)
        minmax(var(${FEED_POST_PANEL_MIN_WIDTH_VAR}, 24rem), 1fr); // post panel
    }
  }
`
```

JS가 CSS 변수만 바꾸면 Grid가 애니메이션으로 전환된다. 컬럼 너비를 드래그로 조절하면 `FEED_LIST_WIDTH_VAR`를 업데이트한다.

### 리사이즈 핸들

```typescript
// src/routes/Feed/FeedColumnResizeHandle.tsx
const handlePointerMove = useCallback((e: PointerEvent) => {
  const delta = e.clientX - dragStartX.current
  onPreview(delta)   // 실시간 CSS 변수 업데이트
}, [onPreview])

const handlePointerUp = useCallback(() => {
  document.removeEventListener("pointermove", handlePointerMove)
  document.removeEventListener("pointerup", handlePointerUp)
  onCommit()         // localStorage에 영구 저장
}, [handlePointerMove, onCommit])
```

조절한 너비는 `localStorage`에 저장되어 세션 간 유지된다.

### 포스트 패널 열기 / 스크롤 복원

포스트를 클릭하면 피드가 왼쪽에 유지된 채 오른쪽에 패널이 슬라이드인된다.

```typescript
// src/layouts/RootLayout/index.tsx
// URL이 슬러그 경로이면 rightPanel에 포스트 컴포넌트 삽입
<Feed rightPanel={isPostRoute ? <Detail /> : undefined} />
```

닫을 때는 스크롤 위치를 복원한다.

```typescript
// src/libs/utils/feedScrollMemory.ts
export function saveFeedScrollPosition() {
  sessionStorage.setItem("feed-scroll-y", String(window.scrollY))
}

export function restoreFeedScrollPosition() {
  const y = sessionStorage.getItem("feed-scroll-y")
  if (y) window.scrollTo({ top: Number(y), behavior: "instant" })
}
```

### 모바일 독 모드

모바일에서는 네비게이션이 항상 축소된 독 상태다. 검색 아이콘, 태그 칩 가로 스크롤, 섹션 이모지 아이콘만 노출된다.

```typescript
// 모바일: 항상 독 / 데스크탑: 포스트 패널 열릴 때만 독
const dockNav = !isDesktopFeed || (isDesktopFeed && sideOpen)

// 모바일 독 바
<NavBand>
  <SectionNav dockNav={dockNav} />   // 아이콘만 노출
  <TagChips inDock={!isDesktopFeed} />  // 가로 스크롤 칩
</NavBand>
```

---

## 5. Background 섹션 (학력·경력 타임라인)

피드 메인에 인라인으로 보이는 학력/경력 타임라인이다. `site.config.ts`에 데이터를 정의하면 자동으로 정렬·렌더링된다. `ResumeSections.tsx`는 563줄이다.

### 기간 파싱 + 재직 기간 계산

```typescript
// src/routes/Feed/ResumeSections.tsx

// "Dec 2020 – Aug 2024" → 정렬 키
function parsePeriodForSort(period: string): [endYear: number, startYear: number] {
  const years = (period.match(/\d{4}/g) ?? []).map(Number)
  return [years.at(-1) ?? 2000, years[0] ?? 2000]
}

// "Dec 2020 – Aug 2024" → "3 yrs 8 mos"
function formatWorkDuration(period: string): string {
  const [startStr, endStr] = period.split(/\s*[–—]\s*/)
  const start = parseMonthYear(startStr)
  const end = parseMonthYear(endStr.replace(/\s*\(.*\)/, ""))
  if (!start || !end) return ""
  const totalMonths = (end.year - start.year) * 12 + (end.month - start.month)
  const yrs = Math.floor(totalMonths / 12)
  const mos = totalMonths % 12
  if (yrs > 0 && mos > 0) return `${yrs} yrs ${mos} mos`
  if (yrs > 0) return `${yrs} yrs`
  return `${mos} mos`
}
```

### CSS-only 툴팁

각 하이라이트 키워드를 칩으로 표시하고, 호버 시 상세 내용이 툴팁으로 나온다. JS 이벤트 없이 CSS `content: attr(data-desc)`만으로 구현했다.

```typescript
// data-desc 속성에 툴팁 내용을 넣으면 CSS가 읽어서 렌더링
<MiniTag data-desc={detail}>{category}</MiniTag>

const MiniTag = styled.span`
  position: relative;
  cursor: default;

  &::after {
    content: attr(data-desc);  // 속성값을 CSS가 직접 렌더링
    position: absolute;
    bottom: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
    width: max-content;
    max-width: 280px;
    white-space: normal;
    background: ${({ theme }) => theme.brand.surface2};
    border: 1px solid ${({ theme }) => theme.brand.border};
    border-radius: 8px;
    padding: 6px 10px;
    font-size: 11.5px;
    line-height: 1.5;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.12s;
    z-index: 50;
  }

  &:hover::after {
    opacity: 1;
  }
`
```

---

## 6. 번역 시스템

Notion DB의 `lang` 컬럼(`ko` / `en`)을 읽어 독자의 언어 설정과 다를 때 번역을 제공한다.

### 아키텍처

```
Notion lang 컬럼 → getPosts에서 TPost.lang으로 전달
     │
     ▼
TranslatedNotionRenderer — lang vs. 독자 설정 비교
     │
     ├─ 같음 → NotionRenderer 그대로
     │
     └─ 다름 → recordMap에서 텍스트 블록 추출
               → /api/translate 병렬 호출
               → LRU 캐시 (500 항목)
               → 원문 | 번역 2컬럼 렌더링
```

### 번역 API: 3단계 폴백

```typescript
// src/pages/api/translate.ts
async function translate(text: string, target: string): Promise<string> {
  // 1순위: Google Translate (가장 품질 높음)
  try { return await googleTranslate(text, target) }
  catch { }

  // 2순위: MyMemory (무료 공개 API)
  try { return await myMemoryTranslate(text, target) }
  catch { }

  // 3순위: Lingva (오픈소스 Google 프록시)
  return await lingvaTranslate(text, target)
}

// CDN 캐시: 같은 문장은 1시간 동안 API 재호출 없음
res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400")
```

**패턴에 대한 주석**: Google provider는 공식 Cloud Translate API가 아니라 비공식 `translate_a/single?client=gtx` 엔드포인트를 사용한다 — 섹션 1에서 걷어낸 Notion 비공식 SDK와 같은 패턴이다. 의도적인 선택이다. 번역 API가 깨지면 페이지는 원문 그대로 렌더링되고 핵심 기능은 유지된다. Notion API가 깨지면 블로그 전체가 다운된다. 선택적 기능의 열화와 서비스 단절은 다른 문제다.

### 첫 화면 언어 쿠키

번역 시스템은 쿠키에서 언어를 동기적으로 읽는다. 비동기로 읽으면 첫 렌더링에서 원문이 잠깐 노출된다.

```typescript
// src/hooks/useLanguage.ts
function readLanguageCookieSync(): Language {
  if (typeof document === "undefined") return "ko"
  const match = document.cookie.match(/(?:^|;\s*)lang=([^;]+)/)
  return (match?.[1] as Language) ?? "ko"
}
```

---

## 결과물

보안 엔지니어링 연구 기록을 위한 기술 블로그다. 현재 스택:

```
Next.js 13 Pages Router  — SSG + ISR (revalidate: 30s)
TypeScript strict         — any 없음
Emotion CSS-in-JS         — 시맨틱 토큰만 참조
React Query v4            — SSG dehydration / hydration
@notionhq/client v2       — 공식 SDK (DB 쿼리 + 블록 페치)
react-notion-x v6         — 레거시 포맷 렌더러
Prism.js                  — syntax highlighting
Mermaid.js                — 다이어그램 (lazy import)
Cusdis                    — 댓글
Vercel                    — 배포
```

주요 지표:

| 항목 | 수치 |
|---|---|
| 총 커밋 | 796 |
| 핵심 파일 직접 작성 | `getRecordMap.ts` 281줄, `ResumeSections.tsx` 563줄, `sentinel-theme.css` 415줄, `Feed/index.tsx` 408줄 |
| Notion API 호환 변환 레이어 | 1회 API 변경으로 전체 대응 완료 |
| 번역 폴백 체인 | 3단계 (Google → MyMemory → Lingva) |
| ISR + on-demand revalidate | `/api/revalidate` 엔드포인트 |

오픈소스에서 가져온 건 Next.js + react-notion-x + Emotion 기반 뼈대였고, 그 위에 데이터 레이어, 레이아웃 시스템, 디자인 토큰, 번역 엔진, 캐싱 파이프라인을 전부 직접 설계했다.

소스코드: [github.com/J1w0n-H/NotionBlog](https://github.com/J1w0n-H/NotionBlog)
