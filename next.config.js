module.exports = {
  // Some Notion detail pages are deeply nested (e.g. JW-132) and
  // `getRecordMap` walks children sequentially, so a single page can
  // take well over Next's 60s default during `next build`. Bumping the
  // ceiling avoids SIGTERM restarts and lets static export finish.
  // (Follow-up: cache `loadPublicPostCollections()` across pages and
  //  parallelise `fetchBlocksRecursively` to bring this back down.)
  staticPageGenerationTimeout: 300,
  /* Notion/CDN URLs often fail or redirect in ways Next's optimizer dislikes; also
   * avoids hostname allowlist drift (e.g. img.notionusercontent.com). */
  images: {
    unoptimized: true,
    domains: [
      'www.notion.so',
      'notion.so',
      'img.notionusercontent.com',
      'images.unsplash.com',
      'lh3.googleusercontent.com',
      'lh4.googleusercontent.com',
      'lh5.googleusercontent.com',
      'lh6.googleusercontent.com',
      'prod-files-secure.s3.us-west-2.amazonaws.com',
      's3.us-west-2.amazonaws.com',
      's3-us-west-2.amazonaws.com',
    ],
  },
}
