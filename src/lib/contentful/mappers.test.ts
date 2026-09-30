import { describe, expect, it } from 'vitest'
import { mapImage, mapLandingPage } from './mappers'
import type { LandingPageSkeleton, ResolvedAsset, ResolvedEntry } from './skeletons'

// Minimal fixtures shaped like resolved Delivery API responses.
const asset = (id: string, title = id) =>
  ({
    sys: { id, type: 'Asset' },
    fields: {
      title,
      file: {
        url: `//images.ctfassets.net/space/${id}/hash/${id}.png`,
        details: { image: { width: 800, height: 600 } },
      },
    },
  }) as unknown as ResolvedAsset

const section = (type: string, id: string, fields: Record<string, unknown>) => ({
  sys: { id, type: 'Entry', contentType: { sys: { id: type } } },
  fields,
})

const page = (sections: unknown[]) =>
  ({
    sys: { id: 'page-home', type: 'Entry' },
    fields: { title: 'Byteex', slug: 'home', ratingText: 'Over 500+', sections },
  }) as unknown as ResolvedEntry<LandingPageSkeleton>

describe('mapImage', () => {
  it('turns protocol-relative urls into https and keeps dimensions', () => {
    expect(mapImage(asset('hero', 'Hero photo'))).toEqual({
      id: 'hero',
      url: 'https://images.ctfassets.net/space/hero/hash/hero.png',
      alt: 'Hero photo',
      width: 800,
      height: 600,
    })
  })

  it('returns undefined for missing assets', () => {
    expect(mapImage(undefined)).toBeUndefined()
  })
})

describe('mapLandingPage', () => {
  it('maps page fields and falls back to empty values', () => {
    const result = mapLandingPage(page([]))
    expect(result).toMatchObject({
      slug: 'home',
      seo: { title: 'Byteex', description: '' },
      announcements: [],
      ratingText: 'Over 500+',
      sections: [],
    })
  })

  it('splits founder body into paragraphs on blank lines', () => {
    const result = mapLandingPage(
      page([
        section('founderSection', 'founder', { heading: 'Hi', body: 'One\n\nTwo\n  \nThree' }),
      ]),
    )
    expect(result.sections[0]).toMatchObject({
      type: 'founder',
      paragraphs: ['One', 'Two', 'Three'],
    })
  })

  it('builds the CTA only when both label and url exist', () => {
    const result = mapLandingPage(
      page([
        section('stepsSection', 'with', { heading: 'A', ctaLabel: 'Go', ctaUrl: '#shop' }),
        section('stepsSection', 'without', { heading: 'B', ctaLabel: 'Go' }),
      ]),
    )
    expect(result.sections.map((s) => ('cta' in s ? s.cta : null))).toEqual([
      { label: 'Go', href: '#shop' },
      undefined,
    ])
  })

  it('maps the separate mobile gallery of the reviews section', () => {
    const result = mapLandingPage(
      page([
        section('reviewsSection', 'reviews', {
          heading: 'Fans',
          gallery: [asset('ugc-1'), asset('ugc-2')],
          galleryMobile: [asset('ugc-2')],
        }),
      ]),
    )
    const reviews = result.sections[0]
    expect(reviews?.type).toBe('reviews')
    if (reviews?.type !== 'reviews') return
    expect(reviews.gallery.map((i) => i.id)).toEqual(['ugc-1', 'ugc-2'])
    expect(reviews.galleryMobile.map((i) => i.id)).toEqual(['ugc-2'])
  })

  it('skips sections of unknown types instead of failing', () => {
    const result = mapLandingPage(page([section('somethingNew', 'x', { heading: '?' })]))
    expect(result.sections).toEqual([])
  })
})
