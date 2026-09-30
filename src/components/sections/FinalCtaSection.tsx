import type { CtaSection, IconName } from '@/types/content'
import { CtaButton } from '../ui/CtaButton'
import { CtaWithRating } from '../ui/CtaWithRating'
import { Icon } from '../ui/Icon'
import { PaymentIcons } from '../ui/PaymentIcons'
import { ResponsiveImage } from '../ui/ResponsiveImage'

/** Width / height of the collage exported from Figma (1630 x 765). */
const COLLAGE_RATIO = 1630 / 765

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      className="size-3"
      aria-hidden="true"
    >
      <circle cx="6" cy="6" r="5.2" strokeWidth="1" />
      <path d="M6 3.2V6l1.9 1.2" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

/** Perk icon sizes inside the 31px badge; each icon has its own proportions. */
const PERK_ICON_SIZE: Partial<Record<IconName, string>> = {
  truck: 'h-4 w-[1.375rem]',
  ecoCart: 'h-4 w-5',
  shield: 'h-[1.1875rem] w-[1.125rem]',
}

interface Props {
  section: CtaSection
  ratingText: string
}

/**
 * "Find something you love." — the closing call to action.
 * Mobile: heading, text, collage and CTA with rating.
 * Desktop (lg): CTA without rating, shipping note with payment methods and a row of perks.
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
          className="mt-[3.3125rem] lg:hidden"
        />

        <div className="mt-[3.625rem] hidden flex-col items-center lg:flex">
          <CtaButton cta={section.cta} className="w-[23rem]" />

          <div className="mt-2 flex items-center">
            {section.shippingNote && (
              <p className="flex items-center gap-1 text-[0.6875rem] text-success">
                <ClockIcon />
                {section.shippingNote}
              </p>
            )}
            <span aria-hidden="true" className="mx-3.5 h-4 w-px bg-line" />
            <PaymentIcons className="flex gap-1" />
          </div>

          {section.perks.length > 0 && (
            <ul className="mt-5 flex">
              {section.perks.map((perk) => (
                <li
                  key={perk.id}
                  className="flex min-h-[3.25rem] items-center gap-[1.0625rem] border-l border-line pr-[1.875rem] pl-[1.375rem] text-left first:border-l-0 first:pl-0 last:pr-0"
                >
                  {perk.icon && (
                    <span className="grid size-[1.9375rem] shrink-0 place-items-center rounded-full bg-[#ececec] text-muted">
                      <Icon
                        name={perk.icon}
                        className={PERK_ICON_SIZE[perk.icon] ?? 'size-[1.125rem]'}
                      />
                    </span>
                  )}
                  <span className="max-w-[7.75rem] font-heading text-[0.9375rem] leading-5 tracking-[0.03em] text-muted">
                    {perk.title}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
