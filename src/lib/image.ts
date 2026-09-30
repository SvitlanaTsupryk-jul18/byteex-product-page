/**
 * Helpers for the Contentful Images API.
 * https://www.contentful.com/developers/docs/references/images-api/
 */

const CONTENTFUL_IMAGE_HOST = 'images.ctfassets.net'
const DEFAULT_WIDTHS = [320, 480, 640, 800, 1080, 1440, 1920]

export interface ImageTransform {
  width?: number
  height?: number
  quality?: number
  fit?: 'fill' | 'pad' | 'scale' | 'crop' | 'thumb'
}

export const isContentfulImage = (url: string) => url.includes(CONTENTFUL_IMAGE_HOST)

const isVector = (url: string) => url.toLowerCase().endsWith('.svg')

/** Builds a resized, re-encoded image url. Non-Contentful urls are returned unchanged. */
export function imageUrl(url: string, { width, height, quality = 75, fit }: ImageTransform = {}) {
  if (!isContentfulImage(url) || isVector(url)) return url
  const params = new URLSearchParams({ fm: 'webp', q: String(quality) })
  if (width) params.set('w', String(Math.round(width)))
  if (height) params.set('h', String(Math.round(height)))
  if (fit) params.set('fit', fit)
  return `${url}?${params}`
}

/** srcset limited to the source width, so we never upscale. */
export function imageSrcSet(url: string, sourceWidth?: number, aspectRatio?: number) {
  if (!isContentfulImage(url) || isVector(url)) return undefined
  const widths = DEFAULT_WIDTHS.filter((w) => !sourceWidth || w <= sourceWidth)
  if (sourceWidth && !widths.includes(sourceWidth) && sourceWidth < DEFAULT_WIDTHS.at(-1)!) {
    widths.push(sourceWidth)
  }
  return widths
    .map((w) => {
      const height = aspectRatio ? w / aspectRatio : undefined
      return `${imageUrl(url, { width: w, height, fit: aspectRatio ? 'fill' : undefined })} ${w}w`
    })
    .join(', ')
}

/** Largest width used for the plain `src` fallback. */
const MAX_SRC_WIDTH = 1080

/**
 * `src` and `srcset` for an image. Shared by <ResponsiveImage> and the build-time
 * preload tag, which must produce identical URLs for the preload to be reused.
 */
export function responsiveImageAttrs(url: string, sourceWidth?: number, aspectRatio?: number) {
  const width = Math.min(sourceWidth ?? 800, MAX_SRC_WIDTH)
  return {
    src: imageUrl(url, {
      width,
      height: aspectRatio ? width / aspectRatio : undefined,
      fit: aspectRatio ? 'fill' : undefined,
    }),
    srcSet: imageSrcSet(url, sourceWidth, aspectRatio),
  }
}
