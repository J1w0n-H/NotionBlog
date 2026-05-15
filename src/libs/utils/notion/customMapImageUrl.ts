import { Block } from 'notion-types'

export const customMapImageUrl = (url: string, block: Block): string => {
  if (!url) {
    throw new Error("URL can't be empty")
  }

  if (url.startsWith('data:')) {
    return url
  }

  // more recent versions of notion don't proxy unsplash images
  if (url.startsWith('https://images.unsplash.com')) {
    return url
  }

  /* Already a Notion proxy URL — never double-wrap; only fill missing params so we
   * do not overwrite Notion's id/table (that broke valid image URLs). */
  if (/^https:\/\/(www\.)?notion\.so\/image\//i.test(url)) {
    try {
      const notionImageUrlV2 = new URL(url)
      let table = block.parent_table === 'space' ? 'block' : block.parent_table
      if (table === 'collection' || table === 'team') {
        table = 'block'
      }
      if (!notionImageUrlV2.searchParams.get('table')) {
        notionImageUrlV2.searchParams.set('table', table)
      }
      if (!notionImageUrlV2.searchParams.get('id')) {
        notionImageUrlV2.searchParams.set('id', block.id)
      }
      if (!notionImageUrlV2.searchParams.get('cache')) {
        notionImageUrlV2.searchParams.set('cache', 'v2')
      }
      return notionImageUrlV2.toString()
    } catch {
      return url
    }
  }

  if (url.startsWith('/images')) {
    url = `https://www.notion.so${url}`
  }

  url = `https://www.notion.so${
    url.startsWith('/image') ? url : `/image/${encodeURIComponent(url)}`
  }`

  const notionImageUrlV2 = new URL(url)
  let table = block.parent_table === 'space' ? 'block' : block.parent_table
  if (table === 'collection' || table === 'team') {
    table = 'block'
  }
  notionImageUrlV2.searchParams.set('table', table)
  notionImageUrlV2.searchParams.set('id', block.id)
  notionImageUrlV2.searchParams.set('cache', 'v2')

  url = notionImageUrlV2.toString()

  return url
}
