import { NotionAPI } from "notion-client"

export const getRecordMap = async (pageId: string) => {
  const api = new NotionAPI()
  
  // 재시도 로직 추가 (최대 3회)
  let retryCount = 0
  const maxRetries = 3
  
  while (retryCount < maxRetries) {
    try {
      const recordMap = await api.getPage(pageId)
      return recordMap
    } catch (error) {
      retryCount++
      console.error(`getRecordMap attempt ${retryCount} failed for page ${pageId}:`, error)
      
      if (retryCount >= maxRetries) {
        console.error(`getRecordMap failed after ${maxRetries} attempts for page ${pageId}`)
        // 빌드 실패 방지를 위해 빈 recordMap 반환
        return {
          block: {},
          collection: {},
          collection_view: {},
          notion_user: {},
          signed_urls: {},
          preview_images: {}
        } as any
      }
      
      // 재시도 전 지연 (지수 백오프)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000))
    }
  }
  
  // 이론적으로 도달하지 않지만 타입 안전성을 위해
  return {
    block: {},
    collection: {},
    collection_view: {},
    notion_user: {},
    signed_urls: {},
    preview_images: {}
  } as any
}
