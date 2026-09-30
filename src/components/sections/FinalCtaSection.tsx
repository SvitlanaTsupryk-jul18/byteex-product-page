import type { CtaSection } from '@/types/content'
import { CtaWithRating } from '../ui/CtaWithRating'
import { ResponsiveImage } from '../ui/ResponsiveImage'

/** Width / height of the collage exported from Figma (1630 x 765). */
const COLLAGE_RATIO = 1630 / 765

interface Props {
  section: CtaSection
  ratingText: string
}

/**
 * "Find something you love." — the closing call to action:
 * heading, text, photo collage and the CTA with star rating (same on all screens).
 */
export function FinalCtaSection({ section, ratingText }: Props) {
  const titleId = `${section.id}-title`
  const [collage] = section.images

  return (
    <section
      id="shop"
      aria-labelledby={titleId}
      className="overflow-x-clip bg-linear-to-b from-white from-40% to-[#f7f0e7] pt-[3.4375rem] pb-[3.4375rem] text-center lg:pt-[5.125rem] lg:pb-20"
    >
      <div className="container-page">
        <h2
          id={titleId}
          className="text-[1.75rem] leading-[2.125rem] tracking-[0.02em] text-navy lg:text-[2.1875rem] lg:leading-[2.75rem]"
        >
          {section.heading}
        </h2>
        {section.description && (
          <p className="mx-auto mt-3.5 max-w-[23.25rem] font-heading text-[0.9375rem] leading-[1.375rem] tracking-[0.03em] text-muted lg:mt-[0.6875rem] lg:max-w-[35rem]">
            {section.description}
          </p>
        )}

        {collage && (
          <ResponsiveImage
            image={collage}
            aspectRatio={COLLAGE_RATIO}
            sizes="(min-width: 1024px) 815px, 100vw"
            className="mx-auto mt-8 h-auto w-full max-w-[50.9375rem] lg:mt-[2.1875rem]"
          />
        )}

        <CtaWithRating
          cta={section.cta}
          ratingText={ratingText}
          className="mt-[3.3125rem] lg:mt-[3.625rem]"
        />
      </div>
    </section>
  )
}
