import { useState, type SVGProps } from 'react'
import type { Product } from '@/types/content'
import { cn } from '@/lib/cn'
import { ResponsiveImage } from './ResponsiveImage'

/** Portrait ratio of the product photos (866 x 1296). */
const MAIN_RATIO = 866 / 1296

/** Thin chevron from the mockup (11 x 23 on desktop). */
function Chevron({
  direction,
  ...props
}: SVGProps<SVGSVGElement> & { direction: 'left' | 'right' }) {
  return (
    <svg
      viewBox="0 0 12 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      aria-hidden="true"
      {...props}
    >
      <path d={direction === 'left' ? 'M11 1 1 12l10 11' : 'M1 1l10 11L1 23'} />
    </svg>
  )
}

const arrowClass =
  'absolute top-1/2 grid -translate-y-1/2 place-items-center p-2 text-ink-soft transition-opacity hover:opacity-70'

/**
 * Product photo slider: main image, prev/next arrows outside the photo and a
 * thumbnail strip over its bottom edge. Arrows wrap around.
 */
export function ProductGallery({ product, className }: { product: Product; className?: string }) {
  const [active, setActive] = useState(0)
  const count = product.images.length
  if (count === 0) return null

  const go = (delta: number) => setActive((index) => (index + delta + count) % count)

  return (
    <figure className={cn('flex flex-col items-center', className)}>
      <div className="relative w-full">
        <ResponsiveImage
          image={product.images[active]}
          aspectRatio={MAIN_RATIO}
          sizes="(min-width: 1024px) 432px, 304px"
          className="w-full"
        />

        <ul className="absolute inset-x-0 bottom-[0.5625rem] flex justify-center gap-1.5 lg:gap-[0.5625rem]">
          {product.images.map((image, index) => (
            <li key={image.id}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show image ${index + 1} of ${count}`}
                aria-current={index === active}
                className={cn(
                  'block size-[1.4375rem] border-2 transition-colors lg:size-[1.9375rem]',
                  index === active ? 'border-white' : 'border-transparent',
                )}
              >
                <ResponsiveImage image={image} aspectRatio={1} sizes="32px" className="size-full" />
              </button>
            </li>
          ))}
        </ul>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className={cn(arrowClass, 'right-full mr-[0.5625rem] lg:mr-3')}
            >
              <Chevron
                direction="left"
                className="h-[1.0625rem] w-[0.5625rem] lg:h-[1.4375rem] lg:w-[0.6875rem]"
              />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className={cn(arrowClass, 'left-full ml-[0.5625rem] lg:ml-[1.4375rem]')}
            >
              <Chevron
                direction="right"
                className="h-[1.0625rem] w-[0.5625rem] lg:h-[1.4375rem] lg:w-[0.6875rem]"
              />
            </button>
          </>
        )}
      </div>
      <figcaption className="mt-2 text-[0.8125rem] leading-5 text-ink-soft lg:mt-3.5">
        {product.name}
      </figcaption>
    </figure>
  )
}
