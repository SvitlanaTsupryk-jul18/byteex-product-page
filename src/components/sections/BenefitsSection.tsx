import type { BenefitsSection as BenefitsSectionData } from '@/types/content'
import { CtaWithRating } from '../ui/CtaButton'
import { ProductGallery } from '../ui/ProductGallery'
import { SectionHeading } from '../ui/SectionHeading'
import { FeatureItem } from './FeatureItem'

interface Props {
  section: BenefitsSectionData
  ratingText: string
}

export function BenefitsSection({ section, ratingText }: Props) {
  return (
    <section aria-labelledby={`${section.id}-title`} className="py-12 md:py-20">
      <div className="container-page grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center">
        <div className="flex flex-col gap-8">
          <SectionHeading className="text-center md:text-left">
            <span id={`${section.id}-title`}>{section.heading}</span>
          </SectionHeading>
          <ul className="order-last flex flex-col gap-6 md:order-none">
            {section.features.map((feature) => (
              <li key={feature.id} className="border-line max-md:border-b max-md:pb-6">
                <FeatureItem
                  feature={feature}
                  className="max-md:flex-col max-md:items-center max-md:text-center"
                />
              </li>
            ))}
          </ul>
        </div>

        {section.product && (
          <ProductGallery
            product={section.product}
            className="mx-auto w-full max-w-xs md:max-w-sm"
          />
        )}
      </div>

      {section.cta && (
        <CtaWithRating
          cta={section.cta}
          ratingText={ratingText}
          className="container-page mt-10 md:hidden"
        />
      )}
    </section>
  )
}
