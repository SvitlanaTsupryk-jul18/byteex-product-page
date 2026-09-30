import type { Cta } from '@/types/content'
import { cn } from '@/lib/cn'
import { ArrowRightIcon } from './Icon'

interface CtaButtonProps {
  cta: Cta
  /** The mockup shows the arrow on most CTAs, but not on all of them. */
  showArrow?: boolean
  className?: string
}

/** Primary navy call-to-action link styled as a button. */
export function CtaButton({ cta, showArrow = true, className }: CtaButtonProps) {
  return (
    <a
      href={cta.href}
      className={cn(
        'inline-flex min-h-14 items-center justify-center gap-4 rounded bg-navy px-6 font-body text-lg tracking-[0.01em] text-white transition-colors lg:gap-5',
        // Keeps the longest label on one line on 320px phones.
        'max-[359px]:gap-3 max-[359px]:px-4 max-[359px]:text-base',
        'hover:bg-navy-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy',
        className,
      )}
    >
      {cta.label}
      {showArrow && <ArrowRightIcon className="h-2.5 w-[1.375rem] shrink-0" />}
    </a>
  )
}
