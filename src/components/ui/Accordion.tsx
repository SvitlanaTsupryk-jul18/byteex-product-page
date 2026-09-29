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

/**
 * Single-open accordion following the WAI-ARIA accordion pattern.
 * Height animates with the grid-template-rows 0fr -> 1fr technique.
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
                className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm text-navy"
              >
                {item.title}
                <span aria-hidden="true" className="relative size-3.5 shrink-0">
                  <span className="absolute top-1/2 left-0 h-px w-full bg-current" />
                  <span
                    className={cn(
                      'absolute top-0 left-1/2 h-full w-px bg-current transition-transform',
                      isOpen && 'scale-y-0',
                    )}
                  />
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
                <p className="pb-4 text-xs leading-relaxed text-muted">{item.content}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
