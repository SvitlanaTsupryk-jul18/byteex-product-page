import type { ImpactSection as ImpactSectionData } from '@/types/content'
import { Icon } from '../ui/Icon'
import { SectionHeading } from '../ui/SectionHeading'

export function ImpactSection({ section }: { section: ImpactSectionData }) {
  return (
    <section aria-labelledby={`${section.id}-title`} className="bg-mist py-10">
      <div className="container-page flex flex-col items-center gap-6">
        <SectionHeading className="text-center">
          <span id={`${section.id}-title`}>{section.heading}</span>
        </SectionHeading>
        <dl className="flex flex-col divide-line sm:flex-row sm:divide-x">
          {section.stats.map((stat) => (
            <div key={stat.id} className="flex flex-col items-center gap-1 px-8 py-3 text-center">
              {stat.icon && (
                <span className="mb-1 grid size-8 place-items-center rounded-full bg-white text-navy">
                  <Icon name={stat.icon} className="size-4" />
                </span>
              )}
              {/* dt must precede dd in markup; CSS order puts the value on top visually. */}
              {stat.description && (
                <dt className="order-2 text-xs text-muted">{stat.description}</dt>
              )}
              <dd className="order-1 font-heading text-base font-medium text-navy">{stat.title}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
