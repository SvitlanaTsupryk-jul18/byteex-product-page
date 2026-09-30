// Relative imports on purpose: this file is also used by vite.config.ts (Node).
import { CONTENT_TYPE, LANDING_PAGE_SLUG } from './contentTypes.ts'

interface ContentfulConfig {
  spaceId: string
  accessToken: string
  environment: string
}

/** Link depth of the deepest path: page -> section -> testimonial -> avatar asset. */
export const INCLUDE_DEPTH = 4

export const landingPageQuery = (slug = LANDING_PAGE_SLUG) => ({
  content_type: CONTENT_TYPE.landingPage,
  'fields.slug': slug,
  include: INCLUDE_DEPTH,
  limit: 1,
})

/**
 * Delivery API entries URL. The token is a query parameter so the request is
 * a simple CORS GET (no preflight) and can be preloaded from index.html.
 * The app and the preload tag must build the exact same URL, hence one helper.
 */
export function entriesUrl(
  { spaceId, accessToken, environment }: ContentfulConfig,
  query: Record<string, string | number>,
): string {
  const url = new URL(
    `https://cdn.contentful.com/spaces/${spaceId}/environments/${environment}/entries`,
  )
  for (const [key, value] of Object.entries({ ...query, access_token: accessToken })) {
    url.searchParams.set(key, String(value))
  }
  return url.toString()
}
