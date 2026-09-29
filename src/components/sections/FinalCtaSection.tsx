import type { CtaSection } from '@/types/content'
import { CtaButton } from '../ui/CtaButton'
import { Icon } from '../ui/Icon'
import { ResponsiveImage } from '../ui/ResponsiveImage'
import { SectionHeading } from '../ui/SectionHeading'

export function FinalCtaSection({ section }: { section: CtaSection }) {
  const [left, center, right] = section.images

  return (
    <section
      id="shop"
      aria-labelledby={`${section.id}-title`}
      className="bg-linear-to-b from-white to-cream py-12 md:py-20"
    >
      <div className="container-page flex flex-col items-center gap-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <SectionHeading>
            <span id={`${section.id}-title`}>{section.heading}</span>
          </SectionHeading>
          {section.description && (
            <p className="max-w-md text-xs leading-relaxed text-muted">{section.description}</p>
          )}
        </div>

        <div className="grid w-full max-w-xl grid-cols-[1fr_1.2fr_1fr] items-center gap-1">
          <ResponsiveImage image={left} aspectRatio={0.66} sizes="(min-width: 768px) 180px, 30vw" />
          <ResponsiveImage
            image={center}
            aspectRatio={0.66}
            sizes="(min-width: 768px) 220px, 40vw"
          />
          <ResponsiveImage
            image={right}
            aspectRatio={0.66}
            sizes="(min-width: 768px) 180px, 30vw"
          />
        </div>

        <div className="flex w-full flex-col items-center gap-2">
          <CtaButton cta={section.cta} className="w-full sm:w-auto sm:min-w-64" />
          {section.shippingNote && (
            <p className="text-[0.625rem] text-success">{section.shippingNote}</p>
          )}
        </div>

        {section.perks.length > 0 && (
          <ul className="flex flex-col gap-4 divide-line sm:flex-row sm:gap-0 sm:divide-x">
            {section.perks.map((perk) => (
              <li
                key={perk.id}
                className="flex items-center gap-3 px-6 text-left text-xs text-muted"
              >
                {perk.icon && (
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-mist text-navy">
                    <Icon name={perk.icon} className="size-4" />
                  </span>
                )}
                <span className="max-w-32">{perk.title}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
