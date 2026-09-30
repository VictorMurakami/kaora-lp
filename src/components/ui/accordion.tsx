'use client'

import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Accordion = AccordionPrimitive.Root

export const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentProps<typeof AccordionPrimitive.Item>
>(function AccordionItem({ className, ...props }, ref) {
  return (
    <AccordionPrimitive.Item
      ref={ref}
      className={cn('border-b border-[var(--color-border)]', className)}
      {...props}
    />
  )
})

export const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentProps<typeof AccordionPrimitive.Trigger>
>(function AccordionTrigger({ className, children, ...props }, ref) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          'flex flex-1 items-center justify-between gap-4 py-4 text-left',
          'text-[length:var(--text-body)] font-medium text-[var(--color-text)]',
          'transition-colors duration-[var(--duration-fast)] hover:text-[var(--color-brand-400)]',
          '[&[data-state=open]>svg]:rotate-180',
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown
          aria-hidden
          className="size-4 shrink-0 text-[var(--color-text-muted)] transition-transform duration-[var(--duration-fast)]"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
})

export const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentProps<typeof AccordionPrimitive.Content>
>(function AccordionContent({ className, children, ...props }, ref) {
  return (
    <AccordionPrimitive.Content
      ref={ref}
      className={cn(
        'grid overflow-hidden text-[var(--color-text-muted)]',
        'transition-[grid-template-rows] duration-[var(--duration-fast)] ease-[var(--ease-out-expo)]',
        'data-[state=closed]:grid-rows-[0fr] data-[state=open]:grid-rows-[1fr]',
      )}
      {...props}
    >
      <div className={cn('overflow-hidden pb-4 text-[length:var(--text-body)]', className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
})
