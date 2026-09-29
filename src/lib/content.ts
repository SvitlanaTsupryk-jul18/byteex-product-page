/**
 * Single entry point for page content.
 * Reads from Contentful when it is configured, otherwise falls back to the
 * bundled seed content so the UI can be developed without credentials.
 */
import type { LandingPage } from '@/types/content'
import { fetchLandingPage } from './contentful/api'
import { isContentfulConfigured } from './contentful/client'

export type ContentSource = 'contentful' | 'local'

export const contentSource: ContentSource = isContentfulConfigured ? 'contentful' : 'local'

// Cache in-flight and resolved requests, so React StrictMode double effects
// and repeated mounts never trigger duplicate network calls.
const cache = new Map<string, Promise<LandingPage>>()

export function getLandingPage(slug: string): Promise<LandingPage> {
  let request = cache.get(slug)
  if (!request) {
    request = loadLandingPage(slug)
    // Do not cache failures, so the user can retry.
    request.catch(() => cache.delete(slug))
    cache.set(slug, request)
  }
  return request
}

async function loadLandingPage(slug: string): Promise<LandingPage> {
  if (contentSource === 'contentful') return fetchLandingPage(slug)

  if (import.meta.env.DEV) {
    console.info('[content] Contentful is not configured, using local seed content.')
  }
  // Dynamic import keeps the fallback content out of the main bundle.
  const { landingPageContent } = await import('@/content/landingPage')
  return landingPageContent
}
