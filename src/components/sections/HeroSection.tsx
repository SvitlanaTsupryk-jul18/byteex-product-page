import type { HeroSection as HeroSectionData, Image } from '@/types/content'
import { Carousel } from '../ui/Carousel'
import { CtaButton } from '../ui/CtaButton'
import { Icon } from '../ui/Icon'
import { ResponsiveImage } from '../ui/ResponsiveImage'
import { TestimonialCard } from './TestimonialCard'

/** Width / height of the collage exported from Figma (1450 x 889). */
const COLLAGE_RATIO = 1450 / 889

/**
 * Mockup frames: 428px (mobile) and 1465px (desktop).
 * Below `lg` the single-column mobile layout is used, since two columns
 * are too narrow on tablets.
 */
export function HeroSection({ section }: { section: HeroSectionData }) {
  const [collage] = section.images
  const titleId = `${section.id}-title`

  return (
    <section aria-labelledby={titleId} className="overflow-x-clip">
      {/*
        DOM order follows the mobile layout: heading, collage, content.
        On desktop, grid placement moves the collage into the right column.
      */}
      <div className="container-page grid pt-4 lg:grid-cols-[minmax(0,33rem)_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-10 lg:pt-14">
        <h1
          id={titleId}
          className="mx-auto max-w-[23rem] text-center text-[1.6875rem] leading-[2.125rem] tracking-[0.02em] text-navy lg:mx-0 lg:max-w-none lg:text-left lg:text-[2.5rem] lg:leading-[2.9375rem]"
        >
          {section.heading}
        </h1>

        <div className="mx-auto mt-3 w-full max-w-[34rem] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mx-0 lg:mt-2 lg:max-w-none xl:w-[46rem]">
          <ResponsiveImage
            image={collage}
            aspectRatio={COLLAGE_RATIO}
            sizes="(min-width: 1280px) 736px, (min-width: 1024px) 45vw, (min-width: 576px) 544px, 100vw"
            priority
            className="h-auto w-full"
          />
        </div>

        <div className="mx-auto flex w-full max-w-[23.5rem] flex-col lg:col-start-1 lg:row-start-2 lg:mx-0 lg:max-w-none">
          <ul className="mx-auto mt-4 flex max-w-[20.5rem] flex-col gap-6 lg:mx-0 lg:mt-8 lg:max-w-[26rem]">
            {section.features.map((feature) => (
              <li key={feature.id} className="flex items-center gap-4 lg:items-start">
                {feature.icon && (
                  <span className="grid size-[1.875rem] shrink-0 place-items-center rounded-full bg-cream text-navy lg:-mt-1">
                    <Icon name={feature.icon} className="size-[1.125rem]" />
                  </span>
                )}
                <p className="font-heading text-sm leading-[1.125rem] tracking-[0.02em] text-muted lg:text-[0.9375rem] lg:leading-[1.375rem]">
                  {feature.title}
                </p>
              </li>
            ))}
          </ul>

          <CtaButton cta={section.cta} className="mt-8 w-full lg:w-[22.1875rem]" />

          {section.testimonial && (
            // `relative` keeps the card above the press band that overlaps it.
            <TestimonialCard
              testimonial={section.testimonial}
              inlineOnDesktop
              eagerAvatar
              className="relative mt-8 lg:mt-12 lg:w-[26rem]"
            />
          )}
        </div>
      </div>

      <PressBand heading={section.pressHeading} logos={section.pressLogos} />
    </section>
  )
}

function PressLogo({ logo }: { logo: Image }) {
  return logo.url ? (
    <ResponsiveImage
      image={logo}
      sizes="180px"
      className="mx-auto h-8 w-auto object-contain lg:h-12"
    />
  ) : (
    // Text fallback until logo files are uploaded to the CMS.
    <span className="block text-center font-heading text-xs tracking-widest text-[#bfbcb8] uppercase lg:text-2xl">
      {logo.alt}
    </span>
  )
}

/**
 * "As seen in" band. Its top slides under the testimonial card, as in the mockup.
 * The background is always rendered; heading and logos appear once logos exist in the CMS.
 */
function PressBand({ heading, logos }: { heading?: string; logos: Image[] }) {
  return (
    <div className="-mt-[4.5rem] bg-linear-to-b from-cream to-white pt-24 pb-12 lg:-mt-[4.75rem] lg:pt-[9.75rem] lg:pb-16">
      <div className="container-page text-center">
        {logos.length > 0 && heading && (
          <p className="font-heading text-base tracking-[0.02em] text-[#868787] lg:text-lg">
            {heading}
          </p>
        )}

        {logos.length > 0 && (
          <>
            <ul className="mt-7 hidden items-center justify-between gap-8 lg:flex">
              {logos.map((logo) => (
                <li key={logo.id}>
                  <PressLogo logo={logo} />
                </li>
              ))}
            </ul>

            <Carousel
              label="Press mentions"
              className="mt-4 lg:hidden"
              slideClassName="basis-1/3 px-2 grid place-items-center"
              trackClassName="items-center"
              showArrows={false}
              showDots
              items={logos.map((logo) => ({ key: logo.id, content: <PressLogo logo={logo} /> }))}
            />
          </>
        )}
      </div>
    </div>
  )
}
