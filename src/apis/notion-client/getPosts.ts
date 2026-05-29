import { CONFIG } from "site.config"
import { Client } from "@notionhq/client"
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

      if (prop.url) return prop.url
      return null
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
      if (key === 'status' || key === 'type') {
        if (typeof value === 'string') {
          convertedProps[key] = [value]
        } else {
          convertedProps[key] = value
        }
      } else {
        convertedProps[key] = value
      }
    })

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
    const dateA = new Date(a?.date?.start || a.createdTime).getTime()
    const dateB = new Date(b?.date?.start || b.createdTime).getTime()
    return dateB - dateA
  })

  return posts as TPosts
}

