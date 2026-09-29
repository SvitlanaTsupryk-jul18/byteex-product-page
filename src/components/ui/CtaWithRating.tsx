import type { Cta } from '@/types/content'
import { cn } from '@/lib/cn'
import { CtaButton } from './CtaButton'
import { Rating } from './Rating'

interface CtaWithRatingProps {
  cta: Cta
  /** Social proof line, e.g. "Over 500+ 5 Star Reviews Online". Hidden when empty. */
  ratingText?: string
  /** Width and spacing of the whole block. The button fills it (369px wide in the mockup). */
  className?: string
}

/**
 * Recurring block from the mockup: navy CTA button with a five-star rating
 * line underneath. Used in several sections, mostly on mobile.
 */
export function CtaWithRating({ cta, ratingText, className }: CtaWithRatingProps) {
  return (
    <div
      className={cn(
        'mx-auto flex w-full max-w-[23.0625rem] flex-col items-center gap-2.5',
        className,
      )}
    >
      <CtaButton cta={cta} className="w-full" />
      {ratingText && (
        <p className="flex items-center gap-[0.9375rem] text-[0.8125rem] leading-5 text-subtle">
          <Rating value={5} className="text-[0.9375rem]" />
          {ratingText}
        </p>
      )}
    </div>
  )
}
