import { useId, useState } from 'react'
import { cn } from '@/lib/cn'

interface AccordionItem {
  id: string
  title: string
  content: string
}

interface AccordionProps {
  items: AccordionItem[]
  /** Index of the item opened on first render. */
  defaultOpenIndex?: number
  className?: string
}

/** Plus that turns into a minus when the item is open (16px, as in the mockup). */
function ToggleIcon({ open }: { open: boolean }) {
  return (
    <span aria-hidden="true" className="relative mt-1.5 size-4 shrink-0">
      <span className="absolute top-1/2 left-0 h-[1.5px] w-full -translate-y-1/2 bg-current" />
      <span
        className={cn(
          'absolute top-0 left-1/2 h-full w-[1.5px] -translate-x-1/2 bg-current transition-transform duration-300',
          open && 'scale-y-0',
        )}
      />
    </span>
  )
}

/**
 * Single-open accordion following the WAI-ARIA accordion pattern.
 * Closed rows are 72px high; an open row keeps the answer close to its
 * question. Height animates with the grid-template-rows 0fr -> 1fr technique.
 */
export function Accordion({ items, defaultOpenIndex = 0, className }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex)
  const baseId = useId()

  return (
    <div className={cn('border-t border-line', className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index
        const buttonId = `${baseId}-button-${index}`
        const panelId = `${baseId}-panel-${index}`

        return (
          <div key={item.id} className="border-b border-line">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className={cn(
                  'flex w-full items-start justify-between gap-6 pt-5 text-left text-[1.1875rem] leading-7 tracking-[0.03em] text-navy transition-[padding] duration-300',
                  isOpen ? 'pb-1' : 'pb-6',
                )}
              >
                {item.title}
                <span className="mr-2 flex lg:mr-[2.4375rem]">
                  <ToggleIcon open={isOpen} />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                'grid transition-[grid-template-rows] duration-300',
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              )}
            >
              <div className="overflow-hidden" inert={!isOpen}>
                <p className="pr-5 pb-4 font-heading text-sm leading-5 tracking-[0.03em] text-muted lg:pr-[4.75rem] lg:pb-6 lg:text-[0.9375rem] lg:leading-[1.375rem]">
                  {item.content}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
