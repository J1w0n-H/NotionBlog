export const queryKey = {
  scheme: () => ["scheme"],
  language: () => ["language"],
  posts: () => ["posts"],
  tags: () => ["tags"],
  post: (slug: string) => ["post", slug],
  postRecordMap: (slug: string) => ["postRecordMap", slug],
}
