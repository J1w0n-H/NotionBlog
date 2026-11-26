/**
 * Regression tests for content visibility (P0).
 *
 * Every public surface — feed, detail SSG, record-map API, sitemap,
 * revalidation — must agree on the same rules:
 *   Public          → feed + detail URL + sitemap
 *   PublicOnDetail  → detail URL + sitemap, never the feed
 *   Private / empty → nowhere (404 / absent)
 */
import { beforeEach, describe, expect, it, vi } from "vitest"
import { QueryClient } from "@tanstack/react-query"
import type { TPost } from "src/types"

const getPosts = vi.fn<() => Promise<TPost[]>>()
const getRecordMap = vi.fn()

vi.mock("src/apis", () => ({ getPosts, getRecordMap }))
vi.mock("next-sitemap", () => ({
  getServerSideSitemap: vi.fn((_ctx: unknown, fields: unknown) => ({ fields })),
}))

import { applyNotionPublicationGate } from "src/libs/postFilters"
import { resetPostCollectionsCache } from "src/libs/notion/fetchPublishedPosts"
import { prefetchSlugStaticProps } from "src/libs/notion/prefetchSlugStaticProps"
import { getDetailStaticPaths } from "src/libs/notion/getDetailStaticPaths"
import { queryKey } from "src/constants/queryKey"
import recordMapHandler from "src/pages/api/notion/record-map"
import revalidateHandler, { collectRevalidatePaths } from "src/pages/api/revalidate"
import { getServerSideProps as sitemapProps } from "src/pages/sitemap.xml"

const post = (overrides: Partial<TPost>): TPost => ({
  id: "id",
  slug: "slug",
  title: "Title",
  status: ["Public"],
  type: ["Post"],
  createdTime: "2025-01-01T00:00:00.000Z",
  date: { start_date: "2025-01-01" },
  fullWidth: false,
  ...overrides,
})

const PUBLIC = post({ id: "p-public", slug: "public-post" })
const DETAIL_ONLY = post({
  id: "p-detail",
  slug: "detail-only",
  status: ["PublicOnDetail"],
})
const PRIVATE = post({ id: "p-private", slug: "private-post", status: ["Private"] })
const NO_STATUS = post({
  id: "p-nostatus",
  slug: "no-status",
  status: undefined as unknown as TPost["status"],
})
const FUTURE = post({
  id: "p-future",
  slug: "future-post",
  date: { start_date: "2999-01-01" },
})
const ALL = [PUBLIC, DETAIL_ONLY, PRIVATE, NO_STATUS, FUTURE]

const usableRecordMap = (pageId: string) => ({
  block: { [pageId]: { value: { id: pageId, type: "page" } } },
})

function fakeRes() {
  const res: any = { statusCode: 200, headers: {} as Record<string, string> }
  res.status = vi.fn((code: number) => ((res.statusCode = code), res))
  res.json = vi.fn((body: unknown) => ((res.body = body), res))
  res.send = vi.fn((body: unknown) => ((res.body = body), res))
  res.setHeader = vi.fn((k: string, v: string) => (res.headers[k] = v))
  res.revalidate = vi.fn(async () => undefined)
  return res
}

beforeEach(() => {
  resetPostCollectionsCache()
  getPosts.mockReset().mockResolvedValue(ALL)
  getRecordMap.mockReset().mockImplementation(async (id: string) => usableRecordMap(id))
})

describe("publication gate", () => {
  it("feed contains only Public posts", () => {
    expect(applyNotionPublicationGate(ALL, "feed").map((p) => p.slug)).toEqual([
      "public-post",
    ])
  })

  it("detail adds PublicOnDetail but never Private, unset or future posts", () => {
    expect(applyNotionPublicationGate(ALL, "detail").map((p) => p.slug)).toEqual([
      "public-post",
      "detail-only",
    ])
  })
})

describe("detail pages (SSG)", () => {
  it("static paths never include Private posts and 404 unknown slugs", async () => {
    const { paths, fallback } = await getDetailStaticPaths()
    expect(paths).toEqual(["/public-post", "/detail-only"])
    expect(fallback).toBe("blocking")
  })

  it.each(["private-post", "no-status", "future-post"])(
    "returns null (→ notFound) and fetches no content for %s",
    async (slug) => {
      const client = new QueryClient()
      await expect(prefetchSlugStaticProps(client, slug)).resolves.toBeNull()
      expect(getRecordMap).not.toHaveBeenCalled()
      expect(client.getQueryData(queryKey.post(slug))).toBeUndefined()
    }
  )

  it("serves PublicOnDetail by URL", async () => {
    const client = new QueryClient()
    await expect(prefetchSlugStaticProps(client, "detail-only")).resolves.toMatchObject({
      id: "p-detail",
    })
  })

  it("dehydrated feed list on a detail page excludes non-feed posts", async () => {
    const client = new QueryClient()
    await prefetchSlugStaticProps(client, "detail-only")
    const feed = client.getQueryData<TPost[]>(queryKey.posts()) ?? []
    expect(feed.map((p) => p.slug)).toEqual(["public-post"])
  })
})

describe("/api/notion/record-map", () => {
  it.each(["p-private", "p-nostatus", "p-future", "not-a-post"])(
    "404s for %s without touching Notion content",
    async (pageId) => {
      const res = fakeRes()
      await recordMapHandler({ method: "GET", query: { pageId } } as any, res)
      expect(res.statusCode).toBe(404)
      expect(getRecordMap).not.toHaveBeenCalled()
    }
  )

  it("serves a Public post with a bounded CDN cache", async () => {
    const res = fakeRes()
    await recordMapHandler({ method: "GET", query: { pageId: "p-public" } } as any, res)
    expect(res.statusCode).toBe(200)
    expect(res.headers["Cache-Control"]).toMatch(/stale-while-revalidate=\d+/)
  })
})

describe("sitemap", () => {
  it("lists only detail-visible posts", async () => {
    const result: any = await sitemapProps({} as any)
    const locs: string[] = result.fields.map((f: { loc: string }) => f.loc)
    expect(locs.some((l) => l.endsWith("/public-post"))).toBe(true)
    expect(locs.some((l) => l.endsWith("/detail-only"))).toBe(true)
    for (const hidden of ["private-post", "no-status", "future-post"]) {
      expect(locs.some((l) => l.endsWith(`/${hidden}`))).toBe(false)
    }
  })
})

describe("revalidation", () => {
  it("rejects every request when the token env var is unset or wrong", async () => {
    vi.stubEnv("TOKEN_FOR_REVALIDATE", "")
    for (const secret of [undefined, ""]) {
      const res = fakeRes()
      await revalidateHandler({ query: { secret } } as any, res)
      expect(res.statusCode).toBe(401)
      expect(res.revalidate).not.toHaveBeenCalled()
    }
    vi.stubEnv("TOKEN_FOR_REVALIDATE", "real-token")
    const res = fakeRes()
    await revalidateHandler({ query: { secret: "guess" } } as any, res)
    expect(res.statusCode).toBe(401)
    vi.unstubAllEnvs()
  })

  it("includes Private slugs so a Public → Private switch evicts the cache", async () => {
    const paths = await collectRevalidatePaths()
    expect(paths).toContain("/")
    expect(paths).toContain("/private-post")
    expect(paths).toContain("/public-post")
  })

  it("tolerates paths that 404 during revalidation", async () => {
    vi.stubEnv("TOKEN_FOR_REVALIDATE", "t")
    const res = fakeRes()
    res.revalidate = vi.fn(async (p: string) => {
      if (p === "/private-post") throw new Error("404")
    })
    await revalidateHandler({ query: { secret: "t" } } as any, res)
    expect(res.body).toMatchObject({ revalidated: true, failed: 1 })
    vi.unstubAllEnvs()
  })
})
