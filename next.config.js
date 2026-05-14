module.exports = {
  // Some Notion detail pages are deeply nested (e.g. JW-132) and
  // `getRecordMap` walks children sequentially, so a single page can
  // take well over Next's 60s default during `next build`. Bumping the
  // ceiling avoids SIGTERM restarts and lets static export finish.
  // (Follow-up: cache `loadPublicPostCollections()` across pages and
  //  parallelise `fetchBlocksRecursively` to bring this back down.)
  staticPageGenerationTimeout: 300,
  images: {
    domains: ['www.notion.so', 'lh5.googleusercontent.com', 's3-us-west-2.amazonaws.com'],
  },
}
