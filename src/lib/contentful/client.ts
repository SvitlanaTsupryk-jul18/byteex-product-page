import { resolveLinks, type EntriesResponse } from './resolveLinks'
import { entriesUrl } from './url'

const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID
const accessToken = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN
const environment = import.meta.env.VITE_CONTENTFUL_ENVIRONMENT || 'master'

export const isContentfulConfigured = Boolean(spaceId && accessToken)

/** Error returned by the Delivery API, e.g. `InvalidQuery` or `AccessTokenInvalid`. */
export class ContentfulError extends Error {
  readonly status: number
  readonly code: string
  readonly details: unknown

  constructor(status: number, code: string, details: unknown, message: string) {
    super(message)
    this.name = 'ContentfulError'
    this.status = status
    this.code = code
    this.details = details
  }
}

/**
 * Minimal Content Delivery API client: one GET request plus link resolution.
 * Replaces the official SDK (~115 KB with its dependencies) because the page
 * only needs a single query. The delivery token is read-only and public by design.
 */
export async function getEntries<T>(query: Record<string, string | number>): Promise<T[]> {
  if (!spaceId || !accessToken) {
    throw new Error('Contentful is not configured. Set VITE_CONTENTFUL_* variables in .env.')
  }

  const response = await fetch(entriesUrl({ spaceId, accessToken, environment }, query))
  const body = await response.json()
  if (!response.ok) {
    throw new ContentfulError(
      response.status,
      body?.sys?.id ?? 'Unknown',
      body?.details,
      body?.message ?? `Contentful request failed with status ${response.status}`,
    )
  }

  return resolveLinks(body as EntriesResponse) as T[]
}
