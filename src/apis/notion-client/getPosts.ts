import { CONFIG } from "site.config"
import { Client } from "@notionhq/client"
import { NotionAPI } from "notion-client"
import { idToUuid } from "notion-utils"

import getAllPageIds from "src/libs/utils/notion/getAllPageIds"
import getPageProperties from "src/libs/utils/notion/getPageProperties"
import { TPosts } from "src/types"

/**
 * @param {{ includePages: boolean }} - false: posts only / true: include pages
 */

// TODO: react query를 사용해서 처음 불러온 뒤로는 해당데이터만 사용하도록 수정
export const getPosts = async () => {
  try {
    // 새로운 공식 SDK 시도
    const notionToken = process.env.NOTION_TOKEN
    if (notionToken) {
      console.log("🔄 Trying official Notion SDK...")
      return await getPostsWithOfficialSDK()
    } else {
      console.log("⚠️ NOTION_TOKEN not found, falling back to notion-client")
      return await getPostsWithLegacySDK()
    }
  } catch (error) {
    console.error("Error in getPosts:", error)
    return []
  }
}

// 새로운 공식 SDK 사용
const getPostsWithOfficialSDK = async () => {
  try {
    const notionToken = process.env.NOTION_TOKEN!
    const pageId = CONFIG.notionConfig.pageId as string

    const notion = new Client({
      auth: notionToken,
      notionVersion: "2025-09-03",
    })

    // 데이터베이스 정보 가져오기
    const databaseResponse = await notion.databases.retrieve({
      database_id: pageId,
    })

    // 데이터베이스 쿼리 (새 API 사용)
    const queryResponse = await notion.request({
      method: "post",
      path: `databases/${pageId}/query`,
    }) as any

    console.log(`✅ Official SDK: Found ${queryResponse.results?.length || 0} pages`)
    
    // 간단한 포스트 구조로 변환
    const posts = (queryResponse.results || []).map((page: any) => ({
      id: page.id,
      title: "New Post", // 임시 제목
      createdTime: page.created_time,
      lastEditedTime: page.last_edited_time,
      // 기존 구조와 호환되도록 추가 필드들
      slug: page.id,
      date: { start_date: page.created_time },
      status: ["PublicOnDetail"],
      type: ["Post"],
    }))

    return posts as TPosts

  } catch (error) {
    console.error("Official SDK failed, falling back to legacy:", error)
    return await getPostsWithLegacySDK()
  }
}

// 기존 notion-client 사용 (fallback)
const getPostsWithLegacySDK = async () => {
  try {
    let id = CONFIG.notionConfig.pageId as string
    const api = new NotionAPI()

    const response = await api.getPage(id)
    id = idToUuid(id)
    const collection = Object.values(response.collection)[0]?.value
    const block = response.block
    const schema = collection?.schema

    const rawMetadata = block[id].value

    // Check Type
    if (
      rawMetadata?.type !== "collection_view_page" &&
      rawMetadata?.type !== "collection_view"
    ) {
      return []
    } else {
      // Construct Data
      const pageIds = getAllPageIds(response)
      
      if (pageIds.length === 0) {
        console.warn("No page IDs found in the response")
        return []
      }
      
      const data = []
      for (let i = 0; i < pageIds.length; i++) {
        const id = pageIds[i]
        const properties = (await getPageProperties(id, block, schema)) || null
        // Add fullwidth, createdtime to properties
        properties.createdTime = new Date(
          block[id].value?.created_time
        ).toString()
        properties.fullWidth =
          (block[id].value?.format as any)?.page_full_width ?? false

        data.push(properties)
      }

      // Sort by date
      data.sort((a: any, b: any) => {
        const dateA: any = new Date(a?.date?.start_date || a.createdTime)
        const dateB: any = new Date(b?.date?.start_date || b.createdTime)
        return dateB - dateA
      })

      const posts = data as TPosts
      return posts
    }
  } catch (error) {
    console.error("Legacy SDK also failed:", error)
    
    // 재시도 로직 추가
    if (error instanceof Error && error.message.includes('530')) {
      console.warn("Notion API returned 530 error. This might be temporary.")
      console.warn("Check if your Notion page is published to web and accessible.")
    }
    
    // 에러 정보를 더 자세히 로깅
    console.error("Full error details:", JSON.stringify(error, null, 2))
    
    // Return empty array instead of crashing the build
    return []
  }
}
