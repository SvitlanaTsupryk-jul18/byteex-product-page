import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface SectionHeadingProps {
  children: ReactNode
  as?: 'h1' | 'h2'
  className?: string
}

export function SectionHeading({ children, as: Tag = 'h2', className }: SectionHeadingProps) {
  return (
    <Tag className={cn('text-2xl font-normal tracking-wide text-navy md:text-3xl', className)}>
      {children}
    </Tag>
  )
}
