import type { FaqSection as FaqSectionData } from '@/types/content'
import { Accordion } from '../ui/Accordion'
import { CtaWithRating } from '../ui/CtaWithRating'
import { ResponsiveImage } from '../ui/ResponsiveImage'
import { SectionHeading } from '../ui/SectionHeading'

interface Props {
  section: FaqSectionData
  ratingText: string
}

export function FaqSection({ section, ratingText }: Props) {
  const [topRight, center, bottomLeft] = section.images

  return (
    <section aria-labelledby={`${section.id}-title`} className="py-12 md:py-20">
      <div className="container-page grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center">
        <div className="flex flex-col gap-6">
          <SectionHeading className="text-center md:text-left">
            <span id={`${section.id}-title`}>{section.heading}</span>
          </SectionHeading>
          <Accordion
            items={section.items.map((item) => ({
              id: item.id,
              title: item.question,
              content: item.answer,
            }))}
          />
        </div>

        {/* Decorative collage, desktop only as in the design. */}
        <div
          className="relative mx-auto hidden aspect-[0.8] w-full max-w-sm md:block"
          aria-hidden="true"
        >
          <ResponsiveImage
            image={topRight}
            aspectRatio={0.66}
            sizes="160px"
            className="absolute top-0 right-0 w-2/5"
          />
          <ResponsiveImage
            image={center}
            aspectRatio={0.63}
            sizes="220px"
            className="absolute top-1/5 left-1/5 w-1/2"
          />
          <ResponsiveImage
            image={bottomLeft}
            aspectRatio={1.05}
            sizes="170px"
            className="absolute bottom-0 left-0 w-2/5"
          />
        </div>
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
