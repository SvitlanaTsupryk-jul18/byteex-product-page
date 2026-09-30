/**
 * Type-level description of Contentful entries, mirroring scripts/contentful/model.ts.
 * Gives typed `fields` on responses from the Delivery API.
 */
import type { Asset, Entry, EntryFieldTypes as F } from 'contentful'
import type { IconName } from '@/types/content'
import type { CONTENT_TYPE, SECTION_CONTENT_TYPE } from './contentTypes'

type Cta = {
  ctaLabel?: F.Symbol
  ctaUrl?: F.Symbol
}

type RequiredCta = {
  ctaLabel: F.Symbol
  ctaUrl: F.Symbol
}

type Images = F.Array<F.AssetLink>

export type FeatureSkeleton = {
  contentTypeId: typeof CONTENT_TYPE.feature
  fields: {
    title: F.Symbol
    description?: F.Text
    icon?: F.Symbol<IconName>
  }
}

export type TestimonialSkeleton = {
  contentTypeId: typeof CONTENT_TYPE.testimonial
  fields: {
    author: F.Symbol
    avatar?: F.AssetLink
    rating: F.Integer
    quote: F.Text
    badge?: F.Symbol
  }
}

export type FaqItemSkeleton = {
  contentTypeId: typeof CONTENT_TYPE.faqItem
  fields: {
    question: F.Symbol
    answer: F.Text
  }
}

export type ProductSkeleton = {
  contentTypeId: typeof CONTENT_TYPE.product
  fields: {
    name: F.Symbol
    images?: Images
  }
}

type Features = F.Array<F.EntryLink<FeatureSkeleton>>

export type HeroSectionSkeleton = {
  contentTypeId: typeof SECTION_CONTENT_TYPE.hero
  fields: RequiredCta & {
    heading: F.Symbol
    features?: Features
    testimonial?: F.EntryLink<TestimonialSkeleton>
    images?: Images
    pressHeading?: F.Symbol
    pressLogos?: Images
  }
}

export type BenefitsSectionSkeleton = {
  contentTypeId: typeof SECTION_CONTENT_TYPE.benefits
  fields: Cta & {
    heading: F.Symbol
    features?: Features
    product?: F.EntryLink<ProductSkeleton>
  }
}

export type FounderSectionSkeleton = {
  contentTypeId: typeof SECTION_CONTENT_TYPE.founder
  fields: Cta & {
    heading: F.Symbol
    body?: F.Text
    images?: Images
  }
}

export type StepsSectionSkeleton = {
  contentTypeId: typeof SECTION_CONTENT_TYPE.steps
  fields: Cta & {
    heading: F.Symbol
    steps?: Features
  }
}

export type ReviewsSectionSkeleton = {
  contentTypeId: typeof SECTION_CONTENT_TYPE.reviews
  fields: Cta & {
    heading: F.Symbol
    description?: F.Text
    gallery?: Images
    galleryMobile?: Images
    testimonials?: F.Array<F.EntryLink<TestimonialSkeleton>>
  }
}

export type FaqSectionSkeleton = {
  contentTypeId: typeof SECTION_CONTENT_TYPE.faq
  fields: Cta & {
    heading: F.Symbol
    items?: F.Array<F.EntryLink<FaqItemSkeleton>>
    images?: Images
  }
}

export type ImpactSectionSkeleton = {
  contentTypeId: typeof SECTION_CONTENT_TYPE.impact
  fields: {
    heading: F.Symbol
    stats?: Features
  }
}

export type CtaSectionSkeleton = {
  contentTypeId: typeof SECTION_CONTENT_TYPE.cta
  fields: RequiredCta & {
    heading: F.Symbol
    description?: F.Text
    images?: Images
    shippingNote?: F.Symbol
    perks?: Features
  }
}

export type SectionSkeleton =
  | HeroSectionSkeleton
  | BenefitsSectionSkeleton
  | FounderSectionSkeleton
  | StepsSectionSkeleton
  | ReviewsSectionSkeleton
  | FaqSectionSkeleton
  | ImpactSectionSkeleton
  | CtaSectionSkeleton

export type LandingPageSkeleton = {
  contentTypeId: typeof CONTENT_TYPE.landingPage
  fields: {
    title: F.Symbol
    slug: F.Symbol
    seoDescription?: F.Text
    announcements?: F.Array<F.Symbol>
    ratingText?: F.Symbol
    sections?: F.Array<F.EntryLink<SectionSkeleton>>
  }
}

/** Entry as returned by client.withoutUnresolvableLinks (single locale, no broken links). */
export type ResolvedEntry<S extends { contentTypeId: string; fields: object }> = Entry<
  S,
  'WITHOUT_UNRESOLVABLE_LINKS',
  string
>

export type ResolvedAsset = Asset<'WITHOUT_UNRESOLVABLE_LINKS', string>
