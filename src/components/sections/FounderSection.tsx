import type { FounderSection as FounderSectionData } from '@/types/content'
import { CtaButton } from '../ui/CtaButton'
import { ResponsiveImage } from '../ui/ResponsiveImage'
import { SectionHeading } from '../ui/SectionHeading'

export function FounderSection({ section }: { section: FounderSectionData }) {
  const [main, topLeft, bottomRight] = section.images

  return (
    <section aria-labelledby={`${section.id}-title`} className="bg-mist py-12 md:py-20">
      {/* Mobile order: heading, collage, text. Desktop: collage left, heading + text right. */}
      <div className="container-page grid gap-8 md:grid-cols-2 md:grid-rows-[auto_1fr] md:gap-x-12">
        <SectionHeading className="text-center md:col-start-2 md:self-end md:text-left">
          <span id={`${section.id}-title`}>{section.heading}</span>
        </SectionHeading>

        {/* Collage: one large photo with two smaller overlapping ones. */}
        <div className="relative mx-auto w-3/4 max-w-sm md:col-start-1 md:row-span-2 md:row-start-1 md:self-center">
          <ResponsiveImage image={main} aspectRatio={0.68} sizes="(min-width: 768px) 30vw, 75vw" />
          <ResponsiveImage
            image={topLeft}
            aspectRatio={1}
            sizes="120px"
            className="absolute -top-4 -left-1/5 w-1/3 border-4 border-mist"
          />
          <ResponsiveImage
            image={bottomRight}
            aspectRatio={0.75}
            sizes="100px"
            className="absolute -right-1/6 -bottom-4 w-1/4 border-4 border-mist"
          />
        </div>

        <div className="flex flex-col gap-4 md:col-start-2">
          <div className="flex flex-col gap-4 text-xs leading-relaxed text-muted">
            {section.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          {section.cta && <CtaButton cta={section.cta} className="mt-2 w-full md:w-fit" />}
        </div>
      </div>
    </section>
  )
}
