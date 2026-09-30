/**
 * Resolves `{ sys: { type: 'Link' } }` references in a Content Delivery API
 * response against its `includes`, the same way the official SDK does with
 * `withoutUnresolvableLinks`: missing or unpublished targets are dropped.
 */

interface Sys {
  id: string
  type: string
  linkType?: 'Entry' | 'Asset'
}

export interface Entity {
  sys: Sys
  fields?: Record<string, unknown>
}

export interface EntriesResponse {
  items: Entity[]
  includes?: { Entry?: Entity[]; Asset?: Entity[] }
}

const isLink = (value: unknown): value is { sys: Sys } =>
  typeof value === 'object' && value !== null && (value as { sys?: Sys }).sys?.type === 'Link'

export function resolveLinks(response: EntriesResponse): Entity[] {
  const lookup = new Map<string, Entity>()
  for (const entry of [...response.items, ...(response.includes?.Entry ?? [])]) {
    lookup.set(`Entry:${entry.sys.id}`, entry)
  }
  for (const asset of response.includes?.Asset ?? []) {
    lookup.set(`Asset:${asset.sys.id}`, asset)
  }

  // Each entity is copied once, so circular references stay finite.
  const resolved = new Map<Entity, Entity>()

  const resolveValue = (value: unknown): unknown => {
    if (Array.isArray(value)) {
      return value.map(resolveValue).filter((item) => item !== undefined)
    }
    if (isLink(value)) {
      const target = lookup.get(`${value.sys.linkType}:${value.sys.id}`)
      return target ? resolveEntity(target) : undefined
    }
    return value
  }

  const resolveEntity = (entity: Entity): Entity => {
    const cached = resolved.get(entity)
    if (cached) return cached

    const fields: Record<string, unknown> = {}
    const copy: Entity = { ...entity, fields }
    resolved.set(entity, copy)

    for (const [key, value] of Object.entries(entity.fields ?? {})) {
      const result = resolveValue(value)
      if (result !== undefined) fields[key] = result
    }
    return copy
  }

  return response.items.map(resolveEntity)
}
