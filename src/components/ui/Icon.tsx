import type { SVGProps } from 'react'
import type { IconName } from '@/types/content'

/**
 * Line icons referenced from the CMS by name.
 * Inline SVG: no extra requests, inherits currentColor.
 * TODO: replace paths with the exact icons exported from Figma.
 */
const PATHS: Record<IconName, string> = {
  sparkle: 'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6',
  leaf: 'M5 19c0-8 5-13 14-14-1 9-6 14-14 14Zm0 0 7-7',
  package: 'M4 8l8-4 8 4v8l-8 4-8-4V8Zm0 0 8 4 8-4M12 12v8',
  fabric: 'M4 7c3-2 5 2 8 0s5 2 8 0M4 12c3-2 5 2 8 0s5 2 8 0M4 17c3-2 5 2 8 0s5 2 8 0',
  hanger: 'M12 7a2 2 0 1 1 2-2M12 7v2L3 16h18l-9-7',
  heart: 'M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z',
  waves:
    'M4 8c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 4 0M4 13c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 4 0M4 18c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 4 0',
  cart: 'M3 4h2l2.5 11h10L20 7H7M9 20a1 1 0 1 0 0-.01M17 20a1 1 0 1 0 0-.01',
  truck: 'M3 6h11v10H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-.01M17 19a2 2 0 1 0 0-.01',
  sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5',
  cloud: 'M7 18h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 9.5 4.3 4.3 0 0 0 7 18Z',
  drop: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z',
  bolt: 'M13 2 4 14h7l-1 8 9-12h-7l1-8Z',
  shield: 'M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Zm-3 9 2 2 4-4',
}

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName
}

export function Icon({ name, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d={PATHS[name]} />
    </svg>
  )
}

export function ChevronIcon({
  direction,
  ...props
}: SVGProps<SVGSVGElement> & { direction: 'left' | 'right' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
      {...props}
    >
      <path d={direction === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
    </svg>
  )
}

export function ArrowRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 12"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
      {...props}
    >
      <path d="M0 6h22M17 1l5 5-5 5" />
    </svg>
  )
}
