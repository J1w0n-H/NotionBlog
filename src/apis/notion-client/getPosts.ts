import { CONFIG } from "site.config"
import { Client } from "@notionhq/client"
import { dedupeTagsForPost } from "src/libs/utils/normalizeTag"
import { customMapImageUrl } from "src/libs/utils/notion/customMapImageUrl"
import { TPosts } from "src/types"

/**
 * @param {{ includePages: boolean }} - false: posts only / true: include pages
 */

// TODO: react query를 사용해서 처음 불러온 뒤로는 해당데이터만 사용하도록 수정
export const getPosts = async () => {
  try {
    const notionToken = process.env.NOTION_API_KEY
    if (!notionToken) {
      console.warn("NOTION_API_KEY not found - returning empty posts array")
      return []
    }
    
    return await getPostsWithOfficialSDK()
  } catch (error) {
    console.error("Error in getPosts:", error)
    
    // Notion API 에러 시 빈 배열 반환하여 빌드 실패 방지
    if (error instanceof Error && error.message.includes('530')) {
      console.warn("Notion API 530 error - returning empty posts array to prevent build failure")
      return []
    }
    
    return []
  }
}

// 새로운 공식 SDK 사용
const getPostsWithOfficialSDK = async (): Promise<TPosts> => {
  const notionToken = process.env.NOTION_API_KEY!
  const databaseId = CONFIG.notionConfig.pageId as string

  if (!databaseId) {
    throw new Error("NOTION_PAGE_ID not configured")
  }

  const notion = new Client({
    auth: notionToken,
  })

  /** Notion page.props keys are UUIDs — map ↔ human column names via DB schema */
  let metaByPropId = new Map<string, { name: string; type: string }>()
  try {
    const dbResp = await notion.databases.retrieve({
      database_id: databaseId,
    })
    for (const propId of Object.keys(dbResp.properties)) {
      const sc = dbResp.properties[propId] as { name?: string; type?: string }
      metaByPropId.set(propId, {
        name: sc.name ?? propId,
        type: String(sc.type ?? ""),
      })
    }
  } catch {
    metaByPropId = new Map()
  }

  const queryResponse = await notion.databases.query({
    database_id: databaseId,
  })

  const posts = queryResponse.results.map((page: any) => {
    const props = page.properties || {}

    const extractPropertyValue = (prop: any): any => {
      if (!prop) return null

      if (prop.title && Array.isArray(prop.title)) {
        return prop.title.map((t: any) => t.plain_text || t.text?.content || '').join('')
      }

      if (prop.rich_text && Array.isArray(prop.rich_text)) {
        return prop.rich_text.map((t: any) => t.plain_text || t.text?.content || '').join('')
      }

      if (prop.date) return prop.date
      if (prop.select) return prop.select.name
      if (prop.multi_select && Array.isArray(prop.multi_select)) {
        return prop.multi_select.map((s: any) => s.name)
      }
      if (prop.number !== undefined) return prop.number
      if (prop.checkbox !== undefined) return prop.checkbox

      if (prop.files && Array.isArray(prop.files)) {
        const fileUrls = prop.files
          .map((file: any) => {
            if (file.type === 'external' && file.external?.url) return file.external.url
            if (file.type === 'file' && file.file?.url) return file.file.url
            return null
          })
          .filter(Boolean)

        return fileUrls.length > 0 ? fileUrls[0] : null
      }

      if (prop.formula) {
        if (prop.formula.type === "string") return prop.formula.string ?? null
        if (prop.formula.type === "boolean") return prop.formula.boolean ?? false
      }

      if (prop.url) return prop.url
      return null
    }

    const applySchemaAliases = (
      dest: Record<string, any>,
      rawProps: Record<string, any>
    ) => {
      for (const [propId, propVal] of Object.entries(rawProps)) {
        const meta = metaByPropId.get(propId)
        if (!meta) continue
        const rawLabel = meta.name.trim()
        const n = rawLabel.toLowerCase()
        const t = meta.type
        const v = extractPropertyValue(propVal)

        if (v == null) continue

        const isTagsColumn = /^tags?$/.test(n) || rawLabel === "태그"
        const isCategoryColumn =
          /^categor(?:y|ies)$/i.test(rawLabel) || rawLabel === "카테고리"

        if (t === "title" && typeof v === "string" && v) {
          dest.title = v
          continue
        }
        if (t === "date" && typeof v === "object" && v?.start_date) {
          dest.date = v
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
          continue
        }

        if (t === "multi_select") {
          const raw =
            typeof v === "string" ? [v] : Array.isArray(v) ? v : []
          const arr = raw.map(String).filter(Boolean)

          if (isTagsColumn) {
            dest.tags = [...(dest.tags ?? []), ...arr]
          } else if (isCategoryColumn) dest.category = arr
          continue
        }

        if (typeof v === "string" && /^(slug|path|pathname)$/.test(n)) {
          dest.slug = v
        }
      }
    }

    const convertedProps: any = {
      id: page.id,
      slug: page.id,
      createdTime: page.created_time,
      lastEditedTime: page.last_edited_time,
      status: ["Public"],
      type: ["Post"],
    }

    Object.keys(props).forEach((key) => {
      const value = extractPropertyValue(props[key])
      // status, type, category, tags must always be string[] per TPost.
      // Notion select properties return a plain string; wrap it here so
      // consumers can safely use array methods (e.g. category?.[0]).
      if (key === 'status' || key === 'type' || key === 'category' || key === 'tags') {
        if (typeof value === 'string') {
          convertedProps[key] = [value]
        } else {
          convertedProps[key] = value
        }
      } else {
        convertedProps[key] = value
      }
    })

    /** Fill `tags`, `category`, etc. using DB column names — fixes UUID-property keys only */
    if (metaByPropId.size > 0) applySchemaAliases(convertedProps, props)

    if (Array.isArray(convertedProps.tags) && convertedProps.tags.length > 0) {
      convertedProps.tags = dedupeTagsForPost(
        convertedProps.tags.map(String).filter(Boolean)
      )
    }

    let thumbnailUrl: string | null = null
    if (props.thumbnail) {
      const thumbnailValue = extractPropertyValue(props.thumbnail)
      if (thumbnailValue) thumbnailUrl = thumbnailValue
    }

    if (!thumbnailUrl && page.cover) {
      if (page.cover.type === 'external' && page.cover.external?.url) {
        thumbnailUrl = page.cover.external.url
      } else if (page.cover.type === 'file' && page.cover.file?.url) {
        thumbnailUrl = page.cover.file.url
      }
    }

    if (thumbnailUrl) {
      try {
        const fakeBlock = { id: page.id, parent_table: 'block' }
        convertedProps.thumbnail = customMapImageUrl(thumbnailUrl, fakeBlock as any)
      } catch (error) {
        convertedProps.thumbnail = thumbnailUrl
      }
    }

    return convertedProps
  })

  posts.sort((a: any, b: any) => {
    const dateA = new Date(a?.date?.start_date || a.createdTime).getTime()
    const dateB = new Date(b?.date?.start_date || b.createdTime).getTime()
    return dateB - dateA
  })

  return posts as TPosts
}

