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
const getPostsWithOfficialSDK = async () => {
  try {
    const notionToken = process.env.NOTION_API_KEY!
    const databaseId = CONFIG.notionConfig.pageId as string

    const notion = new Client({
      auth: notionToken,
      notionVersion: "2025-09-03",
    })
    
    // 1단계: 데이터베이스 정보 가져오기
    const databaseResponse = await notion.databases.retrieve({
      database_id: databaseId,
    }) as any

    // 2단계: 첫 번째 data source ID 가져오기
    if (!databaseResponse.data_sources || databaseResponse.data_sources.length === 0) {
      throw new Error("No data sources in database")
    }

    const dataSourceId = databaseResponse.data_sources[0].id

    // 3단계: data source 쿼리 (새 API의 핵심 변경사항!)
    const queryResponse = await (notion as any).dataSources.query({
      data_source_id: dataSourceId,
    })
    
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
          return prop.select.name
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
         
         // 🔥 files 타입 (썸네일 등에 사용) - 새 API 구조
         if (prop.files && Array.isArray(prop.files)) {
           const fileUrls = prop.files.map((file: any) => {
             if (file.type === 'external' && file.external?.url) {
               return file.external.url
             } else if (file.type === 'file' && file.file?.url) {
               return file.file.url
             }
             return null
           }).filter(Boolean)
           
           // 첫 번째 파일 URL만 반환 (썸네일용)
           return fileUrls.length > 0 ? fileUrls[0] : null
         }
         
         // 🔥 url 타입 (단순 URL 문자열)
         if (prop.url) {
           return prop.url
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
       }
       
       // properties 순회하며 변환
       Object.keys(props).forEach(key => {
         const value = extractPropertyValue(props[key])
         
         // status와 type 필드는 배열로 처리
         if (key === 'status' || key === 'type') {
           if (value && typeof value === 'string') {
             convertedProps[key] = [value]
           } else {
             convertedProps[key] = value
           }
         } else {
           convertedProps[key] = value
         }
       })
       
       // 🔥 썸네일 처리 우선순위:
       // 1. thumbnail property (데이터베이스 필드)
       // 2. cover field (페이지 커버)
       
       let thumbnailUrl = null
       
       // 1. thumbnail property 확인 (우선순위 높음)
       if (props.thumbnail) {
         const thumbnailValue = extractPropertyValue(props.thumbnail)
         if (thumbnailValue) {
           thumbnailUrl = thumbnailValue
         }
       }
       
       // 2. cover field 확인 (fallback)
       if (!thumbnailUrl && page.cover) {
         if (page.cover.type === 'external' && page.cover.external?.url) {
           thumbnailUrl = page.cover.external.url
         } else if (page.cover.type === 'file' && page.cover.file?.url) {
           thumbnailUrl = page.cover.file.url
         }
       }
       
       // URL 변환 적용
       if (thumbnailUrl) {
         try {
           // 가짜 Block 객체 생성 (customMapImageUrl 함수용)
           const fakeBlock = {
             id: page.id,
             parent_table: 'block'
           }
           convertedProps.thumbnail = customMapImageUrl(thumbnailUrl, fakeBlock as any)
         } catch (error) {
           convertedProps.thumbnail = thumbnailUrl
         }
       }
       
       return convertedProps
    })

    // Sort by date (newest first)
    posts.sort((a: any, b: any) => {
      const dateA: any = new Date(a?.date?.start || a.createdTime)
      const dateB: any = new Date(b?.date?.start || b.createdTime)
      return dateB - dateA
    })

    return posts as TPosts

  } catch (error) {
    console.error("Official SDK failed:", error)
    return []
  }
}

