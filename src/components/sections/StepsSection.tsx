import type { Feature, StepsSection as StepsSectionData } from '@/types/content'
import { cn } from '@/lib/cn'
import { Carousel } from '../ui/Carousel'
import { CtaWithRating } from '../ui/CtaWithRating'
import { Icon } from '../ui/Icon'
import { SectionHeading } from '../ui/SectionHeading'

interface Props {
  section: StepsSectionData
  ratingText: string
}

// Card backgrounds alternate as in the design.
const CARD_TONES = ['bg-mist', 'bg-cream', 'bg-mist']

function StepCard({ step, index }: { step: Feature; index: number }) {
  return (
    <div
      className={cn(
        'flex h-full flex-col items-center gap-3 px-6 py-10 text-center',
        CARD_TONES[index % CARD_TONES.length],
      )}
    >
      {step.icon && <Icon name={step.icon} className="size-8 text-navy" />}
      <h3 className="text-base text-navy">{step.title}</h3>
      {step.description && <p className="text-xs leading-relaxed text-muted">{step.description}</p>}
    </div>
  )
}

export function StepsSection({ section, ratingText }: Props) {
  return (
    <section aria-labelledby={`${section.id}-title`} className="py-12 md:py-20">
      <div className="container-page flex flex-col items-center gap-8">
        <SectionHeading className="text-center">
          <span id={`${section.id}-title`}>{section.heading}</span>
        </SectionHeading>

        {/* Mobile: carousel. Desktop: three columns. */}
        <Carousel
          label={section.heading}
          className="w-full max-w-xs md:hidden"
          items={section.steps.map((step, index) => ({
            key: step.id,
            content: <StepCard step={step} index={index} />,
          }))}
        />
        <ol className="hidden w-full max-w-3xl grid-cols-3 gap-4 md:grid">
          {section.steps.map((step, index) => (
            <li key={step.id}>
              <StepCard step={step} index={index} />
            </li>
          ))}
        </ol>

        {section.cta && (
          <CtaWithRating cta={section.cta} ratingText={ratingText} className="w-full" />
        )}
      </div>
    </section>
  )
}
