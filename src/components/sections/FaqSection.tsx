import type { FaqSection as FaqSectionData } from '@/types/content'
import { Accordion } from '../ui/Accordion'
import { CtaWithRating } from '../ui/CtaWithRating'
import { ResponsiveImage } from '../ui/ResponsiveImage'

interface Props {
  section: FaqSectionData
  ratingText: string
}

/** Width / height of the collage exported from Figma (882 x 1304). */
const COLLAGE_RATIO = 882 / 1304

/**
 * "Frequently asked questions."
 * Mobile: lowercase centred heading, accordion, CTA with rating.
 * Desktop (lg): heading and accordion on the left, photo collage on the right, no CTA.
 */
export function FaqSection({ section, ratingText }: Props) {
  const titleId = `${section.id}-title`
  const [collage] = section.images

  return (
    <section aria-labelledby={titleId} className="pt-10 pb-12 lg:pt-9 lg:pb-[2.125rem]">
      <div className="container-page lg:grid lg:grid-cols-[minmax(0,1fr)_27.5625rem] lg:grid-rows-[auto_1fr] lg:gap-x-10">
        <h2
          id={titleId}
          className="mx-auto max-w-[14.5rem] text-center text-[1.8125rem] leading-[1.9375rem] tracking-[0.02em] text-navy max-lg:lowercase lg:mx-0 lg:max-w-none lg:pl-[6.6875rem] lg:text-left lg:text-[2.1875rem] lg:leading-[2.75rem]"
        >
          {section.heading}
        </h2>

        <div className="mx-auto mt-[2.125rem] max-w-[21.75rem] lg:col-start-1 lg:row-start-2 lg:mx-0 lg:mt-12 lg:max-w-[46rem] lg:pl-[6.6875rem]">
          <Accordion
            items={section.items.map((item) => ({
              id: item.id,
              title: item.question,
              content: item.answer,
            }))}
          />
        </div>

        {collage && (
          <div className="hidden lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:-mt-1 lg:block">
            <ResponsiveImage
              image={collage}
              aspectRatio={COLLAGE_RATIO}
              sizes="441px"
              className="h-auto w-full"
            />
          </div>
        )}

        {section.cta && (
          <CtaWithRating cta={section.cta} ratingText={ratingText} className="mt-10 lg:hidden" />
        )}
      </div>
    </section>
  )
}
