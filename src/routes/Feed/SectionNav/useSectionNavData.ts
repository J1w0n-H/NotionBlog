import { useCallback, useMemo } from "react"
import { DEFAULT_CATEGORY, NOTION_PINNED_TAG } from "src/constants"
import usePostsQuery from "src/hooks/usePostsQuery"
import { useFeedRouterFilters } from "src/hooks/useFeedRouterFilters"
import useLanguage from "src/hooks/useLanguage"
import { KO_NAV } from "src/constants/i18n"
import {
  filterPostsForFeedList,
  orderedCategoryTitles,
} from "src/routes/Feed/feedFilter"
import { RESUME_NAV_SECTIONS, RESUME_OWNED_CATEGORIES } from "src/constants/resumeSections"
import {
  getResumeNavSectionIds,
  getBackgroundEntryCount,
} from "src/routes/Feed/ResumeSections"

export type SectionNavData = {
  navCategories: string[]
  resumeNavItems: typeof RESUME_NAV_SECTIONS
  resumeSectionIds: string[]
  backgroundCount: number
  totalEntries: number
  hasPinnedSection: boolean
  countFor: (category: string) => number
  tr: (t: string) => string
}

export function useSectionNavData(q: string): SectionNavData {
  const posts = usePostsQuery()
  const { tag: currentTag, category: currentCategory, order } =
    useFeedRouterFilters()
  const [language] = useLanguage()
  const tr =
    language === "ko"
      ? (t: string) => KO_NAV[t] ?? t
      : (t: string) => t

  const filteredForGrouped = useMemo(
    () =>
      filterPostsForFeedList(posts, {
        q,
        tag: currentTag,
        category: currentCategory,
        order,
      }),
    [posts, q, currentTag, currentCategory, order]
  )

  const navCategories = useMemo(
    () =>
      orderedCategoryTitles(filteredForGrouped).filter(
        (c) => !RESUME_OWNED_CATEGORIES.has(c)
      ),
    [filteredForGrouped]
  )

  const resumeSectionIds = useMemo(() => getResumeNavSectionIds(), [])
  const resumeNavItems = useMemo(
    () => RESUME_NAV_SECTIONS.filter((s) => resumeSectionIds.includes(s.id)),
    [resumeSectionIds]
  )
  const backgroundCount = useMemo(() => getBackgroundEntryCount(), [])

  const postsForCount = useMemo(
    () =>
      filterPostsForFeedList(posts, {
        q,
        tag: currentTag,
        order,
        category: DEFAULT_CATEGORY,
      }),
    [posts, q, currentTag, order]
  )

  const totalEntries = useMemo(
    () => postsForCount.length + backgroundCount,
    [postsForCount, backgroundCount]
  )

  const countFor = useCallback(
    (categoryLabel: string) =>
      postsForCount.filter((p) => p.category?.includes(categoryLabel)).length,
    [postsForCount]
  )

  const hasPinnedSection = useMemo(() => {
    const baseFiltered = filterPostsForFeedList(posts, {
      q,
      tag: currentTag,
      category: DEFAULT_CATEGORY,
      order,
    })
    return baseFiltered.some((p) => p.tags?.includes(NOTION_PINNED_TAG))
  }, [posts, q, currentTag, order])

  return {
    navCategories,
    resumeNavItems,
    resumeSectionIds,
    backgroundCount,
    totalEntries,
    hasPinnedSection,
    countFor,
    tr,
  }
}
