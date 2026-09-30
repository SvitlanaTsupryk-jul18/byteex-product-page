import type { LandingPage } from '@/types/content'
import { normalizeSiteUrl, serializeJsonLd, shareImage, SITE_NAME, structuredData } from '@/lib/seo'

const SITE_URL = normalizeSiteUrl(import.meta.env.VITE_SITE_URL)

/**
 * Title, description, link preview tags and structured data.
 * React 19 hoists <title>, <meta> and <link> into <head>; the prerender step
 * then ships them in the static HTML, where crawlers without JS can read them.
 */
export function SeoTags({ page }: { page: LandingPage }) {
  const { title, description } = page.seo
  const image = shareImage(page)

  return (
    <>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {SITE_URL && <link rel="canonical" href={SITE_URL} />}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      {SITE_URL && <meta property="og:url" content={SITE_URL} />}
      {image && (
        <>
          <meta property="og:image" content={image.url} />
          <meta property="og:image:width" content={String(image.width)} />
          <meta property="og:image:height" content={String(image.height)} />
          {image.alt && <meta property="og:image:alt" content={image.alt} />}
        </>
      )}
      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData(page, SITE_URL)) }}
      />
    </>
  )
}
