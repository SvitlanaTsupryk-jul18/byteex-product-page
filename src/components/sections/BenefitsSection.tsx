import type { BenefitsSection as BenefitsSectionData } from '@/types/content'
import { CtaWithRating } from '../ui/CtaButton'
import { Icon } from '../ui/Icon'
import { ProductGallery } from '../ui/ProductGallery'

interface Props {
  section: BenefitsSectionData
  ratingText: string
}

/**
 * "Loungewear you can be proud of."
 * Mobile: heading, gallery, centred benefits with dividers, CTA.
 * Desktop (lg): benefits on the left, gallery on the right, no CTA.
 * Below 1400px the gallery is shifted left so its outside arrows stay on screen.
 */
export function BenefitsSection({ section, ratingText }: Props) {
  const titleId = `${section.id}-title`

  return (
    <section
      aria-labelledby={titleId}
      className="overflow-x-clip pb-10 max-lg:bg-linear-to-b max-lg:from-white max-lg:from-60% max-lg:to-cream/60 lg:pt-12 lg:pb-14"
    >
      <div className="container-page lg:grid lg:grid-cols-[minmax(0,1fr)_27rem] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-16">
        <h2
          id={titleId}
          className="mx-auto max-w-[20rem] text-center text-[1.6875rem] leading-[2.125rem] tracking-[0.02em] text-navy lg:col-start-1 lg:row-start-1 lg:mx-0 lg:max-w-none lg:pl-10 lg:text-left lg:text-[2.1875rem] lg:leading-[2.9375rem]"
        >
          {section.heading}
        </h2>

        {section.product && (
          <ProductGallery
            product={section.product}
            className="mx-auto mt-6 w-[19rem] max-w-[calc(100%-4rem)] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:mr-10 lg:w-auto lg:max-w-none wide:mr-0"
          />
        )}

        <ul className="mx-auto mt-[3.5625rem] max-w-[21rem] lg:col-start-1 lg:row-start-2 lg:mx-0 lg:mt-20 lg:flex lg:max-w-none lg:flex-col lg:gap-[1.375rem] lg:pl-8">
          {section.features.map((feature) => (
            <li
              key={feature.id}
              className="flex flex-col items-center border-b border-line pt-8 pb-10 text-center first:pt-0 last:border-b-0 last:pb-0 lg:flex-row lg:items-start lg:gap-9 lg:border-0 lg:p-0 lg:text-left"
            >
              {feature.icon && (
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-cream text-navy lg:-mt-1.5">
                  <Icon name={feature.icon} className="size-[1.375rem]" />
                </span>
              )}
              <div>
                <h3 className="mx-auto mt-[1.125rem] max-w-[14rem] text-xl leading-7 tracking-[0.02em] text-navy lg:mx-0 lg:mt-0 lg:max-w-none lg:text-[1.375rem]">
                  {feature.title}
                </h3>
                {feature.description && (
                  <p className="mx-auto mt-3.5 max-w-[15.25rem] font-heading text-sm leading-[1.125rem] tracking-[0.02em] text-muted lg:mx-0 lg:mt-2 lg:max-w-[28.5rem] lg:text-[0.9375rem] lg:leading-[1.4375rem]">
                    {feature.description}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>

        {section.cta && (
          <CtaWithRating cta={section.cta} ratingText={ratingText} className="mt-11 lg:hidden" />
        )}
      </div>
    </section>
  )
}
