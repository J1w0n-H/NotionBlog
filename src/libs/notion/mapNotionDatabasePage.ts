import { dedupeTagsForPost } from "src/libs/utils/normalizeTag"
import { customMapImageUrl } from "src/libs/utils/notion/customMapImageUrl"
import { normalizeNotionDate } from "src/libs/utils/notion/normalizeNotionDate"
import type { TPost } from "src/types"

export type NotionPropertyMeta = {
  name: string
  type: string
}

export type NotionSchemaByPropId = Map<string, NotionPropertyMeta>

export function extractNotionPropertyValue(prop: unknown): unknown {
  if (!prop || typeof prop !== "object") return null
  const p = prop as Record<string, unknown>

  if (Array.isArray(p.title)) {
    return (p.title as Array<{ plain_text?: string; text?: { content?: string } }>)
      .map((t) => t.plain_text || t.text?.content || "")
      .join("")
  }

  if (Array.isArray(p.rich_text)) {
    return (p.rich_text as Array<{ plain_text?: string; text?: { content?: string } }>)
      .map((t) => t.plain_text || t.text?.content || "")
      .join("")
  }

  if (p.date) return normalizeNotionDate(p.date)
  if (p.select && typeof p.select === "object" && p.select !== null) {
    return (p.select as { name?: string }).name ?? null
  }
  if (Array.isArray(p.multi_select)) {
    return (p.multi_select as Array<{ name?: string }>).map((s) => s.name)
  }
  if (typeof p.number === "number") return p.number
  if (typeof p.checkbox === "boolean") return p.checkbox

  if (Array.isArray(p.files)) {
    const fileUrls = (p.files as Array<{
      type?: string
      external?: { url?: string }
      file?: { url?: string }
    }>)
      .map((file) => {
        if (file.type === "external" && file.external?.url) return file.external.url
        if (file.type === "file" && file.file?.url) return file.file.url
        return null
      })
      .filter(Boolean)
    return fileUrls.length > 0 ? fileUrls[0] : null
  }

  if (p.formula && typeof p.formula === "object" && p.formula !== null) {
    const formula = p.formula as { type?: string; string?: string | null; boolean?: boolean }
    if (formula.type === "string") return formula.string ?? null
    if (formula.type === "boolean") return formula.boolean ?? false
  }

  if (typeof p.url === "string") return p.url
  return null
}

function applySchemaAliases(
  dest: Record<string, unknown>,
  rawProps: Record<string, unknown>,
  metaByPropId: NotionSchemaByPropId
) {
  for (const [propId, propVal] of Object.entries(rawProps)) {
    const meta = metaByPropId.get(propId)
    if (!meta) continue
    const rawLabel = meta.name.trim()
    const n = rawLabel.toLowerCase()
    const t = meta.type
    const v = extractNotionPropertyValue(propVal)

    if (v == null) continue

    const isTagsColumn = /^tags?$/.test(n) || rawLabel === "태그"
    const isCategoryColumn =
      /^categor(?:y|ies)$/i.test(rawLabel) || rawLabel === "카테고리"

    if (t === "title" && typeof v === "string" && v) {
      dest.title = v
      continue
    }
    if (t === "date") {
      const normalized = normalizeNotionDate(v)
      if (normalized) dest.date = normalized
      continue
    }
    if (t === "rich_text" && (n === "summary" || n === "excerpt")) {
      dest.summary = typeof v === "string" ? v : String(v ?? "")
      continue
    }

    if (t === "select") {
      if (typeof v !== "string") continue
      if (n === "status") dest.status = [v]
      else if (n === "type") dest.type = [v]
      else if (isCategoryColumn) dest.category = [v]
      else if (/^(slug|path|pathname)$/.test(n)) dest.slug = v
      else if (/^lang(uage)?$|^언어$/.test(n)) dest.lang = v
      continue
    }

    if (t === "multi_select") {
      const raw = typeof v === "string" ? [v] : Array.isArray(v) ? v : []
      const arr = raw.map(String).filter(Boolean)

      if (isTagsColumn) {
        const prev = Array.isArray(dest.tags) ? (dest.tags as string[]) : []
        dest.tags = [...prev, ...arr]
      } else if (isCategoryColumn) {
        dest.category = arr
      }
      continue
    }

    if (typeof v === "string" && /^(slug|path|pathname)$/.test(n)) {
      dest.slug = v
    }
  }
}

type NotionPageLike = {
  id: string
  created_time: string
  last_edited_time?: string
  properties?: Record<string, unknown>
  cover?: {
    type?: string
    external?: { url?: string }
    file?: { url?: string }
  }
}

export function mapNotionDatabasePage(
  page: NotionPageLike,
  metaByPropId: NotionSchemaByPropId
): TPost {
  const props = page.properties ?? {}
  const mapped: Record<string, unknown> = {
    id: page.id,
    slug: page.id,
    createdTime: page.created_time,
    fullWidth: false,
  }

  if (page.last_edited_time) {
    mapped.lastEditedTime = page.last_edited_time
  }

  if (metaByPropId.size > 0) {
    applySchemaAliases(mapped, props, metaByPropId)
  }

  if (Array.isArray(mapped.tags) && mapped.tags.length > 0) {
    mapped.tags = dedupeTagsForPost(mapped.tags.map(String).filter(Boolean))
  }

  if (typeof mapped.slug !== "string" || !mapped.slug.trim()) {
    mapped.slug = page.id
  }

  let thumbnailUrl: string | null = null
  for (const [propId, propVal] of Object.entries(props)) {
    const meta = metaByPropId.get(propId)
    if (meta?.type === "files" && /^thumbnail$/i.test(meta.name.trim())) {
      const value = extractNotionPropertyValue(propVal)
      if (typeof value === "string") thumbnailUrl = value
    }
  }

  if (!thumbnailUrl && page.cover) {
    if (page.cover.type === "external" && page.cover.external?.url) {
      thumbnailUrl = page.cover.external.url
    } else if (page.cover.type === "file" && page.cover.file?.url) {
      thumbnailUrl = page.cover.file.url
    }
  }

  if (thumbnailUrl) {
    try {
      const fakeBlock = { id: page.id, parent_table: "block" }
      mapped.thumbnail = customMapImageUrl(thumbnailUrl, fakeBlock as never)
    } catch {
      mapped.thumbnail = thumbnailUrl
    }
  }

  return mapped as TPost
}
