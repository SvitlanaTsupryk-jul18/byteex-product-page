import type { Section } from '@/types/content'
import { BenefitsSection } from './BenefitsSection'
import { FaqSection } from './FaqSection'
import { FinalCtaSection } from './FinalCtaSection'
import { FounderSection } from './FounderSection'
import { HeroSection } from './HeroSection'
import { ImpactSection } from './ImpactSection'
import { ReviewsSection } from './ReviewsSection'
import { StepsSection } from './StepsSection'

interface Props {
  section: Section
  ratingText: string
}

/**
 * Picks a component by section type. Section order is controlled
 * by editors in the CMS, not hard-coded in the page.
 */
export function SectionRenderer({ section, ratingText }: Props) {
  switch (section.type) {
    case 'hero':
      return <HeroSection section={section} />
    case 'benefits':
      return <BenefitsSection section={section} ratingText={ratingText} />
    case 'founder':
      return <FounderSection section={section} />
    case 'steps':
      return <StepsSection section={section} ratingText={ratingText} />
    case 'reviews':
      return <ReviewsSection section={section} ratingText={ratingText} />
    case 'faq':
      return <FaqSection section={section} ratingText={ratingText} />
    case 'impact':
      return <ImpactSection section={section} />
    case 'cta':
      return <FinalCtaSection section={section} />
    default: {
      // Compile-time check that every section type is handled.
      const unhandled: never = section
      return unhandled
    }
  }
}
