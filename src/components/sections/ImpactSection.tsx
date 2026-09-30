import type { ImpactSection as ImpactSectionData } from '@/types/content'
import { Icon } from '../ui/Icon'

/**
 * "Our total green impact" — three stats on a grey band.
 * Mobile: stacked with horizontal dividers, title case heading, indigo text.
 * Desktop (lg): one row with vertical dividers, navy text.
 */
export function ImpactSection({ section }: { section: ImpactSectionData }) {
  const titleId = `${section.id}-title`

  return (
    <section
      aria-labelledby={titleId}
      className="bg-mist pt-[3.3125rem] pb-10 text-indigo lg:pt-9 lg:pb-8 lg:text-navy"
    >
      <div className="container-page">
        <h2
          id={titleId}
          className="text-center text-[1.75rem] leading-[2.125rem] tracking-[0.02em] max-lg:capitalize lg:text-[1.75rem] lg:leading-9"
        >
          {section.heading}
        </h2>

        <ul className="mx-auto mt-[2.6875rem] flex max-w-[17.75rem] flex-col lg:mt-[1.0625rem] lg:max-w-none lg:flex-row lg:justify-center">
          {section.stats.map((stat) => (
            <li
              key={stat.id}
              className="flex flex-col items-center border-b border-line pt-6 pb-6 text-center first:pt-0 last:border-b-0 lg:border-b-0 lg:border-l lg:px-[3.125rem] lg:pt-[0.5625rem] lg:pb-[0.8125rem] lg:first:border-l-0 lg:first:pt-[0.5625rem]"
            >
              {stat.icon && (
                <span className="grid size-[2.625rem] place-items-center rounded-full bg-[#e4e4e4] text-indigo">
                  <Icon name={stat.icon} className="size-full" />
                </span>
              )}
              <p className="mt-2.5 font-heading text-[1.1875rem] leading-7 font-semibold tracking-[0.02em]">
                {stat.title}
              </p>
              {stat.description && (
                <p className="font-heading text-[0.9375rem] leading-5 tracking-[0.02em]">
                  {stat.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
