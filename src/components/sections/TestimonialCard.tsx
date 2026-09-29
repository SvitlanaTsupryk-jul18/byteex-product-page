import type { Testimonial } from '@/types/content'
import { cn } from '@/lib/cn'
import { Rating } from '../ui/Rating'
import { ResponsiveImage } from '../ui/ResponsiveImage'

export function TestimonialCard({
  testimonial,
  className,
}: {
  testimonial: Testimonial
  className?: string
}) {
  return (
    <figure
      className={cn('rounded-md bg-white p-5 shadow-[0_2px_12px_rgb(0_0_0/0.08)]', className)}
    >
      <figcaption className="flex items-center gap-3">
        {testimonial.avatar ? (
          <ResponsiveImage
            image={testimonial.avatar}
            aspectRatio={1}
            sizes="32px"
            className="size-8 rounded-full"
          />
        ) : (
          <span aria-hidden="true" className="size-8 shrink-0 rounded-full bg-navy" />
        )}
        <div className="flex flex-col text-xs">
          <span className="flex flex-wrap items-center gap-x-2">
            <Rating value={testimonial.rating} className="text-[0.625rem]" />
            {testimonial.badge && (
              <span className="text-[0.625rem] text-muted">{testimonial.badge}</span>
            )}
          </span>
          <cite className="text-ink not-italic">{testimonial.author}</cite>
        </div>
      </figcaption>
      <blockquote className="mt-3 text-xs leading-relaxed text-muted">
        <p>{testimonial.quote}</p>
      </blockquote>
    </figure>
  )
}
