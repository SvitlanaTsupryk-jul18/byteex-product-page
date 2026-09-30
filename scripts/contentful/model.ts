/**
 * Contentful content model, versioned in git.
 * Applied to a space by `npm run cms:setup` (see setup.ts).
 */
import type { ContentFields, CreateContentTypeProps } from 'contentful-management'
import { CONTENT_TYPE, SECTION_CONTENT_TYPE } from '../../src/lib/contentful/contentTypes.ts'
import { ICON_NAMES } from '../../src/types/content.ts'

type Field = ContentFields

export interface ContentTypeDefinition extends CreateContentTypeProps {
  id: string
}

// ---------- field builders ----------

const symbol = (id: string, name: string, required = false, extra: Partial<Field> = {}): Field => ({
  id,
  name,
  type: 'Symbol',
  required,
  localized: false,
  ...extra,
})

const text = (id: string, name: string, required = false): Field => ({
  id,
  name,
  type: 'Text',
  required,
  localized: false,
})

const assetLink = (id: string, name: string, required = false): Field => ({
  id,
  name,
  type: 'Link',
  linkType: 'Asset',
  required,
  localized: false,
  validations: [{ linkMimetypeGroup: ['image'] }],
})

const assetList = (id: string, name: string): Field => ({
  id,
  name,
  type: 'Array',
  required: false,
  localized: false,
  items: { type: 'Link', linkType: 'Asset', validations: [{ linkMimetypeGroup: ['image'] }] },
})

const entryLink = (id: string, name: string, contentTypes: string[], required = false): Field => ({
  id,
  name,
  type: 'Link',
  linkType: 'Entry',
  required,
  localized: false,
  validations: [{ linkContentType: contentTypes }],
})

const entryList = (id: string, name: string, contentTypes: string[]): Field => ({
  id,
  name,
  type: 'Array',
  required: false,
  localized: false,
  items: { type: 'Link', linkType: 'Entry', validations: [{ linkContentType: contentTypes }] },
})

/** Every CTA in the design is a label + URL pair. */
const ctaFields = (required = false): Field[] => [
  symbol('ctaLabel', 'CTA label', required),
  symbol('ctaUrl', 'CTA URL', required),
]

const heading = symbol('heading', 'Heading', true)

// ---------- reusable building blocks ----------

const feature: ContentTypeDefinition = {
  id: CONTENT_TYPE.feature,
  name: 'Feature',
  description: 'Icon + title + text. Used for benefits, steps, impact stats and perks.',
  displayField: 'title',
  fields: [
    symbol('title', 'Title', true),
    text('description', 'Description'),
    symbol('icon', 'Icon', false, { validations: [{ in: [...ICON_NAMES] }] }),
  ],
}

const testimonial: ContentTypeDefinition = {
  id: CONTENT_TYPE.testimonial,
  name: 'Testimonial',
  displayField: 'author',
  fields: [
    symbol('author', 'Author', true),
    assetLink('avatar', 'Avatar'),
    {
      id: 'rating',
      name: 'Rating',
      type: 'Integer',
      required: true,
      localized: false,
      validations: [{ range: { min: 1, max: 5 } }],
    },
    text('quote', 'Quote', true),
    symbol('badge', 'Badge'),
  ],
}

const faqItem: ContentTypeDefinition = {
  id: CONTENT_TYPE.faqItem,
  name: 'FAQ item',
  displayField: 'question',
  fields: [symbol('question', 'Question', true), text('answer', 'Answer', true)],
}

const product: ContentTypeDefinition = {
  id: CONTENT_TYPE.product,
  name: 'Product',
  displayField: 'name',
  fields: [symbol('name', 'Name', true), assetList('images', 'Images')],
}

// ---------- page sections ----------

const heroSection: ContentTypeDefinition = {
  id: SECTION_CONTENT_TYPE.hero,
  name: 'Section: Hero',
  displayField: 'heading',
  fields: [
    heading,
    entryList('features', 'Features', [CONTENT_TYPE.feature]),
    ...ctaFields(true),
    entryLink('testimonial', 'Testimonial', [CONTENT_TYPE.testimonial]),
    assetList('images', 'Images'),
    symbol('pressHeading', 'Press heading'),
    assetList('pressLogos', 'Press logos'),
  ],
}

const benefitsSection: ContentTypeDefinition = {
  id: SECTION_CONTENT_TYPE.benefits,
  name: 'Section: Benefits',
  displayField: 'heading',
  fields: [
    heading,
    entryList('features', 'Features', [CONTENT_TYPE.feature]),
    entryLink('product', 'Product', [CONTENT_TYPE.product]),
    ...ctaFields(),
  ],
}

const founderSection: ContentTypeDefinition = {
  id: SECTION_CONTENT_TYPE.founder,
  name: 'Section: Founder',
  description: 'Body paragraphs are separated by an empty line.',
  displayField: 'heading',
  fields: [heading, text('body', 'Body'), assetList('images', 'Images'), ...ctaFields()],
}

const stepsSection: ContentTypeDefinition = {
  id: SECTION_CONTENT_TYPE.steps,
  name: 'Section: How it works',
  displayField: 'heading',
  fields: [heading, entryList('steps', 'Steps', [CONTENT_TYPE.feature]), ...ctaFields()],
}

const reviewsSection: ContentTypeDefinition = {
  id: SECTION_CONTENT_TYPE.reviews,
  name: 'Section: Reviews',
  displayField: 'heading',
  fields: [
    heading,
    text('description', 'Description'),
    assetList('gallery', 'User generated photos'),
    assetList('galleryMobile', 'User generated photos (mobile)'),
    entryList('testimonials', 'Testimonials', [CONTENT_TYPE.testimonial]),
    ...ctaFields(),
  ],
}

const faqSection: ContentTypeDefinition = {
  id: SECTION_CONTENT_TYPE.faq,
  name: 'Section: FAQ',
  displayField: 'heading',
  fields: [
    heading,
    entryList('items', 'Items', [CONTENT_TYPE.faqItem]),
    assetList('images', 'Images'),
    ...ctaFields(),
  ],
}

const impactSection: ContentTypeDefinition = {
  id: SECTION_CONTENT_TYPE.impact,
  name: 'Section: Impact',
  description: 'Feature title holds the value (e.g. "3,927 kg"), description holds the label.',
  displayField: 'heading',
  fields: [heading, entryList('stats', 'Stats', [CONTENT_TYPE.feature])],
}

const ctaSection: ContentTypeDefinition = {
  id: SECTION_CONTENT_TYPE.cta,
  name: 'Section: Final CTA',
  displayField: 'heading',
  fields: [
    heading,
    text('description', 'Description'),
    assetList('images', 'Images'),
    ...ctaFields(true),
    symbol('shippingNote', 'Shipping note'),
    entryList('perks', 'Perks', [CONTENT_TYPE.feature]),
  ],
}

// ---------- page ----------

const landingPage: ContentTypeDefinition = {
  id: CONTENT_TYPE.landingPage,
  name: 'Landing page',
  displayField: 'title',
  fields: [
    symbol('title', 'Title (SEO)', true),
    symbol('slug', 'Slug', true, { validations: [{ unique: true }] }),
    text('seoDescription', 'SEO description'),
    {
      id: 'announcements',
      name: 'Announcement bar items',
      type: 'Array',
      required: false,
      localized: false,
      items: { type: 'Symbol' },
    },
    symbol('ratingText', 'Rating text under CTAs'),
    entryList('sections', 'Sections', Object.values(SECTION_CONTENT_TYPE)),
  ],
}

/** Order matters: referenced types must exist before the types that link to them. */
export const CONTENT_MODEL: ContentTypeDefinition[] = [
  feature,
  testimonial,
  faqItem,
  product,
  heroSection,
  benefitsSection,
  founderSection,
  stepsSection,
  reviewsSection,
  faqSection,
  impactSection,
  ctaSection,
  landingPage,
]
