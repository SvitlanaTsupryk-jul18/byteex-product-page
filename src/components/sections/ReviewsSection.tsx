import type { Image, ReviewsSection as ReviewsSectionData } from '@/types/content'
import { cn } from '@/lib/cn'
import { Carousel } from '../ui/Carousel'
import { CtaWithRating } from '../ui/CtaWithRating'
import { ResponsiveImage } from '../ui/ResponsiveImage'
import { TestimonialCard } from './TestimonialCard'

interface Props {
  section: ReviewsSectionData
  ratingText: string
}

/** Photos shown on phones when no separate mobile selection exists. */
const MOBILE_GALLERY_SIZE = 8

function PhotoGrid({ images, className }: { images: Image[]; className: string }) {
  return (
    <ul className={cn('grid gap-[0.3125rem] lg:gap-1.5', className)}>
      {images.map((image) => (
        <li key={image.id}>
          <ResponsiveImage image={image} aspectRatio={1} sizes="130px" className="w-full" />
        </li>
      ))}
    </ul>
  )
}

/**
 * "What are our fans saying?" — user photos and testimonials.
 * Photo grid is full-bleed: 4 x 2 on mobile, 11 x 2 on desktop.
 * Testimonials: one card per slide on mobile, three per view on desktop.
 * The track has inner padding so card shadows are not clipped by its overflow.
 * On mobile all cards share the tallest height, so the dots stay right below them.
 */
export function ReviewsSection({ section, ratingText }: Props) {
  const titleId = `${section.id}-title`
  const mobilePhotos = section.galleryMobile.length
    ? section.galleryMobile
    : section.gallery.slice(0, MOBILE_GALLERY_SIZE)

  return (
    <section aria-labelledby={titleId} className="pt-10 pb-12 lg:pt-7 lg:pb-16">
      <div className="container-page text-center">
        <h2
          id={titleId}
          className="text-[1.8125rem] leading-[2.125rem] tracking-[0.02em] text-navy lg:text-[2.1875rem] lg:leading-[2.75rem]"
        >
          {section.heading}
        </h2>
        {section.description && (
          <p className="mx-auto mt-[1.4375rem] max-w-[23.25rem] font-heading text-[0.9375rem] leading-[1.4375rem] tracking-[0.03em] text-muted lg:mt-6 lg:max-w-[35rem]">
            {section.description}
          </p>
        )}
      </div>

      {section.gallery.length > 0 && (
        <>
          <PhotoGrid images={mobilePhotos} className="mt-10 grid-cols-4 lg:hidden" />
          <PhotoGrid
            images={section.gallery}
            className="mt-[3.25rem] hidden grid-cols-11 lg:grid"
          />
        </>
      )}

      <div className="container-page">
        {section.testimonials.length > 0 && (
          <Carousel
            label="Customer reviews"
            showDots
            className="mx-auto mt-[1.625rem] w-[19.625rem] max-w-full lg:mt-[3.9375rem] lg:w-[71.4375rem] lg:max-w-[calc(100%-6rem)]"
            trackClassName="py-3 lg:items-start"
            slideClassName="basis-full px-2 lg:basis-1/3 lg:px-[1.3125rem]"
            prevClassName="mr-0.5 lg:top-[6.9375rem] lg:mr-[2.3125rem]"
            nextClassName="ml-1 lg:top-[6.9375rem] lg:ml-[2.1875rem]"
            dotsClassName="mt-1 lg:hidden"
            items={section.testimonials.map((testimonial) => ({
              key: testimonial.id,
              content: (
                <TestimonialCard
                  testimonial={testimonial}
                  variant="review"
                  className="h-full lg:h-auto"
                />
              ),
            }))}
          />
        )}

        {section.cta && (
          <CtaWithRating
            cta={section.cta}
            ratingText={ratingText}
            className="mt-4 lg:mt-[2.9375rem]"
          />
        )}
      </div>
    </section>
  )
}
