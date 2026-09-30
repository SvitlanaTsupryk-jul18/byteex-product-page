import type { Image } from '@/types/content'
import { responsiveImageAttrs } from '@/lib/image'
import { cn } from '@/lib/cn'

interface ResponsiveImageProps {
  image: Image | undefined
  /** `sizes` attribute, e.g. "(min-width: 1024px) 33vw, 100vw". */
  sizes: string
  className?: string
  /** Optional crop ratio (width / height). */
  aspectRatio?: number
  /** Set for above-the-fold images (LCP candidates). */
  priority?: boolean
  /** Load immediately without raising fetch priority (small above-the-fold images). */
  eager?: boolean
}

/**
 * Image with Contentful-generated srcset, WebP output and explicit
 * dimensions to prevent layout shift. Renders a neutral placeholder
 * when the CMS has no asset yet.
 */
export function ResponsiveImage({
  image,
  sizes,
  className,
  aspectRatio,
  priority = false,
  eager = false,
}: ResponsiveImageProps) {
  if (!image?.url) {
    return (
      <div
        role="img"
        aria-label={image?.alt ?? ''}
        className={cn('bg-sand', className)}
        style={aspectRatio ? { aspectRatio } : undefined}
      />
    )
  }

  const width = image.width ?? 800
  const height = aspectRatio
    ? Math.round(width / aspectRatio)
    : (image.height ?? Math.round(width * 1.25))

  return (
    <img
      {...responsiveImageAttrs(image.url, image.width, aspectRatio)}
      sizes={sizes}
      alt={image.alt}
      width={width}
      height={height}
      loading={priority || eager ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      className={cn('object-cover', className)}
      style={aspectRatio ? { aspectRatio } : undefined}
    />
  )
}
