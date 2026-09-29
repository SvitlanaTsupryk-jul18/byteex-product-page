import type { Cta } from '@/types/content'
import { cn } from '@/lib/cn'
import { ArrowRightIcon } from './Icon'
import { Rating } from './Rating'

interface CtaButtonProps {
  cta: Cta
  className?: string
}

export function CtaButton({ cta, className }: CtaButtonProps) {
  return (
    <a
      href={cta.href}
      className={cn(
        'inline-flex min-h-12 items-center justify-center gap-3 rounded-sm bg-navy px-8 py-3 font-heading text-sm font-medium tracking-wide text-white transition-colors',
        'hover:bg-navy-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy',
        className,
      )}
    >
      {cta.label}
      <ArrowRightIcon className="h-3 w-6" />
    </a>
  )
}

interface CtaWithRatingProps extends CtaButtonProps {
  ratingText?: string
}

/** Recurring pattern in the design: CTA button with a star rating line below. */
export function CtaWithRating({ cta, ratingText, className }: CtaWithRatingProps) {
  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <CtaButton cta={cta} className="w-full sm:w-auto sm:min-w-64" />
      {ratingText && (
        <p className="flex items-center gap-2 text-xs text-muted">
          <Rating value={5} className="text-sm" />
          {ratingText}
        </p>
      )}
    </div>
  )
}
