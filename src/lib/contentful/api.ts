import type { LandingPage } from '@/types/content'
import { ContentfulError, getEntries } from './client'
import { mapLandingPage } from './mappers'
import type { LandingPageSkeleton, ResolvedEntry } from './skeletons'
import { landingPageQuery } from './url'

export class ContentNotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ContentNotFoundError'
  }
}

/** An unknown content type means the model was never created in this space. */
function isMissingContentModel(error: unknown): boolean {
  return (
    error instanceof ContentfulError &&
    JSON.stringify(error.details ?? '').includes('unknownContentType')
  )
}

/** Fetches a landing page with all linked sections in a single request. */
export async function fetchLandingPage(slug: string): Promise<LandingPage> {
  let entries: ResolvedEntry<LandingPageSkeleton>[]
  try {
    entries = await getEntries<ResolvedEntry<LandingPageSkeleton>>(landingPageQuery(slug))
  } catch (error) {
    if (isMissingContentModel(error)) {
      throw new ContentNotFoundError(
        'The content model does not exist in this Contentful space yet. Run "npm run cms:setup" and "npm run cms:seed".',
      )
    }
    throw error
  }

  const entry = entries[0]
  if (!entry) {
    throw new ContentNotFoundError(
      `Landing page "${slug}" is not published in Contentful. Run "npm run cms:seed" or publish it in the web app.`,
    )
  }
  return mapLandingPage(entry)
}
