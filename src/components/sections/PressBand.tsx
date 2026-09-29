import type { CSSProperties } from 'react'
import type { Image } from '@/types/content'
import { Carousel } from '../ui/Carousel'
import { ResponsiveImage } from '../ui/ResponsiveImage'

/** Logos are uploaded at 2x, so the natural display width is half the file width. */
const PIXEL_DENSITY = 2

function PressLogo({ logo }: { logo: Image }) {
  if (!logo.url || !logo.width) {
    // Text fallback until logo files are uploaded to the CMS.
    return (
      <span className="block text-center font-heading text-xs tracking-widest text-[#bfbcb8] uppercase lg:text-2xl">
        {logo.alt}
      </span>
    )
  }

  // Each logo keeps its own size from the mockup; on mobile it is scaled down
  // and never wider than its carousel slot.
  const style = { '--logo-w': `${logo.width / PIXEL_DENSITY}px` } as CSSProperties
  return (
    <span style={style} className="block w-[calc(var(--logo-w)*0.68)] max-w-full lg:w-(--logo-w)">
      <ResponsiveImage image={logo} sizes="280px" className="h-auto w-full object-contain" />
    </span>
  )
}

interface PressBandProps {
  heading?: string
  logos: Image[]
}

/**
 * "As seen in" band shown right after the hero.
 * Its top slides under the hero testimonial card, as in the mockup, so the
 * cream background is rendered even before logos are uploaded to the CMS.
 */
export function PressBand({ heading, logos }: PressBandProps) {
  const hasLogos = logos.length > 0

  return (
    <div className="-mt-[4.5rem] bg-linear-to-b from-cream to-white pt-[5.5rem] pb-10 lg:-mt-[4.75rem] lg:pt-[5.25rem] lg:pb-16">
      {hasLogos && (
        <div className="container-page text-center">
          {heading && (
            <p className="font-heading text-base tracking-[0.02em] text-[#868787] lg:text-lg">
              {heading}
            </p>
          )}

          <ul className="mt-[1.125rem] hidden items-center justify-between gap-8 lg:flex">
            {logos.map((logo) => (
              <li key={logo.id}>
                <PressLogo logo={logo} />
              </li>
            ))}
          </ul>

          <Carousel
            label="Press mentions"
            className="mt-2 lg:hidden"
            slideClassName="flex min-w-0 basis-1/3 items-center justify-center px-2"
            trackClassName="items-center"
            showArrows={false}
            showDots
            items={logos.map((logo) => ({ key: logo.id, content: <PressLogo logo={logo} /> }))}
          />
        </div>
      )}
    </div>
  )
}
