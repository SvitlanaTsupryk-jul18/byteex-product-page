import { describe, expect, it } from 'vitest'
import { imageSrcSet, imageUrl } from './image'

const CTF = 'https://images.ctfassets.net/space/id/hash/photo.jpg'

describe('imageUrl', () => {
  it('adds WebP, quality and size params for Contentful images', () => {
    const url = new URL(imageUrl(CTF, { width: 400.4, height: 300, fit: 'fill' }))
    expect(Object.fromEntries(url.searchParams)).toEqual({
      fm: 'webp',
      q: '75',
      w: '400',
      h: '300',
      fit: 'fill',
    })
  })

  it('leaves other hosts and SVG files untouched', () => {
    expect(imageUrl('https://example.com/a.jpg', { width: 100 })).toBe('https://example.com/a.jpg')
    const svg = 'https://images.ctfassets.net/space/id/hash/logo.svg'
    expect(imageUrl(svg, { width: 100 })).toBe(svg)
  })
})

describe('imageSrcSet', () => {
  it('never upscales past the source width', () => {
    const widths = imageSrcSet(CTF, 700)!
      .split(', ')
      .map((candidate) => Number(candidate.split(' ')[1]!.replace('w', '')))
    expect(widths).toEqual([320, 480, 640, 700])
  })

  it('returns undefined for non-Contentful images', () => {
    expect(imageSrcSet('https://example.com/a.jpg', 700)).toBeUndefined()
  })
})
