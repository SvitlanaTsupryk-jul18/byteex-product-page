import type { Feature, IconName, StepsSection as StepsSectionData } from '@/types/content'
import { cn } from '@/lib/cn'
import { Carousel } from '../ui/Carousel'
import { CtaWithRating } from '../ui/CtaWithRating'
import { Icon } from '../ui/Icon'

interface Props {
  section: StepsSectionData
  ratingText: string
}

/** Card backgrounds alternate as in the mockup: grey, cream, grey. */
const CARD_TONES = ['bg-mist', 'bg-cream', 'bg-mist']

/** Icon sizes from the mockup; each icon has its own proportions. */
const ICON_SIZE: Partial<Record<IconName, string>> = {
  ecoCart: 'h-10 w-[3.125rem]',
  truck: 'h-[2.9375rem] w-[4.125rem]',
  dayNight: 'size-[3.125rem]',
}

function StepCard({ step, index }: { step: Feature; index: number }) {
  return (
    <div
      className={cn(
        'flex h-full min-h-[18.0625rem] flex-col items-center rounded-lg px-9 pt-[4.375rem] pb-10 text-center lg:min-h-[20.0625rem] lg:pt-[4.8125rem]',
        CARD_TONES[index % CARD_TONES.length],
      )}
    >
      {step.icon && (
        <span className="flex h-[3.125rem] items-center justify-center text-navy">
          <Icon name={step.icon} className={ICON_SIZE[step.icon] ?? 'size-12'} />
        </span>
      )}
      <h3 className="mt-3.5 text-[1.375rem] leading-7 tracking-[0.02em] text-navy lg:mt-5">
        {step.title}
      </h3>
      {step.description && (
        <p className="mt-3 font-heading text-[0.9375rem] leading-[1.4375rem] tracking-[0.03em] text-muted lg:mt-4">
          {step.description}
        </p>
      )}
    </div>
  )
}

/**
 * "Comfort made easy" — how ordering works.
 * Mobile: one card at a time in a slider. Desktop (lg): three cards in a row.
 */
export function StepsSection({ section, ratingText }: Props) {
  const titleId = `${section.id}-title`

  return (
    <section aria-labelledby={titleId} className="pt-14 pb-12 lg:pt-[4.5rem] lg:pb-10">
      <div className="container-page">
        <h2
          id={titleId}
          className="text-center text-[1.8125rem] leading-[2.125rem] tracking-[0.02em] text-navy lg:text-[2.25rem] lg:leading-[2.75rem]"
        >
          {section.heading}
        </h2>

        <Carousel
          label={section.heading}
          className="mx-auto mt-[1.875rem] w-[18rem] max-w-[calc(100%-5rem)] lg:hidden"
          items={section.steps.map((step, index) => ({
            key: step.id,
            content: <StepCard step={step} index={index} />,
          }))}
        />

        <ol className="mx-auto mt-[2.875rem] hidden max-w-[70.0625rem] grid-cols-3 gap-[2.5625rem] lg:grid">
          {section.steps.map((step, index) => (
            <li key={step.id}>
              <StepCard step={step} index={index} />
            </li>
          ))}
        </ol>

        {section.cta && (
          <CtaWithRating cta={section.cta} ratingText={ratingText} className="mt-10 lg:mt-14" />
        )}
      </div>
    </section>
  )
}
