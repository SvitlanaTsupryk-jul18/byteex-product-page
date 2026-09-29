/**
 * Map Contentful entries to domain types.
 * Components never see raw CMS responses, only the result of these functions.
 */
import type {
  Cta,
  FaqItem,
  Feature,
  Image,
  LandingPage,
  Product,
  Section,
  Testimonial,
} from '@/types/content'
import { SECTION_CONTENT_TYPE, type SectionContentTypeId } from './contentTypes'
import type {
  FaqItemSkeleton,
  FeatureSkeleton,
  LandingPageSkeleton,
  ProductSkeleton,
  ResolvedAsset,
  ResolvedEntry,
  SectionSkeleton,
  TestimonialSkeleton,
} from './skeletons'

const isDefined = <T>(value: T | undefined | null): value is T => value != null

// ---------- primitives ----------

export function mapImage(asset: ResolvedAsset | undefined): Image | undefined {
  const file = asset?.fields.file
  if (!asset || !file?.url) return undefined
  return {
    id: asset.sys.id,
    // Contentful returns protocol-relative urls ("//images.ctfassets.net/...").
    url: file.url.startsWith('//') ? `https:${file.url}` : file.url,
    alt: asset.fields.description || asset.fields.title || '',
    width: file.details.image?.width,
    height: file.details.image?.height,
  }
}

const mapImages = (assets: (ResolvedAsset | undefined)[] | undefined): Image[] =>
  (assets ?? []).map(mapImage).filter(isDefined)

function mapCta(fields: { ctaLabel?: string; ctaUrl?: string }): Cta | undefined {
  return fields.ctaLabel && fields.ctaUrl
    ? { label: fields.ctaLabel, href: fields.ctaUrl }
    : undefined
}

// ---------- building blocks ----------

const mapFeature = ({ sys, fields }: ResolvedEntry<FeatureSkeleton>): Feature => ({
  id: sys.id,
  title: fields.title,
  description: fields.description,
  icon: fields.icon,
})

const mapFeatures = (entries: (ResolvedEntry<FeatureSkeleton> | undefined)[] | undefined) =>
  (entries ?? []).filter(isDefined).map(mapFeature)

const mapTestimonial = ({ sys, fields }: ResolvedEntry<TestimonialSkeleton>): Testimonial => ({
  id: sys.id,
  author: fields.author,
  avatar: mapImage(fields.avatar),
  rating: fields.rating,
  quote: fields.quote,
  badge: fields.badge,
})

const mapFaqItem = ({ sys, fields }: ResolvedEntry<FaqItemSkeleton>): FaqItem => ({
  id: sys.id,
  question: fields.question,
  answer: fields.answer,
})

const mapProduct = ({ sys, fields }: ResolvedEntry<ProductSkeleton>): Product => ({
  id: sys.id,
  name: fields.name,
  images: mapImages(fields.images),
})

// ---------- sections ----------

/** Narrows a section entry by its content type id. */
type SectionEntryOf<Id extends SectionContentTypeId> = ResolvedEntry<
  Extract<SectionSkeleton, { contentTypeId: Id }>
>

function isSection<Id extends SectionContentTypeId>(
  entry: ResolvedEntry<SectionSkeleton>,
  id: Id,
): entry is SectionEntryOf<Id> {
  return entry.sys.contentType.sys.id === id
}

export function mapSection(entry: ResolvedEntry<SectionSkeleton>): Section | undefined {
  const id = entry.sys.id

  if (isSection(entry, SECTION_CONTENT_TYPE.hero)) {
    const { fields } = entry
    return {
      type: 'hero',
      id,
      heading: fields.heading,
      features: mapFeatures(fields.features),
      cta: { label: fields.ctaLabel, href: fields.ctaUrl },
      testimonial: fields.testimonial && mapTestimonial(fields.testimonial),
      images: mapImages(fields.images),
      pressHeading: fields.pressHeading,
      pressLogos: mapImages(fields.pressLogos),
    }
  }

  if (isSection(entry, SECTION_CONTENT_TYPE.benefits)) {
    const { fields } = entry
    return {
      type: 'benefits',
      id,
      heading: fields.heading,
      features: mapFeatures(fields.features),
      product: fields.product && mapProduct(fields.product),
      cta: mapCta(fields),
    }
  }

  if (isSection(entry, SECTION_CONTENT_TYPE.founder)) {
    const { fields } = entry
    return {
      type: 'founder',
      id,
      heading: fields.heading,
      paragraphs: (fields.body ?? '')
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean),
      images: mapImages(fields.images),
      cta: mapCta(fields),
    }
  }

  if (isSection(entry, SECTION_CONTENT_TYPE.steps)) {
    const { fields } = entry
    return {
      type: 'steps',
      id,
      heading: fields.heading,
      steps: mapFeatures(fields.steps),
      cta: mapCta(fields),
    }
  }

  if (isSection(entry, SECTION_CONTENT_TYPE.reviews)) {
    const { fields } = entry
    return {
      type: 'reviews',
      id,
      heading: fields.heading,
      description: fields.description,
      gallery: mapImages(fields.gallery),
      testimonials: (fields.testimonials ?? []).filter(isDefined).map(mapTestimonial),
      cta: mapCta(fields),
    }
  }

  if (isSection(entry, SECTION_CONTENT_TYPE.faq)) {
    const { fields } = entry
    return {
      type: 'faq',
      id,
      heading: fields.heading,
      items: (fields.items ?? []).filter(isDefined).map(mapFaqItem),
      images: mapImages(fields.images),
      cta: mapCta(fields),
    }
  }

  if (isSection(entry, SECTION_CONTENT_TYPE.impact)) {
    const { fields } = entry
    return { type: 'impact', id, heading: fields.heading, stats: mapFeatures(fields.stats) }
  }

  if (isSection(entry, SECTION_CONTENT_TYPE.cta)) {
    const { fields } = entry
    return {
      type: 'cta',
      id,
      heading: fields.heading,
      description: fields.description,
      images: mapImages(fields.images),
      cta: { label: fields.ctaLabel, href: fields.ctaUrl },
      shippingNote: fields.shippingNote,
      perks: mapFeatures(fields.perks),
    }
  }

  // Unknown section type: skip it instead of breaking the whole page.
  return undefined
}

// ---------- page ----------

export function mapLandingPage({ fields }: ResolvedEntry<LandingPageSkeleton>): LandingPage {
  return {
    slug: fields.slug,
    seo: { title: fields.title, description: fields.seoDescription ?? '' },
    announcements: fields.announcements ?? [],
    ratingText: fields.ratingText ?? '',
    sections: (fields.sections ?? []).filter(isDefined).map(mapSection).filter(isDefined),
  }
}
