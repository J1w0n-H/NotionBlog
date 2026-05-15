module.exports = {
  // Some Notion detail pages are deeply nested (e.g. JW-132) and
  // `getRecordMap` walks children sequentially, so a single page can
  // take well over Next's 60s default during `next build`. Bumping the
  // ceiling avoids SIGTERM restarts and lets static export finish.
  // (Follow-up: cache `loadPublicPostCollections()` across pages and
  //  parallelise `fetchBlocksRecursively` to bring this back down.)
  staticPageGenerationTimeout: 300,
  images: {
    /* Notion covers/thumbnails often redirect through notion.so, but file URLs
       can also surface direct S3 hosts — allow both for the image optimizer. */
    remotePatterns: [
      { protocol: 'https', hostname: 'www.notion.so', pathname: '/**' },
      { protocol: 'https', hostname: 'notion.so', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '/**' },
      { protocol: 'https', hostname: 'lh4.googleusercontent.com', pathname: '/**' },
      { protocol: 'https', hostname: 'lh5.googleusercontent.com', pathname: '/**' },
      { protocol: 'https', hostname: 'lh6.googleusercontent.com', pathname: '/**' },
      { protocol: 'https', hostname: '**.amazonaws.com', pathname: '/**' },
      { protocol: 'https', hostname: 's3-us-west-2.amazonaws.com', pathname: '/**' },
    ],
    domains: [
      'www.notion.so',
      'notion.so',
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
