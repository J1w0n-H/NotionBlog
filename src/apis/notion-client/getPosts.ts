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
    const notionToken = process.env.NOTION_API_KEY
    if (notionToken) {
      console.log("🔄 Trying official Notion SDK...")
      return await getPostsWithOfficialSDK()
    } else {
      console.log("⚠️ NOTION_API_KEY not found, falling back to notion-client")
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
    const notionToken = process.env.NOTION_API_KEY!
    const databaseId = CONFIG.notionConfig.pageId as string

    const notion = new Client({
      auth: notionToken,
      notionVersion: "2025-09-03",
    })

    console.log("📡 Fetching database info...")
    
    // 1단계: 데이터베이스 정보 가져오기
    const databaseResponse = await notion.databases.retrieve({
      database_id: databaseId,
    }) as any

    console.log("Database retrieved:", databaseResponse.id)
    console.log("Data sources:", databaseResponse.data_sources)

    // 2단계: 첫 번째 data source ID 가져오기
    if (!databaseResponse.data_sources || databaseResponse.data_sources.length === 0) {
      console.error("No data sources found in database")
      throw new Error("No data sources in database")
    }

    const dataSourceId = databaseResponse.data_sources[0].id
    console.log("Using data source ID:", dataSourceId)

    // 3단계: data source 쿼리 (새 API의 핵심 변경사항!)
    const queryResponse = await (notion as any).dataSources.query({
      data_source_id: dataSourceId,
    })

    console.log(`✅ Official SDK: Found ${queryResponse.results.length} pages`)
    
    // 새 API 응답을 기존 구조로 변환
    const posts = queryResponse.results.map((page: any) => {
      const props = page.properties || {}
      
      // 각 property에서 실제 값 추출
      const extractPropertyValue = (prop: any) => {
        if (!prop) return null
        
        // title 타입
        if (prop.title && Array.isArray(prop.title)) {
          return prop.title.map((t: any) => t.plain_text || t.text?.content || '').join('')
        }
        
        // rich_text 타입
        if (prop.rich_text && Array.isArray(prop.rich_text)) {
          return prop.rich_text.map((t: any) => t.plain_text || t.text?.content || '').join('')
        }
        
        // date 타입
        if (prop.date) {
          return prop.date
        }
        
        // select 타입
        if (prop.select) {
          return [prop.select.name]
        }
        
        // multi_select 타입
        if (prop.multi_select && Array.isArray(prop.multi_select)) {
          return prop.multi_select.map((s: any) => s.name)
        }
        
        // number 타입
        if (prop.number !== undefined) {
          return prop.number
        }
        
       // checkbox 타입
       if (prop.checkbox !== undefined) {
         return prop.checkbox
       }
       
       // url 타입 (썸네일 등에 사용)
       if (prop.url) {
         return prop.url
       }
       
       // files 타입 (파일 업로드)
       if (prop.files && Array.isArray(prop.files)) {
         return prop.files.map((file: any) => {
           if (file.type === 'external' && file.external?.url) {
             return file.external.url
           } else if (file.type === 'file' && file.file?.url) {
             return file.file.url
           }
           return null
         }).filter(Boolean)
       }
       
       return null
      }

      // 썸네일 전용 추출 함수 (첫 번째 파일 URL만 반환)
      const extractThumbnailValue = (prop: any) => {
        if (!prop) return null
        
        // url 타입
        if (prop.url) {
          return prop.url
        }
        
        // files 타입 - 첫 번째 파일의 URL만 반환
        if (prop.files && Array.isArray(prop.files) && prop.files.length > 0) {
          const firstFile = prop.files[0]
          if (firstFile.type === 'external' && firstFile.external?.url) {
            return firstFile.external.url
          } else if (firstFile.type === 'file' && firstFile.file?.url) {
            return firstFile.file.url
          }
        }
        
        return null
      }
      
      // 모든 속성을 변환
       const convertedProps: any = {
         id: page.id,
         slug: page.id,
         createdTime: page.created_time,
         lastEditedTime: page.last_edited_time,
         // 필수 필드들 - 필터링을 통과하기 위해
         status: ["Public"], // 필터 조건: ["Public"]
         type: ["Post"],     // 필터 조건: ["Post"]
         fullWidth: false,   // 기본값
       }
       
      // properties 순회하며 변환
      Object.keys(props).forEach(key => {
        // thumbnail은 별도로 처리하므로 스킵
        if (key === 'thumbnail') {
          return
        }
        convertedProps[key] = extractPropertyValue(props[key])
      })
      
      // 썸네일 필드 처리
      // 1. cover 필드 확인 (페이지 커버)
      if (page.cover) {
        if (page.cover.type === 'external' && page.cover.external?.url) {
          convertedProps.thumbnail = page.cover.external.url
          console.log("🖼️ Using cover thumbnail:", page.cover.external.url)
        } else if (page.cover.type === 'file' && page.cover.file?.url) {
          convertedProps.thumbnail = page.cover.file.url
          console.log("🖼️ Using cover thumbnail:", page.cover.file.url)
        }
      }
      
     // 2. thumbnail property 확인 (데이터베이스 필드) - cover보다 우선
     if (props.thumbnail) {
       const thumbnailValue = extractThumbnailValue(props.thumbnail)
       console.log("🖼️ Thumbnail property found:", props.thumbnail)
       console.log("🖼️ Extracted thumbnail value:", thumbnailValue)
       if (thumbnailValue) {
         convertedProps.thumbnail = thumbnailValue
         console.log("🖼️ Setting thumbnail to:", thumbnailValue)
       }
     }
      
      // 최종 썸네일 값 로그
      console.log("🖼️ Final thumbnail for post:", page.id, "->", convertedProps.thumbnail)
       
       return convertedProps
    })

     // 디버깅: 실제 페이지 구조 확인
     console.log("🔍 Page structure sample:", JSON.stringify(queryResponse.results[0], null, 2))
     console.log("🔍 Properties structure:", JSON.stringify(queryResponse.results[0]?.properties, null, 2))
     console.log("🔍 Thumbnail property specifically:", JSON.stringify(queryResponse.results[0]?.properties?.thumbnail, null, 2))
     console.log("Converted posts sample:", JSON.stringify(posts[0], null, 2))
     return posts as TPosts

  } catch (error) {
    console.error("Official SDK failed, falling back to legacy:", error)
    if (error instanceof Error) {
      console.error("Error details:", error.message)
    }
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
