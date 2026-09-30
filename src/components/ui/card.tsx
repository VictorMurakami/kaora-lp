'use client'
import * as React from 'react'
import { cn } from '@/lib/utils'

export function Card({
  spotlight,
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & { spotlight?: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return (
    <div
      ref={ref}
      onMouseMove={spotlight ? onMove : undefined}
      className={cn(
        'group relative overflow-hidden rounded-[var(--radius-lg)]',
        'border border-[var(--color-border)] bg-[var(--color-surface)]',
        'transition-colors duration-[var(--duration-base)] hover:border-[var(--color-neutral-600)]',
        spotlight && 'kaora-spotlight',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
