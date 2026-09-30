import { describe, expect, it } from 'vitest'
import { resolveLinks, type Entity } from './resolveLinks'

const link = (linkType: 'Entry' | 'Asset', id: string) => ({ sys: { type: 'Link', linkType, id } })
const entry = (id: string, fields: Record<string, unknown>): Entity => ({
  sys: { id, type: 'Entry' },
  fields,
})

describe('resolveLinks', () => {
  it('replaces entry and asset links with included entities', () => {
    const [page] = resolveLinks({
      items: [entry('page', { hero: link('Entry', 'hero') })],
      includes: {
        Entry: [entry('hero', { image: link('Asset', 'img') })],
        Asset: [{ sys: { id: 'img', type: 'Asset' }, fields: { title: 'Photo' } }],
      },
    })

    const hero = page!.fields!.hero as Entity
    expect(hero.sys.id).toBe('hero')
    expect((hero.fields!.image as Entity).fields).toEqual({ title: 'Photo' })
  })

  it('drops links that cannot be resolved', () => {
    const [page] = resolveLinks({
      items: [
        entry('page', {
          single: link('Entry', 'missing'),
          list: [link('Entry', 'a'), link('Entry', 'missing')],
        }),
      ],
      includes: { Entry: [entry('a', {})] },
    })

    expect(page!.fields).not.toHaveProperty('single')
    expect((page!.fields!.list as Entity[]).map((e) => e.sys.id)).toEqual(['a'])
  })

  it('handles circular references', () => {
    const [a] = resolveLinks({
      items: [entry('a', { next: link('Entry', 'b') })],
      includes: { Entry: [entry('b', { next: link('Entry', 'a') })] },
    })

    const b = a!.fields!.next as Entity
    expect(b.fields!.next).toBe(a)
  })

  it('keeps plain values untouched', () => {
    const [page] = resolveLinks({ items: [entry('page', { title: 'Hi', tags: ['x', 'y'] })] })
    expect(page!.fields).toEqual({ title: 'Hi', tags: ['x', 'y'] })
  })
})
