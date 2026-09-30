/**
 * Build-time prerender entry (see scripts/prerender.mjs).
 * Renders the page from the Contentful snapshot embedded in index.html,
 * so the first paint does not wait for JavaScript. The client then hydrates
 * the same markup, because its first render uses the same snapshot.
 */
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { LandingPageView } from './components/LandingPageView'
import { mapLandingPage } from './lib/contentful/mappers'
import { resolveLinks, type EntriesResponse } from './lib/contentful/resolveLinks'
import type { LandingPageSkeleton, ResolvedEntry } from './lib/contentful/skeletons'

export function renderSnapshot(json: string): string | undefined {
  const [entry] = resolveLinks(JSON.parse(json) as EntriesResponse)
  if (!entry) return undefined
  const page = mapLandingPage(entry as ResolvedEntry<LandingPageSkeleton>)
  return renderToString(
    <StrictMode>
      <LandingPageView page={page} />
    </StrictMode>,
  )
}
