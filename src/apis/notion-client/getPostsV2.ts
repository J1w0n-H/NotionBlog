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

    // 1단계: 기본 연결 테스트 - 데이터베이스 정보 가져오기
    console.log("Testing basic connection...")
    
    try {
      const databaseResponse = await notion.databases.retrieve({
        database_id: pageId,
      })

      console.log("✅ Database connection successful!")
      console.log("Database info:", {
        id: databaseResponse.id,
        object: databaseResponse.object,
      })

      return [{
        id: "test-success",
        title: "✅ Connection Successful!",
        message: "Notion SDK v2025-09-03 is working!",
        databaseId: databaseResponse.id,
        timestamp: new Date().toISOString(),
      }]

    } catch (dbError) {
      console.error("❌ Database connection failed:", dbError)
      
      // 2단계: 페이지 직접 접근 시도
      console.log("Trying direct page access...")
      try {
        const pageResponse = await notion.pages.retrieve({
          page_id: pageId,
        })

        console.log("✅ Page access successful!")
        console.log("Page info:", {
          id: pageResponse.id,
          object: pageResponse.object,
        })

        return [{
          id: "page-access-success",
          title: "✅ Page Access Successful!",
          message: "Can access page directly, but database query failed",
          pageId: pageResponse.id,
          timestamp: new Date().toISOString(),
        }]

      } catch (pageError) {
        console.error("❌ Page access also failed:", pageError)
        
        return [{
          id: "connection-failed",
          title: "❌ Connection Failed",
          message: `Both database and page access failed. Check token and permissions.`,
          errors: {
            databaseError: dbError instanceof Error ? dbError.message : "Unknown",
            pageError: pageError instanceof Error ? pageError.message : "Unknown"
          },
          timestamp: new Date().toISOString(),
        }]
      }
    }

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
