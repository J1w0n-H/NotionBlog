import { CONFIG } from "site.config"
import { Client } from "@notionhq/client"

// 새로운 공식 Notion SDK를 사용한 게시글 가져오기 (v2025-09-03)
export const getPostsV2 = async () => {
  try {
    console.log("=== Using Official Notion SDK v2025-09-03 ===")
    
    // 환경 변수에서 Notion 토큰 확인 (추후 설정 필요)
    const notionToken = process.env.NOTION_TOKEN
    if (!notionToken) {
      console.warn("NOTION_TOKEN not found. Please set it in Vercel environment variables.")
      return []
    }

    const pageId = CONFIG.notionConfig.pageId as string
    if (!pageId) {
      console.error("NOTION_PAGE_ID not found in environment variables")
      return []
    }

    console.log("Page ID:", pageId)
    console.log("Notion Token exists:", !!notionToken)

    // 공식 Notion 클라이언트 초기화 (새로운 API 버전)
    const notion = new Client({
      auth: notionToken,
      notionVersion: "2025-09-03",
    })

    // 1단계: 데이터베이스 정보 가져오기
    console.log("Fetching database info...")
    const databaseResponse = await notion.databases.retrieve({
      database_id: pageId,
    })

    console.log("Database response:", {
      id: databaseResponse.id,
      object: databaseResponse.object,
      // 다른 속성들 확인
    })

    // 2단계: 데이터베이스에서 페이지 목록 가져오기 (기존 방식으로 먼저 테스트)
    console.log("Querying database...")
    const queryResponse = await notion.databases.query({
      database_id: pageId,
    })

    console.log(`Found ${queryResponse.results.length} pages`)

    // 3단계: 각 페이지의 상세 정보 가져오기
    const posts = []
    for (const page of queryResponse.results) {
      try {
        console.log(`Processing page: ${page.id}`)
        
        // 페이지 상세 정보 가져오기
        const pageDetails = await notion.pages.retrieve({
          page_id: page.id,
        })

        // 페이지 속성 추출
        const properties = pageDetails.properties
        const post = {
          id: page.id,
          title: "Page Title", // 임시 제목
          createdTime: pageDetails.created_time,
          lastEditedTime: pageDetails.last_edited_time,
          properties: Object.keys(properties || {}),
        }

        posts.push(post)
      } catch (error) {
        console.error(`Failed to process page ${page.id}:`, error)
      }
    }

    console.log(`Successfully processed ${posts.length} posts`)
    return posts

  } catch (error) {
    console.error("Error in getPostsV2:", error)
    
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        name: error.name,
        stack: error.stack?.substring(0, 500)
      })
    }
    
    return []
  }
}
