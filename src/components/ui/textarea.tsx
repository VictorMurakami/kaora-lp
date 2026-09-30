'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export type TextareaProps = React.ComponentProps<'textarea'> & { error?: string }

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, error, id, rows = 4, ...props },
  ref,
) {
  const generatedId = React.useId()
  const textareaId = id ?? generatedId
  const errorId = error ? `${textareaId}-error` : undefined

  return (
    <>
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className={cn(
          'w-full resize-y rounded-[var(--radius-md)] border bg-[var(--color-surface)] px-4 py-3',
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
