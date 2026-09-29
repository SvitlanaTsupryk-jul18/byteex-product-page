import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { ChevronIcon } from './Icon'

interface CarouselProps {
  /** Accessible name of the carousel region. */
  label: string
  items: { key: string; content: ReactNode }[]
  /** Width of each slide, e.g. "basis-full md:basis-1/3". */
  slideClassName?: string
  trackClassName?: string
  className?: string
  showDots?: boolean
  showArrows?: boolean
}

/**
 * Lightweight carousel built on native CSS scroll-snap.
 * Works with touch/trackpad out of the box; arrows and dots are progressive
 * enhancement. No third-party slider library needed.
 */
export function Carousel({
  label,
  items,
  slideClassName = 'basis-full',
  trackClassName,
  className,
  showDots = false,
  showArrows = true,
}: CarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(items.length > 1)
  // Number of scroll positions, e.g. 5 slides with 3 visible -> 3 positions.
  const [positionCount, setPositionCount] = useState(items.length)

  const slideWidth = () => {
    const firstSlide = trackRef.current?.firstElementChild as HTMLElement | null
    return firstSlide?.offsetWidth ?? 1
  }

  const updateState = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const { scrollLeft, scrollWidth, clientWidth } = track
    const width = slideWidth()
    setActiveIndex(Math.round(scrollLeft / width))
    setPositionCount(Math.max(1, items.length - Math.round(clientWidth / width) + 1))
    setCanPrev(scrollLeft > 1)
    setCanNext(scrollLeft + clientWidth < scrollWidth - 1)
  }, [items.length])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(updateState)
    }
    updateState()
    track.addEventListener('scroll', onScroll, { passive: true })
    const resizeObserver = new ResizeObserver(onScroll)
    resizeObserver.observe(track)
    return () => {
      cancelAnimationFrame(frame)
      track.removeEventListener('scroll', onScroll)
      resizeObserver.disconnect()
    }
  }, [updateState])

  const scrollToIndex = (index: number) => {
    trackRef.current?.scrollTo({ left: index * slideWidth(), behavior: 'smooth' })
  }

  /** Arrows wrap around: "next" on the last position goes back to the first. */
  const scrollByStep = (direction: -1 | 1) => {
    const track = trackRef.current
    if (!track) return
    if (direction === 1 && !canNext) return track.scrollTo({ left: 0, behavior: 'smooth' })
    if (direction === -1 && !canPrev) {
      return track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' })
    }
    track.scrollBy({ left: direction * slideWidth(), behavior: 'smooth' })
  }

  const arrowClass =
    'absolute top-1/2 z-10 grid -translate-y-1/2 place-items-center p-2 text-ink-soft transition-opacity hover:opacity-70'
  const chevronClass = 'h-[1.0625rem] w-[0.5625rem] lg:h-[1.4375rem] lg:w-[0.6875rem]'

  return (
    <section
      aria-roledescription="carousel"
      aria-label={label}
      className={cn('relative', className)}
    >
      {/* Arrows are positioned against the slides only, not the dots below. */}
      <div className="relative">
        <ul
          ref={trackRef}
          className={cn(
            'flex snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto overscroll-x-contain [&::-webkit-scrollbar]:hidden',
            trackClassName,
          )}
        >
          {items.map((item, index) => (
            <li
              key={item.key}
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${items.length}`}
              className={cn('shrink-0 snap-start', slideClassName)}
            >
              {item.content}
            </li>
          ))}
        </ul>

        {showArrows && (
          <>
            <button
              type="button"
              onClick={() => scrollByStep(-1)}
              aria-label="Previous slide"
              className={cn(arrowClass, 'right-full mr-4')}
            >
              <ChevronIcon direction="left" className={chevronClass} />
            </button>
            <button
              type="button"
              onClick={() => scrollByStep(1)}
              aria-label="Next slide"
              className={cn(arrowClass, 'left-full ml-4')}
            >
              <ChevronIcon direction="right" className={chevronClass} />
            </button>
          </>
        )}
      </div>

      {showDots && positionCount > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: positionCount }, (_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => scrollToIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === activeIndex}
              className={cn(
                'size-[0.4375rem] rounded-full transition-colors',
                index === activeIndex ? 'bg-black' : 'bg-[#c4c4c4]',
              )}
            />
          ))}
        </div>
      )}
    </section>
  )
}
