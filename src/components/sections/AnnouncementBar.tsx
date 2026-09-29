import { Fragment, useEffect, useState } from 'react'
import { cn } from '@/lib/cn'

const ROTATE_MS = 4000

/** Longest message that fits one line on a 428px phone at 11px. */
const MOBILE_MAX_CHARS = 36

/** Mobile starts with the first message that fits one line, as in the mockup. */
const firstFittingIndex = (items: string[]) =>
  Math.max(
    0,
    items.findIndex((item) => item.length <= MOBILE_MAX_CHARS),
  )

/**
 * Desktop: all messages in one row separated by "|".
 * Mobile: one message at a time, rotating (paused for reduced motion).
 */
export function AnnouncementBar({ items }: { items: string[] }) {
  const [active, setActive] = useState(() => firstFittingIndex(items))

  useEffect(() => {
    if (items.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(
      () => setActive((index) => (index + 1) % items.length),
      ROTATE_MS,
    )
    return () => window.clearInterval(timer)
  }, [items.length])

  if (items.length === 0) return null

  return (
    <aside
      aria-label="Announcements"
      className="bg-cream text-[0.6875rem] tracking-[0.06em] text-ink-soft"
    >
      <p className="container-page hidden min-h-9 items-center justify-center lg:flex">
        {items.map((item, index) => (
          <Fragment key={item}>
            {index > 0 && (
              <span aria-hidden="true" className="px-3 text-divider">
                |
              </span>
            )}
            <span>{item}</span>
          </Fragment>
        ))}
      </p>
      <div className="grid min-h-9 items-center text-center lg:hidden">
        {items.map((item, index) => (
          <p
            key={item}
            aria-hidden={index !== active}
            className={cn(
              'col-start-1 row-start-1 px-4 transition-opacity duration-500',
              index === active ? 'opacity-100' : 'opacity-0',
            )}
          >
            {item}
          </p>
        ))}
      </div>
    </aside>
  )
}
