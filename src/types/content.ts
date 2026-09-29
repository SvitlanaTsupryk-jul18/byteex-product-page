/**
 * Domain model of the landing page.
 *
 * UI components depend only on these types, never on raw Contentful
 * responses. The CMS layer maps entries into this shape, which keeps
 * components simple and makes the CMS replaceable.
 */

export const ICON_NAMES = [
  'dayNight',
  'ecoCart',
  'waves',
  'sparkle',
  'leaf',
  'package',
  'fabric',
  'hanger',
  'heart',
  'truck',
  'sun',
  'cloud',
  'drop',
  'bolt',
  'shield',
] as const

export type IconName = (typeof ICON_NAMES)[number]

export interface Image {
  /** Stable id, also used as the Contentful asset id when seeding. */
  id: string
  /** Absolute URL. Empty string means "no image yet" and renders a placeholder. */
  url: string
  alt: string
  width?: number
  height?: number
}

export interface Cta {
  label: string
  href: string
}

export interface Feature {
  id: string
  title: string
  description?: string
  icon?: IconName
}

export interface Testimonial {
  id: string
  author: string
  avatar?: Image
  rating: number
  quote: string
  badge?: string
}

export interface FaqItem {
  id: string
  question: string
  answer: string
}

export interface Product {
  id: string
  name: string
  images: Image[]
}

interface SectionBase {
  id: string
  heading: string
}

export interface HeroSection extends SectionBase {
  type: 'hero'
  features: Feature[]
  cta: Cta
  testimonial?: Testimonial
  images: Image[]
  pressHeading?: string
  pressLogos: Image[]
}

export interface BenefitsSection extends SectionBase {
  type: 'benefits'
  features: Feature[]
  product?: Product
  cta?: Cta
}

export interface FounderSection extends SectionBase {
  type: 'founder'
  paragraphs: string[]
  images: Image[]
  cta?: Cta
}

export interface StepsSection extends SectionBase {
  type: 'steps'
  steps: Feature[]
  cta?: Cta
}

export interface ReviewsSection extends SectionBase {
  type: 'reviews'
  description?: string
  gallery: Image[]
  testimonials: Testimonial[]
  cta?: Cta
}

export interface FaqSection extends SectionBase {
  type: 'faq'
  items: FaqItem[]
  images: Image[]
  cta?: Cta
}

export interface ImpactSection extends SectionBase {
  type: 'impact'
  stats: Feature[]
}

export interface CtaSection extends SectionBase {
  type: 'cta'
  description?: string
  images: Image[]
  cta: Cta
  shippingNote?: string
  perks: Feature[]
}

export type Section =
  | HeroSection
  | BenefitsSection
  | FounderSection
  | StepsSection
  | ReviewsSection
  | FaqSection
  | ImpactSection
  | CtaSection

export type SectionType = Section['type']

export interface LandingPage {
  slug: string
  seo: {
    title: string
    description: string
  }
  announcements: string[]
  /** Social proof line shown under CTA buttons, e.g. "Over 500+ 5 Star Reviews Online". */
  ratingText: string
  sections: Section[]
}
