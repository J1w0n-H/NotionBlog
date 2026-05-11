import { describe, expect, it } from "vitest"
import {
  extractNotionPropertyValue,
  mapNotionDatabasePage,
  type NotionSchemaByPropId,
} from "./mapNotionDatabasePage"

const TITLE_ID = "prop-title"
const SLUG_ID = "prop-slug"
const STATUS_ID = "prop-status"
const TYPE_ID = "prop-type"
const DATE_ID = "prop-date"
const TAGS_ID = "prop-tags"
const CATEGORY_ID = "prop-category"
const SUMMARY_ID = "prop-summary"

function fixtureSchema(): NotionSchemaByPropId {
  return new Map([
    [TITLE_ID, { name: "Title", type: "title" }],
    [SLUG_ID, { name: "Slug", type: "rich_text" }],
    [STATUS_ID, { name: "Status", type: "select" }],
    [TYPE_ID, { name: "Type", type: "select" }],
    [DATE_ID, { name: "Date", type: "date" }],
    [TAGS_ID, { name: "Tags", type: "multi_select" }],
    [CATEGORY_ID, { name: "Category", type: "multi_select" }],
    [SUMMARY_ID, { name: "Summary", type: "rich_text" }],
  ])
}

describe("extractNotionPropertyValue", () => {
  it("reads title and rich_text", () => {
    expect(
      extractNotionPropertyValue({
        title: [{ plain_text: "Hello" }],
      })
    ).toBe("Hello")
    expect(
      extractNotionPropertyValue({
        rich_text: [{ plain_text: "Summary line" }],
      })
    ).toBe("Summary line")
  })

  it("normalizes date objects", () => {
    expect(
      extractNotionPropertyValue({
        date: { start: "2024-06-01", end: null },
      })
    ).toEqual({ start_date: "2024-06-01" })
  })
})

describe("mapNotionDatabasePage", () => {
  it("maps schema-backed properties without default status or type", () => {
    const schema = fixtureSchema()
    const page = {
      id: "page-1",
      created_time: "2024-01-01T00:00:00.000Z",
      last_edited_time: "2024-02-01T00:00:00.000Z",
      properties: {
        [TITLE_ID]: { title: [{ plain_text: "Fixture post" }] },
        [SLUG_ID]: { rich_text: [{ plain_text: "fixture-post" }] },
        [STATUS_ID]: { select: { name: "Public" } },
        [TYPE_ID]: { select: { name: "Post" } },
        [DATE_ID]: { date: { start: "2024-06-01", end: null } },
        [TAGS_ID]: {
          multi_select: [{ name: "notion" }, { name: "vitest" }],
        },
        [CATEGORY_ID]: { multi_select: [{ name: "Dev" }] },
        [SUMMARY_ID]: { rich_text: [{ plain_text: "Short summary" }] },
      },
    }

    const mapped = mapNotionDatabasePage(page, schema)

    expect(mapped.id).toBe("page-1")
    expect(mapped.title).toBe("Fixture post")
    expect(mapped.slug).toBe("fixture-post")
    expect(mapped.status).toEqual(["Public"])
    expect(mapped.type).toEqual(["Post"])
    expect(mapped.date).toEqual({ start_date: "2024-06-01" })
    expect(mapped.tags).toEqual(["notion", "vitest"])
    expect(mapped.category).toEqual(["Dev"])
    expect(mapped.summary).toBe("Short summary")
    expect(mapped.fullWidth).toBe(false)
    expect(mapped.createdTime).toBe("2024-01-01T00:00:00.000Z")
  })

  it("falls back to page id when slug is missing", () => {
    const schema = new Map([
      [TITLE_ID, { name: "Title", type: "title" }],
    ])
    const page = {
      id: "page-without-slug",
      created_time: "2024-01-01T00:00:00.000Z",
      properties: {
        [TITLE_ID]: { title: [{ plain_text: "Untitled" }] },
      },
    }

    expect(mapNotionDatabasePage(page, schema).slug).toBe("page-without-slug")
  })

  it("uses page cover when no thumbnail column is mapped", () => {
    const schema = new Map([
      [TITLE_ID, { name: "Title", type: "title" }],
    ])
    const page = {
      id: "page-cover",
      created_time: "2024-01-01T00:00:00.000Z",
      properties: {
        [TITLE_ID]: { title: [{ plain_text: "Cover post" }] },
      },
      cover: {
        type: "external",
        external: { url: "https://example.com/cover.png" },
      },
    }

    expect(mapNotionDatabasePage(page, schema).thumbnail).toBe(
      "https://example.com/cover.png"
    )
  })
})
