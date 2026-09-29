import { createClient, type ContentfulClientApi } from 'contentful'

const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID
const accessToken = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN
const environment = import.meta.env.VITE_CONTENTFUL_ENVIRONMENT || 'master'

export const isContentfulConfigured = Boolean(spaceId && accessToken)

let client: ContentfulClientApi<undefined> | undefined

/** Lazily creates a single Delivery API client. */
export function getContentfulClient(): ContentfulClientApi<undefined> {
  if (!spaceId || !accessToken) {
    throw new Error('Contentful is not configured. Set VITE_CONTENTFUL_* variables in .env.')
  }
  client ??= createClient({ space: spaceId, accessToken, environment })
  return client
}
