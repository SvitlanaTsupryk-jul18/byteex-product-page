/**
 * Seeds Contentful with the initial landing page content from
 * src/content/landingPage.ts. Entry and asset ids are deterministic,
 * so running it again updates existing entries instead of duplicating them.
 *
 * Images: put files into scripts/contentful/images/ named after the image id
 * (e.g. hero-1.jpg). Missing files are skipped; existing assets are reused.
 *
 * Usage: npm run cms:seed
 */
import { createReadStream, existsSync } from 'node:fs'
import { extname, join } from 'node:path'
import type { AssetProps } from 'contentful-management'
import { landingPageContent } from '../../src/content/landingPage.ts'
import {
  CONTENT_TYPE,
  DEFAULT_LOCALE,
  SECTION_CONTENT_TYPE,
} from '../../src/lib/contentful/contentTypes.ts'
import type {
  Cta,
  FaqItem,
  Feature,
  Image,
  Product,
  Section,
  Testimonial,
} from '../../src/types/content.ts'
import { createManagementClient, isNotFound } from './client.ts'

const client = createManagementClient()
const IMAGES_DIR = join(import.meta.dirname, 'images')
const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
}

type Link = { sys: { type: 'Link'; linkType: 'Entry' | 'Asset'; id: string } }
type FieldValues = Record<string, unknown>

const link = (linkType: Link['sys']['linkType'], id: string): Link => ({
  sys: { type: 'Link', linkType, id },
})

/** Wraps values into the { 'en-US': value } shape and drops empty ones. */
function localize(fields: FieldValues) {
  return Object.fromEntries(
    Object.entries(fields)
      .filter(([, value]) => value !== undefined && !(Array.isArray(value) && value.length === 0))
      .map(([key, value]) => [key, { [DEFAULT_LOCALE]: value }]),
  )
}

// ---------- assets ----------

function findImageFile(id: string): string | undefined {
  return Object.keys(MIME_TYPES)
    .map((ext) => join(IMAGES_DIR, `${id}${ext}`))
    .find((path) => existsSync(path))
}

async function getAsset(assetId: string): Promise<AssetProps | undefined> {
  try {
    return await client.asset.get({ assetId })
  } catch (error) {
    if (isNotFound(error)) return undefined
    throw error
  }
}

/** Returns a link to the asset, or undefined when there is nothing to link. */
async function upsertAsset(image: Image | undefined): Promise<Link | undefined> {
  if (!image) return undefined
  if (await getAsset(image.id)) return link('Asset', image.id)

  const filePath = findImageFile(image.id)
  if (!filePath) return undefined

  const ext = extname(filePath)
  const upload = await client.upload.create({}, { file: createReadStream(filePath) })
  const draft = await client.asset.createWithId(
    { assetId: image.id },
    {
      fields: {
        title: { [DEFAULT_LOCALE]: image.alt },
        description: { [DEFAULT_LOCALE]: image.alt },
        file: {
          [DEFAULT_LOCALE]: {
            contentType: MIME_TYPES[ext] ?? 'application/octet-stream',
            fileName: `${image.id}${ext}`,
            uploadFrom: { sys: { type: 'Link', linkType: 'Upload', id: upload.sys.id } },
          },
        },
      },
    },
  )
  const processed = await client.asset.processForAllLocales({}, draft)
  await client.asset.publish({ assetId: image.id }, processed)
  console.log(`asset    ${image.id}`)
  return link('Asset', image.id)
}

async function upsertAssets(list: Image[]): Promise<Link[]> {
  const links: Link[] = []
  // Sequential on purpose: keeps us well under the CMA rate limit.
  for (const image of list) {
    const assetLink = await upsertAsset(image)
    if (assetLink) links.push(assetLink)
  }
  return links
}

// ---------- entries ----------

async function upsertEntry(contentTypeId: string, entryId: string, values: FieldValues) {
  const fields = localize(values)
  let existing
  try {
    existing = await client.entry.get({ entryId })
  } catch (error) {
    if (!isNotFound(error)) throw error
  }

  const saved = existing
    ? await client.entry.update({ entryId }, { ...existing, fields })
    : await client.entry.createWithId({ contentTypeId, entryId }, { fields })

  await client.entry.publish({ entryId }, saved)
  console.log(`entry    ${contentTypeId}/${entryId}`)
  return link('Entry', entryId)
}

async function upsertAll<T>(items: T[], upsert: (item: T) => Promise<Link>) {
  const links: Link[] = []
  for (const item of items) links.push(await upsert(item))
  return links
}

const ctaValues = (cta?: Cta) => ({ ctaLabel: cta?.label, ctaUrl: cta?.href })

const upsertFeature = (feature: Feature) =>
  upsertEntry(CONTENT_TYPE.feature, feature.id, {
    title: feature.title,
    description: feature.description,
    icon: feature.icon,
  })

const upsertTestimonial = async (testimonial: Testimonial) =>
  upsertEntry(CONTENT_TYPE.testimonial, testimonial.id, {
    author: testimonial.author,
    avatar: await upsertAsset(testimonial.avatar),
    rating: testimonial.rating,
    quote: testimonial.quote,
    badge: testimonial.badge,
  })

const upsertFaqItem = (item: FaqItem) =>
  upsertEntry(CONTENT_TYPE.faqItem, item.id, { question: item.question, answer: item.answer })

const upsertProduct = async (product: Product) =>
  upsertEntry(CONTENT_TYPE.product, product.id, {
    name: product.name,
    images: await upsertAssets(product.images),
  })

async function sectionFields(section: Section): Promise<FieldValues> {
  switch (section.type) {
    case 'hero':
      return {
        features: await upsertAll(section.features, upsertFeature),
        ...ctaValues(section.cta),
        testimonial: section.testimonial && (await upsertTestimonial(section.testimonial)),
        images: await upsertAssets(section.images),
        pressHeading: section.pressHeading,
        pressLogos: await upsertAssets(section.pressLogos),
      }
    case 'benefits':
      return {
        features: await upsertAll(section.features, upsertFeature),
        product: section.product && (await upsertProduct(section.product)),
        ...ctaValues(section.cta),
      }
    case 'founder':
      return {
        body: section.paragraphs.join('\n\n'),
        images: await upsertAssets(section.images),
        ...ctaValues(section.cta),
      }
    case 'steps':
      return { steps: await upsertAll(section.steps, upsertFeature), ...ctaValues(section.cta) }
    case 'reviews':
      return {
        description: section.description,
        gallery: await upsertAssets(section.gallery),
        testimonials: await upsertAll(section.testimonials, upsertTestimonial),
        ...ctaValues(section.cta),
      }
    case 'faq':
      return {
        items: await upsertAll(section.items, upsertFaqItem),
        images: await upsertAssets(section.images),
        ...ctaValues(section.cta),
      }
    case 'impact':
      return { stats: await upsertAll(section.stats, upsertFeature) }
    case 'cta':
      return {
        description: section.description,
        images: await upsertAssets(section.images),
        ...ctaValues(section.cta),
        shippingNote: section.shippingNote,
        perks: await upsertAll(section.perks, upsertFeature),
      }
  }
}

const upsertSection = async (section: Section) =>
  upsertEntry(SECTION_CONTENT_TYPE[section.type], section.id, {
    heading: section.heading,
    ...(await sectionFields(section)),
  })

// ---------- run ----------

const page = landingPageContent
await upsertEntry(CONTENT_TYPE.landingPage, `page-${page.slug}`, {
  title: page.seo.title,
  slug: page.slug,
  seoDescription: page.seo.description,
  announcements: page.announcements,
  ratingText: page.ratingText,
  sections: await upsertAll(page.sections, upsertSection),
})

console.log('\nDone. Content is published and available through the Delivery API.')
