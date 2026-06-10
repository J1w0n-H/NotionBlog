// Notion API 타입 정의
export interface NotionDatabaseResponse {
  data_sources?: Array<{ id: string; type?: string }>;
  [key: string]: any;
}

export interface NotionPageResult {
  id: string;
  properties: Record<string, any>;
  cover?: {
    type: 'external' | 'file';
    external?: { url: string };
    file?: { url: string };
  };
  created_time: string;
  last_edited_time: string;
}

export interface NotionQueryResponse {
  results: NotionPageResult[];
}