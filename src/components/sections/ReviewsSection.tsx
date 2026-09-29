import type { ReviewsSection as ReviewsSectionData } from '@/types/content'
import { Carousel } from '../ui/Carousel'
import { CtaWithRating } from '../ui/CtaButton'
import { ResponsiveImage } from '../ui/ResponsiveImage'
import { SectionHeading } from '../ui/SectionHeading'
import { TestimonialCard } from './TestimonialCard'

interface Props {
  section: ReviewsSectionData
  ratingText: string
}

/** Photos shown on mobile, where the design uses a shorter 4x2 grid. */
const MOBILE_GALLERY_LIMIT = 8

export function ReviewsSection({ section, ratingText }: Props) {
  return (
    <section aria-labelledby={`${section.id}-title`} className="py-12 md:py-20">
      <div className="container-page flex flex-col items-center gap-4 text-center">
        <SectionHeading>
          <span id={`${section.id}-title`}>{section.heading}</span>
        </SectionHeading>
        {section.description && (
          <p className="max-w-md text-xs leading-relaxed text-muted">{section.description}</p>
        )}
      </div>

      {section.gallery.length > 0 && (
        <ul className="mt-8 grid grid-cols-4 gap-0.5 md:grid-cols-11">
          {section.gallery.map((image, index) => (
            <li
              key={image.id}
              className={index >= MOBILE_GALLERY_LIMIT ? 'max-md:hidden' : undefined}
            >
              <ResponsiveImage
                image={image}
                aspectRatio={1}
                sizes="(min-width: 768px) 9vw, 25vw"
                className="w-full"
              />
            </li>
          ))}
        </ul>
      )}

      <div className="container-page mt-10 flex flex-col items-center gap-10">
        {section.testimonials.length > 0 && (
          <Carousel
            label="Customer reviews"
            showDots
            className="w-full max-w-xs md:max-w-3xl"
            trackClassName="items-center py-3"
            slideClassName="basis-full md:basis-1/3 md:px-3"
            items={section.testimonials.map((testimonial) => ({
              key: testimonial.id,
              content: <TestimonialCard testimonial={testimonial} />,
            }))}
          />
        )}
        {section.cta && (
          <CtaWithRating cta={section.cta} ratingText={ratingText} className="w-full" />
        )}
      </div>
    </section>
  )
}
