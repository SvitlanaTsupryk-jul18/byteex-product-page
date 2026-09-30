import type { CSSProperties } from 'react'
import type { Image } from '@/types/content'
import { cn } from '@/lib/cn'
import { ResponsiveImage } from './ResponsiveImage'

interface MarqueeProps {
  images: Image[]
  /** Scroll to the right instead of the left. */
  reverse?: boolean
  /**
   * How many times the photos repeat inside each half of the track.
   * Each half must be wider than the screen for the loop to look seamless.
   */
  repeat?: number
  /** Seconds one photo takes to scroll past; keeps speed independent of count. */
  secondsPerItem?: number
  className?: string
  tileClassName: string
}

/**
 * Endless row of photos. The track holds two identical halves and slides by
 * exactly one half (-50%), so the loop has no visible jump. Pauses on hover
 * and stays still for users who prefer reduced motion.
 */
export function Marquee({
  images,
  reverse = false,
  repeat = 1,
  secondsPerItem = 3,
  className,
  tileClassName,
}: MarqueeProps) {
  const half = Array.from({ length: repeat }, () => images).flat()
  const style = { '--marquee-duration': `${half.length * secondsPerItem}s` } as CSSProperties

  return (
    <div className={cn('group overflow-hidden', className)}>
      <div
        style={style}
        className={cn(
          'flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none',
          reverse && '[animation-direction:reverse]',
        )}
      >
        {[0, 1].map((copy) => (
          // Only the first half is exposed to assistive tech; the rest are visual repeats.
          <ul
            key={copy}
            aria-hidden={copy === 1 || undefined}
            className="flex shrink-0 gap-[0.3125rem] pr-[0.3125rem] lg:gap-1.5 lg:pr-1.5"
          >
            {half.map((image, index) => {
              const isRepeat = copy === 1 || index >= images.length
              return (
                <li key={`${image.id}-${index}`} className={cn('shrink-0', tileClassName)}>
                  <ResponsiveImage
                    image={isRepeat ? { ...image, alt: '' } : image}
                    aspectRatio={1}
                    sizes="130px"
                    className="w-full"
                  />
                </li>
              )
            })}
          </ul>
        ))}
      </div>
    </div>
  )
}
