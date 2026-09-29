import { useState } from 'react'
import type { Product } from '@/types/content'
import { cn } from '@/lib/cn'
import { ChevronIcon } from './Icon'
import { ResponsiveImage } from './ResponsiveImage'

const MAIN_RATIO = 0.67
const THUMB_RATIO = 0.8

/** Main product image with prev/next arrows and a thumbnail strip. */
export function ProductGallery({ product, className }: { product: Product; className?: string }) {
  const [active, setActive] = useState(0)
  const count = product.images.length
  if (count === 0) return null

  const go = (delta: number) => setActive((index) => (index + delta + count) % count)

  return (
    <figure className={cn('flex flex-col items-center gap-2', className)}>
      <div className="relative w-full">
        <div className="relative">
          <ResponsiveImage
            image={product.images[active]}
            aspectRatio={MAIN_RATIO}
            sizes="(min-width: 1024px) 400px, 80vw"
            className="w-full"
          />
          <ul className="absolute inset-x-0 bottom-3 flex justify-center gap-1 px-3">
            {product.images.map((image, index) => (
              <li key={image.id}>
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Show image ${index + 1} of ${count}`}
                  aria-current={index === active}
                  className={cn(
                    'block w-7 border bg-white p-px transition-colors',
                    index === active ? 'border-ink' : 'border-transparent',
                  )}
                >
                  <ResponsiveImage
                    image={image}
                    aspectRatio={THUMB_RATIO}
                    sizes="28px"
                    className="w-full"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute top-1/2 -left-10 hidden -translate-y-1/2 p-2 sm:block"
            >
              <ChevronIcon direction="left" className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute top-1/2 -right-10 hidden -translate-y-1/2 p-2 sm:block"
            >
              <ChevronIcon direction="right" className="size-5" />
            </button>
          </>
        )}
      </div>
      <figcaption className="text-xs text-muted">{product.name}</figcaption>
    </figure>
  )
}
