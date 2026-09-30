'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export type InputProps = React.ComponentProps<'input'> & { error?: string }

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, error, id, ...props },
  ref,
) {
  const generatedId = React.useId()
  const inputId = id ?? generatedId
  const errorId = error ? `${inputId}-error` : undefined

  return (
    <>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className={cn(
          'w-full rounded-[var(--radius-md)] border bg-[var(--color-surface)] px-4 py-3',
          'text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]',
          'transition-colors duration-[var(--duration-fast)]',
          error ? 'border-[var(--color-error)]' : 'border-[var(--color-border)]',
          'hover:border-[var(--color-neutral-600)]',
          className,
        )}
        {...props}
      />
      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 text-[length:var(--text-caption)] text-[var(--color-error)]"
        >
          {error}
        </p>
      )}
    </>
  )
})
