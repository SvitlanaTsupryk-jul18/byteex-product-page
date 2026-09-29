import { cn } from '@/lib/cn'

interface RatingProps {
  value: number
  max?: number
  className?: string
}

/** Star rating, announced to screen readers as text. */
export function Rating({ value, max = 5, className }: RatingProps) {
  return (
    <span
      role="img"
      aria-label={`Rated ${value} out of ${max}`}
      className={cn('inline-flex gap-0.5 text-star', className)}
    >
      {Array.from({ length: max }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="size-[1em]" aria-hidden="true">
          <path
            fill={i < value ? 'currentColor' : 'none'}
            stroke="currentColor"
            d="m10 1.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5Z"
          />
        </svg>
      ))}
    </span>
  )
}
