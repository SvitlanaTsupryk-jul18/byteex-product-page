import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'

const ROTATE_MS = 4000

/**
 * Desktop: all messages in one row separated by dividers.
 * Mobile: one message at a time, rotating (paused for reduced motion).
 */
export function AnnouncementBar({ items }: { items: string[] }) {
  const [active, setActive] = useState(0)

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
    <aside aria-label="Announcements" className="bg-cream text-[0.625rem] tracking-wider uppercase">
      <ul className="container-page hidden items-center justify-center divide-x divide-ink/30 py-2 md:flex">
        {items.map((item) => (
          <li key={item} className="px-4">
            {item}
          </li>
        ))}
      </ul>
      <div className="grid py-2 text-center md:hidden" aria-live="off">
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
