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
}: CarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(items.length > 1)

  const slideWidth = () => {
    const firstSlide = trackRef.current?.firstElementChild as HTMLElement | null
    return firstSlide?.offsetWidth ?? 1
  }

  const updateState = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const { scrollLeft, scrollWidth, clientWidth } = track
    setActiveIndex(Math.round(scrollLeft / slideWidth()))
    setCanPrev(scrollLeft > 1)
    setCanNext(scrollLeft + clientWidth < scrollWidth - 1)
  }, [])

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

  const scrollByStep = (direction: -1 | 1) => {
    trackRef.current?.scrollBy({ left: direction * slideWidth(), behavior: 'smooth' })
  }

  const arrowClass =
    'absolute top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center text-ink transition-opacity disabled:pointer-events-none disabled:opacity-30'

  return (
    <section
      aria-roledescription="carousel"
      aria-label={label}
      className={cn('relative', className)}
    >
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

      <button
        type="button"
        onClick={() => scrollByStep(-1)}
        disabled={!canPrev}
        aria-label="Previous slide"
        className={cn(arrowClass, '-left-2 md:-left-12')}
      >
        <ChevronIcon direction="left" className="size-6" />
      </button>
      <button
        type="button"
        onClick={() => scrollByStep(1)}
        disabled={!canNext}
        aria-label="Next slide"
        className={cn(arrowClass, '-right-2 md:-right-12')}
      >
        <ChevronIcon direction="right" className="size-6" />
      </button>

      {showDots && items.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {items.map((item, index) => (
            <button
              key={item.key}
              type="button"
              onClick={() => scrollToIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === activeIndex}
              className={cn(
                'size-1.5 rounded-full transition-colors',
                index === activeIndex ? 'bg-ink' : 'bg-line',
              )}
            />
          ))}
        </div>
      )}
    </section>
  )
}
