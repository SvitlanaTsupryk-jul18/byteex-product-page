import type { Testimonial } from '@/types/content'
import { cn } from '@/lib/cn'
import { Rating } from '../ui/Rating'
import { ResponsiveImage } from '../ui/ResponsiveImage'

/** Spacing and type sizes of the two card styles in the mockup. */
const VARIANTS = {
  hero: {
    card: 'px-[1.125rem] pt-4 pb-5 lg:px-5',
    avatar: 'size-[2.4375rem]',
    quote: 'mt-3.5 text-sm leading-[1.375rem] lg:text-[0.8125rem] lg:leading-[1.4375rem]',
  },
  review: {
    card: 'px-8 pt-[1.6875rem] pb-8 lg:px-10 lg:pt-7 lg:pb-7',
    avatar: 'size-[2.1875rem] lg:size-[2.4375rem]',
    quote: 'mt-4 text-[0.8125rem] leading-5 lg:mt-3.5 lg:leading-[1.4375rem]',
  },
}

interface TestimonialCardProps {
  testimonial: Testimonial
  variant?: keyof typeof VARIANTS
  /** Hero variant: name, stars and badge in one row on desktop. */
  inlineOnDesktop?: boolean
  /** Set when the card is above the fold. */
  eagerAvatar?: boolean
  className?: string
}

export function TestimonialCard({
  testimonial,
  variant = 'hero',
  inlineOnDesktop = false,
  eagerAvatar = false,
  className,
}: TestimonialCardProps) {
  const styles = VARIANTS[variant]
  return (
    <figure
      className={cn(
        'rounded-md bg-white shadow-[0_0_14px_rgb(0_0_0/0.08)] ring-1 ring-black/5',
        styles.card,
        className,
      )}
    >
      <figcaption className="flex items-center gap-4">
        {testimonial.avatar ? (
          <ResponsiveImage
            image={testimonial.avatar}
            aspectRatio={1}
            sizes="40px"
            eager={eagerAvatar}
            className={cn('shrink-0 rounded-full', styles.avatar)}
          />
        ) : (
          <span
            aria-hidden="true"
            className={cn('shrink-0 rounded-full bg-avatar', styles.avatar)}
          />
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
      <blockquote className={cn('tracking-[0.01em] text-muted', styles.quote)}>
        <p>{testimonial.quote}</p>
      </blockquote>
    </figure>
  )
}
