# Notion 콘텐츠 운영 가이드

이 블로그에서 **Notion만으로 바꿀 수 있는 것**과 **코드를 고쳐야 하는 것**, 그리고 공개 범위가 어떻게 정해지는지 정리한 문서입니다.

---

## 1. Notion에서 직접 관리하는 것

### 글 데이터베이스 속성

| 속성 | 타입 | 용도 |
|---|---|---|
| `title` | Title | 글 제목 |
| `slug` | Text | URL (`/JW-129`). 비어 있으면 페이지 ID를 씁니다. **한 번 공개한 글의 slug는 바꾸지 마세요.** 기존 링크가 깨집니다. |
| `status` | Select | `Public` / `PublicOnDetail` / `Private` (아래 공개 범위 표 참고) |
| `type` | Select | `Post` / `Paper` / `Page` |
| `date` | Date | 게시일. 피드 정렬 기준이며, 비어 있으면 생성일을 씁니다. **내일 이후 날짜는 숨겨집니다(예약 게시).** |
| `category` | Select 또는 Multi-select | 피드 그룹 (아래 카테고리 참고) |
| `tags` | Multi-select | 태그. `Pinned`를 붙이면 상단 고정 영역에 표시됩니다. |
| `summary` | Text | 카드 요약과 메타 설명 |
| `lang` | Select | `ko` / `en` — 번역 토글 기준 |
| `thumbnail` | Files | 썸네일. 없으면 페이지 커버를 씁니다. |
| `Editorial` | 아무 타입 | **내부 편집 관리용.** 블로그는 이 값을 전혀 읽지 않으며, 공개 여부에도 영향을 주지 않습니다. |

컬럼명은 대소문자를 구분하지 않습니다. `태그`, `카테고리`, `언어`도 인식합니다.

### 공개 범위

| status | 피드·검색 | 글 URL | sitemap | record-map API |
|---|---|---|---|---|
| `Public` | ✅ | ✅ | ✅ | ✅ |
| `PublicOnDetail` | ❌ | ✅ (링크를 아는 사람만) | ✅ | ✅ |
| `Private` / 비어 있음 / 그 외 값 | ❌ | 404 | ❌ | 404 |

- 공개 여부는 **`status` 하나로만** 정해집니다. `Editorial` 같은 다른 속성은 관여하지 않습니다.
- 글 안의 **하위 페이지와 인라인 DB는 링크로만 표시**되고, 그 내용은 블로그로 가져오지 않습니다.
- 블로그는 `NOTION_PAGE_ID`로 지정된 **글 DB에 속한 페이지만** 렌더링합니다.

### 카테고리

현재 카테고리는 다음 6개이며, 피드에는 이 순서로 표시됩니다: `Research`, `Engineering`, `Insights`, `Conferences`, `Community`, `Life & Career`

- Notion에서 새 카테고리를 만들면 **코드 수정 없이** 바로 표시됩니다. 색상은 자동으로 정해지고, 목록의 맨 뒤에 정렬됩니다.
- 순서나 색상 슬롯을 정하고 싶으면 `src/constants/feedSections.ts`의 `FEED_CATEGORY_ORDER`에 추가하세요.

### 변경 사항이 사이트에 반영되는 방식

- 페이지는 **30초 주기 ISR**로 갱신됩니다(서버 인스턴스별 글 목록 캐시 10초 포함). 수정 후 첫 방문이 재생성을 트리거하므로, 그 다음 방문부터 반영됩니다.
- 즉시 반영하려면:
  `https://j1w0n.vercel.app/api/revalidate?secret=<TOKEN_FOR_REVALIDATE>` (전체)
  `...&path=/JW-129` (특정 글)
- **Public → Private 전환** 시에는 전체 revalidate를 한 번 호출하세요. Private 글도 재생성 대상에 포함되기 때문에, 캐시된 공개본이 즉시 404로 바뀝니다.

---

## 2. 아직 코드로 관리하는 것

| 항목 | 파일 |
|---|---|
| 이름, 직함, 연락처, SNS | `site.config.ts` → `profile` |
| 학력, 경력(이력 섹션) | `site.config.ts` → `education`, `workExperience` |
| 한국어 번역(이력·About) | `src/constants/i18n.ts` |
| About 본문, 지표, 타임라인 | `src/constants/aboutContent.ts` |
| 홈 히어로 문구·지표 | `site.config.ts` → `hero` |
| 사이트 설명, 도메인 | `site.config.ts` → `blog`, `link` |

---

## 3. 보안 운영 체크리스트 (Notion·Vercel 설정)

코드로는 강제할 수 없는 항목입니다. 정기적으로 확인하세요.

1. **Notion "Share to Web"(웹에 게시)을 끄세요.** 이 블로그는 공식 API로 데이터를 가져오므로 웹 게시가 필요 없습니다. 켜져 있으면 Private 글과 하위 페이지가 블로그와 무관하게 `*.notion.site`에서 공개됩니다.
2. **Notion 통합(Integration)은 글 DB에만 연결하세요.** Personal & Editorial Knowledge Base나 다른 워크스페이스 페이지에는 연결하지 마세요. 권한은 읽기 전용(Read content)이면 충분합니다.
3. **Vercel 환경 변수**
   - `NOTION_API_KEY`, `NOTION_PAGE_ID`: 서버 전용입니다. `NEXT_PUBLIC_` 접두사를 붙이지 마세요.
   - `TOKEN_FOR_REVALIDATE`: **반드시 설정하세요.** 설정하지 않으면 revalidate API가 모든 요청을 거부합니다. 길고 무작위한 값을 쓰세요.
   - Preview 환경에도 같은 키가 필요합니다. 없으면 프리뷰의 글 목록이 비어 보입니다.

---

## 4. 향후 제안: 프로필과 경력을 Notion으로 옮기기

**권장안:** 글 DB와 별개로 `Site Profile` DB를 만들고, 같은 통합에 연결합니다.

| 행 타입 | 필드 예시 |
|---|---|
| `Experience` | org, role, employmentType, location, period, highlights, order |
| `Education` | institution, degree, period, courses, order |
| `Skill` / `Metric` | label, value, order |

- 빌드·ISR 시점에 이 DB를 읽고, 실패하면 `site.config.ts` 값으로 대체합니다. 장애가 나도 프로필이 사라지지 않습니다.
- 글 DB 스키마, slug, status는 바꾸지 않으므로 기존 글과 호환됩니다.
- About의 긴 내러티브(EN/KO)는 Notion 페이지 본문으로 옮길 수 있습니다. 다만 현재 디자인(섹션 번호, 지표 카드, 인용)이 블록 구조에 의존하므로, 프로필·경력 DB를 먼저 옮기고 내러티브는 다음 단계로 미루는 것을 권장합니다.
- 고정 글은 이미 Notion에서 관리됩니다(`tags`에 `Pinned`). 별도 `featured` 속성은 필요하지 않습니다.
