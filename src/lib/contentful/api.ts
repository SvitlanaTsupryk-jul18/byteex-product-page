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
  constructor(message: string) {
    super(message)
    this.name = 'ContentNotFoundError'
  }
}

/**
 * The Contentful SDK serialises API error details into `error.message` as JSON.
 * An unknown content type means the model was never created in this space.
 */
function isMissingContentModel(error: unknown): boolean {
  return error instanceof Error && error.message.includes('unknownContentType')
}

/** Fetches a landing page with all linked sections in a single request. */
export async function fetchLandingPage(slug: string): Promise<LandingPage> {
  let response
  try {
    response = await getContentfulClient().withoutUnresolvableLinks.getEntries<LandingPageSkeleton>(
      {
        content_type: CONTENT_TYPE.landingPage,
        'fields.slug': slug,
        include: INCLUDE_DEPTH,
        limit: 1,
      },
    )
  } catch (error) {
    if (isMissingContentModel(error)) {
      throw new ContentNotFoundError(
        'The content model does not exist in this Contentful space yet. Run "npm run cms:setup" and "npm run cms:seed".',
      )
    }
    throw error
  }

  const entry = response.items[0]
  if (!entry) {
    throw new ContentNotFoundError(
      `Landing page "${slug}" is not published in Contentful. Run "npm run cms:seed" or publish it in the web app.`,
    )
  }
  return mapLandingPage(entry)
}
