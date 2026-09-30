/**
 * Data for search engines and link previews (Open Graph, Twitter, JSON-LD).
 * Pure functions, so the rules are unit tested and the component stays trivial.
 */
import type { Image, LandingPage } from '@/types/content'
import { imageUrl } from './image'

export const SITE_NAME = 'Byteex'

/** Size recommended by Facebook, LinkedIn and X for large link previews. */
export const SHARE_IMAGE_SIZE = { width: 1200, height: 630 } as const

/** Absolute site URL with a trailing slash, or undefined when not configured. */
export function normalizeSiteUrl(value: string | undefined): string | undefined {
  const trimmed = value?.trim()
  if (!trimmed) return undefined
  try {
    const url = new URL(trimmed)
    if (!url.pathname.endsWith('/')) url.pathname += '/'
    return url.toString()
  } catch {
    return undefined
  }
}

/** The hero photo represents the page best; otherwise the first image on the page. */
function pickShareImage(page: LandingPage): Image | undefined {
  const hero = page.sections.find((section) => section.type === 'hero')
  const candidates = [
    ...(hero?.images ?? []),
    ...page.sections.flatMap((section) => ('images' in section ? section.images : [])),
  ]
  return candidates.find((image) => image.url)
}

export interface ShareImage {
  url: string
  alt: string
  width: number
  height: number
}

export function shareImage(page: LandingPage): ShareImage | undefined {
  const image = pickShareImage(page)
  if (!image) return undefined
  return {
    url: imageUrl(image.url, { ...SHARE_IMAGE_SIZE, fit: 'fill', format: 'jpg', quality: 80 }),
    alt: image.alt,
    ...SHARE_IMAGE_SIZE,
  }
}

/**
 * schema.org graph: the organization, the website and this page.
 * No Product with ratings on purpose: Google requires real offer or review data
 * (price, rating value, review count), which the CMS does not hold yet.
 */
export function structuredData(page: LandingPage, siteUrl: string | undefined) {
  const id = (fragment: string) => `${siteUrl ?? ''}#${fragment}`
  const image = shareImage(page)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': id('organization'), name: SITE_NAME, url: siteUrl },
      {
        '@type': 'WebSite',
        '@id': id('website'),
        name: SITE_NAME,
        url: siteUrl,
        publisher: { '@id': id('organization') },
      },
      {
        '@type': 'WebPage',
        '@id': id('webpage'),
        name: page.seo.title,
        description: page.seo.description || undefined,
        url: siteUrl,
        isPartOf: { '@id': id('website') },
        primaryImageOfPage: image && { '@type': 'ImageObject', url: image.url },
      },
    ],
  }
}

/** JSON for an inline <script>; "<" is escaped so content can never close the tag. */
export const serializeJsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c')
