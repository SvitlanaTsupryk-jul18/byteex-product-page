import type { FounderSection as FounderSectionData, Image } from '@/types/content'
import { CtaButton } from '../ui/CtaButton'
import { ResponsiveImage } from '../ui/ResponsiveImage'

/**
 * Three overlapping photos. Positions are percentages of the collage box, so
 * it scales with the screen. Box sizes from the mockup: 337x355 (mobile),
 * 521x662 (desktop). The two small photos already contain a frame in the
 * section background colour.
 */
function FounderCollage({ images }: { images: Image[] }) {
  const [main, topLeft, bottomRight] = images

  return (
    <div className="relative mx-auto aspect-[337/355] w-full max-w-[21.0625rem] lg:aspect-[521/662] lg:max-w-[32.5625rem]">
      <ResponsiveImage
        image={main}
        sizes="(min-width: 1024px) 382px, 240px"
        className="absolute top-[5.9%] left-[14.5%] aspect-[239/311] h-auto w-[70.9%] lg:top-[6.5%] lg:left-[14%] lg:aspect-[382/570] lg:w-[73.3%]"
      />
      <ResponsiveImage
        image={topLeft}
        sizes="(min-width: 1024px) 166px, 94px"
        className="absolute top-0 left-0 h-auto w-[27.9%] lg:w-[31.9%]"
      />
      <ResponsiveImage
        image={bottomRight}
        sizes="(min-width: 1024px) 129px, 105px"
        className="absolute top-[69.9%] left-[68.8%] aspect-[105/107] h-auto w-[31.2%] lg:top-[73.6%] lg:left-[75.2%] lg:aspect-[129/175] lg:w-[24.8%]"
      />
    </div>
  )
}

/**
 * "Be your best self." founder story.
 * Mobile: heading, collage, text (no CTA). Desktop: collage left, heading,
 * text and a CTA without arrow on the right, vertically centred.
 */
export function FounderSection({ section }: { section: FounderSectionData }) {
  const titleId = `${section.id}-title`

  return (
    <section
      aria-labelledby={titleId}
      className="bg-mist pt-10 pb-[2.625rem] lg:pt-[5.625rem] lg:pb-[3.75rem]"
    >
      <div className="container-page lg:grid lg:grid-cols-[minmax(0,1fr)_38rem] lg:grid-rows-[1fr_auto_auto_1fr] lg:gap-x-10">
        <h2
          id={titleId}
          className="text-center text-[1.75rem] leading-[2.125rem] tracking-[0.02em] text-indigo lg:col-start-2 lg:row-start-2 lg:text-left lg:text-[2.125rem] lg:leading-10"
        >
          {section.heading}
        </h2>

        <div className="mt-12 lg:col-start-1 lg:row-span-4 lg:row-start-1 lg:mt-0 lg:pl-5 lg:[&>div]:mx-0">
          <FounderCollage images={section.images} />
        </div>

        <div className="mx-auto mt-[3.1875rem] max-w-[20.25rem] lg:col-start-2 lg:row-start-3 lg:mx-0 lg:mt-8 lg:mb-3.5 lg:max-w-none">
          <div className="space-y-[1.4375rem] font-heading text-sm leading-[1.4375rem] tracking-[0.02em] text-muted lg:text-[0.9375rem]">
            {section.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          {section.cta && (
            // Desktop only: on mobile the next section's CTA follows right away.
            <div className="mt-[2.1875rem] hidden lg:block">
              <CtaButton cta={section.cta} showArrow={false} className="w-[22.25rem]" />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
