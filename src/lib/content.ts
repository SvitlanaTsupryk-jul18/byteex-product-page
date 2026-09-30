/**
 * Single entry point for page content.
 * Reads from Contentful when it is configured, otherwise falls back to the
 * bundled seed content so the UI can be developed without credentials.
 */
import type { LandingPage } from '@/types/content'
import { fetchLandingPage } from './contentful/api'
import { isContentfulConfigured } from './contentful/client'
import { mapLandingPage } from './contentful/mappers'
import { resolveLinks, type EntriesResponse } from './contentful/resolveLinks'
import type { LandingPageSkeleton, ResolvedEntry } from './contentful/skeletons'
import { SNAPSHOT_ELEMENT_ID } from './contentful/url'

export type ContentSource = 'contentful' | 'local'

export const contentSource: ContentSource = isContentfulConfigured ? 'contentful' : 'local'

// Cache in-flight and resolved requests, so React StrictMode double effects
// and repeated mounts never trigger duplicate network calls.
const cache = new Map<string, Promise<LandingPage>>()

/**
 * Page content embedded into index.html at build time (see scripts/vite/contentful-html.ts).
 * Lets the first render skip the network; fresh content is fetched right after.
 */
export function getSnapshotPage(): LandingPage | undefined {
  if (contentSource !== 'contentful') return undefined
  const json = document.getElementById(SNAPSHOT_ELEMENT_ID)?.textContent
  if (!json) return undefined
  try {
    const [entry] = resolveLinks(JSON.parse(json) as EntriesResponse)
    return entry ? mapLandingPage(entry as ResolvedEntry<LandingPageSkeleton>) : undefined
  } catch {
    return undefined
  }
}

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
