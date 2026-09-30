import * as React from 'react'
import { cn } from '@/lib/utils'

export function Badge({ className, children, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-[var(--radius-full)] border',
        'border-[var(--color-border)] bg-[var(--color-surface-elevated)]',
        'px-3 py-1 text-[length:var(--text-caption)] text-[var(--color-text-muted)]',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
