'use client'

import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export type SelectOption = { value: string; label: string; disabled?: boolean }

export type SelectProps = {
  id?: string
  name?: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  options: SelectOption[]
  error?: string
  disabled?: boolean
  required?: boolean
  className?: string
  'aria-label'?: string
  'aria-labelledby'?: string
}

export function Select({
  id,
  name,
  value,
  defaultValue,
  onValueChange,
  placeholder,
  options,
  error,
  disabled,
  required,
  className,
  ...props
}: SelectProps) {
  const generatedId = React.useId()
  const selectId = id ?? generatedId
  const errorId = error ? `${selectId}-error` : undefined

  return (
    <>
      <SelectPrimitive.Root
        name={name}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
        required={required}
      >
        <SelectPrimitive.Trigger
          id={selectId}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          className={cn(
            'flex w-full items-center justify-between gap-2 rounded-[var(--radius-md)] border bg-[var(--color-surface)] px-4 py-3',
            'text-[var(--color-text)] data-[placeholder]:text-[var(--color-text-muted)]',
            'transition-colors duration-[var(--duration-fast)]',
            'disabled:pointer-events-none disabled:opacity-60',
            error ? 'border-[var(--color-error)]' : 'border-[var(--color-border)]',
            'hover:border-[var(--color-neutral-600)]',
            className,
          )}
          {...props}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon asChild>
            <ChevronDown aria-hidden className="size-4 shrink-0 text-[var(--color-text-muted)]" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            position="popper"
            sideOffset={4}
            className={cn(
              'z-50 max-h-[--radix-select-content-available-height] overflow-hidden',
              'rounded-[var(--radius-md)] border border-[var(--color-border)]',
              'bg-[var(--color-surface-elevated)] text-[var(--color-text)] shadow-[var(--shadow-lg)]',
            )}
          >
            <SelectPrimitive.Viewport className="p-1">
              {options.map((opt) => (
                <SelectPrimitive.Item
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled}
                  className={cn(
                    // min-h garante o alvo de toque de 44px mesmo se a fonte ou o
                    // ajuste de tamanho de texto do usuário mudar a métrica da linha.
                    'relative flex min-h-11 cursor-pointer items-center rounded-[var(--radius-sm)] py-2 pr-3 pl-8 select-none',
                    'text-[length:var(--text-body)] text-[var(--color-text)]',
                    'transition-colors duration-[var(--duration-fast)]',
                    'data-[highlighted]:bg-[var(--color-brand-600)] data-[highlighted]:text-white',
                    'data-[disabled]:pointer-events-none data-[disabled]:opacity-60',
                  )}
                >
                  <span className="absolute left-2 flex size-4 items-center justify-center">
                    <SelectPrimitive.ItemIndicator>
                      <Check aria-hidden className="size-4" />
                    </SelectPrimitive.ItemIndicator>
                  </span>
                  <SelectPrimitive.ItemText>{opt.label}</SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
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
}
