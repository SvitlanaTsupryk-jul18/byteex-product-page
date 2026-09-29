import type { HeroSection as HeroSectionData } from '@/types/content'
import { CtaButton } from '../ui/CtaButton'
import { ResponsiveImage } from '../ui/ResponsiveImage'
import { SectionHeading } from '../ui/SectionHeading'
import { FeatureItem } from './FeatureItem'
import { TestimonialCard } from './TestimonialCard'

export function HeroSection({ section }: { section: HeroSectionData }) {
  const [left, center, right] = section.images

  return (
    <section aria-labelledby={`${section.id}-title`} className="bg-linear-to-b from-white to-cream">
      {/*
        DOM order follows the mobile layout (heading, images, content).
        On desktop, grid placement moves the images into the right column.
      */}
      <div className="container-page grid gap-6 py-8 md:grid-cols-2 md:grid-rows-[auto_1fr] md:gap-x-10 md:py-12">
        <SectionHeading as="h1" className="text-center md:self-end md:text-left">
          <span id={`${section.id}-title`}>{section.heading}</span>
        </SectionHeading>

        <div className="grid grid-cols-[1fr_1.3fr_1fr] items-center gap-2 md:col-start-2 md:row-span-2 md:row-start-1">
          <ResponsiveImage image={left} aspectRatio={0.6} sizes="(min-width: 768px) 15vw, 30vw" />
          <ResponsiveImage
            image={center}
            aspectRatio={0.55}
            sizes="(min-width: 768px) 20vw, 40vw"
            priority
          />
          <ResponsiveImage image={right} aspectRatio={0.6} sizes="(min-width: 768px) 15vw, 30vw" />
        </div>

        <div className="flex flex-col gap-6 md:col-start-1 md:row-start-2">
          <ul className="grid gap-4">
            {section.features.map((feature) => (
              <li key={feature.id}>
                <FeatureItem feature={feature} />
              </li>
            ))}
          </ul>

          <CtaButton cta={section.cta} className="w-full md:w-fit" />

          {section.testimonial && (
            <TestimonialCard testimonial={section.testimonial} className="max-w-sm" />
          )}
        </div>
      </div>

      {section.pressLogos.length > 0 && (
        <div className="container-page pb-10 text-center">
          {section.pressHeading && (
            <p className="mb-4 text-xs text-muted">{section.pressHeading}</p>
          )}
          <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-60 md:justify-between">
            {section.pressLogos.map((logo) => (
              <li key={logo.id} className="h-8 w-28">
                {logo.url ? (
                  <ResponsiveImage
                    image={logo}
                    sizes="112px"
                    className="size-full object-contain"
                  />
                ) : (
                  <span className="grid size-full place-items-center text-xs tracking-widest uppercase">
                    {logo.alt}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
