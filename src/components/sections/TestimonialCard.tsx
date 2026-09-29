import type { Testimonial } from '@/types/content'
import { cn } from '@/lib/cn'
import { Rating } from '../ui/Rating'
import { ResponsiveImage } from '../ui/ResponsiveImage'

interface TestimonialCardProps {
  testimonial: Testimonial
  /** Hero variant: name, stars and badge in one row on desktop. */
  inlineOnDesktop?: boolean
  className?: string
}

export function TestimonialCard({
  testimonial,
  inlineOnDesktop = false,
  className,
}: TestimonialCardProps) {
  return (
    <figure
      className={cn(
        'rounded-md bg-white px-[1.125rem] pt-4 pb-5 shadow-[0_0_14px_rgb(0_0_0/0.08)] ring-1 ring-black/5 lg:px-5',
        className,
      )}
    >
      <figcaption className="flex items-center gap-4">
        {testimonial.avatar ? (
          <ResponsiveImage
            image={testimonial.avatar}
            aspectRatio={1}
            sizes="40px"
            className="size-[2.4375rem] shrink-0 rounded-full"
          />
        ) : (
          <span aria-hidden="true" className="size-[2.4375rem] shrink-0 rounded-full bg-navy" />
        )}
        {/* Name comes first for screen readers; column-reverse puts the stars on top visually. */}
        <div
          className={cn(
            'flex flex-col-reverse gap-0.5',
            inlineOnDesktop && 'lg:flex-row lg:items-center lg:gap-4',
          )}
        >
          <cite className="font-heading text-base tracking-[0.02em] whitespace-nowrap text-muted not-italic">
            {testimonial.author}
          </cite>
          <span
            className={cn(
              'flex flex-wrap items-center gap-x-2.5',
              inlineOnDesktop && 'lg:flex-nowrap lg:gap-x-2',
            )}
          >
            <Rating value={testimonial.rating} className="text-[0.6875rem]" />
            {testimonial.badge && (
              <span className="text-[0.6875rem] whitespace-nowrap text-subtle">
                {testimonial.badge}
              </span>
            )}
          </span>
        </div>
      </figcaption>
      <blockquote className="mt-3.5 text-sm leading-[1.375rem] tracking-[0.01em] text-muted lg:text-[0.8125rem] lg:leading-[1.4375rem]">
        <p>{testimonial.quote}</p>
      </blockquote>
    </figure>
  )
}
