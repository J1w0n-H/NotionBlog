import type { TPosts } from "src/types"
import {
  filterPosts as applyNotionPublicationRules,
  type FilterPostsOptions,
} from "src/libs/utils/notion/filterPosts"

export type { FilterPostsOptions }

/**
 * 홈 피드 SSG·React Query에 올리는 글: 공개 Post만.
 * (`pages/index`, `getStaticProps` 기본)
 */
export const NOTION_PRESET_FEED: FilterPostsOptions = {
  acceptStatus: ["Public"],
  acceptType: ["Post"],
}

/**
 * 상세 경로·정적 props: Public / PublicOnDetail + Post / Paper / Page.
 * (`pages/[slug]` — 기존 `filter` 객체와 동일)
 */
export const NOTION_PRESET_DETAIL: FilterPostsOptions = {
  acceptStatus: ["Public", "PublicOnDetail"],
  acceptType: ["Paper", "Post", "Page"],
}

export type NotionPublicationPreset = "feed" | "detail"

const PRESET_MAP: Record<NotionPublicationPreset, FilterPostsOptions> = {
  feed: NOTION_PRESET_FEED,
  detail: NOTION_PRESET_DETAIL,
}

/**
 * 노션에서 받은 원시 목록에 대한 **서버 게이트** (제목·slug·날짜·status·type).
 * URL의 `tag` / `category` / 검색어는 여기서 다루지 않음 → `feedFilter.filterPostsForFeedList`.
 */
export function applyNotionPublicationGate(
  posts: TPosts,
  preset: NotionPublicationPreset | FilterPostsOptions = "feed"
): TPosts {
  const options = typeof preset === "string" ? PRESET_MAP[preset] : preset
  return applyNotionPublicationRules(posts, options)
}
