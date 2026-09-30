import { describe, expect, it } from 'vitest'
import type { LandingPage } from '@/types/content'
import { normalizeSiteUrl, serializeJsonLd, shareImage, structuredData } from './seo'

const HERO_URL = 'https://images.ctfassets.net/space/hero/hash/hero.png'

const page = (sections: LandingPage['sections']): LandingPage => ({
  slug: 'home',
  seo: { title: 'Byteex', description: 'Loungewear' },
  announcements: [],
  ratingText: '',
  sections,
})

const faq = {
  type: 'faq' as const,
  id: 'faq',
  heading: 'FAQ',
  items: [],
  images: [{ id: 'faq', url: 'https://images.ctfassets.net/s/faq/h/faq.png', alt: 'FAQ' }],
}

const hero = {
  type: 'hero' as const,
  id: 'hero',
  heading: 'Hero',
  features: [],
  cta: { label: 'Shop', href: '#shop' },
  images: [{ id: 'hero', url: HERO_URL, alt: 'Woman in a robe' }],
  pressLogos: [],
}

describe('normalizeSiteUrl', () => {
  it('adds a trailing slash and rejects empty or invalid values', () => {
    expect(normalizeSiteUrl('https://user.github.io/repo')).toBe('https://user.github.io/repo/')
    expect(normalizeSiteUrl(' https://example.com/ ')).toBe('https://example.com/')
    expect(normalizeSiteUrl('')).toBeUndefined()
    expect(normalizeSiteUrl('not a url')).toBeUndefined()
  })
})

describe('shareImage', () => {
  it('prefers the hero photo, cropped to 1200 x 630 JPEG', () => {
    const image = shareImage(page([faq, hero]))!
    expect(image.alt).toBe('Woman in a robe')
    expect(Object.fromEntries(new URL(image.url).searchParams)).toMatchObject({
      fm: 'jpg',
      w: '1200',
      h: '630',
      fit: 'fill',
    })
  })

  it('falls back to any section image, or nothing', () => {
    expect(shareImage(page([faq]))!.url).toContain('/faq.png')
    expect(shareImage(page([]))).toBeUndefined()
  })
})

describe('structuredData', () => {
  it('links the page to the website and organization', () => {
    const data = structuredData(page([hero]), 'https://example.com/')
    const webPage = data['@graph'][2]!
    expect(webPage).toMatchObject({
      '@id': 'https://example.com/#webpage',
      url: 'https://example.com/',
      isPartOf: { '@id': 'https://example.com/#website' },
    })
  })

  it('serializes without a raw "<" that could close the script tag', () => {
    const json = serializeJsonLd({ text: '</script><script>alert(1)</script>' })
    expect(json).not.toContain('<')
    expect(JSON.parse(json)).toEqual({ text: '</script><script>alert(1)</script>' })
  })
})
