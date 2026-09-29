import type { LandingPage } from '@/types/content'
import { getContentfulClient } from './client'
import { CONTENT_TYPE } from './contentTypes'
import { mapLandingPage } from './mappers'
import type { LandingPageSkeleton } from './skeletons'

/**
 * Link depth needed for the deepest path:
 * page -> section -> testimonial -> avatar asset.
 */
const INCLUDE_DEPTH = 4

export class ContentNotFoundError extends Error {
  constructor(slug: string) {
    super(`Landing page "${slug}" was not found in Contentful`)
    this.name = 'ContentNotFoundError'
  }
}

/** Fetches a landing page with all linked sections in a single request. */
export async function fetchLandingPage(slug: string): Promise<LandingPage> {
  const response =
    await getContentfulClient().withoutUnresolvableLinks.getEntries<LandingPageSkeleton>({
      content_type: CONTENT_TYPE.landingPage,
      'fields.slug': slug,
      include: INCLUDE_DEPTH,
      limit: 1,
    })

  const entry = response.items[0]
  if (!entry) throw new ContentNotFoundError(slug)
  return mapLandingPage(entry)
}
