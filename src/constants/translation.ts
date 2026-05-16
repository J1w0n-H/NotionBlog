// 번역 관련 상수들
export const TRANSLATION_CONFIG = {
  CACHE_SIZE: 500,
  BATCH_SIZE: 8,
  DELAY_BETWEEN_BATCHES: 100,
  API_TIMEOUT: 10000, // 10초
  CHUNK_SIZE: 1000, // 긴 텍스트 청킹 크기
} as const;

export const METADATA_PATTERNS = [
  /이\s*영어\s*텍스트를\s*한국어로\s*번역하세요\s*/gi,
  /이\s*한국어\s*텍스트를\s*영어로\s*번역하세요\s*/gi,
  /translate\s*this\s*english\s*text\s*to\s*korean\s*/gi,
  /translate\s*this\s*korean\s*text\s*to\s*english\s*/gi,
  /번역하세요\s*/gi,
  /translate\s*this\s*/gi,
  /translate\s*this\s*.+text\s*to\s*.+:\s*/gi,
  /^translate\s*this\s*.+text\s*to\s*.+:\s*/gmi,
] as const;