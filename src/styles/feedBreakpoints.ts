/** Header profile / quick actions (RootLayout/Header). */
export const FEED_HEADER_PROFILE_MIN_PX = 768

/** Feed desktop grid: side nav, split post panel, column resize. */
export const FEED_DESKTOP_MIN_PX = 1024

export const feedHeaderProfileMinMedia = `@media (min-width: ${FEED_HEADER_PROFILE_MIN_PX}px)`
export const feedDesktopMinMedia = `@media (min-width: ${FEED_DESKTOP_MIN_PX}px)`
export const feedBelowDesktopMedia = `@media (max-width: ${FEED_DESKTOP_MIN_PX - 1}px)`
export const feedMobileOnlyMedia = `@media (max-width: ${FEED_HEADER_PROFILE_MIN_PX - 1}px)`
export const feedTabletOnlyMedia = `@media (min-width: ${FEED_HEADER_PROFILE_MIN_PX}px) and (max-width: ${FEED_DESKTOP_MIN_PX - 1}px)`

export const FEED_DESKTOP_LAYOUT_QUERY = `(min-width: ${FEED_DESKTOP_MIN_PX}px)`
