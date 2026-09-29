import type { Feature } from '@/types/content'
import { cn } from '@/lib/cn'
import { Icon } from '../ui/Icon'

interface FeatureItemProps {
  feature: Feature
  layout?: 'row' | 'column'
  className?: string
}

/** Icon + title + optional description, reused across several sections. */
export function FeatureItem({ feature, layout = 'row', className }: FeatureItemProps) {
  return (
    <div
      className={cn(
        'flex gap-3',
        layout === 'column' && 'flex-col items-center text-center',
        className,
      )}
    >
      {feature.icon && (
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-mist text-navy">
          <Icon name={feature.icon} className="size-4" />
        </span>
      )}
      <div className="flex flex-col gap-1">
        <h3 className="text-sm text-navy">{feature.title}</h3>
        {feature.description && (
          <p className="text-xs leading-relaxed text-muted">{feature.description}</p>
        )}
      </div>
    </div>
  )
}
