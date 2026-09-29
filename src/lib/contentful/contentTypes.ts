// Relative import on purpose: this file is also used by Node scripts.
import type { SectionType } from '../../types/content.ts'

/**
 * Contentful content type ids.
 * Shared by the app (to read entries) and by the setup scripts (to create them).
 */
export const CONTENT_TYPE = {
  landingPage: 'landingPage',
  feature: 'feature',
  testimonial: 'testimonial',
  faqItem: 'faqItem',
  product: 'product',
} as const

export const SECTION_CONTENT_TYPE = {
  hero: 'heroSection',
  benefits: 'benefitsSection',
  founder: 'founderSection',
  steps: 'stepsSection',
  reviews: 'reviewsSection',
  faq: 'faqSection',
  impact: 'impactSection',
  cta: 'ctaSection',
} as const satisfies Record<SectionType, string>

export type SectionContentTypeId = (typeof SECTION_CONTENT_TYPE)[SectionType]

export const DEFAULT_LOCALE = 'en-US'
export const LANDING_PAGE_SLUG = 'home'
